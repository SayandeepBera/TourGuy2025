import React from 'react';
import { motion } from 'framer-motion';
import { ImSpinner9 } from "react-icons/im";
import { FiAlertCircle } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';

const AvailablityMessage = ({ formData , availabilityStatus }) => {
    const { loading, data } = availabilityStatus;

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-[#00C4CC] mt-4"
            >
                <ImSpinner9 className="animate-spin" />
                <span className="text-xs font-medium">Checking guide availability...</span>
            </motion.div>
        );
    }

    if (!data || !formData.languages) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-4 p-4 rounded-xl border flex items-start gap-3 text-left transition-colors ${data.success
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}
        >
            {data.success ? (
                <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            ) : (
                <FiAlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            )}
            <div>
                <p className={`text-sm font-bold ${data.success ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {data.success ? 'Great News!' : 'Language Note'}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed mt-1">
                    {data?.msg}
                    {data.result?.count && ` (${data.result?.count} guides match your criteria)`}
                </p>
            </div>
        </motion.div>
    )
}

export default AvailablityMessage
