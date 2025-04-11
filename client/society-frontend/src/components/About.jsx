import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import homeimg from "../assets/Home.png";
import { useScroll } from "../context/ScrollContext";
const images = [homeimg, homeimg, homeimg];

const About = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  const aboutRef = useScroll();

  return (
    <section
      ref={aboutRef}
      className="h-[92vh] bg-gray-100 px-4 md:px-10 py-8 flex items-center"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 w-full">
        {/* LEFT SIDE: About Text */}
        <div className="md:w-1/2 text-gray-800 text-center md:text-left space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">About Nayan Vihar</h2>
          <p className="text-base md:text-lg leading-relaxed">
            Nayan Vihar started in the year 2000 and is now home to more than
            150 families. With top-notch security, 24/7 water supply, and a
            close-knit community, it offers a peaceful and harmonious lifestyle.
            All festivals are celebrated together with joy and unity.
          </p>
        </div>

        {/* RIGHT SIDE: Image Slider */}
        <div className="md:w-1/2 w-full relative">
          <h3 className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-base sm:text-lg font-semibold z-10 bg-black bg-opacity-50 px-4 py-2 rounded-full shadow">
            Some Moments of Nayan Vihar
          </h3>
          <Slider {...sliderSettings}>
            {images.map((src, i) => (
              <div key={i}>
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="rounded-xl w-full h-[250px] sm:h-[300px] md:h-[320px] object-cover shadow-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default About;
