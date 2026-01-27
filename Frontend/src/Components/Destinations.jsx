import React, { useCallback, useState, useMemo } from 'react'
import FilterSection from './FilterSection';
import DestinationCard from './DestinationCard';
import { useContext } from 'react';
import DestinationsContext from '../Context/Destinations/DestinationsContext';
import { useEffect } from 'react';
import NewDestinationAdd from './Admin Protal/NewDestinationAdd';
import EditDestination from './Admin Protal/EditDestination';
import { FaPlus, FaTimes } from 'react-icons/fa';
import DestinationDetailsView from './DestinationDetailsView';
import AuthContext from '../Context/Authentication/AuthContext';
import { useLocation } from 'react-router-dom';

const Destinations = () => {
    const [currentFilter, setCurrentFilter] = useState('All');
    const [selectDestination, setSelectDestination] = useState(null);
    const [showNewDestinationForm, setShowNewDestinationForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const { destinations, fetchDestinations, selectedCategory, selectedType, searchQuery, sortBy } = useContext(DestinationsContext);
    const { userRole } = useContext(AuthContext);
    const location = useLocation();

    // Check if the user is an admin
    const isAdmin = userRole === "admin";

    useEffect(() => {
        fetchDestinations();
        // eslint-disable-next-line
    }, []);

    // Open details of selected destination if navigated with state
    useEffect(() => {
        // Check if openId exists in state
        if (location.state && location.state.openId && destinations.length > 0) {
            const target = destinations.find(d => d._id === location.state.openId);
            if (target) {
                setSelectDestination(target);
            }
        }
    }, [location.state, destinations]);

    // Show details of selected destination
    const showDetails = useCallback((id) => {
        const destination = destinations.find((destination) => destination._id === id);
        setSelectDestination(destination);

        // Scroll to top when switching views
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [destinations]);

    // Filter destinations based on selected filter
    const filteredDestinations = useMemo(() => {
        let result = destinations.filter(dest => {
            // Check the type, category, and search query
            const typeMatch =
                selectedType === "All" || dest.type === selectedType;

            const categoryMatch =
                selectedCategory === "All" || dest.category === selectedCategory;

            const searchMatch =
                searchQuery === "" ||
                dest.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.country.toLowerCase().includes(searchQuery.toLowerCase());

            return typeMatch && categoryMatch && searchMatch;
        });

        // Sort the filtered destinations
        const sortResult = [...result].sort((a, b) => {
            if(sortBy === "PriceLow") {
                return a.price - b.price;
            } else if(sortBy === "PriceHigh") {
                return b.price - a.price;
            } else if(sortBy === "Rating") {
                return b.rating - a.rating; // Sort by rating (high to low)
            } 

            return 0; // Default sorting
        });

        return sortResult;

    }, [destinations, selectedType, selectedCategory, searchQuery, sortBy]);

    const currentView = selectDestination ? "details" : "list";

    // Open edit modal with selected destination
    const openEditModal = (destination) => {
        setSelectDestination(destination);
        setShowEditModal(true);
    };

    // Handler to close the New Destination form (passed implicitly)
    const toggleNewDestinationForm = () => {
        setShowNewDestinationForm(prev => !prev);
    };

    // Handler to close the Edit Modal (and re-fetch data)
    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectDestination(null); // Clear selected data after close
        fetchDestinations(); // Refresh the list after successful edit
    }

    return (
        <div className="min-h-screen">
            {/* Destination hero section */}
            {currentView === "list" && (<div className="text-white ">
                <div className="dest-bg max-w-8xl text-center py-16 px-4 ">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl  font-extrabold mb-4">Explore Amazing Destinations</h1>
                    <p className="text-base md:text-lg lg:text-xl text-white px-22 max-w-2xl mx-auto">Discover your dream destination from our curated collection of national and international tours</p>
                </div>

                <FilterSection currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
            </div>)}

            {/* Destination cards section */}
            {currentView === "list" ? (
                <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredDestinations.map((destination) => (
                            <DestinationCard key={destination._id} destination={destination} showDetails={showDetails} openEditModal={openEditModal} />
                        ))}
                    </div>

                    {filteredDestinations.length === 0 && (
                        <div className="text-center p-10 rounded-xl mt-10">
                            <p className="text-xl font-semibold text-white">No matching destinations found.</p>
                            <p className="text-gray-400 mt-2">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            ) : (
                <DestinationDetailsView selectedDestination={selectDestination} showDestinationsList={showDetails} />
            )}

            {/* Add New Destination Section (Admin only) */}
            {isAdmin && (
                <div className='my-5'>
                    {showNewDestinationForm ? (
                        <>
                            <NewDestinationAdd onSaveSuccess = {toggleNewDestinationForm} />
                            {/* Manual hide button for NewDestinationAdd */}
                            <div className='text-center my-5'>
                                <button
                                    className="px-5 py-1 md:px-7 md:py-2 rounded-full text-center font-semibold border-2 text-lg cursor-pointer bg-red-500 border-red-600 text-white shadow-lg hover:bg-red-700 transition duration-150 flex items-center gap-2 mx-auto"
                                    onClick={toggleNewDestinationForm}
                                >
                                    <FaTimes /> Hide Form
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center my-5">
                            <button
                                className="px-6 py-2 md:px-8 md:py-3 rounded-full text-center font-semibold border-2 text-lg cursor-pointer bg-[#00C4CC] border-[#00C4CC] text-white shadow-[0_0_20px_#0ef] hover:bg-cyan-400 transition duration-150 flex items-center gap-2 mx-auto"
                                onClick={toggleNewDestinationForm}
                            >
                                <FaPlus /> Add Destination
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Destination Modal */}
            {showEditModal && selectDestination && (
                <EditDestination
                    destination={selectDestination}
                    onClose={closeEditModal}
                />
            )}

        </div>
    )
}

export default Destinations
