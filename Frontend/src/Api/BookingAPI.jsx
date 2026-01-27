import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance for reuse
const api = axios.create({
    baseURL: `${API_URL}/api/booking`,
});

// This interceptor will add the token to the request headers if it exists in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if(token){
        config.headers['auth-token'] = token;
    }

    return config;
}, (error) =>{
    return Promise.reject(error);
});

// API 1: Create Booking Order
export const CreateBookingOrder = async (amount) => {
    try {
        const response = await api.post('/create-order', { amount });
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to create booking order due to a server error." };
    }
}

// API 2: Verify Payment for booking
export const VerifyPayment = async (formData) => {
    try {
        const response = await api.post('/verify-payment', formData);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to verify payment due to a server error." };
    }
}

// API 3: Guide accepts or rejects requests handle
export const GuideAcceptsRejectsRequests = async ({ bookingId, action, destinationName }) => {
    try {
        const response = await api.patch(`/handle-request/${bookingId}`, { action, destinationName });
        return response.data;
    } catch (error) {
        return { success: false, error : error.response?.data?.error || "Failed to handle request due to a server error." }
    }
}

// API 4: Get all bookings (Admin only)
export const GetAllBookings = async () => {
    try {
        const response = await api.get('/all-bookings');
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch bookings due to a server error." };
    }
}

// API 5: Get tourist history
export const GetTouristHistory = async (touristId) => {
    try {
        const response = await api.get(`/tourist-history/${touristId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch tourist history due to a server error." };
    }
}

// API 6: Get Guide history
export const GetGuideHistory = async (userId) => {
    try {
        const response = await api.get(`/guide-history/${userId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch guide history due to a server error." };
    }
}

// API 7: Get all today bookings (Admin only)
export const GetTodayBookings = async () => {
    try {
        const response = await api.get('/today-bookings');
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch today bookings due to a server error." };
    }
}

// API 8: Get Revenue & Trends (Admin only)
export const GetRevenueStats = async () => {
    try {
        const response = await api.get('/revenue-stats');
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch revenue stats due to a server error." };
    }
}

// API 9: Get guides stats
export const GetGuidesStats = async (userId) => {
    try {
        const response = await api.get(`/guide-stats/${userId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch guides stats due to a server error." };
    }
}

// API 10: Get active (pending) requests for a specific guide
export const GetActiveRequests = async (userId) => {
    try {
        const response = await api.get(`/active-requests/${userId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch active requests due to a server error." };
    }
}

// API 11: Mark tour as Completed and update guide stats
export const MarkTourAsCompleted = async (bookingId, pin) => {
    try {
        const response = await api.patch(`/complete-tour/${bookingId}`, { pin });
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to mark tour as completed due to a server error." };
    }
}

// API 12: Get guide recent activities
export const GetRecentActivities = async (userId) => {
    try {
        const response = await api.get(`/recent-activity/${userId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch recent activities due to a server error." };
    }
}

// API 13: Get booking activity log (Admin only)
export const GetBookingActivityLog = async (bookingId) => {
    try {
        const response = await api.get(`/activity-log/${bookingId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch activity log due to a server error." };
    }
}