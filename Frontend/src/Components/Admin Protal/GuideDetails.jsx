import React from "react";
import { useContext } from "react";
import {
    FaArrowLeft,
    FaCheck,
    FaTimes,
    FaMapMarkerAlt,
    FaLanguage,
    FaPhone,
    FaUserAlt,
    FaExternalLinkAlt,
    FaEnvelope,
    FaUserCircle,
} from "react-icons/fa";
import GuidesContext from "../../Context/Guides/GuidesContext";
import DeleteConfirmation from "../DeleteConfirmation";
import { toast } from "react-toastify";
import { BsInfoCircleFill } from "react-icons/bs";
import { ImSpinner9 } from "react-icons/im";

const GuideDetails = ({ selectedGuide, onBack, onVerify, refreshData }) => {
    const { deleteAccount, reactivateAccount, isLoading } = useContext(GuidesContext);

    if (!selectedGuide) return null;

    // Delete account confirmation
    const handleDeleteAccount = () => {
        const toastId = toast.info(
            <div className='flex gap-1 items-start'>
                <div className='text-xl mt-3 shrink-0'>
                    <BsInfoCircleFill />
                </div>
                <DeleteConfirmation
                    message={`Are you sure you want to delete ${selectedGuide.fullName} account?`}
                    onCancel={() => toast.dismiss(toastId)} // Close if user clicks cancel
                    onConfirm={() => {
                        toast.dismiss(toastId); // Close the confirm toast
                        onDeleteAccount(); // Proceed with deletion
                    }}
                />
            </div>,

            {
                icon: false,
                position: "top-center",
                autoClose: false, // Wait for user action
                closeOnClick: false,
                draggable: false,
                style: { width: '95vw', maxWidth: '460px', borderRadius: '15px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderBottom: '4px solid #707c7c', margin: '0 auto' }
            }
        )
    }

    // Delete account function
    const onDeleteAccount = async () => {
        const result = await deleteAccount(selectedGuide._id);

        if (result.success) {
            toast.success(result.msg, {
                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
            });

            // Refresh data
            if(refreshData) {
                await refreshData();
            }

            // Go back to list
            onBack();
        } else {
            toast.error(result.msg || "Failed to delete guide account.", {
                theme: "colored"
            });
        }
    }

    // Reactivate account function
    const onReactivateAccount = async () => {
        const result = await reactivateAccount(selectedGuide._id);

        if (result.success) {
            toast.success(result.msg, {
                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
            });

            // Refresh data
            if(refreshData) {
                await refreshData();
            }

            onBack();
        } else {
            toast.error(result.msg || "Failed to reactivate guide account.", {
                theme: "colored"
            });
        }
    }


    return (
        <div className="animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto p-4 pb-20">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 mb-6 hover:text-[#00C4CC] transition font-bold"
            >
                <FaArrowLeft /> Back to List
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ---------------- Profile Card ---------------- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-2xl text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20"></div>
                        <div className="relative z-10">
                            <img
                                src={selectedGuide.profilePhoto?.url || "/default-avatar.png"}
                                alt="Guide"
                                className="w-32 h-32 rounded-2xl object-cover mx-auto border-4 border-[#1E293B] shadow-2xl mb-4"
                            />
                            <h2 className="text-2xl font-bold text-white">{selectedGuide.fullName}</h2>
                            <p className="text-[#00C4CC] font-medium flex justify-center items-center gap-2 mt-1">
                                <FaMapMarkerAlt /> {selectedGuide.city}, {selectedGuide.country}
                            </p>
                        </div>

                        <div className="mt-8 space-y-4 text-left border-t border-gray-700 pt-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-2"><FaUserCircle /> Username</span>
                                <span className="text-white font-bold">{selectedGuide.userId?.username}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-2"><FaEnvelope /> Email</span>
                                <span className="text-white font-bold truncate ml-4">{selectedGuide.userId?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Age</span>
                                <span className="text-white font-bold">{selectedGuide.age} Years</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-2"><FaPhone /> Phone</span>
                                <span className="text-white font-bold">
                                    {selectedGuide.phoneNumber?.countryCode} {selectedGuide.phoneNumber?.number}
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedGuide.status === "pending" && (
                        <div className="bg-[#1E293B] rounded-3xl border border-gray-800 p-6 flex flex-col gap-3">
                            <button
                                onClick={() => onVerify(selectedGuide._id, "approved")}
                                disabled={isLoading}
                                className={`w-full bg-green-600  text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${isLoading ? "opacity-50 bg-green-400 cursor-not-allowed" : "cursor-pointer active:scale-95 hover:bg-green-500"}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <ImSpinner9 className="animate-spin" /> Approving ...
                                    </span>
                                ) : (
                                    <>
                                        <FaCheck /> "Approve Guide"
                                    </>
                                )}

                            </button>
                            <button
                                onClick={() => onVerify(selectedGuide._id, "rejected")}
                                disabled={isLoading}
                                className={`w-full border border-red-500/40 text-red-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <ImSpinner9 className="animate-spin" /> Rejecting ...
                                    </span>
                                ) : (
                                    <>
                                        <FaTimes /> Reject Application
                                    </>
                                )}

                            </button>
                        </div>
                    )}

                    {/* GUIDE IS ACTIVE (Can be deleted) */}
                    {selectedGuide.status === "approved" && (
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                            className={`w-full bg-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${isLoading ? "opacity-50 bg-red-400 cursor-not-allowed" : "cursor-pointer hover:bg-red-500 active:scale-95"}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <ImSpinner9 className="animate-spin" /> Deleting ...
                                </span>
                            ) : (
                                <>
                                    <FaTimes /> "Delete Account"
                                </>
                            )}
                        </button>
                    )}

                    {/* GUIDE IS SCHEDULED FOR DELETION (Can be reactivated) */}
                    {selectedGuide.status === "scheduled_for_deletion" && (
                        <div className="space-y-3">
                            <div className="text-yellow-500 text-xs text-center font-bold uppercase tracking-wider mb-2">
                                ⚠️ Deletion Scheduled
                            </div>
                            <button
                                onClick={onReactivateAccount}
                                disabled={isLoading}
                                className={`w-full bg-cyan-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${isLoading ? "opacity-50 bg-cyan-400 cursor-not-allowed" : "cursor-pointer hover:bg-cyan-500"}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <ImSpinner9 className="animate-spin" /> Reactivating ...
                                    </span>
                                ) : (
                                    "Reactivate Account"
                                )}

                            </button>
                        </div>
                    )}
                </div>

                {/* ---------------- Content ---------------- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-2xl">
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <FaUserAlt className="text-[#00C4CC]" /> About Guide
                        </h3>
                        <p className="text-gray-300 leading-relaxed italic text-lg">“{selectedGuide.bio}”</p>
                        <div className="mt-8">
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                <FaLanguage className="text-[#00C4CC]" /> Languages
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedGuide.languages?.map((lang, i) => (
                                    <span key={i} className="bg-slate-800 text-cyan-400 px-4 py-1 rounded-full text-sm border border-slate-700">{lang}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-2xl">
                        <h3 className="text-white font-bold text-lg mb-6">Identity & Verification Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {selectedGuide.documents?.map((doc, idx) => {
                                const fileFormat = doc.format || 'jpg';
                                const fileName = `document_${idx + 1}.${fileFormat}`;

                                return (
                                    <div key={idx} className="rounded-2xl border border-gray-700 bg-slate-900 p-4 flex flex-col items-center group">
                                        {/* ✅ Live Image Preview */}
                                        <div className="w-full h-40 rounded-xl overflow-hidden mb-4 border border-gray-800">
                                            <img
                                                src={doc.url}
                                                alt="ID Document"
                                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                            />
                                        </div>

                                        <span className="text-gray-400 text-xs mb-4 uppercase tracking-widest">{fileName}</span>

                                        <div className="flex flex-col gap-2 w-full">
                                            {/* View Full Image in New Tab */}
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#00C4CC]/10 text-[#00C4CC] border border-[#00C4CC]/20 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#00C4CC] hover:text-white transition"
                                            >
                                                <FaExternalLinkAlt size={12} /> View Full Size
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-gray-500 text-xs mt-4 italic">
                            * Click "View Full Size" to inspect the image in a new tab.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideDetails;