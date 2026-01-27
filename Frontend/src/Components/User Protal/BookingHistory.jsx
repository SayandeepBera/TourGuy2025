import React, { useState, useContext, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Clock, CheckCircle2,
    ArrowLeft, Info, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Context/Authentication/AuthContext';
import BookingContext from '../../Context/Booking/BookingContext';
import StatCard from './StatCard';
import BookingContent from './BookingContent';
import UploadMomentModal from './UploadMoment';

const BookingHistory = () => {
    const navigate = useNavigate();
    const { userId } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const { getTouristHistory } = useContext(BookingContext);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);


    // Fetch booking history
    const fetchHistory = useCallback(async () => {
        if (!userId) return;

        try {
            const res = await getTouristHistory(userId);
            if (res.success) {
                setBookings(res.result.bookings);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            setBookings([]);
        } finally {
            setIsInitialLoad(false); // Stop the initial load state
        }
    }, [userId, getTouristHistory]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Filtered bookings based on status
    const filteredBookings = bookings.filter(b =>
        filterStatus === 'all' ? true : b.bookingStatus === filterStatus
    );

    // Calculate Stats Dynamically from the bookings array
    const stats = {
        total: bookings.length,
        completed: bookings.filter(b => b.bookingStatus === 'completed').length,
        confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
        investment: bookings.reduce((acc, curr) => acc + (curr.paymentStatus === 'paid' ? Number(curr.totalAmount) : 0), 0)
    };

    // Open Upload Modal
    const openUploadModal = (trip) => {
        setSelectedTrip(trip);
        setIsUploadOpen(true);
    };

    return (
        <div className="bg-[#0F172A] min-h-screen text-white pt-15 md:pt-20 pb-20 px-4 md:px-10 font-[fangsong]">
            <div className="max-w-6xl mx-auto">

                {/* --- Header Section --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 md:mb-12 gap-6">
                    <div className="w-full lg:w-auto">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white transition-all mb-4 text-[10px] font-black uppercase tracking-[0.2em]">
                            <ArrowLeft size={14} /> Return to Dashboard
                        </button>
                        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter">My <span className="text-[#00C4CC]">Adventures</span></h1>
                        <p className="text-gray-500 font-medium mt-2 text-sm">Manage your past and upcoming local experiences.</p>
                    </div>

                    {/* Filter Bar: Scrollable on small screens */}
                    <div className="flex items-center justify-around gap-2 bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
                        {['all', 'confirmed', 'completed', 'cancelled'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === s ? "bg-[#00C4CC] text-[#0F172A]" : "text-gray-500 hover:text-white"}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Stats Section: 2 columns on mobile, 4 on large --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
                    <StatCard label="Adventures" value={stats.total} icon={<MapPin size={18} />} />
                    <StatCard label="Completed" value={stats.completed} icon={<CheckCircle2 size={18} />} />
                    <StatCard label="Upcoming" value={stats.confirmed} icon={<Clock size={18} />} />
                    <StatCard label="Investment" value={`₹${stats.investment.toLocaleString()}`} icon={<Wallet size={18} />} />
                </div>

                {/* --- Content Area --- */}
                {isInitialLoad ? (
                    <div className="py-20 text-center">
                        <div className="w-10 h-10 border-4 border-[#00C4CC]/20 border-t-[#00C4CC] rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 italic uppercase text-[10px]">Recalling journeys...</p>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <BookingContent filteredBookings={filteredBookings} onShareClick={openUploadModal} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-20 md:py-32 flex flex-col items-center text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[2.5rem] md:rounded-[4rem] px-6"
                    >
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 md:mb-8">
                            <Info size={30} className="text-gray-600" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic mb-4">No Adventures Found</h2>
                        <p className="text-gray-500 max-w-xs mb-8 md:mb-10 text-sm font-medium">Book your first local guide and start exploring.</p>
                        <button
                            onClick={() => navigate('/destination')}
                            className="bg-[#00C4CC] text-[#0F172A] px-8 py-3 md:px-10 md:py-4 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] shadow-xl shadow-[#00C4CC]/20"
                        >
                            Find Destinations
                        </button>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {isUploadOpen && (
                    <UploadMomentModal
                        isOpen={isUploadOpen}
                        onClose={() => setIsUploadOpen(false)}
                        booking={selectedTrip}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookingHistory;