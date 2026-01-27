import React from 'react'
import { motion } from 'framer-motion';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

const ActivityLog = ({ setIsModalOpen, selectedLogs, logLoading }) => {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 mt-20 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#141b2d] w-full max-w-2xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl shadow-cyan-900/20"
            >
                <div className="px-8 py-5 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-[#00C4CC]/10 to-transparent">
                    <div>
                        <h3 className="text-2xl font-black text-white italic">Audit Trail</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Booking: {selectedLogs?.bookingSummary?.destination}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl text-gray-400 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {logLoading ? (
                        <div className="py-20 text-center animate-pulse text-gray-500 font-bold uppercase text-xs tracking-tighter">Deciphering Logs...</div>
                    ) : (
                        <div className="space-y-8">
                            {selectedLogs?.activities?.map((log, index) => (
                                <div key={index} className="flex gap-6 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#1E293B] border-2 border-[#00C4CC] flex items-center justify-center text-[#00C4CC] group-hover:bg-[#00C4CC] group-hover:text-[#0F172A] transition-all duration-300 shadow-lg shadow-cyan-500/10">
                                            <FaCheckCircle size={16} />
                                        </div>
                                        {index !== selectedLogs.activities.length - 1 && (
                                            <div className="w-0.5 h-full bg-gradient-to-b from-[#00C4CC] to-transparent my-2"></div>
                                        )}
                                    </div>
                                    <div className="pb-8">
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </p>
                                        <h4 className="text-white font-black text-lg capitalize">{log.type.replace(/_/g, ' ')}</h4>
                                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">{log.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-8 py-5 bg-black/20 border-t border-gray-800 flex justify-between items-center">
                    <div className="text-xs">
                        <p className="text-gray-500 font-bold">Assigned Guide</p>
                        <p className="text-white font-black">{selectedLogs?.bookingSummary?.guide}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-black text-xs uppercase transition-all">Close Entry</button>
                </div>
            </motion.div>
        </div>
    )
}

export default ActivityLog
