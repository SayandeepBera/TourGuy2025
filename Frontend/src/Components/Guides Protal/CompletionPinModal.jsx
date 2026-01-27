import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LuX, LuShieldCheck } from "react-icons/lu";
import { ImSpinner9 } from "react-icons/im";
import BookingContext from '../../Context/Booking/BookingContext';
import { toast } from 'react-toastify';

const CompletionPinModal = ({ booking, onClose, onSuccess }) => {
    const [pin, setPin] = useState("");
    const { markTourAsCompleted, isLoading } = useContext(BookingContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin.length < 6) return toast.warn("Please enter the full 6-digit PIN");

        const result = await markTourAsCompleted(booking._id, pin);

        if (result.success) {
            toast.success(result.msg, {
                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
            });
            onSuccess();
        } else {
            toast.error(result.msg || "Invalid PIN. Please check with the tourist.");
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#1e293b] border border-white/10 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden"
            >
                <div className="p-6 text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                        <LuX size={20} />
                    </button>
                    
                    <div className="w-16 h-16 bg-[#00C4CC]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#00C4CC]">
                        <LuShieldCheck size={32} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white">Verify Completion</h3>
                    <p className="text-gray-400 text-sm mt-2">
                        Enter the 6-digit PIN provided by <span className="text-white font-semibold">{booking.fullName}</span> to finish the tour.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                    <input
                        autoFocus
                        type="text"
                        maxLength="6"
                        placeholder="0 0 0 0 0 0"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-black/30 border border-gray-700 rounded-2xl py-4 text-center text-3xl font-black tracking-[0.5em] text-[#00C4CC] outline-none focus:border-[#00C4CC] transition-all"
                    />

                    <button
                        type="submit"
                        disabled={isLoading || pin.length !== 6}
                        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                            pin.length === 6 
                            ? 'bg-[#00C4CC] text-[#0F172A] hover:bg-cyan-400 shadow-lg shadow-cyan-500/20' 
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? <ImSpinner9 className="animate-spin" size={24} /> : "Verify & Complete"}
                    </button>
                    
                    <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
                        Earnings will be released to your wallet upon verification.
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default CompletionPinModal;