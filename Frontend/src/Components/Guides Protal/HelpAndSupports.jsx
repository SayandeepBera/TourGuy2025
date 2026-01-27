import React from 'react';
import { motion } from 'motion/react';
import { Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpAndSupports = () => {
    const navigate = useNavigate();

    return (
        <div className="py-20 px-6">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#16213e] to-[#0b0f1a] border border-[#00C4CC]/30 p-10 md:p-16 rounded-[2rem] text-center shadow-2xl">
                <motion.div
                    whileInView={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                    className="inline-block p-4 rounded-full bg-[#00C4CC]/10 text-[#00C4CC] mb-6 transform hover:scale-105 transition-transform duration-700"
                >
                    <Headphones size={48} />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Always Here to Help</h2>
                <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                    Whether you need help setting up your profile or have questions about payments, our dedicated Guide Support team is available 24/7.
                </p>
                <button
                    onClick={() => {
                        navigate('/support');
                        
                        // Scroll to top when switching views
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-10 py-4 border-2 border-[#00C4CC] text-[#00C4CC] hover:bg-[#00C4CC] hover:text-white hover:shadow-[0_0_20px_#0ef] rounded-full font-bold transition-all duration-300"
                >
                    Visit Support Center
                </button>
            </div>
        </div>
    )
}

export default HelpAndSupports
