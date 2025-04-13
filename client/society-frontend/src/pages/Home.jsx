import React from "react";
import bgImage from "../assets/Home.png";

import { useRef } from "react";
import About from "../components/About.jsx";
import Hero from "../components/Hero.jsx";
import Contact from "../components/AboutBuilder.jsx";
import AboutBuilder from "../components/AboutBuilder.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />

      <About />

      <AboutBuilder />
      <Footer />
    </div>
  );
};

export default Home;
