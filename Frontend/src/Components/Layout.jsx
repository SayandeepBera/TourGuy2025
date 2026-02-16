import { useLocation, matchRoutes } from 'react-router-dom';
import Footer from './Footer';
import { useContext } from 'react';
import AuthContext from '../Context/Authentication/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { userRole } = useContext(AuthContext);

  console.log("userRole: ", userRole);
  // Check if the user is an admin
  const isAdmin = userRole === "admin";

  // Define routes where the footer should be hidden
  const routes = [
    { path: "/" },
    { path: "/destination" },
    { path: "/whyus" },
    { path: "/guides" },
    { path: "/support" },
    { path: "/booking" },
    { path: "/login" },
    { path: "/reset-password/:token" },
    { path: "/profile" },
    { path: "/editprofile" },
    { path: "/bookinghistory" },
    { path: "/booking-details/:id" },
    { path: "/upload-moment/:bookingId" },
    { path: "/chat/:conversationId" }
  ];

  // Check if the current route matches any of the defined routes
  const matchedRoute = matchRoutes(routes, location);

  const isNotFound = !matchedRoute;

  // Routes where footer should be hidden
  const hideFooterRoutes = [
    "/login",
    "/register",
    "/profile",
    "/editprofile",
    "/bookinghistory",
  ];

  // Hide footer for admin, 404 page, and specific routes
  const hideFooter =
    isAdmin ||
    isNotFound ||
    hideFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/booking-details/") ||
    location.pathname.startsWith("/upload-moment/");

  return (
    <>
      {children}

      {/* Conditionally render Footer based on the current route */}
      {!hideFooter && <Footer />}
    </>
  )
}

export default Layout
