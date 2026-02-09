import React, { useContext } from 'react'
import SearchBar from './SearchBar';
import TopDestinations from './TopDestinations';
import Gallery from './Gallery';
import ValueProposition from './ValueProposition';
import Guide from './Guide';
import TopReview from './TopReview';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AuthContext from '../Context/Authentication/AuthContext';
import AdminHome from './Admin Protal/AdminHome';
import GuideDashboard from './Guides Protal/GuideDashboard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

// Background images
import bgImg1 from './Images/bg1.jpg';
import bgImg2 from './Images/bg2.jpg';
import bgImg3 from './Images/bg3.jpg';
import bgImg4 from './Images/bg4.jpg';
import bgImg5 from './Images/bg5.jpg';
import bgImg6 from './Images/bg6.jpg';
import bgImg7 from './Images/bg7.jpg';

const Home = () => {
    const navigate = useNavigate();
    const images = [
        { url: bgImg1 },
        { url: bgImg2 },
        { url: bgImg3 },
        { url: bgImg4 },
        { url: bgImg5 },
        { url: bgImg6 },
        { url: bgImg7 },
    ];

    const { authToken, userRole } = useContext(AuthContext);

    // Check if user is admin or not
    if (authToken && userRole === "admin") {
        return <AdminHome />;
    }

    if (authToken && (userRole === "approved_guide" || userRole === "pending_guide")) {
        return <GuideDashboard />;
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        fade: true,
        arrows: false
    };

    return (
        <div>
            {/* Top background */}
            <div className="relative">
                {/* Silder image background */}
                <Slider {...settings}>
                    {images.map((img, index) => (
                        <div key={index}>
                            <img src={img.url} alt="" className="w-full h-[400px] lg:h-[600px] object-cover rounded-2xl select-none pointer-events-none" />
                        </div>
                    ))}
                </Slider>

                <div className="absolute flex flex-col justify-center items-center w-full text-white bottom-2/5">
                    <motion.h2
                        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ type: "spring", stiffness: 100, duration: 0.8 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black mb-3"
                    >
                        Discover the World with <span className="block text-center text-[#359ec8]">Absolute Precision.</span>
                    </motion.h2>
                    <motion.button
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        type="button"
                        className="font-bold text-lg lg:text-xl rounded-lg cursor-pointer px-5 py-2 lg:px-8.5 lg:py-3 bg-[#00C4CC] text-[#121827] shadow-lg shadow-[#00C4CC]/30 hover:bg-cyan-400 transition duration-150"
                        onClick={() => {
                            navigate('/destination');

                            // Scroll to top when switching views
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        Find Your Dream Tour
                    </motion.button>
                </div>
            </div>

            {/* Search bar */}
            <SearchBar />

            {/* Top Destinations */}
            <TopDestinations />

            {/* Gallery */}
            <Gallery />

            {/* Value proposition */}
            <ValueProposition />

            {/* Guide Portal */}
            <Guide />

            {/* Top Reviews */}
            <TopReview />
        </div>
    )
}

export default Home
