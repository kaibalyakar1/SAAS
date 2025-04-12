import React from "react";

const AboutBuilder = () => {
  return (
    <section
      className="w-full bg-gradient-to-b from-blue-50 to-white py-16 px-6 md:px-20"
      id="builder"
    >
      <div className="max-w-7xl mx-auto">
        {/* Builder Info - Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 relative inline-block">
            BN Developer, Kendrapara
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></div>
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left column: Text */}
          <div className="md:w-1/2">
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                BN Developer is a trusted name in real estate from Kendrapara,
                Odisha. With a strong presence in eastern India, the company has
                delivered multiple residential and commercial projects known for
                quality and transparency.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Their vision is to provide modern, affordable living solutions
                for families and individuals. With decades of experience, BN
                Developer has established itself as a pioneer in the local real
                estate market.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Each project is crafted with attention to detail, ensuring
                comfort, sustainability, and value for homeowners. The company
                prioritizes customer satisfaction above all else, making them a
                preferred choice for property investment in Kendrapara.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition duration-300 shadow-md">
                Contact Us Today
              </button>
            </div>
          </div>

          {/* Right column: Timeline tree structure */}
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 relative inline-block">
              <span className="text-blue-700">Completed</span> Projects
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-200"></div>
            </h3>

            {/* Tree timeline structure */}
            <div className="relative pl-8 border-l-2 border-blue-300">
              {/* Project 1 */}
              <div className="mb-12 relative">
                <div className="absolute -left-10 top-0 w-6 h-6 rounded-full bg-blue-600 border-4 border-blue-100"></div>
                <div className="bg-white rounded-lg shadow-md p-5 ml-2">
                  <h4 className="text-xl font-bold text-blue-700 mb-1">
                    Nayan Vihar
                  </h4>
                  <p className="text-gray-600 mb-2">Kendrapara Town</p>
                  <div className="text-sm text-blue-500 font-medium">
                    Completed in 2005
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="mb-12 relative">
                <div className="absolute -left-10 top-0 w-6 h-6 rounded-full bg-green-600 border-4 border-green-100"></div>
                <div className="bg-white rounded-lg shadow-md p-5 ml-2">
                  <h4 className="text-xl font-bold text-green-700 mb-1">
                    Baula Vihar
                  </h4>
                  <p className="text-gray-600 mb-2">Kendrapara</p>
                  <div className="text-sm text-green-500 font-medium">
                    Completed in 2022
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="relative">
                <div className="absolute -left-10 top-0 w-6 h-6 rounded-full bg-yellow-500 border-4 border-yellow-100"></div>
                <div className="bg-white rounded-lg shadow-md p-5 ml-2">
                  <h4 className="text-xl font-bold text-yellow-700 mb-1">
                    Hadibandhu Vihar
                  </h4>
                  <p className="text-gray-600 mb-2">Kasoti, Kendrapara</p>
                  <div className="text-sm text-yellow-500 font-medium">
                    Completed in 2021
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBuilder;
