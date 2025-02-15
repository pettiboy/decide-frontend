import { FC } from "react";
import { useNavigate, Link } from "react-router-dom";

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
      <nav className="py-4 px-6 flex items-center">
        <button
          onClick={() => navigate("/")}
          className="text-xl font-bold mr-8"
        >
          Decide
        </button>

        <div className="flex-1 flex items-center justify-between">
          {progress ? (
            <span className="text-gray-600 text-sm font-medium ml-auto">
              Progress: {progress.current}/{progress.total}
            </span>
          ) : (
            <Link
              to="/my-decisions"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium ml-auto"
            >
              My Decisions
            </Link>
          )}
        </div>
      </nav>

      {/* Linear Progress Bar */}
      {progress && (
        <div className="w-full bg-gray-200 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
