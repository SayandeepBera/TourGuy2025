import React from 'react';
import { motion } from 'motion/react';
import {
    Phone,
    Calendar,
    User,
    Send,
    Users,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const FormSlide1 = ({ setFormStep, formData, setFormData }) => {
    // Check if step 1 is valid
    const isStep1Valid = () => {
        return (
            formData.fullName &&
            formData.email &&
            formData.phoneNumber &&
            formData.age &&
            formData.gender
        );
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validation for Full Name (Letters and Spaces only)
        if (name === "fullName") {
            const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
            setFormData({ ...formData, [name]: lettersOnly });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleContinue = () => {
        // Age validation with Toast
        if (Number(formData.age) < 18) {
            console.log(formData.age);
            return toast.warning("Minimum age requirement is 18 years.", {
                position: "top-center",
                theme: "colored"
            });
        }

        // Email validation check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return toast.error("Please enter a valid email address.");
        }

        setFormStep(2);
    };

    return (
        <motion.div
            key="step1"
            initial={{ x: 50, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ x: -50, opacity: 0, filter: "blur(10px)" }}
            className="flex flex-col h-full"
        >
            <div className="mb-6 md:mb-10">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">Personal Identity</h3>
                <p className="text-gray-500 font-medium">Slide 1 of 4: Basic Information</p>
            </div>

            <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                            <input
                                type="text"
                                required
                                name="fullName"
                                placeholder="Johnathan Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="relative group">
                            <Send className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Phone Number</label>
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

                            containerClass='custom-phone-input'
                            enableSearch={true}
                            searchPlaceholder="Search country..."
                            inputProps={{
                                required: true,
                                className: "w-full bg-[#1a2236]! border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl"
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Age (Min. 18 years)</label>
                        <div className="relative group">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                            <input
                                type="number"
                                required
                                name="age"
                                placeholder="25"
                                min={18}
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Gender</label>
                        <div className="relative group">
                            <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                            <select
                                required
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-[#141b2d]">Select</option>
                                <option value="Male" className="bg-[#141b2d]">Male</option>
                                <option value="Female" className="bg-[#141b2d]">Female</option>
                                <option value="Other" className="bg-[#141b2d]">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex justify-end">
                <button
                    onClick={handleContinue}
                    disabled={!isStep1Valid()}
                    className={`px-10 py-3 md:px-12 md:py-4 rounded-3xl font-black text-xl transition-all flex items-center gap-4 group active:scale-95
                            ${isStep1Valid() ?
                            "bg-[#00C4CC] hover:bg-cyan-500 text-slate-900 shadow-[0_20px_40px_-10px_rgba(0,196,204,0.5)] hover:-translate-y-2"
                            : "bg-gray-600 text-gray-300 cursor-not-allowed"
                        }
                    `}
                >
                    Continue <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </motion.div>
    )
}

export default FormSlide1
