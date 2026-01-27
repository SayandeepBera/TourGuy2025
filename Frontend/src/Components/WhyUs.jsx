import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
} from 'lucide-react';
import OurFeatures from './OurFeatures';
import OurVerification from './OurVerification';
import { useNavigate } from 'react-router-dom';
import DestinationsContext from '../Context/Destinations/DestinationsContext';
import GuidesContext from '../Context/Guides/GuidesContext';

const WhyUs = () => {
    const { fetchDestinations, totalDestinations } = useContext(DestinationsContext);
    const { getAllApprovedGuides, getTotalUsers, totalApprovedGuides, totalUsers } = useContext(GuidesContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDestinations();
        getAllApprovedGuides();
        getTotalUsers();
        // eslint-disable-next-line
    }, []);

    // Statistics
    const stats = [
        { label: "Verified Guides", value: totalApprovedGuides },
        { label: "Happy Travelers", value: totalUsers },
        { label: "Destinations", value: totalDestinations },
        { label: "Safety Rating", value: "4.9/5" }
    ];

    // Framer Motion Variants
    const smoothFadeUp = {
        hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="bg-[#0F172A] text-white min-h-screen font-[fangsong] overflow-hidden">

            {/* --- Hero Section --- */}
            <section className="relative pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.span
                        initial={{ opacity: 0, letterSpacing: "0.1em" }}
                        animate={{ opacity: 1, letterSpacing: "0.3em" }}
                        transition={{ duration: 1 }}
                        className="text-[#00C4CC] font-black uppercase text-sm inline-block mb-4"
                    >
                        The TourGuy Difference
                    </motion.span>
                    <motion.h1
                        variants={smoothFadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 italic leading-tight"
                    >
                        Redefining How You <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C4CC] to-blue-400">
                            Experience The World
                        </span>
                    </motion.h1>
                    <motion.p
                        variants={smoothFadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
                    >
                        We noticed that traditional travel agencies are slow and impersonal.
                        TourGuy was built to bridge the gap between curious travelers and
                        local legends through technology and trust.
                    </motion.p>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent -z-0 blur-3xl"></div>
            </section>

            <section>
                <OurFeatures />
            </section>

            {/* --- Stats Section --- */}
            <section className="py-20 bg-[#06071f]/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h4 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#00C4CC] mb-2 tracking-tighter">{stat.value}</h4>
                                <p className="text-gray-500 uppercase text-xs tracking-[0.2em] font-bold">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Verification Section --- */}
            <section>
                <OurVerification />
            </section>

            {/* --- Integrated CTA Section --- */}
            <section className="py-24 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto py-20 px-8 rounded-[4rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden group shadow-2xl shadow-[#00C4CC]/25"
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-10 italic">
                            Ready to find your <br />
                            <span className="text-[#00C4CC]">local expert?</span>
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,196,204,0.15)" }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#00C4CC] text-[#0F172A] px-6 py-3 md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-2xl font-black text-xl flex items-center gap-4 mx-auto transition-all"
                            onClick={() => {
                                navigate('/destination');

                                // Scroll to top when switching views
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            Start Booking Now <ArrowRight size={24} />
                        </motion.button>
                    </div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00C4CC]/5 rounded-full blur-[80px]"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>
                </motion.div>
            </section>

        </div>
    );
};

export default WhyUs;