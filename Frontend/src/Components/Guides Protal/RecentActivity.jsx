import React from 'react';
import { motion } from 'framer-motion';
import { LuCalendarDays, LuRefreshCw, LuWallet } from "react-icons/lu";
import { FaCheckCircle } from 'react-icons/fa';
import { XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = ({ activities }) => {

    // Helper to pick icons based on status
    const getIcon = (type) => {
        switch (type) {
            case 'pending_guide_confirmation':
                return {
                    icon: <LuWallet />,
                    color: 'text-blue-500'
                };
            case 'confirmed':
                return {
                    icon: <LuCalendarDays />,
                    color: 'text-orange-500'
                };
            case 'completed':
                return {
                    icon: <FaCheckCircle />,
                    color: 'text-[#00C4CC]'
                };
            case 'rejected_by_guide':
                return {
                    icon: <XCircle />,
                    color: 'text-red-500'
                };
            default:
                return {
                    icon: <LuRefreshCw />,
                    color: 'text-gray-500'
                };
        }
    };

    return (
        <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>

            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-800 before:via-gray-700 before:to-transparent">
                {activities.length > 0 ? activities.map((activity, index) => {
                    const { icon, color } = getIcon(activity.type);
                    
                    return (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex items-start gap-4"
                        >
                            <div className={`relative flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-gray-900 border border-gray-700 ${color} shadow-lg shadow-black/50 z-10`}>
                                {icon}
                            </div>

                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-200">{activity.message}</p>
                                <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">
                                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                                </span>
                            </div>
                        </motion.div>
                    );
                }) : (
                    <div className="text-center py-10 text-gray-500 italic">No recent activity found.</div>
                )}
            </div>

            <button className="w-full mt-8 py-2 text-sm text-gray-500 hover:text-[#00C4CC] transition-colors border-t border-gray-800 pt-4 font-bold uppercase tracking-widest">
                View All Activity
            </button>
        </div>
    );
};

export default RecentActivity;