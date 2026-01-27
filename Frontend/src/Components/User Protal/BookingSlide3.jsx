import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuUpload } from "react-icons/lu";
import { ImSpinner9 } from "react-icons/im";
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookingSlide3 = ({ formData, setFormData, destination }) => {

    // Check-out date Calculation logic
    useEffect(() => {
        if (formData.checkIn && destination?.duration) {
            try {
                const durationDays = parseInt(destination.duration);
                if (!isNaN(durationDays)) {
                    const checkInDate = new Date(formData.checkIn);

                    // Use getTime() and add milliseconds to handle date shifts accurately
                    const checkOutTime = checkInDate.getTime() + (durationDays * 24 * 60 * 60 * 1000);
                    const checkOutDate = new Date(checkOutTime);

                    const calculatedCheckOut = checkOutDate.toISOString().split('T')[0];

                    if (formData.checkOut !== calculatedCheckOut) {
                        setFormData(prev => ({ ...prev, checkOut: calculatedCheckOut }));
                    }
                }
            } catch (err) {
                console.error("Error calculating checkout date:", err);
            }
        }
    }, [formData.checkIn, destination?.duration]);

    // Specialized Handler for Cloudinary Upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        // Check file size
        if (file.size > 5 * 1024 * 1024) {
            return toast.error("File is too large! Maximum limit is 5MB.");
        }

        // Prevent uploading non-image files
        if (!file.type.startsWith("image/")) {
            return toast.error("Please upload an image file (JPG, PNG, ...)");
        }

        // Store the raw file object in formData
        setFormData(prev => ({ ...prev, document: file }));

        toast.info("Document Successfully attached. Ready for payment.");
    };

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-2 underline decoration-[#00C4CC] underline-offset-8">Tour & Documents</h3>
            <div className="space-y-4 md:space-y-6 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Check-in Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={formData.checkIn}
                                className="w-full p-3 md:p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white opacity-70 focus:border-[#00C4CC] outline-none"
                                readOnly
                            />
                            <span className="absolute right-3 top-13/25 -translate-y-1/2 text-white pointer-events-none">
                                📅
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Check-out Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="checkOut"
                                value={formData.checkOut}
                                className="w-full p-3 md:p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white opacity-70 focus:border-[#00C4CC] outline-none"
                                readOnly
                            />
                            <span className="absolute right-3 top-13/25 -translate-y-1/2 text-white pointer-events-none">
                                📅
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Number of Adults</label>
                        <input
                            type="number"
                            name="adults"
                            min="1"
                            placeholder="Adults"
                            value={formData.adults}
                            className="w-full p-3 md:p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Number of Children</label>
                        <input
                            type="number"
                            name="children"
                            min="0"
                            placeholder="Children (Under 3 Years)"
                            value={formData.children}
                            className="w-full p-3 md:p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Upload Document */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Verification Document (ID Proof)</label>
                    <div className={`relative border-2 border-dashed p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${formData.document?.url ? 'border-green-500 bg-green-500/5' : 'border-gray-700 hover:border-[#00C4CC] hover:bg-[#00C4CC]/5'}`}>
                        {formData.document ? (
                            <>
                                <FaCheckCircle className="text-green-500 mb-2" size={35} />
                                <p className="text-green-500 font-bold">{formData.document.name}</p>
                                <p className="text-gray-500 text-xs mt-1">Click to replace file</p>
                            </>
                        ) : (
                            <>
                                <LuUpload className="text-gray-500 group-hover:text-[#00C4CC] mb-2" size={35} />
                                <p className="text-gray-400 text-base font-medium text-center">Click to upload Passport or Aadhar Card</p>
                                <p className="text-gray-600 text-sm mt-1">JPG, PNG ... (Max 5MB)</p>
                            </>
                        )}
                        <input
                            type="file"
                            required
                            accept="image/*"
                            name="document"
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
            </div>

        </motion.div>
    )
}

export default BookingSlide3
