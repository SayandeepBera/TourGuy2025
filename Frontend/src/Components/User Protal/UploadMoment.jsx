import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LuUpload, LuImage, LuX, LuMapPin } from "react-icons/lu";
import { ImSpinner9 } from "react-icons/im";
import GalleryContext from '../../Context/Gallery/GalleryContext';
import { toast } from 'react-toastify';

const UploadMomentModal = ({ isOpen, onClose, booking }) => {
    const { uploadGalleryImage, isLoading } = useContext(GalleryContext);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState("");

    if (!isOpen || !booking) return null;

    const handleUpload = async (e) => {
        e.preventDefault();

        // Check if an image is selected or not
        if (!image) return toast.error("Please select an image!");

        // Check if the file type starts with 'image/'
        if(!image.type.startsWith("image/")) {
            return toast.error("Please upload a valid image file (JPG, PNG, WebP ...).");
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("caption", caption);

        const res = await uploadGalleryImage(booking._id, formData);
        if (res.success) {
            toast.success("Moment published successfully!");
            onClose(); // Close modal on success
        } else {
            toast.error(res.msg);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 mt-15 bg-black/20 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="max-w-xl w-full bg-[#1e293b] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                    <LuX size={24} />
                </button>

                <h2 className="text-3xl font-black italic mb-2 text-white">Share Your <span className="text-[#00C4CC]">Moment</span></h2>
                <div className="flex items-center gap-2 text-[#00C4CC] text-sm font-bold mb-8">
                    <LuMapPin size={14} /> {booking.destinationName}
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="relative h-54 rounded-[2rem] border-2 border-dashed border-white/10 hover:border-[#00C4CC] flex flex-col items-center justify-center overflow-hidden transition-colors bg-black/20">
                        {preview ? (
                            <img src={preview} className="w-full h-full object-cover" alt="preview" />
                        ) : (
                            <div className="text-center">
                                <LuImage size={48} className="mx-auto text-gray-600 mb-2" />
                                <p className="text-xs text-gray-500 font-black uppercase">Select Tour Photo</p>
                            </div>
                        )}
                        <input type="file" required accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                            onChange={(e) => {
                                if(e.target.files[0]) {
                                    setImage(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }} 
                        />
                    </div>

                    <textarea 
                        placeholder="Write a cinematic caption..."
                        className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 outline-none focus:border-[#00C4CC] h-24 text-sm text-white"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                    <button disabled={isLoading} className="w-full py-4 bg-[#00C4CC] text-[#0F172A] rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 flex items-center justify-center gap-2 transition-all">
                        {isLoading ? <ImSpinner9 className="animate-spin" /> : <><LuUpload /> Share Moment</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default UploadMomentModal;