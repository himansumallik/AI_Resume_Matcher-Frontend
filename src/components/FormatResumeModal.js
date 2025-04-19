import React, { useState, useEffect } from 'react';
import axios from 'axios';
import resumeTemplates from './ResumeLogs';
import { FaRegCheckCircle, FaRegTimesCircle, FaDownload } from 'react-icons/fa';

const FormatResumeModal = ({ onClose }) => {
// State management
const [resumeFile, setResumeFile] = useState(null);
const [suggestions, setSuggestions] = useState([]);
const [loading, setLoading] = useState(false);
const [analysisComplete, setAnalysisComplete] = useState(false);
const [pdfPreview, setPdfPreview] = useState(null);
const [selectedIndustry, setSelectedIndustry] = useState('All');
const [metrics, setMetrics] = useState({});
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


// Calculate score based on suggestions
const calculateScore = (suggestions) => {
    const highPriorityCount = suggestions.filter(s => s.priority === 'high').length;
    const mediumPriorityCount = suggestions.filter(s => s.priority === 'medium').length;
    
    let score = 100;
    score -= highPriorityCount * 15;
    score -= mediumPriorityCount * 5;
    return Math.max(0, Math.min(100, Math.round(score)));
};

// Handle file upload with validation
const handleUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
    alert('File size exceeds 5MB limit');
    return;
    }
    
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
    alert('Only PDF and DOCX files are allowed');
    return;
    }
    
    setResumeFile(file);
    setSuggestions([]);
    setAnalysisComplete(false);
    
    if (file.type === 'application/pdf') {
    const previewUrl = URL.createObjectURL(file);
    setPdfPreview(previewUrl);
    } else {
    setPdfPreview(null);
    }
};

// Download template handler
const handleDownloadTemplate = (templateFile, templateName) => {
    const link = document.createElement('a');
    link.href = templateFile;
    link.download = `${templateName.toLowerCase().replace(/ /g, '-')}-template.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Process suggestions from API
const processSuggestions = (rawSuggestions) => {
    if (!rawSuggestions) return [];

    const priorityMap = {
    'missing': 'high',
    'add': 'high',
    'email': 'high',
    'name': 'high',
    'short': 'high',
    'length': 'high',
    'brief': 'high',
    'bullet': 'medium',
    'expand': 'medium',
    'condense': 'medium',
    'consider': 'medium'
    };

    const typeMap = {
    'contact': ['email', 'phone', 'address', 'linkedin'],
    'experience': ['experience', 'work', 'job', 'position', 'employment'],
    'skills': ['skill', 'technical', 'tool', 'language', 'competenc'],
    'education': ['education', 'degree', 'school', 'university', 'course']
    };

    return rawSuggestions.map(suggestion => {
    // Handle both string and object formats
    const suggestionText = typeof suggestion === 'string' 
        ? suggestion 
        : suggestion.message || '';

    let type = 'general';
    let priority = 'medium';
    const lowerSuggestion = suggestionText.toLowerCase();

    // Determine priority
    Object.entries(priorityMap).forEach(([keyword, level]) => {
        if (lowerSuggestion.includes(keyword)) {
        priority = level;
        }
    });

    // Determine type
    Object.entries(typeMap).forEach(([suggestionType, keywords]) => {
        if (keywords.some(keyword => lowerSuggestion.includes(keyword))) {
        type = suggestionType;
        }
    });

    // Enhance short/length suggestions
    if (lowerSuggestion.includes('short') || lowerSuggestion.includes('length')) {
        return {
        message: `Resume length appears insufficient. Recommended additions:
            - More bullet points under each position
            - Relevant projects section
            - Detailed accomplishments
            - Technical skills inventory`,
        type: 'length',
        priority: 'high'
        };
    }

    // If suggestion was already an object, preserve its structure
    if (typeof suggestion === 'object') {
        return {
        ...suggestion, // Keep original fields
        type: suggestion.type || type,
        priority: suggestion.priority || priority
        };
    }

    return {
        message: suggestionText,
        type,
        priority
    };
    }).sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
};

// Submit to API
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
    alert('Please upload a resume first');
    return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    setLoading(true);
    setSuggestions([]);

    try {
    const res = await axios.post('http://localhost:5001/format-check', formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        },
    });

    const processedSuggestions = processSuggestions(res.data.suggestions);
    setSuggestions(processedSuggestions);
    setMetrics(res.data.metrics || {});
    setAnalysisComplete(true);
    } catch (err) {
    console.error("Error:", err);
    setSuggestions([{
        type: 'error',
        message: 'Failed to analyze resume formatting. Please try again.',
        priority: 'high'
    }]);
    } finally {
    setLoading(false);
    }
};

// Get strengths list
const getStrengths = () => {
    const strengths = [];

    // Check for sufficient length
    if (metrics.wordCount && metrics.wordCount >= 300) {
    strengths.push("✓ Appropriate length (300+ words)");
    }

    // Check for multiple bullet points
    if (metrics.bulletPoints && metrics.bulletPoints >= 10) {
    strengths.push(`✓ Detailed experience (${metrics.bulletPoints} bullet points)`);
    }

    // Check for multiple sections
    if (metrics.sections && metrics.sections >= 4) {
    strengths.push(`✓ Well-structured (${metrics.sections} sections)`);
    }

    // Check for contact completeness
    if (metrics.hasEmail && metrics.hasPhone) {
    strengths.push("✓ Complete contact information");
    }

    // Check for education section
    if (metrics.educationItems && metrics.educationItems >= 1) {
    strengths.push("✓ Complete education details");
    }

    // Check for work experience
    if (metrics.experienceItems && metrics.experienceItems >= 1) {
    strengths.push("✓ Detailed work experience");
    }

    // Check for skills section
    if (metrics.skillsCount && metrics.skillsCount >= 5) {
    strengths.push(`✓ Comprehensive skills (${metrics.skillsCount} skills listed)`);
    }

    // Check for summary/objective
    if (metrics.hasSummary) {
    strengths.push("✓ Professional summary included");
    }

    return strengths;
};

// Suggestion icon component
const getSuggestionIcon = (type) => {
    switch(type) {
    case 'error':
        return <FaRegTimesCircle className="text-red-400 mr-2 mt-1 flex-shrink-0" />;
    default:
        return <FaRegCheckCircle className="text-amber-400 mr-2 mt-1 flex-shrink-0" />;
    }
};

// Clean up preview URL
useEffect(() => {
    return () => {
    if (pdfPreview) {
        URL.revokeObjectURL(pdfPreview);
    }
    };
}, [pdfPreview]);

// Industry options derived from templates
const industryOptions = ['All', ...new Set(resumeTemplates.map(t => t.industry))];

return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-gray-800 rounded-lg w-full max-w-2xl flex flex-col border-2 border-gray-700 shadow-2xl my-4 max-h-[95vh]">
        <div className="bg-gray-900 px-6 py-4 border-b-2 border-gray-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">
            Resume Format Advisor
        </h2>
        <button 
            onClick={onClose}
            className="text-gray-400 hover:text-amber-300 text-3xl font-light"
        >
            &times;
        </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
            <label className="block text-xl font-semibold text-amber-200">
                Upload Your Resume
            </label>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-700/50 border-gray-600 hover:border-amber-400/50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX (MAX. 5MB)</p>
                </div>
                <input 
                    type="file" 
                    onChange={handleUpload}
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                />
                </label>
            </div>
            {resumeFile && (
                <p className="text-sm text-amber-300 mt-2">
                Selected: {resumeFile.name}
                </p>
            )}
            {pdfPreview && (
                <div className="mt-4 border border-gray-700 p-2 rounded">
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Preview:</h4>
                <iframe 
                    src={pdfPreview} 
                    className="w-full h-64 border-0"
                    title="Resume preview"
                />
                </div>
            )}
            </div>

            <button 
            type="submit"
            disabled={loading || !resumeFile}
            className={`w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg shadow-md transition ${loading || !resumeFile ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
            {loading ? (
                <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
                </span>
            ) : (
                'Check Format'
            )}
            </button>
        </form>

        {suggestions.length > 0 && (
            <div className="mt-8 p-6 bg-gray-700/50 rounded-xl border border-gray-600">
            <h3 className="text-xl font-bold text-amber-300 mb-4">
                {analysisComplete ? 'Resume Analysis Report' : 'Analysis Error'}
            </h3>

            {analysisComplete && (
                <>
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg flex flex-wrap justify-between items-center">
                    <div className="flex items-center mr-4 mb-2 sm:mb-0">
                    <span className="text-sm text-gray-400 mr-2">Overall Score:</span>
                    <span className={`text-lg font-bold ${
                        suggestions.filter(s => s.priority === 'high').length > 0 
                        ? 'text-amber-400' 
                        : suggestions.length > 0
                            ? 'text-blue-400'
                            : 'text-green-400'
                    }`}>
                        {calculateScore(suggestions)}/100
                    </span>
                    </div>
                    <div className="flex space-x-4">
                    <div className="text-center">
                        <span className="block text-red-400 font-bold">
                        {suggestions.filter(s => s.priority === 'high').length}
                        </span>
                        <span className="text-xs text-gray-400">Critical</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-amber-400 font-bold">
                        {suggestions.filter(s => s.priority === 'medium').length}
                        </span>
                        <span className="text-xs text-gray-400">Recommended</span>
                    </div>
                    </div>
                </div>

                {Object.keys(metrics).length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-md font-semibold text-blue-300 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        Resume Metrics
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Sections Metric */}
                        <div className="bg-gray-700/50 hover:bg-gray-700/70 transition p-3 rounded-lg border border-gray-600/50">
                            <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-400">Sections</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-300">
                                Structure
                            </span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                            {metrics.sections || '0'}
                            <span className="text-xs ml-1 text-gray-400">/6</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-600 rounded-full mt-2 overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${Math.min(100, (metrics.sections || 0) * 16.66)}%` }}
                            ></div>
                            </div>
                        </div>

                        {/* Word Count Metric */}
                        <div className="bg-gray-700/50 hover:bg-gray-700/70 transition p-3 rounded-lg border border-gray-600/50">
                            <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-400">Word Count</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-900/30 text-amber-300">
                                Content
                            </span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                            {metrics.wordCount || '0'}
                            </div>
                            <div className="text-xs mt-1 text-gray-400">
                            {metrics.wordCount >= 300 ? (
                                <span className="text-green-400">✓ Optimal length</span>
                            ) : (
                                <span className="text-amber-400">Consider expanding</span>
                            )}
                            </div>
                        </div>

                        {/* Bullet Points Metric */}
                        <div className="bg-gray-700/50 hover:bg-gray-700/70 transition p-3 rounded-lg border border-gray-600/50">
                            <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-400">Bullet Points</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-900/30 text-purple-300">
                                Readability
                            </span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                            {metrics.bulletPoints || '0'}
                            </div>
                            <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.min(5, Math.floor((metrics.bulletPoints || 0) / 3)) ? 'text-purple-400 fill-current' : 'text-gray-600'}`}
                                viewBox="0 0 20 20"
                                >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                            <span className="text-xs ml-2 text-gray-400">
                                {metrics.bulletPoints >= 10 ? 'Excellent' : metrics.bulletPoints >= 5 ? 'Good' : 'Needs more'}
                            </span>
                            </div>
                        </div>
                        </div>

                        {/* Additional context */}
                        <div className="mt-3 text-xs text-gray-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Ideal metrics: 4+ sections, 300-500 words, 10+ bullet points
                        </div>
                    </div>
                )}


                {suggestions.filter(s => s.priority === 'high').length > 0 && (
                    <div className="mb-6">
                    <h4 className="text-md font-semibold text-red-400 mb-2">Critical Improvements Needed:</h4>
                    <div className="space-y-2 pl-4">
                        {suggestions.filter(s => s.priority === 'high').map((s, i) => (
                        <div 
                            key={`high-${i}`} 
                            className="flex items-start text-sm text-gray-300"
                        >
                            {getSuggestionIcon(s.type)}
                            <span>{s.message}</span>
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                {suggestions.filter(s => s.priority === 'medium').length > 0 && (
                    <div className="mb-6">
                    <h4 className="text-md font-semibold text-amber-400 mb-2">Recommended Enhancements:</h4>
                    <div className="space-y-2 pl-4">
                        {suggestions.filter(s => s.priority === 'medium').map((s, i) => (
                        <div 
                            key={`med-${i}`} 
                            className="flex items-start text-sm text-gray-300"
                        >
                            {getSuggestionIcon(s.type)}
                            <span>{s.message}</span>
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                {getStrengths().length > 0 && (
                    <div className="mb-6">
                    <h4 className="text-md font-semibold text-green-400 mb-2">Strengths:</h4>
                    <div className="space-y-2 pl-4">
                        {getStrengths().map((strength, i) => (
                        <div key={`strength-${i}`} className="flex items-start text-sm text-gray-300">
                            <span>{strength}</span>
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                    <h4 className="text-md font-semibold text-blue-300 mb-2">
                    ATS Optimization Tips
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                    <li>Use standard section headers (Experience, Education, Skills)</li>
                    <li>Include relevant keywords from job description</li>
                    <li>Avoid tables, columns, and graphics</li>
                    <li>Use full form of acronyms first (e.g., "Artificial Intelligence (AI)")</li>
                    </ul>
                </div>
                </>
            )}
            </div>
        )}

        <div className="mt-10">
            <h4 className="text-lg font-semibold text-amber-300 mb-3">
            Try a Resume Template
            </h4>
            
            <div className="mb-3 flex flex-wrap gap-2">
            {industryOptions.map(tag => (
                <button 
                key={tag}
                className={`px-3 py-1 rounded-full text-xs ${
                    selectedIndustry === tag 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => setSelectedIndustry(tag)}
                >
                {tag}
                </button>
            ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumeTemplates
                .filter(template => selectedIndustry === 'All' || template.industry === selectedIndustry)
                .map(template => (
                <div key={template.id} className="bg-gray-700/40 p-4 rounded-lg border border-gray-600 flex justify-between items-center">
                    <div>
                    <h5 className="text-md font-bold text-white">{template.name}</h5>
                    <p className="text-xs text-gray-400">{template.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                        <span key={tag} className="bg-gray-600 text-amber-300 px-2 py-0.5 rounded-full text-xs">
                            {tag}
                        </span>
                        ))}
                    </div>
                    </div>
                    <button 
                    onClick={() => handleDownloadTemplate(template.file, template.name)}
                    className="text-amber-400 hover:text-white transition"
                    title="Download template"
                    >
                    <FaDownload size={18} />
                    </button>
                </div>
                ))}
            </div>
        </div>
        </div>
    </div>
    </div>
);
};

export default FormatResumeModal;