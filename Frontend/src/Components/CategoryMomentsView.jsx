import React from 'react';
import { motion } from 'motion/react';
import { LuX, LuImage, LuMapPin, LuUser, LuTrash2 } from "react-icons/lu";

const CategoryMomentsView = ({ 
    selectedCategory, 
    setSelectedCategory, 
    categoryMoments, 
    isLoading, 
    isAdmin, 
    handleDelete 
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-[#0F172A] overflow-y-auto px-6 mt-15 py-12"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-black italic text-white">
                            {selectedCategory} <span className="text-[#00C4CC]">Moments</span>
                        </h2>
                        <p className="text-gray-500 text-sm uppercase font-bold tracking-widest">Shared by our Travelers</p>
                    </div>
                    <button 
                        onClick={() => setSelectedCategory(null)} 
                        className="p-4 bg-white/5 rounded-full text-white hover:bg-red-500 transition-all cursor-pointer"
                    >
                        <LuX size={32} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#00C4CC]/20 border-t-[#00C4CC] rounded-full animate-spin"></div>
                    </div>
                ) : categoryMoments && categoryMoments.length > 0 ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {categoryMoments.map((m) => (
                            <motion.div 
                                key={m._id} 
                                initial={{ y: 20, opacity: 0 }} 
                                animate={{ y: 0, opacity: 1 }} 
                                className="break-inside-avoid bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 group relative"
                            >
                                <img src={m.image.url} alt={m.placeName} className="w-full object-cover" />

                                {/* Admin Delete Logic - Corrected variable to m._id */}
                                {isAdmin && (
                                    <button 
                                        onClick={() => handleDelete(m._id, m.placeName)} 
                                        className="absolute top-4 right-4 p-2 bg-red-500 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer shadow-lg"
                                    >
                                        <LuTrash2 size={18} />
                                    </button>
                                )}

                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-[#00C4CC] mb-2">
                                        <LuMapPin size={14} /> 
                                        <span className="text-xs font-black uppercase tracking-tighter">{m.placeName}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm italic mb-4">"{m.caption || 'No caption shared'}"</p>
                                    <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                                        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px]">
                                            <LuUser size={12} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">{m.touristName}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <LuImage size={64} className="mx-auto text-gray-800 mb-4" />
                        <p className="text-gray-600 font-bold italic text-xl">No moments shared in this category yet.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CategoryMomentsView;