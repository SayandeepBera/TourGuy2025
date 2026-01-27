import React from 'react'
import { motion } from 'motion/react';

const CompletionCircle = ({ profileData, username, email }) => {
    // Profile Completion Logic
    const calculateCompletion = () => {
        // Define the fields to check for completion
        const fields = [
            !!username,
            !!email,
            !!profileData?.fullName,
            !!profileData?.bio && profileData.bio.length >= 50,
            !!profileData?.phoneNumber?.number,
            !!profileData?.gender,
            !!profileData?.address,
            !!profileData?.city,
            !!profileData?.state,
            !!profileData?.country,
            profileData?.languages?.length > 0,
            !!profileData?.avatar?.url
        ];

        // Calculate completion percentage
        const totalFields = fields.length;
        const completedFields = fields.filter(field => field === true).length;

        return Math.round((completedFields / totalFields) * 100);
    };

    const completionPercent = calculateCompletion();

    // SVG Circle parameters
    const strokeDasharray = 364.4;

    return (
        <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center relative overflow-hidden group">
            <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                    <motion.circle
                        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent"
                        strokeDasharray={strokeDasharray}
                        initial={{ strokeDashoffset: strokeDasharray }}
                        animate={{ strokeDashoffset: strokeDasharray - (strokeDasharray * completionPercent) / 100 }}
                        className="text-[#00C4CC]"
                        transition={{ duration: 2, ease: "anticipate" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-3xl font-black"
                    >
                        {completionPercent}%
                    </motion.span>
                    <span className="text-[7px] uppercase font-bold text-gray-500 tracking-tighter">Strength</span>
                </div>
            </div>
            <div className="relative z-10">
                <h4 className="font-black text-sm mb-1 uppercase tracking-widest text-white">
                    {completionPercent === 100 ? "Elite Profile" : "Profile Progress"}
                </h4>
                <p className="text-[10px] text-gray-500 italic leading-tight">
                    {completionPercent < 50
                        ? "Add more information to complete your profile."
                        : completionPercent < 100
                            ? "Almost there! Complete for a verified badge."
                            : "Your profile is looking great!"}
                </p>
            </div>
        </div>
    )
}

export default CompletionCircle
