import React from 'react';
import { motion } from 'framer-motion';
import { LuMapPin, LuGlobe, LuLanguages, LuNavigation, LuBuilding2 } from "react-icons/lu";

const BookingSlide2 = ({ formData, setFormData }) => {

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <motion.div
            key="step2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4"
        >
            <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-2 underline decoration-[#00C4CC] underline-offset-8">
                Location & Language
            </h3>

            <div className="space-y-4 md:space-y-6 pt-4 mt-4">
                {/* Full Address */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Current Address</label>
                    <div className="relative group">
                        <LuMapPin className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                        <textarea
                            name="address"
                            placeholder="Current Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 md:p-4 pl-10 md:pl-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none h-24 resize-none transition-all"
                            required
                        />
                    </div>
                </div>

                {/* City and State Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* City */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">City</label>
                        <div className="relative group">
                            <LuBuilding2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC]" size={20} />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-3 md:p-4 pl-10 md:pl-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">State / Province</label>
                        <div className="relative group">
                            <LuNavigation className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC]" size={20} />
                            <input
                                type="text"
                                name="state"
                                placeholder="State / Province"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-3 md:p-4 pl-10 md:pl-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Country */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Country</label>
                        <div className="relative group">
                            <LuGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC]" size={20} />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full p-3 md:p-4 pl-10 md:pl-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Zip/Postal Code */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Zip / Postal Code</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold group-focus-within:text-[#00C4CC]">#</span>
                            <input
                                type="text"
                                name="pinCode"
                                placeholder="Zip / Postal Code"
                                value={formData.pinCode}
                                onChange={handleChange}
                                className="w-full p-3 md:p-4 pl-10 md:pl-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Language Fluency */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Preferred Tour Language</label>
                    <div className="relative group">
                        <LuLanguages className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC]" size={20} />
                        <input
                            type="text"
                            name="languages"
                            placeholder="Languages Known (e.g. English, Hindi)"
                            value={formData.languages}
                            onChange={handleChange}
                            className="w-full p-3 md:p-4 pl-10 md:pl-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none"
                            required
                        />
                    </div>
                </div>

                <p className="text-gray-500 text-xs italic text-center">
                    Note: Your language preferences help us match you with the best guide.
                </p>
            </div>
        </motion.div>
    );
}

export default BookingSlide2;