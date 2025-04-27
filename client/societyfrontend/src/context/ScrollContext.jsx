import { createContext, useContext, useRef } from "react";

//1st step create context

const ScrollContext = createContext();

//2nd step create provider

export const ScrollProvider = ({ children }) => {
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  return (
    <ScrollContext.Provider value={{ aboutRef, contactRef }}>
      {children}
    </ScrollContext.Provider>
  );
};
export const useScroll = () => useContext(ScrollContext);
