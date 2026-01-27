import React from 'react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const BookingSlide1 = ({ formData, setFormData }) => {

    // Standardized styles for the input field
    const phoneInputStyle = {
        width: '100%',
        height: '60px',
        background: '#11182780', // Same as bg-gray-900
        color: '#ffffff',
        border: '1px solid #374151',
        borderRadius: '12px',
        fontSize: '16px',
    };

    const buttonStyle = {
        background: 'transparent',
        border: 'none',
        borderRadius: '12px 0 0 12px',
        paddingLeft: '10px'
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <motion.div
            key="step1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4"
        >
            <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-2 underline decoration-[#00C4CC] underline-offset-8">
                Tourist Information
            </h3>

            <div className="space-y-4 md:space-y-6 pt-4 mt-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name (e.g., John Doe)"
                        value={formData.fullName}
                        className="w-full p-3 md:p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none transition-colors"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email Address"
                        className="w-full p-3 md:p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Phone */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Primary Phone</label>
                        <div className="dark-phone-input">
                            <PhoneInput
                                country={'in'}
                                value={formData.phoneNumber.countryCode + formData.phoneNumber.number}
                                onChange={(value, data) => {
                                    const actualNumber = value.slice(data.dialCode.length);

                                    setFormData({
                                        ...formData,
                                        phoneNumber: {
                                            countryCode: `+${data.dialCode}`,
                                            number: actualNumber
                                        }
                                    });
                                }}
                                inputStyle={phoneInputStyle}
                                buttonStyle={buttonStyle}
                                enableSearch={true}
                                searchPlaceholder="Search country..."
                                required={true}
                            />
                        </div>
                    </div>

                    {/* Alt Phone */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Alternate Phone (Optional)</label>
                        <div className="dark-phone-input md:col-span-1">
                            <PhoneInput
                                country={'in'}
                                value={formData.alternateNumber.countryCode + formData.alternateNumber.number}
                                onChange={(value, data) => {
                                    const actualNumber = value.slice(data.dialCode.length);
                                    setFormData({
                                        ...formData,
                                        alternateNumber: {
                                            countryCode: `+${data.dialCode}`,
                                            number: actualNumber
                                        }
                                    });
                                }}
                                inputStyle={phoneInputStyle}
                                buttonStyle={buttonStyle}
                                enableSearch={true}
                                searchPlaceholder="Search country..."
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Age (Min. 18 years)</label>
                        <input
                            type="number"
                            name="age"
                            placeholder="25"
                            min={18}
                            value={formData.age}
                            className="w-full p-3 md:p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Gender</label>
                        <select
                            className="w-full p-3 md:p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-[#00C4CC] outline-none cursor-pointer"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="" className="bg-[#111827]">Select</option>
                            <option value="Male" className="bg-[#111827]">Male</option>
                            <option value="Female" className="bg-[#111827]">Female</option>
                            <option value="Other" className="bg-[#111827]">Other</option>
                        </select>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default BookingSlide1;