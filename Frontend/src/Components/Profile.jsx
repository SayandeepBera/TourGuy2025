import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Globe, Languages,
    ShieldCheck, Edit3, Fingerprint, Briefcase, Info,
    Award, CheckCircle2, ChevronRight, Verified, ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthContext from '../Context/Authentication/AuthContext';
import ProfileContext from '../Context/Profile/ProfileContext';
import CompletionCircle from './CompletionCircle';
import InfoCard from './InfoCard';

const Profile = () => {
    const { username, userRole, email, userId } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState('identity');
    const [profileData, setProfileData] = useState(null);
    const { fetchUserProfile } = useContext(ProfileContext);

    const isGuide = userRole === 'approved_guide' || userRole === 'pending_guide';
    const isAdmin = userRole === 'admin';
    
    // Sidebar Items 
    const sidebarItems = [
        { id: 'identity', label: 'Personal Identity', icon: <User size={18} /> },
        { id: 'location', label: 'Global Address', icon: <MapPin size={18} /> },
        { id: 'preferences', label: 'Language & Skills', icon: <Languages size={18} /> },
    ];

    useEffect(() => {
        const getProfile = async () => {
            const result = await fetchUserProfile(userId);
            console.log("success : ", result.success);
            if (result && result.success) {
                setProfileData(result.profile);
            } else {
                console.error("Failed to fetch profile data:", result?.error);
            }
        };

        console.log("user Id : ", userId);
        if (userId) {
            getProfile();
        }
    }, [userId]);

    return (
        <div className="bg-[#0F172A] min-h-screen text-white pt-15 pb-20 px-4 md:px-10 font-[fangsong]">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

                {/* --- Left Sidebar --- */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="sticky top-28 space-y-6">
                        {/* Completion Circle Card */}
                        <CompletionCircle profileData={profileData} username={username} email={email} />

                        {/* Navigation Menu */}
                        <div className="space-y-4">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all border ${activeSection === item.id
                                        ? "bg-[#00C4CC] text-[#0F172A] border-[#00C4CC] shadow-xl shadow-[#00C4CC]/20"
                                        : "bg-white/[0.02] text-gray-400 border-white/5 hover:bg-white/[0.05]"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {item.icon}
                                        {item.label}
                                    </div>
                                    <ChevronRight size={16} opacity={activeSection === item.id ? 1 : 0} />
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* --- Main Content --- */}
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeSection === 'identity' && (
                                <div className="space-y-8">
                                    <div className="flex flex-col md:flex-row items-center gap-10 bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] relative overflow-hidden">
                                        <div className="w-40 h-40 rounded-full border-4 border-[#00C4CC]/30 p-2 shrink-0">
                                            {profileData?.avatar?.url ? (
                                                <img src={profileData.avatar.url} className="w-full h-full rounded-full object-cover shadow-2xl hover:scale-105 transition-transform" alt="avatar" />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#00C4CC] to-blue-500 flex items-center justify-center text-5xl font-black text-[#0F172A] hover:scale-105 transition-transform">
                                                    {username?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h2 className="text-5xl font-black italic tracking-tighter mb-4 flex items-center gap-3 justify-center md:justify-start">
                                                {profileData?.fullName || username}
                                                {isAdmin && <ShieldAlert className="text-red-500" size={32} />}
                                                {isGuide && userRole === 'approved_guide' && <Verified className="text-[#00C4CC]" size={32} />}
                                            </h2>
                                            <div className="flex items-center gap-3 text-[#00C4CC] mb-6 justify-center md:justify-start">
                                                <Award size={20} />
                                                <span className="text-xs uppercase font-black tracking-[0.3em]">{userRole?.replace('_', ' ')} Member</span>
                                            </div>
                                            <Link to="/editprofile" className="inline-flex items-center gap-3 bg-white text-[#0F172A] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00C4CC] transition-all shadow-xl">
                                                <Edit3 size={16} /> Edit Profile
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoCard icon={<Mail />} label="Email" value={email} locked />
                                        <InfoCard icon={<Fingerprint />} label="Username" value={username} locked />
                                        <InfoCard icon={<Phone />} label="Phone" value={profileData?.phoneNumber?.number ? `${profileData.phoneNumber.countryCode} ${profileData.phoneNumber.number}` : "Not Linked"} />
                                        <InfoCard icon={<Briefcase />} label="Gender" value={isGuide ? "Service Provider" : isAdmin ? "System Admin" : "Explorer"} />
                                    </div>

                                    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative">
                                        <div className="flex items-center gap-3 mb-6 text-[#00C4CC]">
                                            <Info size={20} />
                                            <h4 className="font-black uppercase text-[10px] tracking-[0.2em]">{isGuide ? "Guide Mission" : isAdmin ? "Admin Biography" : "Traveler Biography"}</h4>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed text-lg italic">
                                            {profileData?.bio || "Tell the world about your traveling spirit. Click edit to add a bio."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'location' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoCard icon={<Globe />} label="Nationality" value={profileData?.country || "Not Set"} />
                                    <InfoCard icon={<MapPin />} label="State" value={profileData?.state || "Not Set"} />
                                    <InfoCard icon={<MapPin />} label="City" value={profileData?.city || "Not Set"} />
                                    <div className="md:col-span-2">
                                        <InfoCard icon={<MapPin />} label="Residential Address" value={profileData?.address || "Please provide your address for further communication."} />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'preferences' && (
                                <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[#00C4CC] font-black uppercase text-xs tracking-[0.3em] mb-10 flex items-center gap-3">
                                        <Languages size={20} /> Communication Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-4">
                                        {profileData?.languages?.length > 0 ? (
                                            profileData.languages.map(lang => (
                                                <div key={lang} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[#00C4CC] flex items-center gap-2 shadow-inner">
                                                    <CheckCircle2 size={16} /> {lang}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic text-lg">No languages listed yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Profile;