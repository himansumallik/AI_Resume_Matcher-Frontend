import React, { useState } from 'react';
import axios from 'axios';

function Resume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResumeUpload = (e) => {
    setResumeFile(e.target.files[0]);
    setError(null);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError('Please upload a resume');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);
  
    try {
      const response = await axios.post('http://localhost:5001/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const normalizedData = normalizeResponse(response.data);
      if (normalizedData?.detailedAnalysis?.skills) {
        setAnalysis(normalizedData);
      } else {
        setError("Unexpected analysis structure. Please try again.");
      }
      
    } catch (error) {
      setError(error.response?.data?.message || 'Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const normalizeResponse = (data) => {
    if (!data || typeof data !== 'object') {
      return {
        overallMatch: 0,
        detailedAnalysis: {
          skills: { matchPercentage: 0, matchingSkills: [], missingSkills: [], suggestedSkills: [] },
          experience: { yearsRequired: 0, yearsActual: 0, meetsMinimum: false, meetsPreferred: false },
          ats: { score: 0, issues: [] }
        },
        improvementSuggestions: []
      };
    }
  
    if (data.detailedAnalysis) return data;
  
    return {
      overallMatch: data.matchPercentage || 0,
      detailedAnalysis: {
        skills: {
          matchPercentage: data.matchPercentage || 0,
          matchingSkills: [],
          missingSkills: data.missingKeywords || [],
          suggestedSkills: data.suggestedSkills || []
        },
        experience: {
          yearsRequired: 3,
          yearsActual: 0,
          meetsMinimum: false,
          meetsPreferred: false
        },
        ats: {
          score: 0,
          issues: []
        }
      },
      improvementSuggestions: [
        ...(data.missingKeywords ? [`Add these keywords: ${data.missingKeywords.slice(0, 3).join(', ')}`] : []),
        ...(data.suggestedSkills ? [`Consider adding these skills: ${data.suggestedSkills.slice(0, 3).join(', ')}`] : [])
      ]
    };
  };

  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-600 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full ${
          value > 70 ? 'bg-green-500' : 
          value > 40 ? 'bg-yellow-500' : 'bg-red-500'
        }`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      ></div>
    </div>
  );

  const SkillPill = ({ skill, type }) => (
    <span className={`px-3 py-1 rounded-full text-sm ${
      type === 'match' ? 'bg-green-900/50 text-green-200' :
      type === 'missing' ? 'bg-red-900/50 text-red-200' :
      'bg-blue-900/50 text-blue-200'
    }`}>
      {skill}
    </span>
  );

  const AnalysisSection = ({ title, children }) => (
    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
      <h3 className="text-lg font-medium text-amber-200 mb-3">{title}</h3>
      {children}
    </div>
  );

  const getAnalysisData = () => {
    if (!analysis) return null;
    
    return {
      overallMatch: analysis.overallMatch || 0,
      skills: {
        matchPercentage: analysis.detailedAnalysis?.skills?.matchPercentage || 0,
        matchingSkills: analysis.detailedAnalysis?.skills?.matchingSkills || [],
        missingSkills: analysis.detailedAnalysis?.skills?.missingSkills || [],
        suggestedSkills: analysis.detailedAnalysis?.skills?.suggestedSkills || []
      },
      experience: {
        yearsRequired: analysis.detailedAnalysis?.experience?.yearsRequired || 0,
        yearsActual: analysis.detailedAnalysis?.experience?.yearsActual || 0,
        meetsMinimum: analysis.detailedAnalysis?.experience?.meetsMinimum || false,
        meetsPreferred: analysis.detailedAnalysis?.experience?.meetsPreferred || false
      },
      ats: {
        score: analysis.detailedAnalysis?.ats?.score || 0,
        issues: analysis.detailedAnalysis?.ats?.issues || []
      },
      improvementSuggestions: analysis.improvementSuggestions || []
    };
  };

  const analysisData = getAnalysisData();

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume Upload */}
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
                onChange={handleResumeUpload} 
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
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <label className="block text-xl font-semibold text-amber-200">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            className="w-full p-4 text-gray-200 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
            rows="6"
            placeholder="Paste the job description here..."
            required
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg shadow-md transition ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
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
            'Analyze Resume'
          )}
        </button>
      </form>

      {/* Results Section */}
      {analysisData && (
        <div className="mt-8 space-y-6">
          {/* Overall Score */}
          <AnalysisSection title="Overall Match">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl font-bold text-amber-300">
                {analysisData.overallMatch}%
              </div>
              <div className="text-gray-300">
                {analysisData.overallMatch > 70 ? 'Strong Match' : 
                analysisData.overallMatch > 40 ? 'Moderate Match' : 'Weak Match'}
              </div>
            </div>
            <ProgressBar value={analysisData.overallMatch} />
          </AnalysisSection>

          {/* Skills Analysis */}
          <AnalysisSection title="Skills Analysis">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">Skills Coverage</span>
                <span className="font-medium">{analysisData.skills.matchPercentage}%</span>
              </div>
              <ProgressBar value={analysisData.skills.matchPercentage} />
            </div>
            
            {analysisData.skills.missingSkills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-md font-medium text-red-300 mb-2">Missing Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisData.skills.missingSkills.slice(0, 10).map((skill, index) => (
                    <SkillPill key={`missing-${index}`} skill={skill} type="missing" />
                  ))}
                </div>
              </div>
            )}
            
            {analysisData.skills.suggestedSkills.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-blue-300 mb-2">Suggested Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisData.skills.suggestedSkills.slice(0, 10).map((skill, index) => (
                    <SkillPill key={`suggested-${index}`} skill={skill} type="suggested" />
                  ))}
                </div>
              </div>
            )}
          </AnalysisSection>

          {/* Improvement Suggestions */}
          {analysisData.improvementSuggestions.length > 0 && (
            <AnalysisSection title="Improvement Suggestions">
              <ul className="space-y-2">
                {analysisData.improvementSuggestions.map((suggestion, index) => (
                  <li key={`suggestion-${index}`} className="flex items-start">
                    <svg className="w-5 h-5 text-amber-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-gray-300">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </AnalysisSection>
          )}
        </div>
      )}
    </div>
  );
}

export default Resume;