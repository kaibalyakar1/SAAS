import React from "react";
import bgImage from "../assets/Home.png";
import { useScroll } from "../context/ScrollContext";

const Hero = () => {
  const heading = "Welcome to Nayan Vihar";
  const aboutRef = useScroll();

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-black opacity-60" />

      <div className="relative z-10 text-white text-center max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <h1 className="text-xl sm:text-xl md:text-5xl lg:text-6xl font-bold leading-tight flex justify-center">
          {heading.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block opacity-0 animate-wave"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p className="mt-4 text-base sm:text-lg md:text-xl px-2 sm:px-0">
          Experience peace, security & a happy community
        </p>

        <button
          onClick={scrollToAbout}
          className="mt-6 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white text-sm sm:text-base md:text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        >
          Explore More
        </button>
      </div>
    </section>
  );
};

export default Hero;
