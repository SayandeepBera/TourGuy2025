import React, { useContext, useEffect, useState } from 'react'
import '../SignUpLogin.css';
import { FcGoogle } from 'react-icons/fc';
import { FaUser, FaEyeSlash, FaEye } from 'react-icons/fa';
import ForgotPassword from './ForgotPassword';
import AuthContext from '../Context/Authentication/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { ImSpinner9 } from "react-icons/im";

const Login = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [credentials, setCredentials] = useState({ loginIdentifier: "", password: "" });
    const { userLogin, isLoading, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for session expiry message in URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if(params.get('message') === 'session_expired'){
            toast.warn("Session expired. Please log in again to continue.", {
                theme: "colored",
                toastId: "session-expiry-toast" // Prevent duplicate toasts
            })

            // Clean the URL so the message doesn't show again on reload
            navigate('/login', { replace: true });
        }
    }, [location, navigate]);

    // Toggle function for password
    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    // Login form submission function
    const handleLoginForm = async (e) => {
        e.preventDefault();

        const loginResult = await userLogin(credentials.loginIdentifier, credentials.password);
        console.log(loginResult);

        if (loginResult.success) {
            toast.success(loginResult.msg, {
                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
            })

            navigate('/');
        } else {
            toast.error(loginResult.msg || "Invalide credentials. Please try again.", {
                theme: "colored"
            })
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        // Prevent spaces in username
        if (name === "loginIdentifier" && value.includes(" ")) return;

        setCredentials({ ...credentials, [name]: value });
    }

    // Google login function
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (authResult) => {
            const googleLoginResult = await googleLogin(authResult);
            console.log(googleLoginResult);

            if (googleLoginResult.success) {
                toast.success(googleLoginResult.msg, {
                    style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
                })

                // Allows React/browser time to fully process the state update
                setTimeout(() => {
                    window.location.replace('/');
                }, 3000);

            } else {
                toast.error(googleLoginResult.msg || "Google login failed. Please try again.", {
                    theme: "colored"
                })

                console.error("Google login error: ", googleLoginResult.error);
            }
        },
        onError: (errorResponse) => {
            toast.error("Google login failed. Please try again.");
            console.error("Google login failed: ", errorResponse);
        },

        flow: 'auth-code',
    })

    return (
        <>
            {/* login left side content */}
            <form className="form-box login text-white" onSubmit={handleLoginForm}>
                <h1 className="text-[2.5rem] font-bold text-center animation" style={{ "--i": 0, "--j": 22 }}>Login</h1>
                <div className="input-box animation relative my-9" style={{ "--i": 1, "--j": 23 }}>
                    <input type="text" name="loginIdentifier" id="loginIdentifier" value={credentials.loginIdentifier} onChange={handleChange} autoComplete="username" required />
                    <label htmlFor="loginIdentifier" className="form-label">Username or Email</label>
                    <FaUser />
                </div>

                <div className="input-box animation relative mb-2" style={{ "--i": 2, "--j": 24 }}>
                    <input type={showPassword ? "text" : "password"} name="password" id="loginPassword" value={credentials.password} onChange={handleChange} minLength={5} autoComplete="current-password" required />
                    <label htmlFor="password" className="form-label">Password</label>

                    {/* 👁 Eye Icon for toggle */}
                    <span onClick={togglePassword} className="cursor-pointer" >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                </div>

                <div className="forgot-link animation mb-4" style={{ "--i": 3, "--j": 25 }}>
                    <span
                        className="cursor-pointer decoration-0 text-[1.03rem]"
                        onClick={() => setIsModalOpen(true)} // Open modal on click
                    >
                        Forgot Password?
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`form-btn animation ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    style={{ "--i": 4, "--j": 26 }}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <ImSpinner9 className="animate-spin" /> Logging in...
                        </span>
                    ) : (
                        "Login"
                    )}
                </button>

                <div className="social-platform animation mt-2" style={{ "--i": 5, "--j": 27 }}>
                    <p className="mb-4 text-[1.03rem]">or login with social platforms</p>
                    <div className="social-icons">
                        <button type="button" className="social-btn" onClick={handleGoogleLogin}>
                            <FcGoogle className="mr-3 text-2xl" /> Continue with Google
                        </button>
                    </div>
                </div>
            </form>

            {/* login right side content */}
            <div className="info-text login text-white">
                <div className="pl-5 transform -translate-y-22.5">
                    <h2 className="animation uppercase font-bold text-[32px]" style={{ "--i": 0, "--j": 20 }}>Welcome Back</h2>
                    <p className="animation text-[1.03rem]" style={{ "--i": 1, "--j": 21 }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore tenetur dolore vel obcaecati quos.</p>
                </div>
                <div className="transform -translate-y-16.5 flex flex-col items-center pl-25">
                    <p className="animation text-[1.03rem] mb-2" style={{ "--i": 2, "--j": 22 }}>Don't have an account?</p>
                    <button type="submit" className="form-btn btn2 animation cursor-pointer" style={{ "--i": 3, "--j": 23 }} onClick={() => props.setToggleAnimation(true)}>Sign Up</button>
                </div>
            </div>

            {/* Forgot Password Modal Render */}
            <ForgotPassword
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}

export default Login
