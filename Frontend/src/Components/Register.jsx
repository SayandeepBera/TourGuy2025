import React, { useState, useContext } from 'react';
import '../SignUpLogin.css';
import { MdEmail } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthContext from '../Context/Authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { ImSpinner9 } from "react-icons/im";

const Register = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
  const { userRegister, isLoading, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Toggle function for password
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  }

  // register form submission function
  const handleRegisterForm = async (e) => {
    e.preventDefault();

    const registerResult = await userRegister(credentials.username, credentials.email, credentials.password);
    console.log(registerResult);

    if (registerResult.success) {
      toast.success(registerResult.msg, {
        style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
      })

      navigate('/');
    } else {
      toast.error(registerResult.msg || "Registration failed. Please try again.", {
        theme: "colored"
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent spaces in username
    if (name === "username" && value.includes(" ")) return;

    setCredentials({ ...credentials, [name]: value });
  }

  // Google login
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
        });

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
      {/* Register left side content */}
      <div className="info-text register text-white">
        <div className="transform -translate-y-22.5 pr-7.5">
          <h2 className="animation uppercase font-bold text-[32px]" style={{ "--i": 17, "--j": 0 }}>Welcome Back</h2>
          <p className="animation text-[1.03rem]" style={{ "--i": 18, "--j": 1 }}>Discover unique destinations, connect with trusted local guides, and
            experience travel like never before. Your next unforgettable journey
            starts here with TourGuy.</p>
        </div>
        <div className="transform -translate-y-16.5 flex flex-col items-center pr-22.5" >
          <p className="animation text-[1.03rem] mb-2" style={{ "--i": 19, "--j": 2 }}>Already have an account?</p>
          <button type="submit" className="form-btn btn2 animation cursor-pointer" style={{ "--i": 20, "--j": 3 }} onClick={() => props.setToggleAnimation(false)}>Sign In</button>
        </div>
      </div>

      {/* register right side content */}
      <form className="form-box register text-white" onSubmit={handleRegisterForm}>
        <h1 className="text-[2.5rem] text-center animation mb-4 font-bold" style={{ "--i": 17, "--j": 0 }}>Register</h1>
        <div className="input-box animation relative mb-8" style={{ "--i": 18, "--j": 1 }}>
          <input type="text" name="username" id="registerUsername" value={credentials.username} onChange={handleChange} minLength={3} autoComplete="username" required />
          <label htmlFor="username" className="form-label">Username</label>
          <FaUser />
        </div>
        <div className="input-box animation relative mb-8" style={{ "--i": 19, "--j": 2 }}>
          <input type="email" name="email" id="registerEmail" value={credentials.email} onChange={handleChange} autoComplete="email" required />
          <label htmlFor="email" className="form-label">Email</label>
          <MdEmail />
        </div>
        <div className="input-box animation relative mb-8" style={{ "--i": 20, "--j": 3 }}>
          <input type={`${showPassword ? "text" : "password"}`} name="password" id="registerPassword" value={credentials.password} onChange={handleChange} minLength={5} autoComplete="current-password" required />
          <label htmlFor="password" className="form-label">Password</label>

          {/* 👁 Eye Icon for toggle */}
          <span className="cursor-pointer" onClick={togglePassword}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`form-btn text-white animation ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          style={{ "--i": 22, "--j": 5 }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <ImSpinner9 className="animate-spin" /> Registering...
            </span>
          ) : (
            "Register"
          )}
        </button>

        {/* Social media icons */}
        <div className="social-platform mt-2 animation" style={{ "--i": 23, "--j": 6 }}>
          <p className="mb-4 text-[1.03rem]">or login with social platforms</p>
          <div className="social-icons">
            <button type="button" className="social-btn" onClick={handleGoogleLogin}>
              <FcGoogle className="mr-3 text-2xl" /> Continue with Google
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default Register
