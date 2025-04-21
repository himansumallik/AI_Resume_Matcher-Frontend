import React from 'react';
import FormatResume from './FormatResume';

const ResumeModal = ({ onClose }) => {
return (
    <div className="bg-gray-800 rounded-xl w-full max-w-4xl border border-gray-700 p-6 mt-6">
    <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
        <h2 className="text-xl font-semibold text-amber-100">Resume Analyzer</h2>
        <button 
        onClick={onClose}
        className="text-gray-400 hover:text-amber-300 text-2xl"
        >
        &times;
        </button>
    </div>
    <FormatResume />
    </div>
);
};

export default ResumeModal;
