import React from "react";
import { useScroll } from "../context/ScrollContext";

const Contact = () => {
  const { contactRef } = useScroll();
  return (
    <div className="h-[100vh]" ref={contactRef}>
      <p className="mt-4 text-base sm:text-lg md:text-xl px-2 sm:px-0">
        Experience peace, security & a happy community
      </p>
    </div>
  );
};

export default Contact;
