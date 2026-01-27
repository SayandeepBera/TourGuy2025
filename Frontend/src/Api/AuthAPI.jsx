import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance for reuse
const api = axios.create({ 
    baseURL: `${API_URL}/api/auth`,
    headers: { "Content-type": "application/json" }, 
});

// This interceptor will add the token to the request headers if it exists in localStorage
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally
        if(error.response && error.response.status === 401){
            localStorage.clear();

            // Redirect to login page with session expired message
            window.location.href = '/login?message=session_expired';
        }

        return Promise.reject(error);
    }
)

// Login api
export const Login = async (loginIdentifier, password) => {
    try {
        // Convert loginIdentifier to lowercase for match backend field name
        const santizedIdentifier = loginIdentifier.toLowerCase();

        const response = await api.post ('/login', { 
            loginIdentifier: santizedIdentifier, 
            password: password 
        });
        return response.data;

    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Login failed due to a server error." }
    }
}

// Register api
export const Register = async (username, email, password) => {
    try {
        const response = await api.post ('/register', { username, email, password });
        return response.data;

    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Registration failed due to a server error." };
    }
}

// Forgot password api
export const ForgotPassword = async (email) => {
    try {
        const response = await api.post ('/forgot-password', { email });
        return response.data;

    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Password reset failed due to a server error." };
    }
}

// Verify OTP api
export const VerifyOTP = async (email, otp) => {
    try {
        const response = await api.post ('/verify-otp', { email, otp });
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Password reset failed due to a server error." };
    }
}

// Reset password api
export const ResetPassword = async (email, newPassword) => {
    try {
        const response = await api.post ('/reset-password', { email, newPassword });
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Password reset failed due to a server error." };
    }
}

// Google login
export const GoogleLogin = async (code) => {
    try {
        const response = await api.get(`/google-login?code=${code}`);
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Google login failed due to a server error." };
    }
}