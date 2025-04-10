import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSearch, FaSun, FaMoon, FaChevronDown } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
const navigate = useNavigate();
const location = useLocation();
const [darkMode, setDarkMode] = useState(false);
const [showDropdown, setShowDropdown] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

return (
    <nav className={`
    w-full bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900
    text-gray-100 shadow-xl border-b border-white/10
    hover:bg-gradient-to-br transition-all duration-500
    sticky top-0 z-50
    `}>
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo/Brand */}
        <div 
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => navigate('/homepage')}
        >
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
            ResumeMatcher AI
        </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-200/80" />
            <input
            type="text"
            placeholder="Search jobs, profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 
                text-amber-100 placeholder-amber-200/50 focus:outline-none 
                focus:ring-2 focus:ring-amber-300/30 border border-white/20"
            />
        </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-6">
        <button 
            onClick={() => navigate('/')} 
            className={`flex items-center space-x-1 transition-colors
            ${location.pathname === '/' ? 'text-amber-300' : 'text-gray-100 hover:text-amber-200'}`}
        >
            <FaHome className="text-lg" />
            <span className="hidden md:inline">Home</span>
        </button>

        {/* Dark Mode Toggle */}
        <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
            {darkMode ? (
            <FaSun className="text-amber-300 text-lg" />
            ) : (
            <FaMoon className="text-gray-300 text-lg" />
            )}
        </button>

        {/* User Dropdown */}
        <div className="relative">
            <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => setShowDropdown(!showDropdown)}
            >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                <span className="text-gray-900 font-bold">U</span>
            </div>
            <FaChevronDown className={`text-amber-200/80 transition-transform ${showDropdown ? 'rotate-180' : ''}`}/>
            </div>

            {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-white/10">
                <a href="#" className="block px-4 py-2 text-amber-100 hover:bg-gray-700/50">Profile</a>
                <a href="#" className="block px-4 py-2 text-amber-100 hover:bg-gray-700/50">Settings</a>
                <div className="border-t border-white/10 my-1"></div>
                <button 
                onClick={() => navigate('/logout')}
                className="w-full text-left px-4 py-2 text-red-300 hover:bg-gray-700/50 flex items-center space-x-2"
                >
                <FiLogOut />
                <span>Logout</span>
                </button>
            </div>
            )}
        </div>
        </div>
    </div>
    </nav>
);
};

export default Navbar;