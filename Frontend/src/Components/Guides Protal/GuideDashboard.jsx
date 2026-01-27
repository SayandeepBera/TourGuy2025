import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPowerOff } from "react-icons/fa6";
import AuthContext from '../../Context/Authentication/AuthContext';
import GuidesContext from '../../Context/Guides/GuidesContext';

import StatCards from './StatCards';
import IncomingRequests from './IncomingRequests';
import GuideBookingHistory from './GuideBookingHistory';
import RecentActivity from './RecentActivity';
import Sidebar from './Sidebar';
import PendingGuideDashboard from './PendingGuideDashboard';
import BookingContext from '../../Context/Booking/BookingContext';
import MobileDashboardNav from './MobileDashboardNav';
import GuideChatList from './GuideChatList';

const GuideDashboard = () => {
    const { userRole, username, userId } = useContext(AuthContext);
    const { isAvailable, toggleGuideAvailability, syncAvailability } = useContext(GuidesContext);
    const [activeTab, setActiveTab] = useState('overview');
    const {
        getGuideStats, guideStats, handleActiveRequests,
        activeRequests, getRecentActivities, activities,
        getGuideHistory, guideHistory
    } = useContext(BookingContext);

    // Check if the guide is still in the pending phase
    const isPending = userRole === "pending_guide";

    // Helper function for dynamic greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Check guide profile active or not, stats, recent activity, and booking history
    useEffect(() => {
        if (userId && !isPending) {
            syncAvailability(userId);
            getGuideStats(userId);
            handleActiveRequests(userId);
            getRecentActivities(userId);
            getGuideHistory(userId);
        }
    }, [userId, isPending]);

    const refreshData = async (userId) => {
        if (userId) {
            // Refresh all data
            await Promise.all([
                syncAvailability(userId),
                getGuideStats(userId),
                handleActiveRequests(userId),
                getRecentActivities(userId),
                getGuideHistory(userId)
            ]);
        }
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-[fangsong] pt-5 flex">
            {/* --- Sidebar --- */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isPending={isPending} />

            {/* --- Main Content --- */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold italic">
                            {getGreeting()}, {username}!
                        </h1>
                        <p className="text-gray-400">
                            Manage your professional profile and guest experiences from your central hub.
                        </p>
                    </div>

                    {!isPending && (
                        <div className="flex justify-center items-center gap-4 bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
                            <span className={`text-sm font-bold ${isAvailable ? 'text-[#00C4CC]' : 'text-red-500'}`}>
                                {isAvailable ? 'Online & Discoverable' : 'Offline'}
                            </span>
                            <button
                                onClick={() => toggleGuideAvailability(userId)}
                                className={`p-2 rounded-xl transition-all cursor-pointer duration-300 ${isAvailable ? 'bg-[#00C4CC] text-[#121827]' : 'bg-gray-800 text-gray-400'}`}
                            >
                                <FaPowerOff size={20} />
                            </button>
                        </div>
                    )}
                </header>

                <MobileDashboardNav
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isPending={isPending}
                />

                <AnimatePresence mode="wait">
                    {isPending ? (
                        <PendingGuideDashboard key="pending" />
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <StatCards statsData={guideStats} />
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <IncomingRequests activeRequests={activeRequests} userId={userId} refreshData={refreshData} />
                                        <RecentActivity activities={activities} />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'requests' && <IncomingRequests activeRequests={activeRequests} userId={userId} refreshData={refreshData} />}
                            {activeTab === 'history' && <GuideBookingHistory guideHistory={guideHistory} userId={userId} refreshData={refreshData} />}
                            {activeTab === 'message' && <GuideChatList onBack={() => setActiveTab('overview')} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default GuideDashboard;