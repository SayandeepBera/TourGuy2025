import React, { useContext, useMemo, useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight, FaArrowLeft, FaSearch, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import GuidesContext from '../../Context/Guides/GuidesContext';

const ListsView = ({ title, statusColor, activeView, setActiveView, setSelectedGuide }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 6; // Reduced slightly for better mobile viewing

    const context = useContext(GuidesContext);
    const { pendingGuides, approvedGuides, todayPendingGuides, activeGuides } = context;

    // Reset page and search term when active view changes
    useEffect(() => {
        setCurrentPage(1);
        setSearchTerm('');
    }, [activeView]);

    // Data Sources for List
    const dataSources = {
        'verified': approvedGuides,
        'pending': pendingGuides,
        'today-request': todayPendingGuides,
        'today-active': activeGuides
    };

    // Filter List based on active view
    const filteredList = useMemo(() => {
        const currentList = dataSources[activeView] || [];
        if (!searchTerm.trim()) return currentList;

        return currentList.filter(guide =>
            guide.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeView, searchTerm, pendingGuides, approvedGuides, todayPendingGuides]);

    // Total Pages
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    // Pagination Logic
    const pagedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredList.slice(start, start + itemsPerPage);
    }, [currentPage, filteredList]);

    return (
        <div className="min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500 px-2 md:px-8 lg:px-15 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <button
                    onClick={() => setActiveView('dashboard')}
                    className="flex items-center gap-2 text-[#00C4CC] mt-3 hover:text-cyan-300 transition cursor-pointer font-bold w-fit"
                >
                    <FaArrowLeft /> <span className="text-sm md:text-base">Back to Dashboard</span>
                </button>

                {/* Responsive Search Bar */}
                <div className="relative w-full md:w-72 md:mt-3">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <FaSearch size={14} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-[#1E293B] border border-gray-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#00C4CC] transition shadow-lg"
                    />
                </div>
            </div>

            <div className="bg-[#1E293B] rounded-2xl border border-gray-800 p-4 md:p-8 lg:p-10 shadow-2xl">
                <h2 className="text-xl md:text-2xl text-white text-center font-bold mb-6 md:mb-8">{title}</h2>

                {/* --- MOBILE VIEW: Card Layout (Visible only on small screens) --- */}
                <div className="block md:hidden space-y-4">
                    {pagedItems.length > 0 ? pagedItems.map((item) => (
                        <div key={item._id} className="bg-slate-800/40 border border-gray-700 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-[#0ef] font-bold text-lg">{item.fullName}</h3>
                                    <p className="text-gray-400 text-sm flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-xs" /> {item.city}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                                    {item.status}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedGuide(item)}
                                className="w-full bg-slate-700 text-[#fff] py-2 rounded-lg font-bold active:scale-95 flex items-center justify-center gap-2"
                            >
                                <FaInfoCircle /> View Details
                            </button>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-10">No records found.</p>
                    )}
                </div>

                {/* --- DESKTOP VIEW: Table Layout (Hidden on small screens) --- */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-base lg:text-lg border-b border-gray-700">
                                <th className="pb-4 px-2">Name</th>
                                <th className="pb-4 px-2">Location</th>
                                <th className="pb-4 px-2">Status</th>
                                <th className="pb-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {pagedItems.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-800/50 transition group">
                                    <td className="py-4 px-2 text-[#0ef] font-medium">{item.fullName}</td>
                                    <td className="py-4 px-2 text-gray-400">{item.city}</td>
                                    <td className="py-4 px-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => setSelectedGuide(item)}
                                            className="bg-slate-700 group-hover:bg-[#00C4CC] text-[#fff] px-4 py-1 rounded-lg transition font-bold active:scale-95 cursor-pointer"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 border-t border-gray-700 pt-6 gap-4">
                        <p className="text-xs md:text-sm text-gray-400 order-2 sm:order-1">
                            Showing {pagedItems.length} of {filteredList.length} results
                        </p>
                        <div className="flex items-center text-white gap-1 md:gap-2 order-1 sm:order-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="p-2 bg-slate-800 rounded-lg disabled:opacity-30 hover:bg-slate-700 transition"
                            >
                                <FaChevronLeft size={12} />
                            </button>

                            {/* Smart Pagination: Hides numbers on very small screens to prevent overflow */}
                            <div className="flex gap-1 md:gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs md:text-sm font-bold transition ${currentPage === i + 1 ? 'bg-[#00C4CC] text-[#121827]' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="p-2 bg-slate-800 rounded-lg disabled:opacity-30 hover:bg-slate-700 transition"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListsView