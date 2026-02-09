import React from 'react'
import { motion } from 'framer-motion';

const ValueProposition = () => {
    const propositions = [
        {
            icon: '📍',
            title: 'Real-Time Route Map',
            desc: 'Monitor your guide\'s location on a live map from pickup to drop-off, just like a modern rideshare app.'
        },
        {
            icon: '🔑',
            title: 'Secure Guide Verification',
            desc: 'Match your unique OTP with your guide\'s to ensure identity verification and a safe start to your tour.'
        },
        {
            icon: '✅',
            title: '5-Star Verified Guides',
            desc: 'Only certified experts who pass rigorous background checks and continuous traveler feedback join our network.'
        },
        {
            icon: '🎯',
            title: 'Specialist Pairing',
            desc: 'Choose a guide based on language, special interest, or let our AI match you with the perfect companion.'
        }
    ]

    return (
        <div className="py-18 md:py-20 lg:py-24 px-4">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ type: "spring", stiffness: 100, duration: 0.8 }}
                    className="text-[1.65rem] md:text-[2rem] lg:text-[2.45rem] font-extrabold text-white text-center mb-2"
                >
                    Confidence in Every Step
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-base md:text-lg lg:text-xl text-gray-400 mb-12 md:mb-14 lg:mb-16 text-center max-w-3xl mx-auto"
                >
                    We integrate advanced logistics to provide the safest, most reliable guided tour experience globally.
                </motion.p>
                <motion.div
                    key="propositions"
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {propositions.map((usp, index) => (
                        <div key={index} className="bg-[#1A2437] p-8 rounded-xl border-t-4 border-[#00C4CC] text-center shadow-xl group hover:shadow-2xl shadow-[#00C4CC]/30 transition duration-300">
                            <span className="text-5xl mb-4 inline-block">{usp.icon}</span>
                            <h3 className="text-xl font-bold text-white mb-3">{usp.title}</h3>
                            <p className="text-base text-gray-400">{usp.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default ValueProposition
