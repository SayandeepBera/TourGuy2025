import React from 'react';
import { LuUserCheck } from "react-icons/lu";
import AvailablityMessage from './AvailablityMessage';

const AutomaticGuideSelection = ({ formData, availabilityStatus }) => {
    return (
        <div className="p-6 border border-[#00C4CC]/20 bg-[#00C4CC]/5 rounded-2xl text-center border-dashed">
            <LuUserCheck size={48} className="text-[#00C4CC] mx-auto mb-4 opacity-80" />
            <p className="text-white font-bold text-lg">Smart Guide Allocation</p>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                We'll match you with a certified guide based on your language and trip dates.
            </p>

            {/* API Availability Message */}
            <AvailablityMessage
                formData={formData}
                availabilityStatus={availabilityStatus}
            />
        </div>
    );
};

export default AutomaticGuideSelection;