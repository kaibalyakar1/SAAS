import logo from "../assets/LOGO.png";
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <img
        src={logo}
        alt="Loading"
        className="w-24 h-24 animate-logoZoom rounded-full"
      />
    </div>
  );
};

export default LoadingSpinner;
