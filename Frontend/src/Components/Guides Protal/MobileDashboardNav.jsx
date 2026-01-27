import React from 'react';
import { LuLayoutDashboard, LuCalendarClock, LuHistory } from "react-icons/lu";
import { MessageSquare } from 'lucide-react';

const MobileDashboardNav = ({ activeTab, setActiveTab, isPending }) => {
    const tabs = [
        { id: 'overview', icon: <LuLayoutDashboard />, label: 'Overview' },
        ...(!isPending ? [
            { id: 'requests', icon: <LuCalendarClock />, label: 'New Requests' },
            { id: 'history', icon: <LuHistory />, label: 'Tour History' }
        ] : []),
        { id: 'message', icon: <MessageSquare />, label: 'Live Chat' },
    ];

    return (
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                        activeTab === tab.id 
                        ? 'bg-[#00C4CC] text-[#0F172A] border-[#00C4CC] shadow-lg shadow-[#00C4CC]/20' 
                        : 'bg-[#1E293B] text-gray-400 border-gray-800'
                    }`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default MobileDashboardNav;