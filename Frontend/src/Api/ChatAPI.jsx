import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance for reuse
const api = axios.create({
    baseURL: `${API_URL}/api/chat`,
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


// API 1: Create a new conversation 
export const CreateNewConversation = async (receiverId) => {
    try {
        const response = await api.post("/newconversation", { receiverId });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// API 2: Save message
export const SaveMessage = async (formData) => {
    try {
        const response = await api.post("/savemessage", formData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// API 3: Get my conversations
export const GetMyConversations = async () => {
    try {
        const response = await api.get("/myconversations");
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// API 4: Get messages for a conversation
export const GetMessages = async (conversationId) => {
    try {
        const response = await api.get(`/getmessages/${conversationId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// API 5: Mark all messages in a conversation as read
export const MarkAllMessagesAsRead = async (conversationId) => {
    try {
        const response = await api.put(`/markasread/${conversationId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}