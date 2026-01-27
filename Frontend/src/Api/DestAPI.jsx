import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance for reuse
const api = axios.create({
    baseURL: `${API_URL}/api/destinations`,
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

// Get all destinations api
export const GetAllDestinations = async () => {
    try {
        const response = await api.get('/alldestinations');
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch destinations due to a server error." };
    }
}

// Add a destination api (Admin only)
export const AddDestination = async (destinationData) => {
    try {
        const response = await api.post('/adddestinations', destinationData);

        console.log("Token used in AddDestination API call:", localStorage.getItem('authToken'));
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to add destination due to a server error." };
    }
}

// Update a destination api (Admin only)
export const UpdateDestination = async (destinationId, updatedData) => {
    try {
        const response = await api.put(`/updatedestinations/${destinationId}`, updatedData);

        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to update destination due to a server error." };
    }
}

// Delete a destination api (Admin only)
export const DeleteDestination = async (destinationId) => {
    try {
        const response = await api.delete(`/deletedestinations/${destinationId}`);

        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to delete destination due to a server error." };
    }
}