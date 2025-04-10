import React, { useState } from 'react';
import axios from 'axios';

const JobRecommendation = () => {
const [resumeFile, setResumeFile] = useState(null);
const [recommendedJobs, setRecommendedJobs] = useState([]);
const [loading, setLoading] = useState(false);

const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
    setLoading(true);
    const res = await axios.post('http://localhost:5001/recommend', formData);
    setRecommendedJobs(res.data);
    } catch (error) {
    console.error("Error fetching recommendations:", error);
    } finally {
    setLoading(false);
    }
};

return (
    <div className="max-w-3xl mx-auto p-4">
    <h1 className="text-3xl font-semibold text-center mb-6">Job Recommendations</h1>

    <form onSubmit={handleSubmit} className="space-y-4">
        <input
        type="file"
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded-md p-2"
        accept=".pdf"
        />
        <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
        {loading ? 'Analyzing...' : 'Get Recommendations'}
        </button>
    </form>

    {recommendedJobs.length > 0 && (
        <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Top Matches</h2>
        <ul className="space-y-4">
            {recommendedJobs.map((job) => (
            <li key={job.id} className="p-4 border rounded shadow-sm">
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="mt-2 text-sm text-gray-800">{job.description}</p>
                <p className="mt-2 text-blue-700 font-semibold">
                Match: {job.matchPercentage}%
                </p>
            </li>
            ))}
        </ul>
        </div>
    )}
    </div>
);
};

export default JobRecommendation;
