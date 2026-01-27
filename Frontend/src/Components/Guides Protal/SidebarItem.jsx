import React from 'react'

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold ${active ? 'bg-[#00C4CC] text-[#0F172A] shadow-lg shadow-[#00C4CC]/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        {icon}
        {label}
    </button>
);

export default SidebarItem
