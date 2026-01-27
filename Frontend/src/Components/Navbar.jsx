import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../Context/Authentication/AuthContext';
import { FaUserCircle } from "react-icons/fa";
import { LuUserRound, LuHistory, LuUserRoundPen } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";
import { toast } from 'react-toastify';
import logo from './Images/logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { authToken, userLogout, username, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  // State and Ref for the User Dropdown
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Check login status directly from the token
  const isLoggedin = !!authToken;

  // Check if the user is an admin
  const isAdmin = userRole === "admin";

  // Check if the user is guide
  const isGuide = userRole === "approved_guide" || userRole === "pending_guide";

  // Capitalized the username
  const capitalizedUsername = username ? username.charAt(0).toUpperCase() + username.slice(1) : null;

  // Handle logout
  const handleLogout = () => {
    userLogout();
    closeMenus();

    toast.success("Logged out successfully.", {
      style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
    });

    navigate('/');
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigation items based on user role
  const navItems = [
    {
      name: isAdmin || isGuide ? "Dashboard" : "Home",
      path: "/"
    },
    ...(!isGuide ? [{ name: "Destination", path: "/destination" }] : []), // tourist and admin show
    ...(!isAdmin && !isGuide ? [{ name: "Why Us?", path: "/whyus" }] : []), // tourist  show
    ...(!isGuide && !isAdmin ? [{ name: "Guides", path: "/guides" }] : []), // tourist only show
    ...(!isAdmin ? [
      { name: "Support", path: "/support" },
    ] : [
      { name: "Booking", path: "/booking" },
    ]),
  ]

  // Submenu items for logged in users
  const subMenuItems = [
    { name: "Profile", icon: <LuUserRound size={20} className="mr-2" />, path: "/profile" },
    { name: "Edit Profile", icon: <LuUserRoundPen size={20} className="mr-2" />, path: "/editprofile" },
    ...(!isAdmin && !isGuide ? [
      { name: "Booking History", icon: <LuHistory size={20} className="mr-2" />, path: "/bookinghistory" }
    ] : []
    )
  ];

  // Smooth scroll to Top Destinations section
  const scrollToTopDestinations = (e) => {
    e.preventDefault();
    const element = document.getElementById("top-destinations");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    closeMenus();
  }

  // Backdrop for Offcanvas
  const backdropClass = `
      fixed inset-0 bg-opacity-50 z-30 transition-opacity duration-300 lg:hidden
      ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `;

  const mobileMenuClass = `
      fixed top-0 right-0 h-full w-3/4 max-w-xs bg-[#0F172A] shadow-2xl z-40 p-6 
      transform transition-transform duration-300 ease-in-out lg:hidden
      ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
  `;

  // Helper to close both menus simultaneously
  const closeMenus = () => {
    setMenuOpen(false);
    setIsVisible(false);
  };

  return (
    <nav className="bg-[#0F172A] fixed w-full z-2000 top-0 left-0 shadow-xl border-b border-gray-800 font-[fangsong]">
      <div className="container mx-auto flex items-center justify-between px-6 py-5">
        <img src={logo} alt="TourGuy Logo" className="h-12 w-auto ml-2 md:ml-4" />

        {/* Mobile Toggle Button (Menu button) */}
        <button
          className="text-white lg:hidden p-2 rounded focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul className={`hidden lg:flex gap-4 items-center text-lg ${isAdmin || isGuide ? "mr-25" : ""}`}>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`
                  font-semibold px-2 py-2 rounded relative text-[19px]
                  ${location.pathname === item.path ? "text-[#00C4CC] after:w-full" : "text-gray-400"}
                  hover:text-[#00C4CC] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2.9px]
                  after:w-0 after:bg-red-500 after:transition-all after:duration-500 after:ease-in-out
                  hover:after:w-full
                `}
              >
                {item.name}
              </Link>
            </li>
          ))}

          <li className="ml-5">
            {isLoggedin ? (
              // Dropdown container with ref and toggle logic
              <div className="relative text-white mr-2" ref={dropdownRef}>
                <div className="flex cursor-pointer items-center" onClick={() => setIsVisible((prev) => !prev)}>
                  <FaUserCircle size={25} className="bg-[#00C4CC] text-[#121827] hover:bg-cyan-400 rounded-2xl border-2 border-[#00C4CC] mr-2" />
                  <span className="hover:text-[#00C4CC]">{capitalizedUsername}</span>
                </div>

                {isVisible && (
                  <ul className="absolute right-0 mt-4 w-48 bg-[rgb(26,36,55)] border-t-2 border-[#00C4CC] shadow-lg rounded">
                    {subMenuItems.map((item) => (
                      <li key={item.name} className="hover:bg-slate-700 px-3 py-2">
                        <Link to={item.path} onClick={() => setIsVisible(false)} className="flex items-center mb-2">
                          {item.icon} {item.name}
                        </Link>
                      </li>
                    ))}

                    <li className="hover:bg-slate-700 px-3 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center cursor-pointer w-full text-left mb-2"
                      >
                        <TbLogout size={22} className="mr-2" />Sign Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              // Not logged in: Show Sign In link
              <Link to="/login" className="font-semibold px-3 py-2 rounded text-[19px] text-white hover:text-[#00C4CC] hover:bg-gray-700">
                Sign In
              </Link>
            )}
          </li>
          {!isAdmin && !isGuide && (
            <li>
              <a
                href="#top-destinations"
                onClick={scrollToTopDestinations}
                className="px-5 py-2 bg-[#00C4CC] text-[#121827] text-[19px] font-bold rounded-full shadow-lg shadow-[#00C4CC]/30 hover:bg-cyan-400 transition duration-150"
              >
                Start Exploring
              </a>
            </li>
          )}

        </ul>
      </div>

      {/* --- Mobile Offcanvas Menu --- */}

      {/* 1. Backdrop (Click to close) */}
      <div className={backdropClass} onClick={() => setMenuOpen(false)}></div>

      {/* 2. Offcanvas Panel (Slides in/out) */}
      <div className={mobileMenuClass}>

        {/* Offcanvas Header (Closer look to original Bootstrap style) */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
          <h5 className="text-xl font-semibold text-white">
            {isAdmin ? "Admin Panel" : isGuide ? "Guide Menu" : "Explore"}
          </h5>
          <button
            type="button"
            className="text-white hover:text-[#00C4CC] transition"
            onClick={() => setMenuOpen(false)}
            aria-label="Close"
          >
            {/* Custom Close Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Offcanvas Body */}
        <ul className="flex flex-col space-y-1">

          {/* Logged In User Dropdown Section (Visible only when logged in) */}
          {isLoggedin && (
            <li className="mb-2 border-b border-gray-700 pb-2">
              <button
                onClick={() => setMobileDropdownOpen((prev) => !prev)}
                className="flex items-center justify-between px-2 py-2 w-full cursor-pointer text-white hover:text-[#00C4CC]"
                aria-label="User Menu"
                aria-expanded={mobileDropdownOpen}
                aria-controls="user-mobile-dropdown"
              >
                <div className="flex items-center">
                  <FaUserCircle size={25} className="bg-[#00C4CC] text-[#121827] rounded-2xl mr-2" />
                  <span className="font-bold">{capitalizedUsername}</span>
                </div>

                {/* Down Arrow Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  id="user-mobile-dropdown"
                  className={`w-5 h-5 transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>


              {/* Dropdown Links (Toggled by isVisible state) */}
              {mobileDropdownOpen && (
                <ul className="mt-2 pl-4 space-y-1">
                  {subMenuItems.map((item) => (
                    <li key={item.name} className="hover:bg-gray-700 rounded">
                      <Link to={item.path} onClick={() => { setMobileDropdownOpen(false); closeMenus(); }} className="flex items-center px-2 py-2 text-gray-400 hover:text-[#00C4CC]">
                        {item.icon} {item.name}
                      </Link>
                    </li>
                  ))}

                  <li className="hover:bg-gray-700 rounded">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileDropdownOpen(false);
                      }}
                      className="flex items-center px-2 py-2 w-full text-left text-gray-400 hover:text-[#00C4CC]"
                    >
                      <TbLogout size={22} className="mr-2" /> Sign Out
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Standard Navigation Links */}
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={closeMenus}
                className={`
                    font-semibold px-2 py-2 rounded relative block hover:text-[#00C4CC]
                    ${location.pathname === item.path ? "text-[#00C4CC]" : "text-gray-400"}
                `}
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* ⭐ NEW: Login/Sign Up (Only shown if NOT logged in) */}
          {!isLoggedin ? (
            <li className="pt-2 border-t border-gray-700">
              <Link onClick={closeMenus} to="/login" className="font-semibold inline-block px-2 py-2 rounded mb-2 text-white hover:bg-gray-700 hover:text-[#00C4CC]">
                Sign In
              </Link>
            </li>
          ) : null}

          {/* Start Exploring Link */}
          {!isAdmin && !isGuide && (<li>
            <a
              onClick={scrollToTopDestinations}
              href="#top-destinations"
              className="block px-4 py-2 rounded-full bg-[#00C4CC] hover:bg-cyan-400 text-[#121827] font-bold w-[159.6px] text-center"
            >
              Start Exploring
            </a>
          </li>)}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
