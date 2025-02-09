import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BarChart3, Hand, ListPlus } from "lucide-react"; // Icons
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-100">
        {/* Main Container */}
        <div className="max-w-2xl text-center space-y-8">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome to Decide
          </h1>

          {/* Tagline */}
          <p className="text-lg text-gray-600">
            A next-generation voting system that leverages the power of
            consensus over your conscious mind.
          </p>

          {/* Start Button */}
          <Button
            className="bg-black text-white text-lg px-6 py-3 rounded-lg hover:scale-105 transition-transform"
            onClick={() => navigate("/create")}
          >
            Start Voting
          </Button>

          {/* How it Works Section with Icons */}
          <div className="text-gray-500 text-md">
            <h2 className="font-semibold text-gray-700 text-xl mb-4">
              How it works:
            </h2>
            <div className="flex flex-col space-y-4 items-center">
              <div className="flex items-center space-x-3">
                <ListPlus className="w-6 h-6 text-gray-700" />
                <span className="text-lg">Add your options</span>
              </div>
              <div className="flex items-center space-x-3">
                <Hand className="w-6 h-6 text-gray-700" />
                <span className="text-lg">Vote on pairs of options</span>
              </div>
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-gray-700" />
                <span className="text-lg">
                  Get a ranked list based on your votes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
