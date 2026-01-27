import React, { useState, useContext } from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import AuthContext from '../Context/Authentication/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [credentials, setCredentials] = useState({ newPassword: "", confirmPassword: "" });
    const [message, setMessage] = useState("");
    const [msgColor, setMsgColor] = useState(false);
    const { resetPassword, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const { token } = useParams();

    // Helper to control message display time
    const hideMessage = () => {
        setTimeout(() => {
            setMessage("");
        }, 5000);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Clear previous messages immediately on submission
        setMessage("");
        setMsgColor(false);

        if (credentials.newPassword !== credentials.confirmPassword) {
            setMessage("Passwords do not match. Please try again.")
            setMsgColor(false);

            // Hide message after 5 seconds
            hideMessage();

            return;
        }

        // API call
        const resetPasswordResult = await resetPassword(token, credentials.newPassword, credentials.confirmPassword);
        console.log(resetPasswordResult);

        setMessage(resetPasswordResult.msg);
        setMsgColor(resetPasswordResult.success);

        // Hide message after 5 seconds
        hideMessage();

        if (resetPasswordResult.success) {
            // Clear the sensitive fields immediately after success
            setCredentials({ newPassword: "", confirmPassword: "" });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    }
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-[8px] z-1000">
            <div className="bg-[#081b29] text-white border-2 border-[#0ef] rounded-2xl p-8 w-[90%] max-w-112.5 shadow-2xl shadow-[#0ef]">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl">Reset Password</h2>
                </div>

                <form className="modal-body" onSubmit={handleResetPassword}>
                    <p className="text-gray-400 mb-6 text-[1.03rem]">
                        Enter a new strong password below to change your password
                    </p>

                    {/* New Password Field */}
                    <div className="input-box relative my-9 w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            id="newPassword"
                            value={credentials.newPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                        <label htmlFor="newPassword" className="form-label z-1!">New Password</label>

                        {/* 👁 Eye Icon for toggle */}
                        <span onClick={() => setShowPassword((prev) => !prev)} className="cursor-pointer" >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="input-box relative mt-6 mb-3 w-full">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            value={credentials.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                        <label htmlFor="confirmPassword" className="form-label z-1!">Confirm Password</label>

                        {/* 👁 Eye Icon for toggle */}
                        <span onClick={() => setShowConfirmPassword((prev) => !prev)} className="cursor-pointer" >
                            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <p className={`text-sm ${msgColor ? "text-green-400" : "text-red-400"} h-5 mb-3`}>{message}</p>

                    <button type="submit" disabled={isLoading} className="form-btn w-full cursor-pointer">{isLoading ? "Resetting..." : "Reset Password"}</button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
