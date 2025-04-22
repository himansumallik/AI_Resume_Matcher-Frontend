import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import JobRecommendation from './components/JobRecommendation';
import Resume from './components/Resume';
import FormatResume from './components/FormatResume';
import '../src/styles/tailwind.css';

function App() {
  const [darkMode, setDarkMode] = useState(true); // Global dark mode state

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/resume" element={<Resume darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/recommend" element={<JobRecommendation darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/resumeFormat" element={<FormatResume darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
