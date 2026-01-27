import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX } from "react-icons/lu";
import GuidesContext from '../../Context/Guides/GuidesContext';
import AutomaticGuideSelection from './AutomaticGuideSelection';
import ManualGuideSelection from './ManualGuideSelection';
import GuideDetailsModal from './GuideDetailsModal';

const BookingSlide4 = ({ formData, setFormData }) => {
    const [guideSelection, setGuideSelection] = useState('automatic');
    const [viewingGuide, setViewingGuide] = useState(null);
    const { getAllApprovedGuides, approvedGuides, checkGuidesAvailability } = useContext(GuidesContext);
    const [availabilityStatus, setAvailabilityStatus] = useState({ loading: false, data: null, busyIds: [] });

    // Fetch approved guides
    useEffect(() => {
        getAllApprovedGuides();
    }, []);

    // Check guide availability
    useEffect(() => {
        if (guideSelection === 'automatic' && formData.languages) {
            handleCheckAvailability();
        }
    }, [guideSelection, formData.languages]);

    // Handle check availability
    const handleCheckAvailability = async () => {
        setAvailabilityStatus(prev => ({ ...prev, loading: true }));
        const result = await checkGuidesAvailability(formData.languages, formData.checkIn, formData.checkOut);
        
        setAvailabilityStatus({ 
            loading: false, 
            data: result, 
            busyIds: result?.busyGuideIds || [] 
        });
    };

    // Toggle selection mode
    const toggleSelectionMode = (mode) => {
        setGuideSelection(mode);
        if (mode === 'automatic') {
            setFormData({ ...formData, selectedGuideId: null });
        }
    };

    return (
        <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5 relative">
            <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-2 underline decoration-[#00C4CC] underline-offset-8">Guide Preferences</h3>

            <div className="space-y-4 md:space-y-6 pt-4 mt-4">
                {/* Tabs */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Assignment Mode</label>
                    <div className="flex gap-4 py-2 px-3 bg-black/20 rounded-2xl border border-gray-800">
                        <button onClick={() => toggleSelectionMode('automatic')} className={`flex-1 py-3 rounded-xl transition duration-500 font-bold ${guideSelection === 'automatic' ? 'bg-[#00C4CC] text-[#0F172A]' : 'text-gray-500 hover:text-gray-300'}`}>Automatic</button>
                        <button onClick={() => toggleSelectionMode('manual')} className={`flex-1 py-3 rounded-xl transition duration-500 font-bold ${guideSelection === 'manual' ? 'bg-[#00C4CC] text-[#0F172A]' : 'text-gray-500 hover:text-gray-300'}`}>Manual Choice</button>
                    </div>
                </div>

                {/* Conditional Rendering of Sub-components */}
                {guideSelection === 'manual' ? (
                    <ManualGuideSelection
                        approvedGuides={approvedGuides}
                        formData={formData}
                        setFormData={setFormData}
                        setViewingGuide={setViewingGuide}
                    />
                ) : (
                    <AutomaticGuideSelection
                        formData={formData}
                        availabilityStatus={availabilityStatus}
                    />
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#00C4CC] uppercase ml-1 tracking-wider">Additional Notes (Optional)</label>
                    <textarea
                        placeholder="Any special requests or dietary needs?"
                        className="w-full p-3 md:p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white h-24 focus:border-[#00C4CC] outline-none"
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    />
                </div>
            </div>

            {/* Guide Info Modal Logic (Same as before) */}
            <AnimatePresence>
                {viewingGuide && (
                    <GuideDetailsModal viewingGuide={viewingGuide} setViewingGuide={setViewingGuide} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BookingSlide4;