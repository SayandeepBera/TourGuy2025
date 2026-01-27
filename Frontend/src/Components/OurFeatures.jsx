import React from 'react'
import { 
    ShieldCheck, 
    Zap, 
    Globe, 
    Languages,      
    UserCheck,      
    Headphones     
} from 'lucide-react';
import { motion } from 'framer-motion';

const OurFeatures = () => {
    const features = [
        {
            icon: <ShieldCheck className="text-[#00C4CC]" size={32} />,
            title: "Verified Experts Only",
            description: "Every guide undergoes a rigorous 5-step background check and document verification process for your peace of mind.",
            color: "from-cyan-500/20 to-transparent"
        },
        {
            icon: <Zap className="text-yellow-400" size={32} />,
            title: "Instant Allocation",
            description: "Our smart system matches you with available experts in real-time. No waiting, just immediate adventure.",
            color: "from-yellow-500/20 to-transparent"
        },
        {
            icon: <Globe className="text-blue-400" size={32} />,
            title: "Local Perspectives",
            description: "Access private locations and authentic stories that aren't found in guidebooks or standard search results.",
            color: "from-blue-500/20 to-transparent"
        },
        {
            icon: <Languages className="text-purple-400" size={32} />,
            title: "Linguistic Harmony",
            description: "We bridge the gap by assigning guides who are fluent in your native tongue, ensuring zero communication barriers.",
            color: "from-purple-500/20 to-transparent"
        },
        {
            icon: <UserCheck className="text-emerald-400" size={32} />,
            title: "Solo-Traveler Safe",
            description: "Our guides are trained to provide a safe, comfortable, and engaging environment specifically for solo explorers.",
            color: "from-emerald-500/20 to-transparent"
        },
        {
            icon: <Headphones className="text-pink-400" size={32} />,
            title: "24/7 Human Support",
            description: "Travel with confidence knowing our dedicated assistance team is always one tap away, day or night.",
            color: "from-pink-500/20 to-transparent"
        }
    ];
    return (
        <div className="py-20 px-6 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -12, transition: { duration: 0.3 } }}
                        className="relative group p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:border-[#00C4CC]/50 transition-all duration-500">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default OurFeatures
