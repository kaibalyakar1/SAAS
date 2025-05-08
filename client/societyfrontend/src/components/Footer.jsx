import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-indigo-900 text-white">
      {/* Main Footer - Simplified */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Society Info */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Nayan Vihar Society</h3>
            <address className="text-indigo-200 text-sm not-italic mt-1">
              Duhuria,Kendrapara,754211,Odisha,India
            </address>
          </div>

          {/* Quick Links */}

          {/* Contact */}
          <div className="flex items-center space-x-4">
            <a
              href="tel:+911234567890"
              className="text-indigo-200 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </a>
            <a
              href="mailto:info@nayanvihar.com"
              className="text-indigo-200 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
            <a href="#" className="text-indigo-200 hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright - Simplified */}
      <div className="bg-indigo-950 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs">
            <p className="text-indigo-300">
              &copy; {currentYear} Nayan Vihar Society
            </p>
            <div className="mt-1 md:mt-0">
              <span className="text-indigo-300">
                <a href="/privacy" className="hover:text-white">
                  Privacy
                </a>{" "}
                ·
                <a href="/terms" className="ml-2 hover:text-white">
                  Terms
                </a>{" "}
                ·
                <a href="/help" className="ml-2 hover:text-white">
                  Help
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
