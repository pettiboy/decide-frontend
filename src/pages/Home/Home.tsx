import type React from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Hand,
  LinkIcon,
  ListPlus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getNextComparison } from "@/utils/api";

export default function Home() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    if (!/^[a-zA-Z0-9]{7}$/.test(trimmedCode)) {
      enqueueSnackbar(
        "Invalid decision code. Code must be 7 characters long.",
        {
          variant: "error",
        }
      );
      return;
    }

    try {
      setLoading(true);
      await getNextComparison(trimmedCode);
      navigate(`/vote/${trimmedCode}`);
    } catch {
      enqueueSnackbar("Invalid decision code. Please check and try again.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-8">
              <Card className="border-2 border-blue-600 bg-blue-50/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Start a New Decision
                    </h3>
                    <p className="text-sm text-gray-600">
                      Create a new poll and invite others to vote
                    </p>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl
                               shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => navigate("/create")}
                    >
                      Make Your First Decision
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Join Existing Decision
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enter a decision code to participate
                    </p>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          type="text"
                          placeholder="Enter decision code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="py-6 text-lg pr-24"
                          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                        />
                        <Button
                          className="absolute right-2 top-1/2 -translate-y-1/2 py-4"
                          onClick={handleJoin}
                          disabled={!code.trim() || loading}
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>Join</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <Separator className="max-w-4xl mx-auto mb-16" />

          {/* Steps Section */}
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
                icon={<LinkIcon className="w-6 h-6" />}
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
