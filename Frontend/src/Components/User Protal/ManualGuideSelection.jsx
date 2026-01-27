import React, { useRef } from 'react';
import { LuChevronLeft, LuChevronRight, LuInfo } from "react-icons/lu";

const ManualGuideSelection = ({ approvedGuides, formData, setFormData, setViewingGuide, busyIds }) => {
    const scrollRef = useRef(null);

    // Filter Logic
    const filterGuides = approvedGuides.filter(guide => {
        // Availability Check: Guide must be isAvailable: true
        if (!guide.isAvailable) {
            return false;
        }
        
        // Check if guide is already booked for these dates
        const isBusy = busyIds && busyIds.includes(guide._id.toString());
        if (isBusy) {
            return false;
        }
        
        // Check if languages match 
        if (!formData.languages || formData.languages.length === 0) {
            return true;
        }

        const searchTerms = String(formData.languages).toLowerCase().split(',').map(l => l.trim());
        
        // Check if any of the guide's languages match any of the search terms
        return guide.languages.some(guideLang => {
            const normalizedGuideLang = guideLang.toLowerCase();
            return searchTerms.some(term => term !== "" && normalizedGuideLang.includes(term));
        });
    });

    // Scroll Logic
    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            const { scrollLeft } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const handleGuideSelect = (guide) => {
        setFormData({ ...formData, selectedGuideId: guide._id });
        setViewingGuide(guide);
    };

    return (
        <div className="relative group bg-[#00C4CC]/5 rounded-2xl border border-[#00C4CC]/20 border-dashed overflow-hidden">
            {filterGuides.length > 0 ? (
                <>
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-gray-800/90 hover:bg-[#00C4CC] text-white hover:text-black p-2 rounded-full transition-all border border-gray-700"
                    >
                        <LuChevronLeft size={24} />
                    </button>

                    {/* Carousel */}
                    <div ref={scrollRef} className="flex gap-10 overflow-x-hidden scroll-smooth px-16 pt-6 pb-4 snap-x w-full">
                        {filterGuides.map((guide) => {
                            const isSelected = formData.selectedGuideId === guide._id;
                            return (
                                <div key={guide._id} className="flex flex-col items-center snap-center shrink-0">
                                    <div
                                        onClick={() => handleGuideSelect(guide)}
                                        className={`relative w-24 h-24 rounded-full cursor-pointer transition-all duration-500 ${isSelected ? 'scale-125 z-10' : 'scale-100 opacity-60 hover:opacity-100'}`}
                                    >
                                        <div className={`w-full h-full rounded-full overflow-hidden border-4 ${isSelected ? 'border-[#00C4CC] shadow-xl shadow-[#00C4CC]/40' : 'border-gray-700'}`}>
                                            <img src={guide.profilePhoto.url} alt={guide.fullName} className="w-full h-full object-cover" />
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setViewingGuide(guide); }}
                                            className="absolute -bottom-1 -right-1 bg-white text-black p-1.5 rounded-full shadow-lg hover:bg-[#00C4CC] transition-colors z-20"
                                        >
                                            <LuInfo size={14} />
                                        </button>
                                    </div>
                                    <p className={`text-sm mt-6 font-bold transition-colors ${isSelected ? 'text-[#00C4CC]' : 'text-white'}`}>
                                        {guide.fullName.split(' ')[0]}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-gray-800/90 hover:bg-[#00C4CC] text-white hover:text-black p-2 rounded-full transition-all border border-gray-700"
                    >
                        <LuChevronRight size={24} />
                    </button>
                </>
            ) : (
                /* Fallback */
                <div className="flex flex-col items-center p-6 text-center animate-pulse">
                    <LuInfo size={28} className="text-yellow-500 mb-3" />
                    <h4 className="text-lg font-bold text-white mb-1">No Guides Available</h4>
                    <p className="text-gray-400 text-xs max-w-[250px] mb-4">
                        We couldn't find a guide fluent in <span className="text-[#00C4CC] font-bold">"{formData.languages}"</span>.
                    </p>
                    <button
                        onClick={() => setFormData({ ...formData, languages: '' })}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#00C4CC] text-xs font-bold hover:bg-[#00C4CC] hover:text-black transition-all"
                    >
                        Show All Available Guides
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManualGuideSelection;