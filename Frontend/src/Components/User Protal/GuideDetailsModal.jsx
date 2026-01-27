import React from 'react'
import { motion } from 'framer-motion';
import { LuX } from "react-icons/lu";

const GuideDetailsModal = ({ viewingGuide, setViewingGuide, isReadOnly = false }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-gray-900 border border-gray-700 p-8 rounded-3xl max-w-sm w-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 md:p-4">
                    <button onClick={() => setViewingGuide(null)} className="text-gray-400 hover:text-white"><LuX size={24} /></button>
                </div>
                <div className="text-center">
                    <img src={viewingGuide.profilePhoto.url} className="w-24 h-24 rounded-full mx-auto border-4 border-[#00C4CC] mb-4" alt="" />
                    <h4 className="text-2xl font-bold text-white">{viewingGuide.fullName}</h4>
                    <p className="text-[#00C4CC] font-medium mb-6">Certified Professional Guide</p>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-400 uppercase">Age</p>
                            <p className="text-white font-bold">{viewingGuide.age} Years</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-400 uppercase">City</p>
                            <p className="text-white font-bold">{viewingGuide.city}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl col-span-2 border border-white/10">
                            <p className="text-xs text-gray-400 uppercase">Languages</p>
                            <p className="text-white font-bold text-sm leading-relaxed">{Array.isArray(viewingGuide.languages) ? viewingGuide.languages.join(", ") : viewingGuide.languages}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setViewingGuide(null)} 
                        className="w-full mt-8 bg-[#00C4CC] py-3 rounded-xl text-gray-900 font-bold hover:bg-white transition-all"
                    >
                        {isReadOnly ? "Close Profile" : "Confirm Selection"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default GuideDetailsModal
