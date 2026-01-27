import React, { useState } from 'react'
import AuthContext from './AuthContext';
import { Login, Register, ForgotPassword, VerifyOTP, ResetPassword, GoogleLogin } from '../../Api/AuthAPI';

const AuthState = (props) => {
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [email, setEmail] = useState(localStorage.getItem('email'));

    // Helper to store the token and role in both state and localStorage
    const setAuthData = (token, role, username, userId, email) => {
        setAuthToken(token);
        setUserRole(role);
        setUsername(username);
        setUserId(userId);
        setEmail(email);

        // Storing token, role, username and userId in localStorage for session persistence
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        
    }

    // Login handle
    const userLogin = async (loginIdentifier, password) => {
        setIsLoading(true);

        try {
            const result = await Login(loginIdentifier, password);
            console.log(result);

            if (result.success) {
                // Store token AND role
                setAuthData(result.authToken, result.role, result.username, result.userId, result.email);

                // return message after succesful login of user
                return { success: true, msg: "You’ve successfully logged in. Let's get started!", role: result.role };

            } else {
                return { success: false, msg: result.error };
            }

        } catch (error) {
            console.error(error);
            return { success: false, msg: "Something went wrong in Log in. Please try again." };
        } finally {
            setIsLoading(false);
        }
    }

    // Register handle
    const userRegister = async (username, email, password) => {
        setIsLoading(true);

        try {
            const result = await Register(username, email, password);
            console.log(result);

            if (result.success) {
                // Store token AND role (default will be 'tourist')
                setAuthData(result.authToken, result.role, result.username, result.userId, result.email);

                // return message after succesful register of user
                return { success: true, msg: <span>Welcome, <strong>{result.username}!</strong> Your account was successfully created</span>, role: result.role };

            } else {
                return { success: false, msg: result.error };
            }

        } catch (error) {
            console.error(error);
            return { success: false, msg: "Something went wrong in Register. Please try again." };
        } finally {
            setIsLoading(false);
        }
    }

    // Forgot Password handle
    const forgotPassword = async (email) => {
        setIsLoading(true);

        try {
            const result = await ForgotPassword(email);
            console.log(result);

            if (result.success) {
                return { success: true, msg: result.msg };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error(error);
            return { success: false, msg: "Something went wrong in forgot password. Please try again." };
        } finally {
            setIsLoading(false);
        }
    }

    // Verify OTP handle
    const verifyOTP = async (email, otp) => {
        setIsLoading(true);

        try {
            const result = await VerifyOTP(email, otp);
            console.log(result);

            if (result.success) {
                return { success: true, msg: result.msg };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error(error);
            return { success: false, msg: "Something went wrong in verify OTP. Please try again." };
        } finally {
            setIsLoading(false);
        }
    }

    // Reset Password handle
    const resetPassword = async (email, newPassword) => {
        setIsLoading(true);

        try {
            const result = await ResetPassword(email, newPassword);
            console.log(result);

            if (result.success) {
                return { success: true, msg: result.msg };
            } else {
                return { success: false, msg: result.error };
            }
        } catch (error) {
            console.error(error);
            return { success: false, msg: "Something went wrong in reset password. Please try again." };
        } finally {
            setIsLoading(false);
        }
    }

    // handle Google login
    const googleLogin = async (authResult) => {
        setIsLoading(true);

        try {
            console.log(authResult);

            // Ensure you have the code, but don't exit the entire function logic immediately
            if (!authResult.code) {
                throw new Error("Authorization code not found in result.");
            }

            const result = await GoogleLogin(authResult.code);
            console.log("Google login response: ", result);

            if (result.success) {
                setAuthData(result.authToken, result.role, result.username, result.userId);

                return { success: true, msg: "You've successfully logged in with Google. Let's get started!", role: result.role };
            } else {
                return { success: false, msg: result.error };
            }

        } catch (error) {
            console.error(error);
            return { success: false, msg: "Something went wrong in Google login. Please try again." };
        } finally {
            setIsLoading(false);
        }
    }

    // Handle logout
    const userLogout = () => {
        setAuthToken(null);
        setUserRole(null);
        setUsername(null);
        setEmail(null);
        setUserId(null);
        localStorage.clear();
    }

    const value = {
        userLogin,
        userRegister,
        userLogout,
        forgotPassword,
        verifyOTP,
        resetPassword,
        googleLogin,
        userRole,
        authToken,
        username,
        userId,
        email,
        isLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState
