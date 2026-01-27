import { LuCalendarClock, LuUser, } from "react-icons/lu";
import { FaCheckCircle } from 'react-icons/fa';
import { XCircle } from 'lucide-react';

const StatCards = ({ statsData }) => {
    const stats = [
        {
            label: "Completed Tours",
            value: statsData?.completedTours || 0,
            icon: <FaCheckCircle />,
            color: "text-[#00C4CC]"
        },
        {
            label: "Rejected",
            value: statsData?.rejectedTours || 0,
            icon: <XCircle />,
            color: "text-red-500"
        },
        {
            label: "Earnings",
            value: statsData?.earnings ? `₹ ${statsData.earnings.toLocaleString()}` : "₹ 0",
            icon: <LuUser />,
            color: "text-green-500"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1E293B] p-5 rounded-2xl border border-gray-800 shadow-xl">
                <div className="flex justify-between items-start mt-3">
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Requests</p>
                    <LuCalendarClock className="text-blue-500 text-3xl" />
                </div>

                <h3 className="text-3xl font-bold mt-1">{statsData?.totalRequests || 0}</h3>
            </div>
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-[#1E293B] p-5 rounded-2xl border border-gray-800 shadow-xl cursor-pointer hover:border-[#00C4CC] hover:scale-[1.02] transition-all group">
                    <div className="flex justify-between items-start mt-3">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                        <span className={`${stat.color} text-3xl`}>{stat.icon}</span>
                    </div>
                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
            ))}
        </div>
    );
};

export default StatCards;