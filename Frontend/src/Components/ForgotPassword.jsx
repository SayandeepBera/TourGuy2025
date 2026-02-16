import React, { useState, useContext } from 'react'
import { MdEmail } from 'react-icons/md';
import { FaEyeSlash, FaEye, FaKey } from 'react-icons/fa';
import AuthContext from '../Context/Authentication/AuthContext';
import { ImSpinner9 } from "react-icons/im";

const ForgotPassword = ({ isVisible, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [showPass, setShowPass] = useState(false);
    const [message, setMessage] = useState({ text: "", isSuccess: false });

    const { forgotPassword, verifyOTP, resetPassword, isLoading } = useContext(AuthContext);

    // Send OTP to Email
    const handleSendOTP = async (e) => {
        e.preventDefault();

        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setMessage({ text: result.msg, isSuccess: true });
                setStep(2); // Move to OTP entry
            } else {
                setMessage({ text: result.error, isSuccess: false });
            }
        } catch (error) {
            setMessage({ text: "Error sending OTP.", isSuccess: false });
        }
    };

    // Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        // Check OTP length
        if (otp.length !== 6) {
            return setMessage({ text: "Enter valid 6-digit OTP", isSuccess: false });
        }

        try {
            const result = await verifyOTP(email, otp);
            if (result.success) {
                setMessage({ text: result.msg, isSuccess: true });
                setStep(3);
            } else {
                setMessage({ text: result.error, isSuccess: false });
            }
        } catch (error) {
            setMessage({ text: "Error verifying OTP.", isSuccess: false });
        }
    };

    // Reset all states
    const resetForm = () => {
        setStep(1);
        setEmail("");
        setOtp("");
        setPasswords({ newPassword: "", confirmPassword: "" });
        setShowPass(false);
        setMessage({ text: "", isSuccess: false });
    };


    // Final Reset call
    const handleReset = async (e) => {
        e.preventDefault();

        // Check passwords match
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMessage({ text: "Passwords do not match", isSuccess: false });
        }

        try {
            const result = await resetPassword(email, passwords.newPassword);
            if (result.success) {
                setMessage({ text: result.msg, isSuccess: true });
                setTimeout(() => {
                    onClose();
                    resetForm();
                }, 500);
            } else {
                // If OTP was wrong, the backend will catch it here
                setMessage({ text: result.error, isSuccess: false });
            }
        } catch (error) {
            setMessage({ text: "Reset failed. Please try again.", isSuccess: false });
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-[8px] z-1000">
            <div className="bg-[#081b29] text-white border-2 border-[#0ef] rounded-2xl p-8 w-[90%] max-w-112.5 shadow-2xl shadow-[#0ef]">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl">
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verify OTP"}
                        {step === 3 && "Set New Password"}
                    </h2>
                    <button onClick={onClose} className="text-[2rem] cursor-pointer">&times;</button>
                </div>

                {/* EMAIL FORM */}
                {step === 1 && (
                    <form onSubmit={handleSendOTP}>
                        <p className="text-gray-400 mb-6">Enter email to receive a 6-digit OTP.</p>
                        <div className="input-box relative mt-9 mb-3">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <label className="form-label z-0!">Email Address</label>
                            <MdEmail />
                        </div>
                        <button type="submit" disabled={isLoading} className="form-btn w-full mt-3 cursor-pointer">
                            {isLoading ? <span className="flex items-center justify-center gap-2"><ImSpinner9 className="animate-spin mx-auto" /> Sending... </span> : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* OTP FORM */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP}>
                        <p className="text-gray-400 mb-6">Check your email: <b>{email}</b></p>
                        <div className="input-box relative mt-6 mb-3">
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
                            <label className="form-label">6-Digit OTP</label>
                            <FaKey />
                        </div>
                        <button type="submit" className="form-btn w-full mt-3 cursor-pointer">Verify OTP</button>
                        <p className="text-sm text-center mt-3 cursor-pointer text-[#0ef]" onClick={() => forgotPassword(email)}>Resend OTP</p>
                    </form>
                )}

                {/* PASSWORD FORM */}
                {step === 3 && (
                    <form onSubmit={handleReset}>
                        <div className="input-box relative mt-6 mb-3">
                            <input type={showPass ? "text" : "password"} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required />
                            <label className="form-label z-0!">New Password</label>
                            <span onClick={() => setShowPass(!showPass)} className="cursor-pointer">
                                {showPass ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        <div className="input-box relative mt-6 mb-3">
                            <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
                            <label className="form-label z-0!">Confirm Password</label>
                        </div>
                        <button type="submit" disabled={isLoading} className="form-btn w-full mt-3 cursor-pointer">
                            {isLoading ? <span className="flex items-center justify-center gap-2"><ImSpinner9 className="animate-spin mx-auto" /> Reseting... </span> : "Reset Password"}
                        </button>
                    </form>
                )}

                <p className={`mt-4 text-center ${message.isSuccess ? "text-green-400" : "text-red-400"}`}>{message.text}</p>
            </div>
        </div>
    );
};

export default ForgotPassword;