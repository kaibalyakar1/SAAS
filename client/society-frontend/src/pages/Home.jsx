import React from "react";
import bgImage from "../assets/Home.png";

import { useRef } from "react";
import About from "../components/About.jsx";
import Hero from "../components/Hero.jsx";
import Contact from "../components/AboutBuilder.jsx";
import AboutBuilder from "../components/AboutBuilder.jsx";

const Home = () => {
  return (
    <div>
      <Hero />

      <About />

      <AboutBuilder />
    </div>
  );
};

export default Home;
