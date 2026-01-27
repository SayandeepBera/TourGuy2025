import React, { useContext, useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaRegEnvelope } from 'react-icons/fa';
import ConciergeContext from '../../Context/Concierge/ConciergeContext';
import { toast } from 'react-toastify';
import { ImSpinner9 } from "react-icons/im";

const ConciergeManagement = ({ onBack }) => {
    const { getAllConciergeRequests, updateConciergeRequestStatus } = useContext(ConciergeContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch concierge requests
    const fetchRequests = async () => {
        const res = await getAllConciergeRequests();
        if (res.success) {
            setRequests(res.requests);
        }

        setLoading(false);
    };

    // Fetch requests on component mount
    useEffect(() => {
        fetchRequests();
    }, []);

    // Handle status update
    const handleStatusUpdate = async (id, newStatus) => {
        const res = await updateConciergeRequestStatus(id, newStatus);
        if (res.success) {
            toast.success(`Request marked as ${newStatus.replace('_', ' ')}`);
            fetchRequests(); // Refresh list
        }
    };

    // Loading state
    if (loading) return <div className="flex justify-center p-20"><ImSpinner9 className="animate-spin text-4xl text-[#00C4CC]" /></div>;

    return (
        <div className="min-h-screen p-4 md:p-8 animate-in fade-in duration-500">
            <button onClick={onBack} className="flex items-center gap-2 text-[#00C4CC] mt-3 mb-6 hover:text-cyan-300 transition cursor-pointer font-bold w-fit">
                <FaArrowLeft /> <span className="text-sm md:text-base">Back to Dashboard</span>
            </button>

            <h2 className="text-3xl text-white font-bold mb-8">Concierge <span className="text-[#00C4CC]">Service Requests</span></h2>

            <div className="grid gap-6">
                {requests.length > 0 ? requests.map((req) => (
                    <div key={req._id} className="bg-[#1E293B] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${req.role === 'tourist' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                    {req.role}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${req.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {req.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{req.name}</h3>
                            <p className="text-[#00C4CC] text-sm mb-4">{req.email}</p>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-gray-700">
                                <p className="text-gray-300 italic">"{req.message}"</p>
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 justify-end">
                            {req.status !== 'in_progress' && req.status !== 'resolved' && (
                                <button onClick={() => handleStatusUpdate(req._id, 'in_progress')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition">
                                    Mark In-Progress
                                </button>
                            )}
                            {req.status !== 'resolved' && (
                                <button onClick={() => handleStatusUpdate(req._id, 'resolved')} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2">
                                    <FaCheckCircle /> Resolve
                                </button>
                            )}
                            <a href={`mailto:${req.email}`} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 justify-center">
                                <FaRegEnvelope /> Reply via Email
                            </a>
                        </div>
                    </div>
                )) : <p className="text-gray-500 text-center py-10">No concierge requests found.</p>}
            </div>
        </div>
    );
};

export default ConciergeManagement;