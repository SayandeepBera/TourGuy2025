import React, { useState } from 'react'
import { useContext } from 'react';
import DestinationsContext from '../Context/Destinations/DestinationsContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchBar = () => {
    const [query, setQuery] = useState(null);
    const { setSelectedCategory, selectedType,setSelectedType, setSearchQuery } = useContext(DestinationsContext);
    const navigate = useNavigate();

    // Handle current tour type for styling
    const handleTourType = (type) => {
        setSelectedType(type);
        navigate('/destination');

        // Scroll to top when switching views
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle search action
    const handleSearch = () => {
        setSearchQuery(query);
        navigate('/destination');

        // Scroll to top when switching views
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleCategory = (category) => {
        setSelectedCategory(category);
        setSelectedType('All');

        navigate('/destination');

        // Scroll to top when switching views
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            id="search" className="max-w-[85rem] mx-auto -mt-16 relative z-20 px-4 sm:px-6 lg:px-8"
        >
            <div className="bg-[#1A2437] rounded-2xl shadow-2xl p-6 md:p-8 border-t-8 border-[#00C4CC]">

                <div className="flex flex-col md:flex-row items-stretch md:space-x-4 space-y-4 md:space-y-0 mb-6">

                    {/* Tabs */}
                    <div className="flex-shrink-0 flex space-x-2 justify-evenly p-1 bg-gray-700 rounded-lg shadow-inner">
                        <button
                            onClick={() => handleTourType('National')}
                            className={`px-4 py-2 font-semibold rounded-lg shadow-md shadow-gray-800 cursor-pointer transition ${selectedType === 'National' ? 'bg-slate-900 text-white text-lg duration-1000' : 'text-gray-300 text-base hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            National Tours
                        </button>
                        <button
                            onClick={() => handleTourType('International')}
                            className={`px-4 py-2 font-semibold rounded-lg shadow-md shadow-gray-800 cursor-pointer transition ${selectedType === 'International' ? 'bg-slate-900 text-white text-lg duration-1000' : 'text-gray-300 text-base hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            International Tours
                        </button>
                    </div>

                    {/* Search Input */}
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by destination (e.g., Paris, Kolkata, Goa)..."
                        className="flex-grow p-4 border border-gray-700 bg-gray-900 text-white text-base rounded-lg focus:ring-2 focus:ring-[#00C4CC] focus:border-[#00C4CC] transition duration-150"
                        aria-label="Search destination"
                    />

                    <button onClick={handleSearch} className="bg-[#00C4CC] text-slate-900 text-xl p-4 rounded-lg font-bold cursor-pointer hover:bg-cyan-400 transition duration-150 md:w-40 shadow-md">
                        <span className="hidden md:inline">Search</span>
                        <span className="inline md:hidden">Go</span>
                    </button>
                </div>

                {/* Quick Filters / Popular Categories */}
                <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-gray-800">
                    <span className="text-lg font-semibold text-gray-500 mr-2 mt-2 hidden sm:inline">Popular :</span>
                    {[
                        { icon: '🏔️', text: 'Mountain' },
                        { icon: '🏰', text: 'History' },
                        { icon: '🌲', text: 'Forest' },
                        { icon: '🏖️', text: 'Beach' }
                    ].map((cat, index) => (
                        <button key={index} onClick={() => handleCategory(cat.text)} className="flex items-center space-x-2 px-5 py-2 cursor-pointer bg-slate-800 text-gray-300 rounded-full text-base font-medium hover:bg-slate-700 transition shadow-sm">
                            <span className="text-xl">{cat.icon}</span>
                            <span>{cat.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>

    )
}

export default SearchBar
