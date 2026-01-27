import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    User,
    MessageSquare,
    Send,
    X
} from 'lucide-react';
import ConciergeContext from '../Context/Concierge/ConciergeContext';
import { toast } from 'react-toastify';

const ConciergeModal = ({ isOpen, onClose }) => {
    const { createConciergeRequest } = useContext(ConciergeContext);
    const [conciergeForm, setConciergeForm] = useState({ name: "", email: "", message: "" });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await createConciergeRequest(conciergeForm);
            console.log(result);

            if(result.success){
                toast.success(result.message, {
                    style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
                });

                // Reset form
                setConciergeForm({ name: "", email: "", message: "" });
                onClose();
            }else{
                toast.error(result.message, {
                    theme: "colored"
                });
            }
        } catch (error) {
            console.error("Error creating concierge request:", error);
            toast.error("Failed to create concierge request due to a server error.", {
                theme: "colored"
            });
        }
    }

    // Handle form input changes
    const handleChange = (e) => {
        setConciergeForm({ ...conciergeForm, [e.target.name]: e.target.value });
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-lg"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                        className="bg-[#1a2236] border border-white/10 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 relative shadow-2xl"
                    >
                        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-white"><X size={24} /></button>
                        <h2 className="text-3xl font-black italic mb-2">Concierge <span className="text-[#00C4CC]">Request</span></h2>
                        <p className="text-gray-500 mb-8 font-medium">Describe your custom needs and we'll get back to you within 4 hours.</p>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <User className="absolute left-4 top-4 text-gray-500" size={18} />
                                    <input type="text" name="name" required value={conciergeForm.name} placeholder="Your Name" className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-[#00C4CC]" onChange={handleChange} />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-4 text-gray-500" size={18} />
                                    <input type="email" name="email" required value={conciergeForm.email} placeholder="Email Address" className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-[#00C4CC]" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-4 text-gray-500" size={18} />
                                <textarea rows="4" name="message" required value={conciergeForm.message} placeholder="How can our concierge help you?" className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-[#00C4CC] resize-none" onChange={handleChange} />
                            </div>
                            <button type="submit" className="w-full bg-[#00C4CC] text-[#0F172A] py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3">
                                Submit Request <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ConciergeModal
