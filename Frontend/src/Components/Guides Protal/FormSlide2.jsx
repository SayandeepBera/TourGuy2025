import React from 'react';
import { motion } from 'motion/react';
import {
    MapPin,
    Flag,
    Languages,
    Briefcase,
    ArrowRight,
} from 'lucide-react';

const FormSlide2 = ({ setFormStep, formData, setFormData }) => {
    // Check if step 2 is valid
    const isStep2Valid = () => {
        return (
            formData.city &&
            formData.country &&
            formData.languages &&
            formData.bio
        );
    }

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <motion.div
            key="step2" initial={{ x: 50, opacity: 0, filter: "blur(10px)" }} animate={{ x: 0, opacity: 1, filter: "blur(0px)" }} exit={{ x: -50, opacity: 0, filter: "blur(10px)" }}
            className="flex flex-col h-full"
        >
            <div className="mb-6 md:mb-8">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">Location & Bio</h3>
                <p className="text-gray-500 font-medium">Slide 2 of 4: Expertise</p>
            </div>

            <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">City</label>
                        <div className="relative group">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                            <input
                                type="text"
                                required
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g. Kolkata"
                                className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Country</label>
                        <div className="relative group">
                            <Flag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                            <input
                                type="text"
                                required
                                name="country"
                                placeholder="e.g. India"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Language Fluency</label>
                    <div className="relative group">
                        <Languages className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                        <input
                            type="text"
                            required
                            name="languages"
                            value={formData.languages}
                            onChange={handleChange}
                            placeholder="English (Native), Hindi (Native), Bengali (Native)..."
                            className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Biography & Experiences (minimum 20 words)</label>
                    <div className="relative group">
                        <Briefcase className="absolute left-5 top-5 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" size={20} />
                        <textarea
                            rows="3"
                            required
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            minLength={20}
                            placeholder="Describe your guiding style and past experiences..."
                            className="w-full bg-[#1a2236] border border-white/5 rounded-2xl pl-14 pr-6 py-3 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4CC] transition-all shadow-xl resize-none"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="mt-6 md:mt-8 flex justify-between">
                <button onClick={() => setFormStep(1)} className="px-6 py-3 md:px-10 md:py-4 border border-white/10 text-white rounded-2xl font-black hover:bg-white/5 transition-all">Back</button>
                <button
                    onClick={() => setFormStep(3)}
                    disabled={!isStep2Valid()}
                    className={`px-10 py-3 md:px-12 md:py-4 rounded-3xl font-black text-xl transition-all flex items-center gap-4 group active:scale-95
                            ${isStep2Valid() ?
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

export default FormSlide2
