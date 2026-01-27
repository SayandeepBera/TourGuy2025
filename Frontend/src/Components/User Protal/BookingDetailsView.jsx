import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, User, ArrowLeft, Phone, Mail,
    ShieldCheck, CreditCard, Clock, FileText
} from 'lucide-react';
import BookingContext from '../../Context/Booking/BookingContext';
import AuthContext from '../../Context/Authentication/AuthContext';
import GuideDetailsModal from './GuideDetailsModal';
import ChatContext from '../../Context/Chat/ChatContext';
import Chat from '../Chat';

const BookingDetailsView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getTouristHistory } = useContext(BookingContext); 
    const { createNewConversation } = useContext(ChatContext);
    const { authToken, userId } = useContext(AuthContext);

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showGuideProfile, setShowGuideProfile] = useState(null);
    const [activeChatId, setActiveChatId] = useState(null);

    // Fetch booking details on mount
    useEffect(() => {
        const fetchDetails = async () => {
            const response = await getTouristHistory(userId);
            if (response.success) {
                const found = response.result.bookings.find(b => b._id === id);
                setBooking(found);
                console.log("Booking Details:", found);
            }
            setLoading(false);
        };

        fetchDetails();
    }, [id]);

    const handleStartChatWithGuide = async () => {
        if(!authToken){
            navigate('/login');
            return;
        }

        if(booking?.guideId?.userId){
            const response = await createNewConversation(booking.guideId.userId);
            if(response.success){
                setActiveChatId(response.newConversation._id);
            }
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">
                <div className="flex flex-col items-center text-[#00C4CC]">
                    <div className="animate-pulse bg-white/5 h-64 rounded-3xl" />
                    <p className="font-black uppercase tracking-widest text-sm">
                        Retrieving Trip Data...
                    </p>
                </div>
            </div>
        );
    }

    if (!booking && !loading) return <div className="text-white text-center py-20">Booking not found.</div>;

    // Function to capitalize the first letter of each word
    const wordCapitalize = (words) => {
        return words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };
    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto pb-20 mt-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#00C4CC] transition-colors font-bold"
                    >
                        <ArrowLeft size={20} /> Back to History
                    </button>
                    <div className="text-right">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Ref ID</p>
                        <p className="text-white font-mono text-sm">#{String(booking._id).toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Summary Card */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden">
                            <div className="relative h-64">
                                <img
                                    src={booking.destinationId?.placeImage?.url}
                                    className="w-full h-full object-cover"
                                    alt="destination"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent" />
                                <div className="absolute bottom-6 left-8">
                                    <span className="bg-[#00C4CC] text-[#0F172A] px-4 py-1 rounded-full text-[10px] font-black uppercase mb-2 inline-block">
                                        {String(booking.bookingStatus).replace(/_/g, ' ')}
                                    </span>
                                    <h1 className="text-4xl font-black text-white italic">{wordCapitalize(booking.destinationName)}</h1>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Calendar size={10} /> Check-in</p>
                                    <p className="text-white font-bold">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> Duration</p>
                                    <p className="text-white font-bold">{booking.destinationId?.duration}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><User size={10} /> Guests</p>
                                    <p className="text-white font-bold">{booking.adults} Adults, {booking.children} Kids</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><CreditCard size={10} /> Total Paid</p>
                                    <p className="text-[#00C4CC] font-black text-xl">₹{booking.totalAmount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tourist Details Section */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                            <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
                                <ShieldCheck className="text-[#00C4CC]" /> Traveler Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-black uppercase">Full Name</p>
                                        <p className="text-white font-bold">{booking.fullName}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg text-[#00C4CC]"><Mail size={16} /></div>
                                        <p className="text-gray-300 text-sm">{booking.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg text-[#00C4CC]"><Phone size={16} /></div>
                                        <p className="text-gray-300 text-sm">{booking.phoneNumber.countryCode} {booking.phoneNumber.number}</p>
                                    </div>
                                </div>
                                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                                    <p className="text-gray-500 text-[10px] font-black uppercase mb-3">Verification ID</p>
                                    <div className="flex items-center gap-4">
                                        <FileText className="text-gray-400" size={30} />
                                        <div>
                                            <p className="text-white text-sm font-bold">Document Uploaded</p>
                                            <a href={booking.document.url} target="_blank" rel="noreferrer" className="text-[#00C4CC] text-xs font-black hover:underline mt-1 block">VIEW ATTACHMENT</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Guide Card */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-[#00C4CC]/10 to-transparent border border-[#00C4CC]/20 rounded-[2.5rem] p-8 text-center sticky top-24">
                            <h3 className="text-white font-black uppercase tracking-tighter mb-6">Assigned Guide</h3>
                            {booking.guideId ? (
                                <>
                                    <div className="relative w-32 h-32 mx-auto mb-6">
                                        <img
                                            src={booking.guideId.profilePhoto?.url}
                                            className="w-full h-full object-cover rounded-full border-4 border-[#00C4CC]"
                                            alt="guide"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-full border-4 border-[#121827]">
                                            <ShieldCheck size={16} className="text-white" />
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-black text-white italic">{booking.guideId.fullName}</h4>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 mb-6">Professional Local Guide</p>

                                    <div className="space-y-3">
                                        <button onClick={handleStartChatWithGuide} className="w-full py-4 bg-[#00C4CC] text-[#0F172A] rounded-2xl font-black text-xs uppercase hover:bg-[#00C4CC]/90 transition-all">
                                            Chat with Guide
                                        </button>
                                        <button
                                            onClick={() => setShowGuideProfile(booking.guideId)}
                                            className="w-full py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase border border-white/10 hover:bg-white/10 transition-all">
                                            View Profile
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="py-10">
                                    <div className="w-20 h-20 bg-white/5 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
                                        <User className="text-gray-600" size={40} />
                                    </div>
                                    <p className="text-gray-500 font-bold text-sm">Waiting for Guide Confirmation...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Guide Profile Modal */}
                <AnimatePresence>
                    {showGuideProfile && (
                        <GuideDetailsModal
                            viewingGuide={showGuideProfile}
                            setViewingGuide={setShowGuideProfile}
                            isReadOnly={true}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {activeChatId && (
                        <Chat
                            conversationId={activeChatId}
                            onClose={() => setActiveChatId(null)}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default BookingDetailsView;