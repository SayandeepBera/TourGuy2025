import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This creates the sliding effect you want
    });
  }, [pathname]); // Fires every time the URL path changes

  return null;
};

export default ScrollToTop;