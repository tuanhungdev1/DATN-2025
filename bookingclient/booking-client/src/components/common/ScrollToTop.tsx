import React from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  React.useEffect(() => {
    // Chỉ scroll lên đầu khi là điều hướng bình thường (không phải Back/Forward)
    if (navigationType !== "POP") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
