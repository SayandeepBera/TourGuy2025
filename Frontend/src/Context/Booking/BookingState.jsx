import React, { useState } from 'react'
import BookingContext from './BookingContext'
import {
    CreateBookingOrder, VerifyPayment, GuideAcceptsRejectsRequests, GetAllBookings,
    GetTouristHistory, GetGuideHistory, GetTodayBookings,
    GetRevenueStats, GetGuidesStats, GetActiveRequests,
    GetRecentActivities, GetBookingActivityLog, MarkTourAsCompleted
} from '../../Api/BookingAPI';

const BookingState = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [guideStats, setGuideStats] = useState({
        totalRequests: 0,
        completedTours: 0,
        rejectedTours: 0,
        earnings: 0
    });
    const [activeRequests, setActiveRequests] = useState([]);
    const [activities, setActivities] = useState([]);
    const [guideHistory, setGuideHistory] = useState([]);
    const [revenueData, setRevenueData] = useState({ totalRevenue: 0 });

    // Function 1: Create Booking Order
    const createBookingOrder = async (amount) => {
        setIsLoading(true);

        try {
            const result = await CreateBookingOrder(amount);
            console.log(result);

            if (result.success) {
                return { success: true, msg: "Order created successfully.", result: result }
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error creating order:", error);
            return { success: false, msg: "Failed to create order due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 2: API Verify Payment
    const verifyPayment = async (formData) => {
        setIsLoading(true);

        try {
            const result = await VerifyPayment(formData);
            console.log("Verify Payment Result: ", result);

            if (result.success) {
                return { success: true, msg: "Booking successful!.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            return { success: false, msg: "Failed to verify payment due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 3: Guide accepts/rejects requests
    const guideAcceptsRejectsRequests = async (bookingId, action, destinationName, userId) => {
        setIsLoading(true);

        try {
            const result = await GuideAcceptsRejectsRequests({ bookingId: bookingId, action: action, destinationName: destinationName });
            console.log(result);

            if (result.success) {
                // Remove the request from the local list immediately
                setActiveRequests(prev => prev.filter(req => req._id !== bookingId));

                // Refresh the guide stats
                getGuideStats(userId);

                return { success: true, msg: result.message, result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error updating request:", error);
            return { success: false, msg: "Failed to update request due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 4: Get all bookings
    const getAllBookings = async () => {
        setIsLoading(true);

        try {
            const result = await GetAllBookings();
            console.log(result);

            if (result.success) {
                return { success: true, msg: "Bookings fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return { success: false, msg: "Failed to fetch bookings due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 5: Get tourist history
    const getTouristHistory = async (id) => {
        setIsLoading(true);

        try {
            const result = await GetTouristHistory(id);
            console.log(result);

            if (result.success) {
                return { success: true, msg: "Tourist history fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching tourist history:", error);
            return { success: false, msg: "Failed to fetch tourist history due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 6: Get guide history
    const getGuideHistory = async (userId) => {
        setIsLoading(true);

        try {
            const result = await GetGuideHistory(userId);
            console.log(result);

            if (result.success) {
                // Set guide history
                setGuideHistory(result.bookingsHistory);

                return { success: true, msg: "Guide history fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching guide history:", error);
            return { success: false, msg: "Failed to fetch guide history due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 7: Get all today bookings
    const getTodayBookings = async () => {
        setIsLoading(true);

        try {
            const result = await GetTodayBookings();
            console.log(result);

            if (result.success) {
                return { success: true, msg: "Today bookings fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching today bookings:", error);
            return { success: false, msg: "Failed to fetch today bookings due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 8: Get revenue stats
    const getRevenueStats = async () => {
        setIsLoading(true);

        try {
            const result = await GetRevenueStats();
            console.log(result);

            if (result.success) {
                // Set revenue data
                setRevenueData(result.stats);

                return { success: true, msg: "Revenue stats fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching revenue stats:", error);
            return { success: false, msg: "Failed to fetch revenue stats due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 9: Get guides stats
    const getGuideStats = async (userId) => {
        try {
            const result = await GetGuidesStats(userId);
            console.log(result);

            if (result.success) {
                setGuideStats(result.stats);

                return { success: true, stats: result.stats, msg: "Guides stats fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching guides stats:", error);
            return { success: false, msg: "Failed to fetch guides stats due to a server error." };
        }
    }

    // Function 10: Handle active requests
    const handleActiveRequests = async (userId) => {
        try {
            const result = await GetActiveRequests(userId);
            console.log(result);

            if (result.success) {
                setActiveRequests(result.requests);

                return { success: true, msg: "Active requests fetched successfully.", requests: result.requests };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching active requests:", error);
            return { success: false, msg: "Failed to fetch active requests due to a server error." };
        }
    }

    // Function 11: Mark tour as completed
    const markTourAsCompleted = async (bookingId, pin) => {
        setIsLoading(true);

        try {
            const result = await MarkTourAsCompleted(bookingId, pin);
            console.log(result);

            if (result.success) {
                return { success: true, msg: "Tour marked as completed successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error marking tour as completed:", error);
            return { success: false, msg: "Failed to mark tour as completed due to a server error." };
        } finally {
            setIsLoading(false);
        }
    }

    // Function 12: Get recent activities
    const getRecentActivities = async (userId) => {
        try {
            const result = await GetRecentActivities(userId);
            console.log(result);

            if (result.success) {
                // Set activities
                setActivities(result.activities);

                return { success: true, msg: "Recent activities fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching recent activities:", error);
            return { success: false, msg: "Failed to fetch recent activities due to a server error." };
        }
    }

    // Function 13: Get booking activity log
    const getBookingActivityLog = async (bookingId) => {
        try {
            const result = await GetBookingActivityLog(bookingId);
            console.log(result);

            if (result.success) {
                return { success: true, msg: "Booking activity log fetched successfully.", result: result };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error("Error fetching booking activity log:", error);
            return { success: false, msg: "Failed to fetch booking activity log due to a server error." };
        }
    }

    const value = {
        createBookingOrder,
        verifyPayment,
        guideAcceptsRejectsRequests,
        getAllBookings,
        getTouristHistory,
        getGuideHistory,
        getTodayBookings,
        getRevenueStats,
        getGuideStats,
        handleActiveRequests,
        getRecentActivities,
        getBookingActivityLog,
        markTourAsCompleted,
        isLoading,
        guideStats,
        activeRequests,
        activities,
        guideHistory,
        revenueData
    }

    return (
        <BookingContext.Provider value={value}>
            {props.children}
        </BookingContext.Provider>
    )
}

export default BookingState
