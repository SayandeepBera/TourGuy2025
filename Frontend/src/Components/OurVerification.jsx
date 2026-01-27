import React from 'react';
import { motion } from 'motion/react';
import {
    CheckCircle2,
} from 'lucide-react';
import verificationImg from './Images/verification_Img.avif';

const OurVerification = () => {
    return (
        <div className="py-32 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-20">
                <div className="flex-1 order-2 md:order-1">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-10 italic leading-tight"
                    >
                        Your Safety is <br />
                        <span className="text-[#00C4CC]">Our Top Priority.</span>
                    </motion.h2>

                    <div className="space-y-8">
                        {[
                            { title: "ID Verification", text: "Government-issued documents check." },
                            { title: "Background Screening", text: "No criminal records or red flags allowed." },
                            { title: "Language Proficiency", text: "Tested communication skills for all guides." }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-5"
                            >
                                <div className="w-8 h-8 rounded-xl bg-[#00C4CC]/10 flex items-center justify-center shrink-0 border border-[#00C4CC]/30">
                                    <CheckCircle2 size={18} className="text-[#00C4CC]" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-xl mb-1">{step.title}</h5>
                                    <p className="text-gray-500 font-medium">{step.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex-1 relative"
                >
                    <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-[#00C4CC]/25 hover:scale-105 transition-transform duration-1000">
                        <img
                            src={verificationImg}
                            alt="Local Expert Guide"
                            className="w-full aspect-[4/5] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent"></div>
                    </div>
                    <div className="absolute -bottom-8 -left-8 bg-[#1a2236] p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl hidden lg:block">
                        <p className="text-[#00C4CC] font-black text-3xl">100%</p>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Verified Profiles</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default OurVerification
