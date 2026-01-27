import React, { useState } from 'react';
import { AnimatePresence, motion } from "motion/react";
import heroGuide from '../Images/guide_photo.avif';
import GuidesStories from './GuidesStories';
import WorkSteps from './WorkSteps';
import HelpAndSupports from './HelpAndSupports';
import GuidesRegistrationForm from './GuidesRegistrationForm';

const BecomeAGuide = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="text-white min-h-screen overflow-x-hidden">
            
            <AnimatePresence>{showForm && <GuidesRegistrationForm setShowForm={setShowForm} />}</AnimatePresence>
            
            {/* --- SECTION 1: HERO --- */}
            <div className="relative max-w-7xl mx-auto px-6 py-10 lg:py-12 flex flex-col lg:flex-row items-center gap-12">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-center lg:text-left"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                        Share Your World. <br />
                        <span className="text-[#00C4CC] drop-shadow-[0_0_10px_rgba(0,196,204,0.5)]">Become a Tour Guide.</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
                        Turn your local knowledge into a rewarding career. Join thousands of guides worldwide leading unforgettable adventures.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button onClick={() => setShowForm(true)} className="px-8 py-4 bg-[#00C4CC] hover:bg-cyan-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_#0ef] transform hover:scale-105">
                            Start Your Journey
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="flex-1 relative"
                >
                    <div className="relative z-10 rounded-2xl overflow-hidden border-8 border-[#1A2437]">
                        <img
                            src={heroGuide}
                            alt="Tour Guide"
                            className="w-full h-[650px] object-cover rounded-xl transform hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    {/* Animated Glow Background */}
                    <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#00C4CC] opacity-10 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#00C4CC] opacity-10 rounded-full blur-[100px] animate-pulse z-1"></div>
                </motion.div>
            </div>

            {/* --- SECTION 2: GUIDE STORIES (CUSTOM SLIDER) --- */}
            <div>
                <GuidesStories showForm={showForm} />
            </div>

            {/* --- SECTION 3: HOW IT WORKS --- */}
            <div>
                <WorkSteps />
            </div>

            {/* --- SECTION: HELP & SUPPORT --- */}
            <div>
                <HelpAndSupports />
            </div>
        </div>
    )
}

export default BecomeAGuide
