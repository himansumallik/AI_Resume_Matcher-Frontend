import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Resume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResumeUpload = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please upload a resume');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
  
    try {
      const response = await axios.post('http://localhost:5001/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMatchResult(response.data);
    } catch (error) {
      console.error('Error submitting resume:', error);
      alert('Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl border-2 border-gray-700 shadow-2xl">
        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500 mb-8">
          AI-Powered Resume Matcher
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
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
              rows="8"
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
        {matchResult && (
          <div className="mt-10 p-6 bg-gray-700/50 rounded-xl border border-gray-600">
            <h2 className="text-2xl font-bold text-amber-300 mb-4">Analysis Results</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-lg font-medium text-amber-100">Match Score</span>
                  <span className="text-lg font-bold text-amber-300">{matchResult.matchPercentage}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${matchResult.matchPercentage > 70 ? 'bg-green-500' : matchResult.matchPercentage > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${matchResult.matchPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-amber-100 mb-2">Missing Keywords</h3>
                {matchResult.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missingKeywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-red-900/50 text-red-200 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-300 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Excellent! No keywords missing
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resume;