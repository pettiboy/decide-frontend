import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDecision, generateTitle } from "@/utils/api";
import { ArrowRight, Loader2, Plus, Sparkles, X } from "lucide-react";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [title, setTitle] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [newChoice, setNewChoice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);

  const addChoice = () => {
    if (newChoice.trim()) {
      setChoices((prev) => [...prev, newChoice.trim()]);
      setNewChoice("");
    } else {
      enqueueSnackbar("Please enter a valid choice!", { variant: "warning" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChoice();
    }
  };

  const deleteChoice = (index: number) => {
    setChoices((prev) => prev.filter((_, i) => i !== index));
  };

  const startDecision = async () => {
    if (choices.length < 2) {
      enqueueSnackbar("Add at least 2 choices to start!", { variant: "error" });
      return;
    }

    if (!title) {
      handleTitleMagic();
      return;
    }

    setLoading(true);
    try {
      const data = await createDecision(title, choices, 1);
      navigate(`/decide/${data.decisionId}`);
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to create decision!", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleTitleMagic = async () => {
    if (choices.length < 2) {
      enqueueSnackbar("Add at least 2 choices to generate a title!", {
        variant: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await generateTitle(choices);
      setTitle(data.title);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to generate title!", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16 pb-32">
          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold text-gray-900">
                List Your <span className="text-blue-600">Options</span>
              </h1>
              <p className="text-lg text-gray-600">
                Add the choices you want to compare. You'll vote on these in
                pairs later.
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              {/* Title Input */}
              <div className="flex space-x-2 items-center">
                <Input
                  value={title || ""}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your decision a name (optional)"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleTitleMagic}
                  className="hover:bg-blue-50"
                >
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </Button>
              </div>

              {/* Choice Input */}
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={newChoice}
                  onChange={(e) => setNewChoice(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter an option"
                  className="flex-1"
                />
                <Button
                  onClick={addChoice}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {/* Updated Choices List with delete buttons */}
              {choices.length > 0 && (
                <div className="space-y-3">
                  {choices.map((choice, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl text-gray-700 opacity-0 animate-slide-in flex justify-between items-center"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <span>{choice}</span>
                      <button
                        onClick={() => deleteChoice(index)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Delete choice"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Helper Text */}
              {choices.length < 2 && (
                <p className="text-gray-500 text-sm text-center">
                  Add at least 2 choices to continue
                </p>
              )}

              {/* Start Button */}
              <Button
                onClick={startDecision}
                disabled={choices.length < 2 || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-xl
                          shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {!title ? (
                      <>
                        Generate Title with AI
                        <Sparkles className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Start Deciding
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <style>
        {`
        @keyframes slideIn {
          from {
            transform: translateY(-5px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.2s ease-out;
        }
        `}
      </style>
      <Footer />
    </>
  );
}
