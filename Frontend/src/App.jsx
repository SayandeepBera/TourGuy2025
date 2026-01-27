import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Layout from "./Components/Layout";
import { ToastContainer } from "react-toastify";

import AuthState from "./Context/Authentication/AuthState";
import DestinationsState from "./Context/Destinations/DestinationsState";
import BookingState from "./Context/Booking/BookingState";
import ProfileState from "./Context/Profile/ProfileState";
import GuidesState from "./Context/Guides/GuidesState";
import GalleryState from "./Context/Gallery/GalleryState";

import AnimatedRoutes from "./Routes/AnimatedRoutes";
import ConciergeState from "./Context/Concierge/ConciergeState";
import ChatState from "./Context/Chat/ChatState";
import ScrollToTop from "./Components/ScrollToTop";

function App() {
  return (
    <ChatState>
      <ConciergeState>
        <GuidesState>
          <GalleryState>
            <DestinationsState>
              <BookingState>
                <ProfileState>
                  <AuthState>
                    <Router>
                      <ScrollToTop />
                      <Navbar />

                      <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        pauseOnHover={false}
                        theme="colored"
                      />

                      <Layout>
                        <main className="mt-[5.3rem] px-4 py-4 bg-[#121827] font-[fangsong] min-h-screen">
                          <AnimatedRoutes />
                        </main>
                      </Layout>
                    </Router>
                  </AuthState>
                </ProfileState>
              </BookingState>
            </DestinationsState>
          </GalleryState>
        </GuidesState>
      </ConciergeState>
    </ChatState>
  );
}

export default App;
