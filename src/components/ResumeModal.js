import React from 'react';
import Resume from './Resume'; // Your existing Resume component

const ResumeModal = ({ onClose }) => {
return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-amber-100">Resume Analyzer</h2>
        <button 
            onClick={onClose}
            className="text-gray-400 hover:text-amber-300 text-2xl"
        >
            &times;
        </button>
        </div>
        <div className="p-6">
        <Resume /> {/* Your existing Resume component */}
        </div>
    </div>
    </div>
);
};

export default ResumeModal;