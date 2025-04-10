import React, { useState } from 'react';
import axios from 'axios';

const FormatResumeModal = ({ onClose }) => {
const [resumeFile, setResumeFile] = useState(null);
const [suggestions, setSuggestions] = useState([]);
const [loading, setLoading] = useState(false);

const handleUpload = (e) => {
    setResumeFile(e.target.files[0]);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
    alert('Please upload a resume first');
    return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    setLoading(true);

    try {
    const res = await axios.post('http://localhost:5001/format-check', formData);
    setSuggestions(res.data.suggestions);
    } catch (err) {
    console.error("Error:", err);
    setSuggestions(["Failed to analyze resume formatting. Please try again."]);
    } finally {
    setLoading(false);
    }
};

return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-lg w-full max-w-2xl flex flex-col border-2 border-gray-700 shadow-2xl">
        {/* Modal Header */}
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
        
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
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
                'Check Format'
            )}
            </button>
        </form>

        {/* Suggestions */}
        {suggestions.length > 0 && (
            <div className="mt-8 p-6 bg-gray-700/50 rounded-xl border border-gray-600">
            <h3 className="text-xl font-bold text-amber-300 mb-4">Formatting Suggestions</h3>
            <ul className="space-y-3">
                {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span className="text-gray-200">{suggestion}</span>
                </li>
                ))}
            </ul>
            </div>
        )}
        </div>
        
        {/* Modal Footer */}
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

export default FormatResumeModal;