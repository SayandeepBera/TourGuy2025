import React from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { LuInfo, LuX, LuUser, LuWallet, LuMessageSquare } from "react-icons/lu";

const BookingInfoModal = ({ selectedBooking, setSelectedBooking, getStatusStyle, onStartChat }) => {
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 mt-15 bg-black/70 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#141b2d] border border-gray-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <LuInfo className="text-[#00C4CC]" /> Activity Detail
                    </h3>
                    <button
                        onClick={() => setSelectedBooking(null)}
                        className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-all"
                    >
                        <LuX size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Tourist Info Card with Chat Button */}
                    <div className="flex items-center justify-between p-5 bg-black/20 rounded-3xl border border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#00C4CC]/10 flex items-center justify-center text-[#00C4CC] shadow-inner">
                                <LuUser size={28} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Tourist</p>
                                <p className="font-extrabold text-xl text-white">{selectedBooking.fullName}</p>
                            </div>
                        </div>

                        {/* Quick Message Button */}
                        <button
                            onClick={() => {
                                onStartChat(selectedBooking.userId);
                                setSelectedBooking(null); // Close info modal to show chat
                            }}
                            className="p-3 bg-[#00C4CC] text-[#0F172A] rounded-2xl hover:scale-110 transition-all shadow-lg shadow-[#00C4CC]/20"
                            title="Message Tourist"
                        >
                            <LuMessageSquare size={20} />
                        </button>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Booking Status</p>
                            <p className={`text-xs font-black mt-1 px-2 py-1 rounded-md inline-block ${getStatusStyle(selectedBooking.bookingStatus)}`}>
                                {selectedBooking.bookingStatus.replace('_', ' ')}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Total Transaction</p>
                            <p className="text-lg font-black mt-1 text-[#00C4CC] flex items-center gap-1">
                                <LuWallet size={16} /> ₹{selectedBooking.totalAmount}
                            </p>
                        </div>
                    </div>

                    {/* Detailed Summary Log */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#00C4CC] rounded-full animate-pulse"></span>
                            Recent Activity Log
                        </h4>
                        <div className="p-5 bg-black/30 rounded-3xl border border-gray-800 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#00C4CC]"></div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Booking for <span className="text-white font-bold">{selectedBooking.destinationName}</span> has been processed.
                                The current status is set to <span className="text-[#00C4CC] font-bold uppercase">{selectedBooking.bookingStatus.replace('_', ' ')}</span>.
                            </p>
                            <p className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-widest">
                                Last Updated: {new Date(selectedBooking.updatedAt || selectedBooking.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-900/30 text-center">
                    <button
                        onClick={() => setSelectedBooking(null)}
                        className="text-[#00C4CC] text-xs font-bold uppercase tracking-[0.2em] hover:text-white transition-all"
                    >
                        Close Details
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default BookingInfoModal
