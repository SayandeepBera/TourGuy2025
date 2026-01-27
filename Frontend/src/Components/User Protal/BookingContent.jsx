import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, User, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LuImage } from 'react-icons/lu';

const BookingContent = ({ filteredBookings, onShareClick }) => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'confirmed': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case 'completed': return "bg-[#00C4CC]/10 text-[#00C4CC] border-[#00C4CC]/20";
            case 'pending_guide_confirmation': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case 'cancelled': return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 md:gap-6"
        >
            {filteredBookings.map((trip) => (
                <motion.div
                    key={trip._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.005, backgroundColor: 'rgba(255,255,255,0.03)' }}
                    className="group bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 transition-all"
                >
                    {/* Destination Image: Full width on mobile, fixed width on desktop */}
                    <div className="w-full md:w-48 h-40 md:h-32 rounded-[1.5rem] md:rounded-3xl overflow-hidden shrink-0 bg-gray-800 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <img
                            src={trip.destinationId?.placeImage.url}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            alt="destination"
                        />
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                            <MapPin size={10} className="text-[#00C4CC]" /> {trip.city}
                        </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 w-full text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-3 gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(trip.bookingStatus)}`}>
                                {trip.bookingStatus.replace(/_/g, ' ')}
                            </span>
                            <p className="text-gray-600 font-bold text-[10px] uppercase tracking-tighter">Ref: #{trip._id.slice(-6).toUpperCase()}</p>
                        </div>

                        <div className="flex justify-between flex-wrap">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black italic mb-4">{trip.destinationName}</h3>

                                <div className="flex flex-wrap justify-center md:justify-start gap-y-3 gap-x-6 text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-[#00C4CC]" />
                                        <span className="text-xs font-bold tracking-tight">
                                            {new Date(trip.checkIn).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-[#00C4CC]" />
                                        <span className="text-xs font-bold line-clamp-1">Guide: <span className="text-white">{trip.guideId?.fullName || "Auto-Assigning..."}</span></span>
                                    </div>
                                </div>
                            </div>

                            {trip.bookingStatus === 'completed' && (<button
                                onClick={() => onShareClick(trip)}
                                className="flex items-center gap-2 text-xs font-black text-[#00C4CC] border border-[#00C4CC]/30 px-3 py-1.5 rounded-lg hover:bg-[#00C4CC] hover:text-black transition-all mt-2"
                            >
                                <LuImage size={16} /> SHARE MOMENT
                            </button>)}
                        </div>

                    </div>



                    {/* Price and Action: Bottom bar on mobile, right side on desktop */}
                    <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-5 md:pt-0 md:pl-8 shrink-0">
                        <div className="text-left md:text-right">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Paid</p>
                            <p className="text-xl md:text-2xl font-black text-[#00C4CC]">₹{trip.totalAmount.toLocaleString()}</p>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                requestAnimationFrame(() => {
                                    navigate(`/booking-details/${trip._id}`);
                                });
                            }}
                            className="bg-white text-[#0F172A] p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-[#00C4CC] transition-colors"
                        >
                            <ChevronRight size={18} />
                        </motion.button>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    )
}

export default BookingContent
