import React, { useState, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LuSearch, LuCalendar, LuUser, LuMapPin, LuInfo, LuMessageCircle } from "react-icons/lu";
import BookingInfoModal from './BookingInfoModal';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';
import CompletionPinModal from './CompletionPinModal';
import Chat from '../Chat';
import ChatContext from '../../Context/Chat/ChatContext';
import AuthContext from '../../Context/Authentication/AuthContext';

const GuideBookingHistory = ({ guideHistory, userId, refreshData }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [completingBooking, setCompletingBooking] = useState(null);
    const [activeChatId, setActiveChatId] = useState(null);

    const { createNewConversation } = useContext(ChatContext);
    const { authToken } = useContext(AuthContext);
    
    // Filter Logic
    const filteredHistory = guideHistory.filter(item => {
        const matchesSearch = item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.destinationId?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || item.bookingStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    console.log("Filtered History: ", filteredHistory);

    // Status Styles Logic
    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'confirmed': return 'bg-[#00C4CC]/10 text-[#00C4CC] border-[#00C4CC]/20';
            case 'cancelled': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            case 'rejected_by_guide': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
    };

    // Handle Chat Logic
    const handleStartChat = async (touristId) => {
        if(!authToken){
            navigate('/login');
            return;
        }

        try {
            const response = await createNewConversation(touristId);
            if(response.success){
                setActiveChatId(response.newConversation._id);
            }else{
                toast.error(response.error || "Could not start chat.");
            }
        } catch (error) {
            toast.error("Failed to start chat due to a server error.");
        }
    }

    // Handle Complete Tour
    const handleCompleteSuccess = async () => {
        setCompletingBooking(null);
        await refreshData(userId);
    }

    return (
        <div className="space-y-6">
            {/* --- Controls Header --- */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
                <div className="relative w-full md:w-96">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by tourist or destination..."
                        className="w-full bg-black/20 border border-gray-700 rounded-xl py-2 pl-10 pr-4 focus:border-[#00C4CC] outline-none text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
                    {['all', 'confirmed', 'completed', 'cancelled', 'rejected_by_guide'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${filterStatus === status
                                ? 'bg-[#00C4CC] text-[#0F172A] border-[#00C4CC]'
                                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
                                }`}
                        >
                            {status.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- History Table / List --- */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold">Tourist</th>
                                <th className="px-6 py-4 font-bold">Destination</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                                <th className="px-6 py-4 font-bold">Amount</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredHistory.length > 0 ? filteredHistory.map((booking) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={booking._id}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[#00C4CC]">
                                                <LuUser size={16} />
                                            </div>
                                            <span className="font-bold">{booking.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <LuMapPin size={14} className="text-[#00C4CC]" />
                                            {booking.destinationName || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <LuCalendar size={14} />
                                            {new Date(booking.checkIn).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#00C4CC]">
                                        ₹{booking.totalAmount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(booking.bookingStatus)}`}>
                                            {booking.bookingStatus.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Chat Button */}
                                            <button
                                                onClick={() => handleStartChat(booking.userId)}
                                                className="p-2 bg-[#00C4CC]/10 text-[#00C4CC] hover:bg-[#00C4CC] hover:text-[#0F172A] rounded-lg transition-all cursor-pointer"
                                                title="Chat with Tourist"
                                            >
                                                <LuMessageCircle size={18} />
                                            </button>

                                            {/* Show Complete Button only if tour is 'confirmed' and checkOut date has passed */}
                                            {booking.bookingStatus === 'confirmed' && new Date() > new Date(booking.checkOut) && (
                                                <button
                                                    onClick={() => setCompletingBooking(booking)}
                                                    className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all cursor-pointer"
                                                    title="Complete Tour"
                                                >
                                                    <FaCheckCircle size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="p-2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                <LuInfo size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-500 italic">
                                        No booking history found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Booking Info Modal --- */}
            <AnimatePresence>
                {selectedBooking && (
                    <BookingInfoModal
                        selectedBooking={selectedBooking}
                        setSelectedBooking={setSelectedBooking}
                        getStatusStyle={getStatusStyle}
                        onStartChat={handleStartChat}
                    />
                )}

                {completingBooking && (
                    <CompletionPinModal
                        booking={completingBooking}
                        onClose={() => setCompletingBooking(null)}
                        onSuccess={handleCompleteSuccess}
                    />
                )}

                {activeChatId && (
                    <Chat
                        key={activeChatId}
                        conversationId={activeChatId}
                        isFloating={true}
                        onClose={() => setActiveChatId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default GuideBookingHistory;