import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';

const Guide = () => {
    const navigate = useNavigate();

    // Function to navigate to the guide portal
    const handleGuidePortal = () => {
        navigate('/guides');

        // Scroll to top when switching views
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return (
        <div className="py-16 md:py-18 lg:py-20 bg-[#0F172A] border-y border-gray-800 px-4">
            <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="lg:w-2/3 text-center lg:text-left mb-8 lg:mb-0 p-5">
                        <motion.h2
                            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-[1.65rem] md:text-[2rem] lg:text-[2.45rem] font-extrabold text-white mb-2"
                        >
                            Ready to Lead? Join the <span>TourGuy</span> Guide Network.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-base md:text-lg lg:text-[22px] text-gray-400 max-w-3xl"
                        >
                            Apply today to manage your bookings, set your rates, and lead verified, safe tours in your area.
                        </motion.p>
                    </div>
                    <div className="lg:w-1/3 flex justify-center lg:justify-end">
                        <button type="button" className="font-bold text-lg lg:text-xl rounded-full px-6 py-3 md:px-8 lg:px-10 lg:py-4 cursor-pointer bg-[#00C4CC] text-[#121827] shadow-lg shadow-[#00C4CC]/50 hover:bg-cyan-400 transition duration-150 transform hover:scale-105" onClick={handleGuidePortal}>Guide Registration protal<span className="ml-1 text-base">&rarr;</span></button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Guide
