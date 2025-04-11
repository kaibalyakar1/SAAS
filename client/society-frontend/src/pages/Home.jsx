import React from "react";
import bgImage from "../assets/Home.png";

import { useRef } from "react";
import About from "../components/About.jsx";
import Hero from "../components/Hero.jsx";
import Contact from "../components/Contact.jsx";

const Home = () => {
  return (
    <div>
      <Hero />

      <About />

      <Contact />
    </div>
  );
};

export default Home;
