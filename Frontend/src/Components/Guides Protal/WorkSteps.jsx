import React from 'react';
import { motion } from 'motion/react';
import {
    UserPlus,
    CheckCircle2,
    Map,
    Wallet
} from 'lucide-react';

const WorkSteps = () => {
    // How it works Data
    const steps = [
        { id: 1, title: "Create Account", desc: "Sign up with your professional details. Tell us about your expertise, languages, and the unique stories you want to share with the world.", icon: <UserPlus className="w-8 h-8" />, img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600" },
        { id: 2, title: "Verify Details", desc: "Our team reviews your profile and credentials to maintain high standards. This ensures trust and safety for both you and the travelers.", icon: <CheckCircle2 className="w-8 h-8" />, img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600" },
        { id: 3, title: "Start Guiding", desc: "Once approved, list your custom tours. Set your own schedule, define your routes, and start receiving booking requests instantly.", icon: <Map className="w-8 h-8" />, img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600" },
        { id: 4, title: "Receive Payments", desc: "Earn competitive rates with transparent pricing. Payments are processed securely and deposited directly to your account after each tour.", icon: <Wallet className="w-8 h-8" />, img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-28">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4">How It Works</h2>
                <p className="text-gray-400 text-lg">Your path to becoming a world-class guide in four simple steps.</p>
            </div>

            <div className="space-y-32">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
                    >
                        {/* Text Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-6 mb-6">
                                <motion.div
                                    whileInView={{ rotate: 360 }}
                                    transition={{ duration: 1 }}
                                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#00C4CC]/10 flex items-center justify-center text-[#00C4CC] shadow-[0_0_15px_rgba(0,196,204,0.2)]"
                                >
                                    {step.icon}
                                </motion.div>
                                <span className="text-4xl md:text-6xl font-black text-white/5">{step.id}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h3>
                            <p className="text-gray-400 text-lg leading-relaxed md:pr-10">
                                {step.desc}
                            </p>
                        </div>

                        {/* Image Visual */}
                        <div className="flex-1 w-full relative">
                            <div className={`absolute inset-0 bg-gradient-to-tr ${index % 2 === 0 ? 'from-[#00C4CC]/20' : 'from-blue-600/20'} to-transparent rounded-3xl -rotate-3 scale-105 -z-10`}></div>
                            <img
                                src={step.img}
                                alt={step.title}
                                className="rounded-3xl shadow-2xl w-full h-[350px] object-cover border border-white/10 transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default WorkSteps
