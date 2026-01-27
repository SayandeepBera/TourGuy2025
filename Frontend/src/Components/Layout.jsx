import { useLocation } from 'react-router-dom';
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
  const isAuthPages = location.pathname === '/login' ||
                      location.pathname === '/profile' ||
                      location.pathname === '/editprofile' ||
                      location.pathname === '/register' ||
                      location.pathname === '/bookinghistory' ||
                      location.pathname.startsWith('/booking-details/') ||
                      location.pathname.startsWith('/upload-moment/') ||
                      location.pathname === '*';

  const hideFooter = isAuthPages || isAdmin;

  return (
    <>
      {children}

      {/* Conditionally render Footer based on the current route */}
      {!hideFooter && <Footer />}
    </>
  )
}

export default Layout
