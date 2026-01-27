import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "../Components/Home";
import Destinations from "../Components/Destinations";
import WhyUs from "../Components/WhyUs";
import BecomeAGuide from "../Components/Guides Protal/BecomeAGuide";
import Support from "../Components/Support";
import AdminBookingHistory from "../Components/Admin Protal/AdminBookingHistory";
import LoginRegisterLayout from "../Components/LoginRegisterLayout";
import ResetPassword from "../Components/ResetPassword";
import Profile from "../Components/Profile";
import EditProfile from "../Components/EditProfile";
import BookingHistory from "../Components/User Protal/BookingHistory";
import BookingDetailsView from "../Components/User Protal/BookingDetailsView";
import UploadMoment from "../Components/User Protal/UploadMoment";
import PageNotFound from "../Components/PageNotFound";

import AuthContext from "../Context/Authentication/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Chat from "../Components/Chat";

// GOOGLE AUTH WRAPPER 

const GoogleAuthWrapper = () => (
    <GoogleOAuthProvider clientId="615688822391-gmsluukitpodifi599eqnlcp9vro7uuv.apps.googleusercontent.com">
        <LoginRegisterLayout />
    </GoogleOAuthProvider>
);

// USER ROUTE

const UserRoute = ({ children }) => {
    const { userRole } = useContext(AuthContext);
    return userRole === "admin" ? <Navigate to="/" /> : children;
};

// ANIMATED ROUTES

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/destination" element={<Destinations />} />

                <Route path="/whyus" element={<UserRoute><WhyUs /></UserRoute>} />
                <Route path="/guides" element={<UserRoute><BecomeAGuide /></UserRoute>} />
                <Route path="/support" element={<UserRoute><Support /></UserRoute>} />

                <Route path="/booking" element={<AdminBookingHistory />} />
                <Route path="/login" element={<GoogleAuthWrapper />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/editprofile" element={<EditProfile />} />

                <Route path="/bookinghistory" element={<BookingHistory />} />
                <Route path="/booking-details/:id" element={<BookingDetailsView />} />
                <Route path="/upload-moment/:bookingId" element={<UploadMoment />} />

                <Route path="/chat/:conversationId" element={<Chat />} />
                
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
