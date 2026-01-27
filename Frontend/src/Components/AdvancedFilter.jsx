import React, { useState, useContext, useRef, useEffect } from 'react';
import DestinationsContext from '../Context/Destinations/DestinationsContext';
import { FaChevronDown, FaFilter, FaRedo } from 'react-icons/fa';

const AdvancedFilter = () => {
    const { 
        selectedCategory, setSelectedCategory, 
        setSelectedType, setSearchQuery, 
        sortBy, setSortBy 
    } = useContext(DestinationsContext);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const categories = ['All', 'Mountain', 'History', 'Forest', 'Beach'];
    const sortOptions = [
        { value: 'Default', label: 'Default' },
        { value: 'PriceLow', label: 'Price: Low to High' },
        { value: 'PriceHigh', label: 'Price: High to Low' },
        { value: 'Rating', label: 'Top Rated' },
    ];

    // Close when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Reset filters
    const resetFilters = () => {
        setSelectedCategory('All');
        setSelectedType('All');
        setSortBy('Default');
        setSearchQuery('');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-6 py-3 bg-[#1A2437] border border-gray-700 rounded-xl text-white font-bold hover:border-[#00C4CC] transition cursor-pointer shadow-lg"
            >
                <FaFilter className="text-[#00C4CC]" />
                <span>Filters</span>
                <FaChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute md:right-0 mt-3 w-72 bg-[#1A2437] border border-gray-700 rounded-2xl shadow-2xl z-50 p-5 animate-in fade-in zoom-in duration-200">
                    {/* Category Filter */}
                    <div className="mb-4">
                        <p className="text-gray-500 text-xs font-bold uppercase mb-3">Category</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                        selectedCategory === cat 
                                        ? "bg-[#00C4CC] text-slate-900 border-[#00C4CC]" 
                                        : "border-gray-700 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[1px] bg-gray-800 my-4" />

                    {/* Sort By Filter */}
                    <div className="mb-4">
                        <p className="text-gray-500 text-xs font-bold uppercase mb-3">Sort By</p>
                        <div className="space-y-2">
                            {sortOptions.map(opt => (
                                <div 
                                    key={opt.value}
                                    onClick={() => setSortBy(opt.value)}
                                    className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition ${
                                        sortBy === opt.value ? "bg-slate-800 text-[#00C4CC] font-bold" : "text-gray-400 hover:bg-slate-800/50"
                                    }`}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-[1px] bg-gray-800 my-4" />

                    {/* Reset Action */}
                    <button 
                        onClick={resetFilters}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition text-xs font-bold"
                    >
                        <FaRedo size={10}/> Reset All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdvancedFilter;