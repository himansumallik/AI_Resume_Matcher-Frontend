import React, { useState } from 'react';
import Navbar from './Navbar';
import Resume from './Resume';
import FormatResume from './FormatResume';

const Homepage = () => {
const [activeSection, setActiveSection] = useState(null);

const renderContent = () => {
    switch (activeSection) {
    case 'resume':
        return (
        <div className="w-full max-w-4xl mt-8">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-amber-100">Resume Analyzer</h2>
            <button
                onClick={() => setActiveSection(null)}
                className="text-gray-400 hover:text-amber-300 text-3xl font-bold"
            >
                &times;
            </button>
            </div>
            <Resume />
        </div>
        );

    case 'format':
        return (
        <div className="w-full max-w-4xl mt-8">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-amber-100">Resume Format Advisor</h2>
            <button
                onClick={() => setActiveSection(null)}
                className="text-gray-400 hover:text-amber-300 text-3xl font-bold"
            >
                &times;
            </button>
            </div>
            <FormatResume onClose={() => setActiveSection(null)} />
        </div>
        );

    default:
        return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Resume Analyzer Card */}
            <div
            onClick={() => setActiveSection('resume')}
            className="bg-gray-800 border border-gray-700 rounded-xl p-8 cursor-pointer 
                hover:shadow-2xl transition-all duration-300 hover:border-amber-400/30
                hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-700/80"
            >
            <div className="flex justify-content items-center mb-4">
                <div className="text-3xl mr-3 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                📝
                </div>
                <h2 className="text-2xl font-semibold text-amber-100">Resume Analyzer</h2>
            </div>
            <p className="text-gray-300">
                Upload your resume and job description to check how well they match.
            </p>
            <div className="mt-4 h-1 bg-gradient-to-r from-amber-400/50 to-transparent rounded-full"></div>
            </div>

            {/* Resume Format Advisor Card */}
            <div
            onClick={() => setActiveSection('format')}
            className="bg-gray-800 border-2 border-gray-700 rounded-xl p-8 cursor-pointer 
                hover:shadow-2xl transition-all duration-300 hover:border-amber-400/30
                hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-700/80"
            >
            <div className="flex items-center mb-4">
                <div className="text-3xl mr-3 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                📄
                </div>
                <h2 className="text-2xl font-semibold text-amber-100">Resume Format Advisor</h2>
            </div>
            <p className="text-gray-300">
                Get suggestions to improve your resume layout and structure.
            </p>
            <div className="mt-4 h-1 bg-gradient-to-r from-amber-400/50 to-transparent rounded-full"></div>
            </div>
        </div>
        );
    }
};

return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
    <Navbar />

    <div className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <h1 className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">
        AI Resume Matcher
        </h1>

        {renderContent()}

        <p className="mt-16 text-gray-400 text-sm">
        Powered by AI technology • Get better job matches instantly
        </p>
    </div>
    </div>
);
};

export default Homepage;