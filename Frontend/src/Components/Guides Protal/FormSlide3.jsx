import React from 'react';
import { motion } from 'motion/react';
import {
    Camera,
    CheckCircle2,
    FileText,
    Upload,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const FormSlide3 = ({ setFormStep, formData, setFormData }) => {
    // Check if step 3 is valid
    const isStep3Valid = () => {
        return (
            formData.profilePhoto &&
            formData.documents
        );
    }

    // Handle input changes
    const handleChange = (e) => {
        const { name, files } = e.target;

        if (files && files.length > 0) {
            if (name === "profilePhoto") {
                const file = files[0];
                if (!file.type.startsWith("image/")) {
                    toast.error("Please select an image file for your profile photo.");
                    e.target.value = null;
                    return;
                }
                setFormData({ ...formData, [name]: files[0] });
            } else {
                // Check if all selected documents are images
                const selectedFiles = Array.from(files);
                const allImages = selectedFiles.every(file => file.type.startsWith("image/"));

                if (!allImages) {
                    toast.error("All documents must be image files (JPG, PNG, etc.).");
                    e.target.value = null;
                    return;
                }
                setFormData({ ...formData, [name]: selectedFiles });
            }
        }
    };

    return (
        <motion.div
            key="step3" initial={{ x: 50, opacity: 0, filter: "blur(10px)" }} animate={{ x: 0, opacity: 1, filter: "blur(0px)" }} exit={{ x: -50, opacity: 0, filter: "blur(10px)" }}
            className="flex flex-col h-full"
        >
            <div className="mb-4 md:mb-6">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">Media & Docs</h3>
                <p className="text-gray-500 font-medium">Slide 3 of 4: Verification</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Upload Profile Photo</label>
                    <div className="group relative border-2 border-dashed border-white/10 hover:border-[#00C4CC]/50 rounded-[2.5rem] px-10 py-4 md:px-12 md:py-5 transition-all bg-[#1a2236]/40 flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-2xl">

                        {formData.profilePhoto ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                <CheckCircle2 className="text-[#00C4CC] mb-2" size={40} />
                                <p className="text-white font-bold text-center truncate max-w-[200px]">{formData.profilePhoto.name}</p>
                                <p className="text-[#00C4CC] text-xs mt-1 font-black uppercase">Photo Selected</p>
                            </div>
                        ) : (
                            <>
                                <Camera className="text-[#00C4CC] mb-2 group-hover:scale-110 transition-transform" size={40} />
                                <p className="text-gray-300 font-black text-lg text-center">Upload Your Photo</p>
                                <p className="text-gray-600 text-sm mt-2 font-medium">PNG, JPEG ... up to 5MB</p>
                            </>
                        )}

                        <input
                            type="file"
                            name="profilePhoto"
                            accept='image/*'
                            required
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-black text-[#00C4CC] uppercase tracking-[0.2em] ml-1">Official Documents (ID / License)</label>
                    <div className="group relative border-2 border-dashed border-white/10 hover:border-[#00C4CC]/50 rounded-[2.5rem] px-10 py-4 md:px-12 md:py-5 transition-all bg-[#1a2236]/40 flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-2xl">
                        {/* Check if documents are selected and show them */}
                        {formData.documents?.length > 0 ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                <FileText className="text-[#00C4CC] mb-2" size={40} />
                                <p className="text-white font-bold text-center">
                                    {formData.documents.length} File(s) Selected
                                </p>
                                <div className="mt-2 flex flex-wrap justify-center gap-2">
                                    {formData.documents.slice(0, 2).map((file, i) => (
                                        <span key={i} className="text-[10px] bg-white/10 text-gray-300 px-2 py-1 rounded-md truncate max-w-[100px]">
                                            {file.name}
                                        </span>
                                    ))}
                                    {formData.documents.length > 2 && <span className="text-[10px] text-gray-500">+{formData.documents.length - 2} more</span>}
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload className="text-[#00C4CC] mb-2 group-hover:scale-110 transition-transform" size={40} />
                                <p className="text-gray-300 font-black text-lg text-center">Upload Photos of your ID (Front & Back)</p>
                                <p className="text-gray-600 text-sm mt-2 font-medium">PNG, JPEG ... up to 5MB (Max. 5 files)</p>
                            </>
                        )}

                        <input
                            type="file"
                            name="documents"
                            required
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={() => setFormStep(2)} className="px-6 py-3 md:px-10 md:py-4 border border-white/10 text-white rounded-2xl font-black hover:bg-white/5 transition-all">Back</button>
                <button
                    onClick={() => setFormStep(4)}
                    disabled={!isStep3Valid()}
                    className={`px-10 py-3 md:px-12 md:py-4 rounded-3xl font-black text-xl transition-all flex items-center gap-4 group active:scale-95
                            ${isStep3Valid() ?
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

export default FormSlide3
