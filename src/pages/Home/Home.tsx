import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BarChart3, Hand, Link, ListPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
              Simplify Your <span className="text-blue-600">Decisions</span>
            </h1>
            <p className="text-2xl font-medium text-gray-600">
              Stop overthinking. Start deciding.
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Decide breaks down complex choices into simple comparisons,
              helping you make confident decisions through an intuitive voting
              process.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full 
                         shadow-lg hover:shadow-xl transition-all duration-300 mt-8"
              onClick={() => navigate("/create")}
            >
              Make Your First Decision
            </Button>
          </div>
        </div>

        {/* Steps Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Four steps to clarity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <StepCard
                icon={<ListPlus className="w-6 h-6" />}
                title="List your options"
                number="1"
              />
              <StepCard
                icon={<Hand className="w-6 h-6" />}
                title="Compare two at a time"
                number="2"
              />
              <StepCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Get your ranked results"
                number="3"
              />
              <StepCard
                icon={<Link className="w-6 h-6" />}
                title="Share for group decisions"
                number="4"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  number: string;
}

function StepCard({ icon, title, number }: StepCardProps) {
  return (
    <div
      className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-md 
                    transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <span className="text-3xl font-bold text-gray-200 group-hover:text-blue-200 transition-colors duration-300">
          {number}
        </span>
      </div>
    </div>
  );
}
