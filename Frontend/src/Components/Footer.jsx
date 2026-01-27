import React, { useContext } from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import DestinationsContext from '../Context/Destinations/DestinationsContext';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const { setSelectedType } = useContext(DestinationsContext);
    const navigate = useNavigate();

    // Handle current tour type for styling
    const handleTourType = (type) => {
        setSelectedType(type);

        console.log("Footer type: ", type);
        navigate('/destination');

        // Scroll to top when switching views
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="py-8 md:py-10 lg:py-12 bg-[#0F172A] border-t border-gray-800 px-4">
            <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-20 grid grid-cols-2 md:grid-cols-4">
                {/* Column 1: TravelTrack */}
                <div className="mb-8 lg:mb-0">
                    <h4 className="font-bold text-xl mb-4 text-[#00C4CC]">TourGuy</h4>
                    <ul className="space-y-2 text-base text-gray-400">
                        {[
                            {name: 'Why Us?', path: '/whyus'}, 
                            {name: 'Help & Support', path: '/support'}, 
                            {name: 'Security Policy', path: '#'}
                        ].map(item => (
                            <li key={item.name}><a href={item.path} className="hover:text-[#00C4CC]">{item.name}</a></li>
                        ))}
                    </ul>
                </div>
                {/* Column 2: Tours */}
                <div>
                    <h4 className="font-bold text-xl mb-4 text-[#00C4CC]">Tours</h4>
                    <ul className="space-y-2 text-base text-gray-400">
                        <li><button onClick={() => handleTourType('National')}  className="hover:text-[#00C4CC] cursor-pointer">National</button></li> 
                        <li><button onClick={() => handleTourType('International')}  className="hover:text-[#00C4CC] cursor-pointer">International</button></li>
                        <li><a href='/bookinghistory'  className="hover:text-[#00C4CC]">Booking History</a></li>                       
                    </ul>
                </div>
                {/* Column 3: Guides */}
                <div>
                    <h4 className="font-bold text-xl mb-4 text-[#00C4CC]">Guides</h4>
                    <ul className="space-y-2 text-base text-gray-400">
                        {[
                            {name: 'Guide Login', path: '/login'}, 
                            {name: 'Apply to Guide', path: '/guides'}, 
                            {name: 'Guide Support', path: '/support'}
                        ].map(item => (
                            <li key={item.name}><a href={item.path} className="hover:text-[#00C4CC]">{item.name}</a></li>
                        ))}
                    </ul>
                </div>
                {/* Column 4: Connect */}
                <div>
                    <h4 className="font-bold text-xl mb-4 text-[#00C4CC]">Connect</h4>
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="text-gray-400 text-2xl hover:text-[#00C4CC] transition duration-150">
                            <FaFacebook />
                        </a>
                        <a href="#" className="text-gray-400 text-2xl hover:text-[#00C4CC] transition duration-150">
                            <FaTwitter />
                        </a>
                        <a href="#" className="text-gray-400 text-2xl hover:text-[#00C4CC] transition duration-150">
                            <FaInstagram />
                        </a>
                        <a href="https://www.linkedin.com/in/sayandeep-bera-6560222b9" className="text-gray-400 text-2xl hover:text-[#00C4CC] transition duration-150">
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center text-base text-gray-500 mt-12">
                &copy; 2025 TourGuy. Cinematic Precision.
            </div>
        </div>
    )
}

export default Footer
