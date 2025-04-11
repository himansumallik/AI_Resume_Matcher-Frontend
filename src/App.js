import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import JobRecommendation from './components/JobRecommendation';
import Resume from './components/Resume'
import FormatResumeModal from './components/FormatResumeModal';
import '../src/styles/tailwind.css';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/recommend" element={<JobRecommendation />} />
        <Route path="/resumeFormat" element={<FormatResumeModal />} />
      </Routes>
    </Router>
  );
}

export default App;
