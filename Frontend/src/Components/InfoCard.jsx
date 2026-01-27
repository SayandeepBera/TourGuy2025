import React from 'react'
import { ShieldCheck } from 'lucide-react';

const InfoCard = ({ icon, label, value, locked }) => {
  return (
    <div className={`p-8 rounded-[2.5rem] bg-white/[0.02] border ${locked ? 'border-dashed border-white/10' : 'border-white/5'} hover:border-white/10 transition-all group shadow-sm`}>
        <div className="flex items-center gap-5">
            <div className={`transition-colors duration-500 ${locked ? 'text-gray-600' : 'text-[#00C4CC]'}`}>{icon}</div>
            <div>
                <p className="text-[10px] font-black text-[#00C4CC] uppercase tracking-widest mb-1 flex items-center gap-2">
                    {label} {locked && <ShieldCheck size={10} className="text-gray-600" />}
                </p>
                <p className={`text-xl font-bold ${locked ? 'text-gray-400' : 'text-white'}`}>{value}</p>
            </div>
        </div>
    </div>
  )
}

export default InfoCard
