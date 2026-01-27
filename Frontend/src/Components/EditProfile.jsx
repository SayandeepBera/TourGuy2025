import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Camera, User, Phone, MapPin, Globe, Languages, Mail, Info, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Context/Authentication/AuthContext';
import { toast } from 'react-toastify';
import ProfileContext from '../Context/Profile/ProfileContext';
import Field from './Field';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const { username, email, userId, userRole } = useContext(AuthContext);
    const { fetchUserProfile, updateUserProfile, isLoading } = useContext(ProfileContext);

    const [activeTab, setActiveTab] = useState('general');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const isGuide = userRole === 'approved_guide' || userRole === 'pending_guide';
    const isAdmin = userRole === 'admin';

    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: {
            countryCode: "+91",
            number: ""
        },
        bio: "",
        gender: "Male",
        address: "",
        city: "",
        state: "",
        country: "",
        languages: "",
    });

    // Fetch profile data
    useEffect(() => {
        const loadData = async () => {
            const result = await fetchUserProfile(userId);

            if (result && result.success) {
                const p = result.profile;

                setFormData({
                    fullName: p.fullName || "",
                    phoneNumber: p.phoneNumber || { countryCode: "+91", number: "" },
                    bio: p.bio || "",
                    gender: p.gender || "Male",
                    address: p.address || "",
                    city: p.city || "",
                    state: p.state || "",
                    country: p.country || "",
                    languages: p.languages ? p.languages.join(", ") : "",
                });

                // If avatar exists, set the preview
                if (p.avatar?.url) {
                    setAvatarPreview(p.avatar.url);
                }
            }
        };

        if (userId) {
            loadData();
        }
    }, [userId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSave = async (e) => {
        e.preventDefault();

        const data = new FormData();

        // Append form data
        Object.keys(formData).forEach(key => {
            if (key === 'phoneNumber') {
                data.append('countryCode', formData.phoneNumber.countryCode);
                data.append('number', formData.phoneNumber.number);
            } else {
                data.append(key, formData[key]);
            }
        });

        if (avatarFile) data.append('avatar', avatarFile);

        try {
            const result = await updateUserProfile(userId, data);
            if (result.success) {
                toast.success("Profile Updated Successfully!");
                navigate('/profile');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Update failed");
        }
    };

    // Handle avatar change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if the file type starts with 'image/'
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload a valid image file (JPG, PNG, WebP ...).");
                // Reset the input so the same invalid file can't be "submitted"
                e.target.value = null;
                return;
            }

            // Check file size (e.g., max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.warning("File is too large. Max limit is 2MB.");
                e.target.value = null;
                return;
            }

            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const inputClasses = "w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-[#00C4CC] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg font-bold";

    return (
        <div className="bg-[#0F172A] min-h-screen text-white pt-15 pb-20 px-4 md:px-10 font-[fangsong]">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">

                {/* --- Left Tab Menu --- */}
                <aside className="lg:w-72 space-y-4">
                    <h3 className="text-3xl font-black italic mb-8 tracking-tighter">Settings <span className="text-[#00C4CC]">Hub</span></h3>
                    {['general', 'location'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all ${activeTab === tab ? "bg-[#00C4CC] text-[#0F172A] shadow-lg shadow-[#00C4CC]/20" : "text-gray-500 hover:text-white bg-white/5 hover:bg-white/10"
                                }`}
                        >
                            {tab} Information
                        </button>
                    ))}
                    
                    {!isAdmin && (<button
                        key="preferences"
                        onClick={() => setActiveTab("preferences")}
                        className={`w-full text-left px-6 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all ${activeTab === "preferences" ? "bg-[#00C4CC] text-[#0F172A] shadow-lg shadow-[#00C4CC]/20" : "text-gray-500 hover:text-white bg-white/5 hover:bg-white/10"
                            }`}
                    >
                        Preferences Information
                    </button>)}
                </aside>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-10">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest">
                            <ArrowLeft size={16} /> Discard Changes
                        </button>
                        <motion.button
                            onClick={handleSave}
                            disabled={isLoading}
                            whileHover={{ scale: 1.05 }}
                            className="bg-[#00C4CC] text-[#0F172A] px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#00C4CC]/30 flex items-center gap-2"
                        >
                            {isLoading ? "Saving..." : <><Save size={18} /> Save Changes</>}
                        </motion.button>
                    </div>

                    <form className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-10 md:p-16 shadow-2xl relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px]"></div>

                        {activeTab === 'general' && (
                            <div className="space-y-10">
                                {/* Avatar Upload Section */}
                                <div className="flex items-center gap-8 mb-12">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-32 h-32 rounded-full bg-black/10 border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-[#00C4CC] transition-all overflow-hidden shadow-inner">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera size={32} className="text-gray-600 group-hover:text-[#00C4CC] group-hover:scale-110 transition-all" />
                                            )}
                                        </div>
                                        <input type="file" className="hidden" id="avatarInput" onChange={handleAvatarChange} accept='image/*' />
                                        <label htmlFor="avatarInput" className="absolute inset-0 cursor-pointer"></label>
                                    </div>
                                    <div>
                                        <h4 className="font-black italic text-2xl uppercase tracking-tighter">Profile <span className="text-[#00C4CC]">Photo</span></h4>
                                        <p className="text-gray-500 text-sm font-medium">Click to upload your traveler image.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 opacity-50"><label className="field-label ml-2 text-[#00C4CC]">Username (Locked)</label><input value={username} disabled className={inputClasses} /></div>
                                    <div className="space-y-2 opacity-50"><label className="field-label ml-2 text-[#00C4CC]">Email (Locked)</label><input value={email} disabled className={inputClasses} /></div>

                                    <Field label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name (e.g., John Doe)" />
                                    <div className="space-y-2">
                                        <label className="field-label ml-2 text-[#00C4CC]">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                                            <option value="Male" className="bg-slate-900">Male</option>
                                            <option value="Female" className="bg-slate-900">Female</option>
                                            <option value="Other" className="bg-slate-900">Other</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="field-label ml-2 text-[#00C4CC]">{isGuide ? "Professional Biography & Mission" : "Traveler Biography"}</label>
                                        <textarea rows="5" name="bio" value={formData.bio} minLength={50} onChange={handleChange} className={`${inputClasses} resize-none italic`} placeholder="Tell us about your travel experience..."></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Field label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="e.g. India" />
                                <Field label="State / Province" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. West Bengal" />
                                <Field label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Kolkata" />
                                <div className="md:col-span-2 space-y-2">
                                    <label className="field-label ml-2 text-[#00C4CC]">Phone Number</label>
                                    <div className="dark-phone-input custom-phone-input">
                                        <PhoneInput
                                            country={'in'}
                                            value={formData.phoneNumber.countryCode + formData.phoneNumber.number}
                                            onChange={(value, data) => {
                                                const actualNumber = value.slice(data.dialCode.length);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    phoneNumber: {
                                                        countryCode: `+${data.dialCode}`,
                                                        number: actualNumber
                                                    }
                                                }));
                                            }}

                                            enableSearch={true}
                                            searchPlaceholder="Search country..."
                                            containerClass="w-full"
                                            inputProps={{
                                                name: 'phoneNumber',
                                                required: true,
                                                className: "w-full px-5 py-4 pl-14 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#00C4CC] transition-all text-lg font-bold"
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <Field label="Permanent Address" name="address" value={formData.address} onChange={handleChange} placeholder="Building, Street, Area..." />
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <Field label={isGuide ? "Service Languages" : "Preferred Languages"} name="languages" value={formData.languages} onChange={handleChange} placeholder="English, Hindi, Bengali..." />
                                <div className="p-8 rounded-3xl bg-[#00C4CC]/5 border border-[#00C4CC]/20 flex gap-4">
                                    <ShieldCheck className="text-[#00C4CC] shrink-0" />
                                    <p className="text-sm text-[#00C4CC]/80 font-bold italic">{isGuide ? "Listing multiple languages increases your visibility to international tourists." : "You can add multiple languages helps us match you with the best local guides in their native tongue."}</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;