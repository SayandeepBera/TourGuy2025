import React from 'react'

const Field = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-2">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-[#00C4CC] transition-all text-lg font-bold"
        />
    </div>
  )
}

export default Field
