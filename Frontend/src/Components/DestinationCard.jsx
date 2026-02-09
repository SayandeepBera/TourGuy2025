import React  from 'react'
import { useContext } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { ImSpinner9 } from "react-icons/im";
import DestinationsContext from '../Context/Destinations/DestinationsContext';
import { toast } from 'react-toastify';
import DeleteConfirmation from './DeleteConfirmation';
import { BsInfoCircleFill } from "react-icons/bs";
import AuthContext from '../Context/Authentication/AuthContext';
import { motion } from 'framer-motion';

const DestinationCard = React.memo(({ destination, showDetails, openEditModal }) => {
    const { deleteDestination, deletingId } = useContext(DestinationsContext);
    const { userRole } = useContext(AuthContext);

    // Check if the user is an admin
    const isAdmin = userRole === "admin";

    // Determine if this destination is being deleted
    const isDeleting = (deletingId === destination._id);

    // Handle delete confirmation
    const handleDeleteDestination = () => {
        // Create a unique toast ID
        const toastId = toast.info(
            <div className='flex gap-1 items-start'>
                <div className='text-xl mt-3 shrink-0'>
                    <BsInfoCircleFill />
                </div>
                <DeleteConfirmation
                    message={`Are you sure you want to delete ${destination.place} destination?`}
                    onCancel={() => toast.dismiss(toastId)} // Close if user clicks cancel
                    onConfirm={() => {
                        toast.dismiss(toastId); // Close the confirm toast
                        proceedWithDelete(); // Proceed with deletion
                    }}
                />
            </div>,

            {
                icon: false,
                position: "top-center",
                autoClose: false, // Wait for user action
                closeOnClick: false,
                draggable: false,
                style: { width: '95vw', maxWidth: '550px', borderRadius: '15px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderBottom: '4px solid #707c7c', margin: '0 auto' }
            }
        );
    }

    // After confirmation proceed with deletion
    const proceedWithDelete = async () => {
        const result = await deleteDestination(destination._id);

        if (result.success) {
            toast.success(result.msg, {
                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
            });
        } else {
            toast.error(result.msg || "Failed to delete destination.", {
                theme: "colored"
            });
        }
    };

    // Function to capitalize the first letter of each word
    const wordCapitalize = (words) => {
        return words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <motion.div
            key="card"
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className={"relative destination-card bg-[#1A2437] rounded-2xl shadow-2xl overflow-visible hover:shadow-[#00C4CC]/30 transition duration-300 transform hover:scale-[1.02]"}
            onClick={() => showDetails(destination._id)}
        >
            {/* Edit Button show only for admin */}
            {isAdmin && (
                <button
                    className="absolute -top-5.5 -right-5.5 z-30 text-white text-xl bg-[#00C4CC]
                    p-2 md:p-3 rounded-full shadow-lg hover:scale-110 transition cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(destination);
                    }}
                >
                    <FaEdit />
                </button>
            )}

            {/* Delete Button show only for admin */}
            {isAdmin && (
                <button
                    disabled={isDeleting}
                    className={`absolute -bottom-5.5 -left-5.5 z-30 text-white text-xl
                        p-2 md:p-3 rounded-full shadow-lg transition ${isDeleting ? 'bg-red-400 cursor-not-allowed opacity-60' : 'bg-red-500 hover:scale-110 cursor-pointer'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDestination();
                    }}
                >
                    {isDeleting ? (
                        <ImSpinner9 className='animate-spin' />
                    ) : (
                        <MdDeleteSweep />
                    )}
                </button>
            )}

            {/* Image Area (Dominant Visual) */}
            <div className="relative z-10 h-64 group rounded-2xl overflow-hidden border-b-4 border-[#00C4CC]">
                <img
                    src={destination.placeImage?.url}
                    alt={destination.place}
                    className="w-full h-64 object-cover cursor-pointer transition-transform duration-700 group-hover:scale-110 will-change-transform backface-hidden"
                />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full bg-[#00C4CC] text-[#0F172A] text-xs font-bold backdrop-blur-sm shadow-md">
                        {destination.type === 'National' ? '🚈 NATIONAL' : '🛫 INTERNATIONAL'}
                    </span>
                    <span className="text-sm font-semibold text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                        {destination.duration} Days
                    </span>
                </div>

                {/* Bottom Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <h3 className="text-2xl font-extrabold text-white mb-1">{wordCapitalize(destination.place)}, {wordCapitalize(destination.city)}</h3>
                    <p className="text-[#f3f1f1] text-sm">{destination.markings}</p>
                </div>
            </div>

            {/* Bottom Content / Booking Details */}
            <div className="p-5 flex justify-between items-center">
                <div>
                    <span className="text-sm text-gray-500">Best Price</span>
                    <div className="text-3xl font-black text-[#00C4CC]">₹ {destination.price}</div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-yellow-400 text-lg mb-1 mx-2">⭐ {destination.rating}</span>
                    <button className="px-4 py-2 rounded-full font-bold bg-[#00C4CC] text-[#0F172A] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); showDetails(destination._id); }}>
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
})

export default DestinationCard
