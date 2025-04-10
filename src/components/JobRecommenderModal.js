import React, { useState } from 'react';
import axios from 'axios';

const JobRecommenderModal = ({ onClose }) => {
const [resumeFile, setResumeFile] = useState(null);
const [jobTitle, setJobTitle] = useState('');
const [location, setLocation] = useState('');
const [skills, setSkills] = useState('');
const [loading, setLoading] = useState(false);
const [recommendations, setRecommendations] = useState(null);

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
    alert('Please upload your resume');
    return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobTitle", jobTitle);
    formData.append("location", location);
    formData.append("skills", skills);

    try {
    const response = await axios.post('http://localhost:5001/recommend', formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        },
    });
    setRecommendations(response.data);
    } catch (error) {
    console.error('Error getting recommendations:', error);
    alert('Error getting job recommendations. Please try again.');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-lg w-full max-w-5xl h-[90vh] flex flex-col border-2 border-gray-700 shadow-2xl">
        <div className="bg-gray-900 px-6 py-4 border-b-2 border-gray-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">
            Job Recommender
        </h2>
        <button 
            onClick={onClose}
            className="text-gray-400 hover:text-amber-300 text-3xl font-light"
        >
            &times;
        </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
        {!recommendations ? (
            <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
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
                    onChange={(e) => setResumeFile(e.target.files[0])}
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

            {/* Job Preferences */}
            <div className="bg-gray-700/50 p-5 rounded border border-gray-600">
                <h3 className="text-lg font-semibold text-amber-200 mb-3">Job Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-amber-100 mb-2">Job Title</label>
                    <input 
                    type="text" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 text-gray-300 bg-gray-800 rounded border border-gray-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
                    placeholder="e.g. Software Engineer"
                    />
                </div>
                <div>
                    <label className="block text-amber-100 mb-2">Location</label>
                    <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-gray-300 bg-gray-800 rounded border border-gray-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
                    placeholder="e.g. Remote, New York"
                    />
                </div>
                </div>
            </div>

            {/* Skills */}
            <div className="flex-1 bg-gray-700/50 p-5 rounded border border-gray-600">
                <label className="block text-amber-100 mb-2">Skills to Match</label>
                <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full h-full min-h-[150px] px-3 py-2 text-gray-300 bg-gray-800 rounded border border-gray-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
                placeholder="List your key skills (separated by commas)..."
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
                <button 
                type="button"
                onClick={() => {
                    setResumeFile(null);
                    setJobTitle('');
                    setLocation('');
                    setSkills('');
                }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg transition"
                >
                Reset
                </button>
                <button 
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                {loading ? (
                    <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finding Jobs...
                    </span>
                ) : (
                    'Find Jobs'
                )}
                </button>
            </div>
            </form>
        ) : (
            <div className="space-y-6">
            <h3 className="text-2xl font-bold text-amber-300 mb-4">Recommended Jobs</h3>
            
            {recommendations.map((job, index) => (
                <div key={index} className="bg-gray-700/50 p-5 rounded-lg border border-gray-600">
                <h4 className="text-xl font-semibold text-amber-200">{job.title}</h4>
                <p className="text-gray-300 mt-1">{job.company} • {job.location}</p>
                <p className="text-amber-100 mt-2">Match Score: <span className="font-bold">{job.matchScore}%</span></p>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                    className={`h-2 rounded-full ${job.matchScore > 70 ? 'bg-green-500' : job.matchScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${job.matchScore}%` }}
                    ></div>
                </div>
                <p className="text-gray-300 mt-3">{job.description}</p>
                <button className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition">
                    Apply Now
                </button>
                </div>
            ))}

            <button
                onClick={() => setRecommendations(null)}
                className="w-full mt-6 py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition"
            >
                Back to Search
            </button>
            </div>
        )}
        </div>
        
        <div className="bg-gray-900 px-6 py-3 border-t-2 border-gray-700 text-right">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-amber-100 rounded-lg transition"
        >
            Close
        </button>
        </div>
    </div>
    </div>
);
};

export default JobRecommenderModal;