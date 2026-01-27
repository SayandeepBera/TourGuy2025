import { FaCheckCircle } from 'react-icons/fa';
import { XCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import BookingContext from '../../Context/Booking/BookingContext';
import { toast } from 'react-toastify';
import { ImSpinner9 } from "react-icons/im";

const IncomingRequests = ({ activeRequests, userId, refreshData }) => {
    const { guideAcceptsRejectsRequests, isLoading } = useContext(BookingContext);

    // Function to handle accept/reject action
    const handleAction = async (bookingId, action) => {
        try {
            const destinationName = activeRequests.find((req) => req._id === bookingId)?.destinationName;
            if(!destinationName) {
                toast.error("Failed to update request due to a server error.", {
                    theme: "colored"
                })
                return;
            }

            const result = await guideAcceptsRejectsRequests(bookingId, action, destinationName, userId);

            if (result.success) {
                toast.success(result.msg, {
                    style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
                })

                await refreshData(userId);
            } else {
                toast.error(result.msg, {
                    theme: "colored"
                })
            }
        } catch (error) {
            console.error("Error updating request:", error);
            toast.error("Failed to update request due to a server error.", {
                theme: "colored"
            })
        }
    };

    return (
        <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00C4CC] rounded-full animate-ping"></span>
                Active Requests
            </h3>
            <div className="space-y-4">
                {activeRequests?.length > 0 ? activeRequests.map((req) => (
                    <div key={req._id} className="p-4 bg-black/20 border border-gray-800 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="font-bold text-lg">{req.fullName}</p>
                            <p className="text-sm text-[#00C4CC]">{req.destinationName} • {req.checkIn ? new Date(req.checkIn).toDateString() : 'TBD'}</p>
                            <p className="text-xs text-gray-500 mt-1">Amount: ₹{req.totalAmount}</p>
                        </div>
                        <div className="flex gap-2">
                            <button disabled={isLoading} onClick={() => handleAction(req._id, 'reject')} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                {isLoading ? <ImSpinner9 className="animate-spin" size={20} /> : <XCircle size={20} />}
                            </button>
                            <button disabled={isLoading} onClick={() => handleAction(req._id, 'accept')} className="p-2 bg-[#00C4CC]/10 text-[#00C4CC] rounded-lg hover:bg-[#00C4CC] hover:text-black transition-all">
                                {isLoading ? <ImSpinner9 className="animate-spin" size={20} /> : <FaCheckCircle size={20} />}
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-500 italic text-center py-4">No new requests at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default IncomingRequests;