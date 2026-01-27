import React, { useState } from 'react';
import GuidesContext from './GuidesContext';
import {
    GuidesRegistration, GetAllGuides, GetAllPendingGuides,
    GetAllApprovedGuides, UpdateGuideStatus, DeleteAccount,
    ReactivateAccount, GetTodayPendingGuides, GetTotalUsers,
    CheckGuidesAvailability, ToggleGuideAvailability, SyncAvailability,
    GetActiveGuides
} from '../../Api/GuidesAPI';

const GuidesState = (props) => {
    const [guides, setGuides] = useState([]);
    const [pendingGuides, setPendingGuides] = useState([]);
    const [approvedGuides, setApprovedGuides] = useState([]);
    const [todayPendingGuides, setTodayPendingGuides] = useState([]);
    const [activeGuides, setActiveGuides] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Count total users, pending guides, approved guides, and today's pending guides
    const [totalPendingGuides, setTotalPendingGuides] = useState(0);
    const [totalApprovedGuides, setTotalApprovedGuides] = useState(0);
    const [totalTodayPendingGuides, setTotalTodayPendingGuides] = useState(0);
    const [totalActiveGuides, setTotalActiveGuides] = useState(0);
    const [isAvailable, setIsAvailable] = useState(true);

    // Function 1: Guide Registration function
    const guidesRegistration = async (guideData) => {
        try {
            const result = await GuidesRegistration(guideData);
            console.log("result : ", result);

            // return message after succesful register of guide
            if (result.success) {
                console.log(result.message);
                return { success: true, msg: result.message };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error(error);
            return { success: false, msg: "Something went wrong in guide registration. Please try again." };
        }
    }

    // Function 2: Get all guides function
    const getAllGuides = async () => {
        try {
            const result = await GetAllGuides();
            console.log(result);

            if (result.success) {
                // Set guides in state
                setGuides(result.guides);

                return { success: true, msg: "Guides fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching guides:", error);
            return { success: false, msg: "Failed to fetch guides due to a server error." };
        }
    }

    // Function 3: Get all pending guides function
    const getAllPendingGuides = async () => {
        try {
            const result = await GetAllPendingGuides();
            console.log(result);

            if (result.success) {
                // Set pending guides in state
                setPendingGuides(result.pendingGuides);
                setTotalPendingGuides(result.count);

                return { success: true, msg: "Pending guides fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching pending guides:", error);
            return { success: false, msg: "Failed to fetch pending guides due to a server error." };
        }
    }

    // Function 4: Get all approved guides function
    const getAllApprovedGuides = async () => {
        try {
            const result = await GetAllApprovedGuides();
            console.log(result);

            if (result.success) {
                // Set approved guides in state
                setApprovedGuides(result.approvedGuides);
                setTotalApprovedGuides(result.count);

                return { success: true, msg: "Approved guides fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching approved guides:", error);
            return { success: false, msg: "Failed to fetch approved guides due to a server error." };
        }
    }

    // Function 5: Update guide status function
    const updateGuideStatus = async (guideId, status) => {
        setIsLoading(true);

        try {
            const result = await UpdateGuideStatus(guideId, status);
            console.log(result);

            if (result.success) {
                // Find the guide object before removing it from pending
                const guideObj = pendingGuides.find(g => g._id === guideId);

                // INSTANT STATE UPDATE: Remove from pending immediately
                setPendingGuides(prev => prev.filter(g => g._id !== guideId));
                setTotalPendingGuides(prev => prev - 1);

                // If Approved, Add to Approved State instantly
                if (status === 'approved' && guideObj) {
                    setApprovedGuides(prev => [...prev, { ...guideObj, status: 'approved' }]);
                    setTotalApprovedGuides(prev => prev + 1);
                }

                return { success: true, msg: result.message, result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error updating guide status:", error);
            return { success: false, msg: "Failed to update guide status due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 6: Delete guide account function
    const deleteAccount = async (guideId) => {
        setIsLoading(true);

        try {
            const result = await DeleteAccount(guideId);
            console.log(result);

            if (result.success) {
                // INSTANT STATE UPDATE: Change status in the main 'guides' list
                setGuides(prev => prev.map(g => g._id === guideId ? { ...g, status: 'scheduled_for_deletion' } : g));

                // Remove from approved list if it was there
                setApprovedGuides(prev => prev.filter(g => g._id !== guideId));
                setTotalApprovedGuides(prev => prev - 1);

                return { success: true, msg: result.message, result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error deleting guide account:", error);
            return { success: false, msg: "Failed to delete guide account due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 7: Reactivate guide account function
    const reactivateAccount = async (guideId) => {
        setIsLoading(true);

        try {
            const result = await ReactivateAccount(guideId);
            console.log(result);

            if (result.success) {
                // INSTANT STATE UPDATE: Reset status back to approved
                setGuides(prev => prev.map(g => g._id === guideId ? { ...g, status: 'approved' } : g));

                return { success: true, msg: result.message, result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error reactivating guide account:", error);
            return { success: false, msg: "Failed to reactivate guide account due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 8: Today pending guides
    const getTodayPendingGuides = async () => {
        try {
            const result = await GetTodayPendingGuides();
            console.log(result);

            if (result.success) {
                setTodayPendingGuides(result.todayPendingRequests);
                setTotalTodayPendingGuides(result.count);

                return { success: true, msg: "Today pending guides fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching today pending guides:", error);
            return { success: false, msg: "Failed to fetch today pending guides due to a server error." };
        }
    }

    // Function 9: Total users
    const getTotalUsers = async () => {
        try {
            const result = await GetTotalUsers();
            console.log(result);

            if (result.success) {
                setTotalUsers(result.count);

                return { success: true, msg: "Total users fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching total users:", error);
            return { success: false, msg: "Failed to fetch total users due to a server error." };
        }
    }

    // Function 10: Check guide availability
    const checkGuidesAvailability = async (languages, checkIn, checkOut) => {
        try {
            const result = await CheckGuidesAvailability(languages, checkIn, checkOut);
            console.log(result);

            if (result.success) {
                return { success: true, count: result.count, msg: result.message, busyGuideIds: result.busyGuideIds, result: result };
            } else {
                return { success: false, count: result.fallbackCount, msg: result.message, busyGuideIds: result.busyGuideIds, result: result };
            }
        } catch (error) {
            console.error("Error checking guides availability:", error);
            return { success: false, msg: "Failed to check guides availability due to a server error." };
        }
    }

    // Function 11: Toggle guide availability
    const toggleGuideAvailability = async (userId) => {
        try {
            const result = await ToggleGuideAvailability(userId);
            console.log(result);

            if (result.success) {
                setIsAvailable(result.isAvailable);

                return { success: true, isAvailable: result.isAvailable, msg: result.message };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error toggling guide availability:", error);
            return { success: false, msg: "Failed to toggle guide availability due to a server error." };
        }
    }

    // Function 12: Check guide profile active or not
    const syncAvailability = async (userId) => {
        try {
            const result = await SyncAvailability(userId);
            console.log(result);

            if (result.success) {
                setIsAvailable(result.isAvailable);

                return { success: true, isAvailable: result.isAvailable };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error syncing guide availability:", error);
            return { success: false, msg: "Failed to sync guide availability due to a server error." };
        }
    }

    // Function 13: Get active guides (Admin only)
    const getActiveGuides = async () => {
        try {
            const result = await GetActiveGuides();
            console.log(result);

            if (result.success) {
                // Set active guides in state
                setActiveGuides(result.activeGuides);
                setTotalActiveGuides(result.count);

                return { success: true, msg: "Active guides fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching active guides:", error);
            return { success: false, msg: "Failed to fetch active guides due to a server error." };
        }
    }

    const value = {
        guidesRegistration,
        getAllGuides,
        getAllPendingGuides,
        getAllApprovedGuides,
        updateGuideStatus,
        deleteAccount,
        reactivateAccount,
        getTodayPendingGuides,
        getTotalUsers,
        checkGuidesAvailability,
        toggleGuideAvailability,
        syncAvailability,
        getActiveGuides,
        pendingGuides,
        approvedGuides,
        todayPendingGuides,
        guides,
        activeGuides,
        totalPendingGuides,
        totalApprovedGuides,
        totalTodayPendingGuides,
        totalUsers,
        totalActiveGuides,
        isLoading,
        isAvailable
    }

    return (
        <GuidesContext.Provider value={value}>
            {props.children}
        </GuidesContext.Provider>
    )
}

export default GuidesState
