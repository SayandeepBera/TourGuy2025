import React from 'react'

const StatCard = ({ label, value, icon }) => {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] hover:border-[#00C4CC]/30 transition-all group">
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-1.5 md:p-2 bg-white/5 rounded-lg text-[#00C4CC] group-hover:scale-110 transition-transform">
                    {/* Scale icon down slightly for mobile */}
                    <div className="scale-75 md:scale-100">{icon}</div>
                </div>
                <div className="h-1 w-6 md:w-8 bg-white/5 rounded-full" />
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg md:text-2xl font-black italic truncate">{value}</p>
        </div>
    )
}

export default StatCard
