import { FC } from "react";

interface NavbarProps {
  progress?: {
    current: number;
    total: number;
  };
}

const Navbar: FC<NavbarProps> = ({ progress }) => {
  const progressPercentage = progress
    ? (progress.current / progress.total) * 100
    : 0;

  return (
    <div className="w-full bg-white shadow-md">
      {/* Navbar */}
      <nav className="py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Decide</h1>
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
