import React, { useState } from 'react'
import DestinationsContext from './DestinationsContext';
import { GetAllDestinations, AddDestination, UpdateDestination, DeleteDestination } from '../../Api/DestAPI';

const DestinationsState = (props) => {
    const [destinations, setDestinations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    
    // Global Filter Category State
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [totalDestinations, setTotalDestinations] = useState(0);
    const [sortBy, setSortBy] = useState("Default");

    // Fetch all destinations from the server
    const fetchDestinations = async () => {
        try {
            const result = await GetAllDestinations();
            console.log(result);

            if (result.success) {
                // Set destinations in state
                setDestinations(result.destinations);
                setTotalDestinations(result.count);

                return { success: true, msg: "Destinations fetched successfully." };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching destinations:", error);
            return { success: false, msg: "Failed to fetch destinations due to a server error." };
        }
    }

    const addDestination = async (destinationData) => {
        setIsLoading(true);

        try {
            const result = await AddDestination(destinationData);
            console.log(result);

            if (result.success) {
                // Add the new Destination to the state
                setDestinations(prev => [...prev, result.newDestination]);

                return { success: true, msg: "New Destination added successfully.", result: result.newDestination };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error adding destination:", error);
            return { success: false, msg: "Failed to add destination due to a server error." };
        } finally {
            setIsLoading(false);
        }

    }

    const updateDestination = async (destinationId, updatedData) => {
        setIsLoading(true);
        try {
            const result = await UpdateDestination(destinationId, updatedData);
            console.log(result);

            if (result.success) {
                // Update the Destination in the state
                setDestinations(prev => prev.map(dest => dest._id === destinationId ? result.updatedDestination : dest));

                return { success: true, msg: "Destination updated successfully.", result: result.updatedDestination };
            } else {
                return { success: false, msg: result.error };
            }

        } catch (error) {
            console.error("Error updating destination:", error);
            return { success: false, msg: "Failed to update destination due to a server error." }
        } finally {
            setIsLoading(false);
        }
    }

    const deleteDestination = async (destinationId) => {
        try {
            // Indicate which destination is being deleted
            setDeletingId(destinationId);

            const result = await DeleteDestination(destinationId);
            console.log(result);

            if (result.success) {
                // Remove the Destination from the state
                setDestinations(prev => prev.filter(dest => dest._id !== destinationId));

                return { success: true, msg: result.message, result: result.deletedDest };
            } else {
                return { success: false, msg: result.error };
            }

        } catch (error) {
            console.error("Error deleting destination:", error);
            return { success: false, msg: "Failed to delete destination due to a server error." }
        } finally {
            setDeletingId(null);
        }
    }

    const value = {
        destinations,
        fetchDestinations,
        addDestination,
        updateDestination,
        deleteDestination,
        isLoading,
        deletingId,
        totalDestinations,

        selectedCategory,
        setSelectedCategory,

        selectedType,
        setSelectedType,

        searchQuery,
        setSearchQuery,

        sortBy,
        setSortBy
    }

    return (
        <DestinationsContext.Provider value={value}>
            {props.children}
        </DestinationsContext.Provider>
    )
}

export default DestinationsState
