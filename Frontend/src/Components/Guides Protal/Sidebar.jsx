import React from 'react'
import { LuLayoutDashboard, LuCalendarClock, LuHistory } from "react-icons/lu";
import SidebarItem from './SidebarItem';
import { MessageSquare } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isPending }) => {

    return (
        <div className="w-64 border-r border-gray-800 hidden lg:block p-6 space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Menu</p>
                <nav className="space-y-1">
                    <SidebarItem icon={<LuLayoutDashboard />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    {!isPending && (
                        <>
                            <SidebarItem icon={<LuCalendarClock />} label="New Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
                            <SidebarItem icon={<LuHistory />} label="Tour History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                        </>
                    )}
                    <SidebarItem icon={<MessageSquare />} label="Live Chat" active={activeTab === 'message'} onClick={() => setActiveTab('message')} />
                </nav>
            </div>
        </div>
    )
}

export default Sidebar
