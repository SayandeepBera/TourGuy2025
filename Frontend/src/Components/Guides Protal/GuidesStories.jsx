import React, { useState, useEffect, useContext } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
    Camera,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import GuidesContext from '../../Context/Guides/GuidesContext';
import { ImSpinner9 } from "react-icons/im";

const GuidesStories = ({ showForm }) => {
    // 1. Stories Data
    const stories = [
        { text: "Joining this platform changed my life. I turned my passion for history into a full-time career!" },
        { text: "The support here is amazing. I love meeting travelers and sharing my culture with them." },
        { text: "Flexible hours and great pay. I guide whenever I want and explore the city daily." },
        { text: "It's more than a job; it's about building bridges between different worlds and people." },
        { text: "The booking system is so seamless that I can focus entirely on providing the best experience." }
    ];

    // Custom Slider State
    const [activeStory, setActiveStory] = useState(0);
    const { getAllApprovedGuides, approvedGuides, isLoading } = useContext(GuidesContext);

    useEffect(() => {
        getAllApprovedGuides();
    }, []);


    useEffect(() => {
        if (!showForm && approvedGuides.length > 0) {
            const timer = setInterval(() => {
                setActiveStory((prev) => (prev + 1) % Math.min(stories.length, approvedGuides.length));
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [showForm, approvedGuides.length]);

    if (approvedGuides.length === 0) {
        return (
            <div className="py-24 bg-[#0F172A] text-center">
                <ImSpinner9 className="animate-spin mx-auto text-[#00C4CC]" size={40} />
                <p className="text-gray-500 mt-4 font-bold italic text-sm uppercase tracking-widest">Loading Guide Success Stories...</p>
            </div>
        );
    }

    const nextStory = () => setActiveStory((prev) => (prev + 1) % approvedGuides.length);
    const prevStory = () => setActiveStory((prev) => (prev - 1 + approvedGuides.length) % approvedGuides.length);

    // Get active guide
    const currentGuide = approvedGuides[activeStory] || approvedGuides[0];

    // This ensures the text repeats every time the story list ends
    const currentText = stories[activeStory % stories.length].text;

    return (
        <div className="py-24 bg-[#0F172A] border-y border-gray-800 relative">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Stories from Our Guides</h2>
                    <div className="w-24 h-1 bg-[#00C4CC] mx-auto rounded-full"></div>
                </div>

                <div className="relative group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStory}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-[#1f2937] p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center shadow-2xl shadow-[#00C4CC]/25 gap-8 border border-gray-700/50 hover:border-[#00C4CC]/50 transition-colors"
                        >
                            <motion.div whileHover={{ scale: 1.05, rotate: -2 }} className="relative shrink-0">
                                <img
                                    src={currentGuide?.profilePhoto?.url}
                                    alt={currentGuide?.fullName}
                                    className="w-40 h-40 rounded-2xl object-cover border-2 border-[#00C4CC] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]"
                                />
                                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#00C4CC] rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Camera size={24} />
                                </div>
                            </motion.div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-xl md:text-2xl italic text-gray-200 mb-6 leading-relaxed">
                                    "{currentText}"
                                </p>
                                <h4 className="text-[#00C4CC] font-bold text-xl">{currentGuide?.fullName}</h4>
                                <p className="text-gray-500 font-medium">{currentGuide?.city}, {currentGuide?.country}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevStory}
                        className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 p-3 bg-[#1f2937] rounded-full border border-gray-700 hover:border-[#00C4CC] transition-all opacity-0 group-hover:opacity-100 hidden md:block"
                    >
                        <ChevronLeft className="text-[#00C4CC]" />
                    </button>
                    <button
                        onClick={nextStory}
                        className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 p-3 bg-[#1f2937] rounded-full border border-gray-700 hover:border-[#00C4CC] transition-all opacity-0 group-hover:opacity-100 hidden md:block"
                    >
                        <ChevronRight className="text-[#00C4CC]" />
                    </button>

                    {/* Progressive Dots */}
                    <div className="flex justify-center items-center gap-3 mt-12">
                        {approvedGuides.map((_, idx) => {
                            const maxVisible = 5;
                            const half = Math.floor(maxVisible / 2);

                            // Calculate the range of dots to show
                            let start = activeStory - half;
                            let end = activeStory + half;

                            // Adjust if near the beginning
                            if (start < 0) {
                                start = 0;
                                end = maxVisible - 1;
                            }
                            // Adjust if near the end
                            if (end >= approvedGuides.length) {
                                end = approvedGuides.length - 1;
                                start = Math.max(0, approvedGuides.length - maxVisible);
                            }

                            // Only render dots within this calculated range
                            if (idx < start || idx > end) return null;

                            // Determine if this dot is an edge dot
                            const isEdge = idx === start || idx === end;
                            const sizeClass = isEdge && approvedGuides.length > maxVisible ? 'scale-75 opacity-50' : 'scale-100 opacity-100';

                            return (
                                <motion.button
                                    layout // Smoothly animates the position change of dots
                                    key={idx}
                                    onClick={() => setActiveStory(idx)}
                                    className={`h-2 rounded-full transition-all duration-500 ${sizeClass} ${activeStory === idx
                                        ? 'w-10 bg-[#00C4CC]'
                                        : 'w-2 bg-gray-700 hover:bg-gray-500'
                                        }`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuidesStories
