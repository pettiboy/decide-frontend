import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface NavbarProps {
  progress?: {
    current: number;
    total: number;
  };
}

const Navbar: FC<NavbarProps> = ({ progress }) => {
  const navigate = useNavigate();

  const progressPercentage = progress
    ? (progress.current / progress.total) * 100
    : 0;

  return (
    <div className="w-full bg-white shadow-md">
      {/* Navbar */}
      <nav className="py-4 px-6 flex justify-between items-center">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="text-xl font-bold"
        >
          Decide
        </button>
        <Link to="/my-decisions" className="text-gray-600 hover:text-gray-900">
          My Decisions
        </Link>
        {progress && (
          <span className="text-gray-600 text-lg font-medium">
            Progress: {progress.current}/{progress.total}
          </span>
        )}
      </nav>

      {/* Linear Progress Bar */}
      {progress && (
        <div className="w-full bg-gray-200 h-2">
          <div
            className="bg-black h-2 transition-all"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
