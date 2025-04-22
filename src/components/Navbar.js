import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaSun, FaMoon, FaChevronDown, FaFileAlt, FaBriefcase, FaMagic  } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const Navbar = ({ setActiveSection }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const services = ["Resume Analyzer", "Job Recommender", "Resume Format Advisor"];
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleServiceSelect = (service) => {
    setSearchQuery(service);
    setShowSuggestions(false);
    
    // Navigate to the selected service
    if (service === "Resume Analyzer") navigate('/resume');
    else if (service === "Job Recommender") navigate('/recommend');
    else if (service === "Resume Format Advisor") navigate('/format-tips');
    };


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
            onClick={() => {
                navigate('/');
                setActiveSection(null); // Clear active section when logo is clicked
            }}
            >
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
                ResumeMatcher AI
            </div>
            </div>

            {/* Search Bar with Autocomplete */}
            <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <div className="relative w-full">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-200/80" />
                <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                    setSelectedIndex(-1); // Reset selection on typing
                }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                    const filteredServices = services.filter(service => 
                    service.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    
                    if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(prev => 
                        prev < filteredServices.length - 1 ? prev + 1 : prev
                    );
                    }
                    else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                    }
                    else if (e.key === 'Enter' && selectedIndex >= 0) {
                    e.preventDefault();
                    const selectedService = filteredServices[selectedIndex];
                    handleServiceSelect(selectedService);
                    }
                }}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 
                    text-amber-100 placeholder-amber-200/50 focus:outline-none 
                    focus:ring-2 focus:ring-amber-300/30 border border-white/20"
                />
                
                {/* Autocomplete Suggestions */}
                {showSuggestions && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
                    {services
                    .filter(service => 
                        service.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((service, index) => {
                        let icon;
                        if (service === "Resume Analyzer") icon = <FaFileAlt className="mr-2 text-amber-300" />;
                        else if (service === "Job Recommender") icon = <FaBriefcase className="mr-2 text-blue-300" />;
                        else if (service === "Resume Format Advisor") icon = <FaMagic className="mr-2 text-purple-300" />;
                        
                        return (
                        <div
                            key={index}
                            className={`px-4 py-3 hover:bg-gray-700 cursor-pointer text-amber-100 flex items-center
                            ${selectedIndex === index ? 'bg-gray-700' : ''}`}
                            onMouseDown={() => handleServiceSelect(service)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            {icon}
                            <span>{service}</span>
                        </div>
                        );
                    })
                    }
                </div>
                )}
            </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-6">
            <button 
                onClick={() => {
                    navigate('/');
                    setActiveSection(null); // Clear active section when logo is clicked
                }}
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