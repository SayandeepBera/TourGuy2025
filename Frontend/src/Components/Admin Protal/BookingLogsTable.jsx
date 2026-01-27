import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHistory, FaEye, FaSearch } from 'react-icons/fa';
import BookingContext from '../../Context/Booking/BookingContext';
import ActivityLog from './ActivityLog';

const BookingLogsTable = ({ data, isLoading, viewMode, setViewMode }) => {
    const { getBookingActivityLog } = useContext(BookingContext);
    const [selectedLogs, setSelectedLogs] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logLoading, setLogLoading] = useState(false);

    const handleViewLogs = async (bookingId) => {
        setLogLoading(true);
        setIsModalOpen(true);
        const response = await getBookingActivityLog(bookingId);
        if (response.success) {
            setSelectedLogs(response.result);
            console.log("Activity Logs:", response.result);
        }
        setLogLoading(false);
    };

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1E293B] rounded-[3rem] border border-gray-800 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3 italic text-white">
                        <FaHistory className="text-[#00C4CC]" />
                        {viewMode === 'all' ? 'Universal History' : "Today's Verified Transactions"}
                    </h2>

                    <div className="flex bg-black/40 p-1.5 rounded-2xl border border-gray-700">
                        <button onClick={() => setViewMode('all')} className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'all' ? 'bg-[#00C4CC] text-[#0F172A] shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Global</button>
                        <button onClick={() => setViewMode('today')} className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'today' ? 'bg-[#00C4CC] text-[#0F172A] shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Today</button>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="p-40 text-center flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-t-[#00C4CC] border-gray-800 rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-bold animate-pulse">Retrieving encrypted logs...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black">
                                <tr>
                                    <th className="px-10 py-6 text-white">Tourist Detail</th>
                                    <th className="px-10 py-6 text-white">Trip Timeline</th>
                                    <th className="px-10 py-6 text-white">Transaction ID</th>
                                    <th className="px-10 py-6 text-white">Status / Amount</th>
                                    <th className="px-10 py-6 text-center text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                <AnimatePresence>
                                    {data.map((booking) => (
                                        <motion.tr key={booking._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-4 text-white">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00C4CC] to-blue-600 flex items-center justify-center font-black text-[#0F172A] text-xl">
                                                        {booking.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg leading-none">{booking.fullName}</p>
                                                        <p className="text-xs text-gray-500 mt-1.5">{booking.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7 text-white">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-300 font-bold">{new Date(booking.checkIn).toLocaleDateString()}</span>
                                                    <span className="text-[#00C4CC] font-black">→</span>
                                                    <span className="text-gray-300 font-bold">{new Date(booking.checkOut).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-widest">{booking.adults} Adults | {booking.children} Kids</p>
                                            </td>
                                            <td className="px-10 py-7 text-white">
                                                <code className="bg-black/30 px-3 py-1.5 rounded-lg border border-gray-800 text-[11px] text-[#00C4CC] font-mono select-all">
                                                    {booking.transactionId || "N/A"}
                                                </code>
                                            </td>
                                            <td className="px-10 py-7 text-white">
                                                <p className="text-xl font-black mb-1">₹{booking.totalAmount}</p>
                                                <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 uppercase font-black tracking-widest">Confirmed & Paid</span>
                                            </td>
                                            <td className="px-10 py-7 text-center text-white">
                                                <button 
                                                    onClick={() => handleViewLogs(booking._id)}
                                                    className="p-4 bg-white/5 rounded-2xl hover:bg-[#00C4CC] hover:text-[#0F172A] transition-all transform active:scale-90 border border-white/5"
                                                >
                                                    <FaEye size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}

                    {!isLoading && data.length === 0 && (
                        <div className="py-40 text-center">
                            <div className="bg-[#1E293B] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700 shadow-inner">
                                <FaSearch size={30} className="text-gray-700" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-600 italic">No Matching Encrypted Logs</h3>
                            <p className="text-gray-700 mt-2 font-bold uppercase text-xs">Verify your search criteria or date range</p>
                        </div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <ActivityLog setIsModalOpen={setIsModalOpen} selectedLogs={selectedLogs} logLoading={logLoading} />
                )}
            </AnimatePresence>
        </>
    );
};

export default BookingLogsTable;