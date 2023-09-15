import React from "react";

import { useLocation } from "react-router-dom";
import Header from "./Components/Header/Header";

const ConditionalHeader = ({ children }) => {
  const location = useLocation();
  const hideHeaderRoutes = [
    "/login",
    "/register",
    "/update/password",
    "/forgot/password",
    "/update/profile",
    "/newpost",
    "/createStory",
    "/*",
  ]; // Add the routes where you want to hide the header

  const shouldRenderHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div>
      {shouldRenderHeader && <Header />}
      {children}
    </div>
  );
};

export default ConditionalHeader;
