import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance for reuse
const api = axios.create({
    baseURL: `${API_URL}/api/gallery`,
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

// API 1: Upload gallery image
export const UploadGalleryImage = async (bookingId, galleryFormData) => {
    try {
        const response = await api.post(`/upload/${bookingId}`, galleryFormData);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to upload gallery image due to a server error." };
    }
}

// API 2: Delete gallery image
export const DeleteGalleryImage = async (id) => {
    try {
        const response = await api.delete(`/delete/${id}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to delete gallery image due to a server error." };
    }
}

// API 3: Get all gallery images by GET "/api/gallery/all-moments"
export const GetAllGalleryImages = async () => {
    try {
        const response = await api.get('/all-moments');
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to get all gallery images due to a server error." };
    }
}

// API 4: Get gallery images based on category
export const GetGalleryImagesByCategory = async (category) => {
    try {
        const response = await api.get(`/moments/${category}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to get gallery images by category due to a server error." };
    }
}