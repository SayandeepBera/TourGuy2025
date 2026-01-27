import React, { useContext, useState, useEffect } from 'react';
import { FaUsers, FaUserCheck, FaClock, FaExclamationTriangle, FaWalking, FaHistory, FaRegEnvelope } from 'react-icons/fa';
import { MessageCircle } from 'lucide-react';
import AuthContext from '../../Context/Authentication/AuthContext';
import ListsView from './ListsView';
import GuidesContext from '../../Context/Guides/GuidesContext';
import GuideDetails from './GuideDetails';
import { toast } from 'react-toastify';
import AdminBookingHistory from './AdminBookingHistory';
import ConciergeContext from '../../Context/Concierge/ConciergeContext';
import ConciergeManagement from './ConciergeManagement';
import BookingContext from '../../Context/Booking/BookingContext';
import AdminChatList from './AdminChatList';

const AdminHome = () => {
    const { username } = useContext(AuthContext);
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedGuide, setSelectedGuide] = useState(null);
    const { getRevenueStats, revenueData } = useContext(BookingContext);

    const context = useContext(GuidesContext);
    const {
        getAllGuides, getAllPendingGuides, getAllApprovedGuides,
        getTodayPendingGuides, getTotalUsers, getActiveGuides,
        totalPendingGuides, totalApprovedGuides, totalTodayPendingGuides,
        totalUsers, totalActiveGuides, updateGuideStatus,
        pendingGuides, guides
    } = context;
    const { getAllConciergeRequests, totalConciergeRequests, pendingConciergeRequests } = useContext(ConciergeContext);

    // Fetch guides, pending guides, approved guides, today's pending guides, total users and concierge requests
    useEffect(() => {
        const fetchGuides = async () => {
            await Promise.all([
                getAllGuides(), getAllPendingGuides(), getAllApprovedGuides(),
                getTodayPendingGuides(), getTotalUsers(), getActiveGuides(),
                getAllConciergeRequests(), getRevenueStats()
            ]);
        };
        fetchGuides();
    }, []);

    // Top 3 pending guides (First Come First Serve - Oldest First)
    const urgentRequests = [...pendingGuides]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(0, 3);

    // Filter guides for reactivation (scheduled for deletion)
    const reactivationRequests = guides.filter((guide) => guide.status === 'scheduled_for_deletion');

    const handleSwitchView = (view) => {
        setActiveView(view);
        setSelectedGuide(null);
    };

    // Refresh all data
    const refreshAllData = async () => {
        await Promise.all([
            getAllGuides(),
            getAllPendingGuides(),
            getAllApprovedGuides(),
            getTodayPendingGuides(),
            getTotalUsers(),
            getActiveGuides(),
            getAllConciergeRequests(),
            getRevenueStats()
        ]);
    };

    // Handle guide verification
    const handleVerification = async (id, status) => {
        const result = await updateGuideStatus(id, status);

        if (result.success) {
            toast.success(result.msg, {
                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
            });

            setSelectedGuide(null);
            setActiveView('dashboard');

            // Refresh all lists to ensure stats update correctly
            await refreshAllData();
        } else {
            toast.error(result.msg || "Failed to update guide status.", {
                theme: "colored"
            });
        }

    };

    // View Logic
    if (selectedGuide) {
        return <GuideDetails selectedGuide={selectedGuide} onBack={() => setSelectedGuide(null)} onVerify={handleVerification} refreshData={refreshAllData} />;
    }

    // --- Main Dashboard View ---
    if (activeView === 'verified') return <ListsView title="All Verified Guides" statusColor="bg-green-500/20 text-green-400" activeView={activeView} setActiveView={setActiveView} setSelectedGuide={setSelectedGuide} />;
    if (activeView === 'today-active') return <ListsView title="Guides Active Today" statusColor="bg-blue-500/20 text-blue-400" activeView={activeView} setActiveView={setActiveView} setSelectedGuide={setSelectedGuide} />;
    if (activeView === 'pending') return <ListsView title="Pending Verifications" statusColor="bg-yellow-500/20 text-yellow-400" activeView={activeView} setActiveView={setActiveView} setSelectedGuide={setSelectedGuide} />;
    if (activeView === 'today-request') return <ListsView title="Today's New Requests" statusColor="bg-red-500/20 text-red-400" activeView={activeView} setActiveView={setActiveView} setSelectedGuide={setSelectedGuide} />;
    if (activeView === 'booking-history') return <AdminBookingHistory onBack={() => setActiveView('dashboard')} />;
    if (activeView === 'concierge-view') return <ConciergeManagement onBack={() => setActiveView('dashboard')} />;
    if (activeView === 'messages') return <AdminChatList onBack={() => setActiveView('dashboard')} />;

    // --- Logic to calculate guides waiting over 48 hours ---
    const guidesOver48Hours = pendingGuides.filter((guide) => {
        const createdDate = new Date(guide.createdAt);
        const currentTime = new Date();
        const diffInHours = (currentTime - createdDate) / (1000 * 60 * 60); // Convert milliseconds to hours
        return diffInHours > 48;
    }).length;

    // --- Stats Card Data ---
    const statsCard = [
        { id: 'verified', label: "Verified Guides", val: totalApprovedGuides, icon: <FaUserCheck />, color: "text-green-500" },
        { id: 'today-active', label: "Guides Active Today", val: totalActiveGuides, icon: <FaWalking />, color: "text-blue-400" },
        { id: 'pending', label: "Pending Verifications", val: totalPendingGuides, icon: <FaClock />, color: "text-yellow-500" },
        { id: 'today-request', label: "Today's Requests", val: totalTodayPendingGuides, icon: <FaExclamationTriangle />, color: "text-red-500" },
        { id: 'concierge-view', label: "Concierge Requests", val: totalConciergeRequests, icon: <FaRegEnvelope />, color: "text-purple-500" },
        { id: 'booking-history', label: "Revenue Logs", val: `₹${(revenueData?.totalRevenue || 0).toLocaleString()}`, icon: <FaHistory />, color: "text-orange-500" },
        { id: 'messages', label: "Live Support", val: "Active", icon: <MessageCircle />, color: "text-emerald-500" },
    ]

    return (
        <div className="min-h-screen text-white p-4 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-400">Welcome, <span className="text-[#00C4CC] font-semibold">{username || 'Admin'}</span></p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
                {/* Total Users */}
                <div className="bg-[#1E293B] p-5 rounded-2xl border border-gray-800 shadow-xl">
                    <div className="flex justify-between items-start">
                        <p className="text-gray-400 text-base font-medium">Total Users</p>
                        <FaUsers className="text-blue-500 text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold mt-2">{totalUsers}</h3>
                </div>

                {/* Clickable Stat Cards */}
                {statsCard.map((stat) => (
                    <div
                        key={stat.id}
                        onClick={() => handleSwitchView(stat.id)}
                        className="bg-[#1E293B] p-5 rounded-2xl border border-gray-800 shadow-xl cursor-pointer hover:border-[#00C4CC] hover:scale-[1.02] transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-gray-400 text-base font-medium group-hover:text-white transition">{stat.label}</p>
                            <span className={`${stat.color} text-3xl`}>{stat.icon}</span>
                        </div>
                        <h3 className="text-2xl font-bold mt-2">{stat.val}</h3>
                        <p className="text-[10px] text-cyan-500 mt-2 font-bold uppercase tracking-wider">Click to View All</p>
                    </div>
                ))}
            </div>

            {/* Dashboard Content - Cards and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Recent Activity Table */}
                <div className="lg:col-span-2 bg-[#1E293B] rounded-2xl border border-gray-800 p-6">
                    <h2 className="text-xl font-bold mb-4">Urgent Review Items</h2>
                    <div className="space-y-4">
                        {urgentRequests.length > 0 ? urgentRequests.map((guide) => (
                            <div key={guide._id} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#00C4CC] flex items-center justify-center text-[#121827] font-bold overflow-hidden">
                                        {guide.profilePhoto?.url ? <img src={guide.profilePhoto.url} alt="" className="object-cover w-full h-full" /> : "G"}
                                    </div>
                                    <div>
                                        <p className="font-bold">{guide.fullName}</p>
                                        <p className="text-xs text-gray-400">Applied: {new Date(guide.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedGuide(guide)} className="text-[#00C4CC] text-sm font-bold hover:underline">Review Now</button>
                            </div>
                        )) : <p className="text-gray-500 italic">No pending applications to review.</p>}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Reactivation Account Section */}
                    {reactivationRequests.length > 0 && (
                        <div className="bg-[#1E293B] rounded-2xl border border-yellow-500/30 p-6 animate-pulse-subtle">
                            <h2 className="text-xl font-bold mb-4 text-yellow-500 flex items-center gap-2">
                                <FaHistory /> Reactivation Needed
                            </h2>
                            <div className="space-y-3">
                                {reactivationRequests.map((guide) => (
                                    <div key={guide._id} className="p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/20 flex justify-between items-center">
                                        <p className="text-sm font-semibold">{guide.fullName}</p>
                                        <button
                                            onClick={() => setSelectedGuide(guide)}
                                            className="bg-yellow-600 hover:bg-yellow-500 text-white text-[10px] px-3 py-1 rounded-lg font-bold transition"
                                        >
                                            View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Insights */}
                    <div className="bg-[#1E293B] rounded-2xl border border-gray-800 p-6">
                        <h2 className="text-xl font-bold mb-4">Quick Insights</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-yellow-500/10 rounded-xl border-l-4 border-yellow-500">
                                <p className="text-sm font-bold text-yellow-500 uppercase text-[10px]">Verification Latency</p>
                                <p className="text-sm mt-1">
                                    {pendingGuides.length === 0
                                        ? "No pending guides to review."
                                        : guidesOver48Hours > 0
                                            ? `${guidesOver48Hours} guides waiting over 48 hours.`
                                            : "All requests are up to date (under 48h)."}
                                </p>
                            </div>
                            <div className="p-4 bg-green-500/10 rounded-xl border-l-4 border-green-500">
                                <p className="text-sm font-bold text-green-500 uppercase text-[10px]">Daily Engagement</p>
                                <p className="text-sm mt-1">
                                    {totalTodayPendingGuides} new guide {totalTodayPendingGuides === 1 ? 'request' : 'requests'} received today.
                                </p>
                            </div>
                            <div className="p-4 bg-purple-500/10 rounded-xl border-l-4 border-purple-500">
                                <p className="text-sm font-bold text-purple-500 uppercase text-[10px]">Concierge Backlog</p>
                                <p className="text-sm mt-1">
                                    {pendingConciergeRequests === 0
                                        ? "All concierge requests are resolved."
                                        : `${pendingConciergeRequests} custom ${pendingConciergeRequests === 1 ? 'request' : 'requests'} awaiting response.`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHome
