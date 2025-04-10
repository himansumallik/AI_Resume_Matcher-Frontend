import React, { useState } from 'react';
import axios from 'axios';
import '../styles/tailwind.css';


function Homepage() {
const [resumeFile, setResumeFile] = useState(null);
const [jobDescription, setJobDescription] = useState('');
const [matchResult, setMatchResult] = useState(null);
const [loading, setLoading] = useState(false);

const handleResumeUpload = (e) => {
    setResumeFile(e.target.files[0]);
};

const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
    alert('Please upload a resume.');
    return;
    }

    if (!jobDescription) {
    alert('Please enter a job description.');
    return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    setLoading(true);

    try {
    const response = await axios.post('http://localhost:5001/analyze', formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        },
    });
    setMatchResult(response.data);
    } catch (error) {
    console.error('Error submitting resume:', error);
    alert('Error: Unable to process your resume. Please try again later.');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="App bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-600">AI-Powered Resume Matcher</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Resume */}
        <div>
            <label className="block text-lg font-medium">Upload Your Resume</label>
            <input
            type="file"
            onChange={handleResumeUpload}
            className="mt-2 p-3 w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
        </div>

        {/* Job Description */}
        <div>
            <label className="block text-lg font-medium">Enter Job Description</label>
            <textarea
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            className="mt-2 p-3 w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="4"
            placeholder="Describe the job requirements..."
            />
        </div>

        {/* Submit Button */}
        <div>
            <button
            type="submit"
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            >
            Submit
            </button>
        </div>
        </form>

        {/* Loading Spinner */}
        {loading && (
        <div className="mt-6 flex justify-center">
            <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0115.864-4.528M12 4v8l4 4"
            ></path>
            </svg>
        </div>
        )}

        {/* Result Section */}
        {matchResult && (
        <div className="mt-6 p-6 border rounded-md border-blue-200 bg-blue-50">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Match Result</h2>
            <div className="space-y-3">
            <p>
                <strong className="text-blue-600">Match Percentage:</strong> {matchResult.matchPercentage}%
            </p>
            <p>
                <strong className="text-blue-600">Missing Keywords:</strong>
                {matchResult.missingKeywords.length > 0 ? (
                <span className="text-red-600">{matchResult.missingKeywords.join(', ')}</span>
                ) : (
                <span className="text-green-600">No keywords missing</span>
                )}
            </p>
            </div>
        </div>
        )}
    </div>
    </div>
);
}

export default Homepage;
