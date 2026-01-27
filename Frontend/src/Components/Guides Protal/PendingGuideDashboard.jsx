import React from 'react'
import { motion } from 'framer-motion';
import { LuCalendarClock } from "react-icons/lu";

const PendingGuideDashboard = () => (
    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <LuCalendarClock size={40} className="text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Application Under Review</h2>
        <p className="text-gray-400 max-w-md mx-auto">
            Our admin team is currently verifying your documents. You'll receive an email as soon as you're approved to start taking tours!
        </p>
    </motion.div>
);

export default PendingGuideDashboard
