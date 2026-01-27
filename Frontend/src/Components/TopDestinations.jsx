import React, { useEffect, useContext } from 'react'
import DestinationsContext from '../Context/Destinations/DestinationsContext';
import DestinationCard from './DestinationCard';
import { useNavigate } from 'react-router-dom';

const TopDestinations = () => {
    const { destinations, fetchDestinations } = useContext(DestinationsContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDestinations();
    }, []);

    // Sort by Rating (High to Low) and take the top 4
    const topTour = [...destinations]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    // Handle card click
    const handleCardClick = (destinationId) => {
        navigate('/destination', { state: { openId: destinationId } });
    }

    return (
        <div id="top-destinations" className="py-18 md:py-20 lg:py-24 px-4 scroll-mt-24">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-[1.65rem] md:text-[2rem] lg:text-[2.45rem] font-extrabold text-white text-center mb-2">Top Destinations: <span className="text-[#00C4CC]">Booked with Precision</span></h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-400 mb-12 md:mb-14 lg:mb-16 text-center max-w-3xl mx-auto">Explore high-demand tours with verified logistics and specialized local guides.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topTour.map((dest) => (
                        <DestinationCard
                            key={dest._id}
                            destination={dest}
                            showDetails={() => handleCardClick(dest._id)}
                        />
                    ))}
                </div>

            </div>
        </div>
    )
}

export default TopDestinations
