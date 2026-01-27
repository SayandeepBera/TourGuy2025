import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import {
    User,
    Lock,
    Check,
    CheckCircle2,
} from 'lucide-react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import GuidesContext from '../../Context/Guides/GuidesContext';
import { toast } from 'react-toastify';

const FormSlide4 = ({ closeForm, setFormStep, formData, setFormData }) => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const context = useContext(GuidesContext);
    const { guidesRegistration } = context;

    // Toggle function for password
    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    // Handle final form submission
    const handleFinalSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedTerms) {
            toast.warning("Please accept the Terms and Conditions to proceed.");
            return;
        }

        setIsSubmitting(true);

        // Prepare the FormData right here
        const data = new FormData();

        // Append form data
        Object.keys(formData).forEach((key) => {
            // For documents 
            if (key === "documents" && Array.isArray(formData.documents)) {
                formData.documents.forEach((file) => data.append("documents", file));
            } else if (key === "profilePhoto" && formData.profilePhoto) { // For profile photo
                data.append("profilePhoto", formData.profilePhoto);
            } else if (key === "phoneNumber") {
                data.append("countryCode", formData.phoneNumber.countryCode);
                data.append("number", formData.phoneNumber.number);
            } else {
                // Append text fields (username, password, bio, etc.)
                data.append(key, formData[key]);
            }
        });

        try {
            // Pass the constructed 'data' to your context function
            const result = await guidesRegistration(data);

            if (result.success) {
                console.log("Result: ", result.msg);
                toast.success(result.msg, {
                    style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
                });

                // Close the form
                closeForm();
            } else {
                setIsSubmitting(false);
                toast.error(result.msg || "Registration failed. Please try again.", {
                    theme: "colored"
                });
            }
        } catch (error) {
            setIsSubmitting(false);
            toast.error("An unexpected error occurred.");
        }
    }

    const isStep4Valid = () => {
        return (
            formData.username &&
            formData.password &&
            acceptedTerms &&
            formData.password.length >= 6
        );
    }

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Prevent spaces in username
        if (name === "username" && value.includes(" ")) return;

        setFormData({ ...formData, [name]: value });
    }

    return (
        <motion.div
            key="step4" initial={{ x: 50, opacity: 0, filter: "blur(10px)" }} animate={{ x: 0, opacity: 1, filter: "blur(0px)" }} exit={{ x: -50, opacity: 0, filter: "blur(10px)" }}
            className="flex flex-col h-full"
        >
            <div className="mb-6 md:mb-8">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">Account Security</h3>
                <p className="text-gray-500 font-medium">Slide 4 of 4: Final Steps</p>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-10 flex-1">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="local_legend_99"
                                autoComplete='username'
                                required
                                className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Password(min. 6 characters)</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••••••"
                                autoComplete="current-password"
                                min={6}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl"
                            />

                            <div className="absolute right-5 bottom-4 md:right-6 md:bottom-5 text-xl">
                                {/* 👁 Eye Icon for toggle */}
                                <span onClick={togglePassword} className="cursor-pointer" >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className="flex items-start gap-4 px-6 py-4 bg-[#1a2236]/30 border border-white/5 rounded-3xl group cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
                        <div className={`w-12 h-6 md:w-10 md:h-7 rounded-sm md:rounded-lg border-2 flex items-center justify-center transition-all ${acceptedTerms ? 'bg-[#00C4CC] border-[#00C4CC]' : 'border-white/20 bg-transparent'}`}>
                            {acceptedTerms && <Check size={18} className="text-slate-900" />}
                        </div>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed group-hover:text-gray-300 transition-colors">
                            I agree to the <span className="text-[#00C4CC] font-bold">Terms of Service</span> and <span className="text-[#00C4CC] font-bold">Privacy Policy</span>. I understand that my information will be reviewed for verification.
                        </p>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-6">
                    <button type="button" onClick={() => setFormStep(3)} className="px-6 py-3 md:px-10 md:py-4 border border-white/10 text-white rounded-2xl font-black hover:bg-white/5 transition-all">Back</button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !isStep4Valid()}
                        className={`flex-1 py-2 px-3 md:py-4 rounded-3xl font-black text-lg md:text-2xl transition-all flex items-center justify-center gap-2 md:gap-4 group active:scale-95 disabled:opacity-50 
                            ${isStep4Valid() ?
                                "bg-[#00C4CC] hover:bg-cyan-500 text-slate-900 shadow-[0_20px_40px_-10px_rgba(0,196,204,0.5)] hover:-translate-y-2"
                                : "bg-gray-600 text-gray-300 cursor-not-allowed"
                            }
                        `}
                    >
                        {isSubmitting ? <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <>Complete Registration <CheckCircle2 size={28} /></>}
                    </button>
                </div>
            </form>
        </motion.div>
    )
}

export default FormSlide4
