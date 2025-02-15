import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { createDecision } from "@/utils/api";
import { ArrowRight, Loader2, Plus, Sparkles } from "lucide-react";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [pollName, setPollName] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [newChoice, setNewChoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [sliderMultiplier, setSliderMultiplier] = useState(1);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);

  const addChoice = () => {
    if (newChoice.trim()) {
      setChoices((prev) => [...prev, newChoice.trim()]);
      enqueueSnackbar("Choice added!", { variant: "success" });
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

  const startDecision = async () => {
    if (choices.length < 2) {
      enqueueSnackbar("Add at least 2 choices to start!", { variant: "error" });
      return;
    }
    setLoading(true);

    try {
      const data = await createDecision(choices, sliderMultiplier);
      navigate(`/decide/${data.decisionId}`);
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to create decision!", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const comparisonCount =
    ((choices.length * (choices.length - 1)) / 2) * sliderMultiplier;

  const handlePollNameMagic = () => {
    setPollName("Magic Poll");
    // TODO: Add auto-generate poll name logic
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <Card className="w-full max-w-lg p-4 sm:p-6 shadow-lg rounded-2xl bg-white">
          <CardContent className="flex flex-col space-y-6">
            {/* Heading Section */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">Add your options</h1>
              <p className="text-gray-500 text-md pb-2">
                Enter the options you want to compare. You'll vote on these in
                pairs later.
              </p>
            </div>

            {/* Poll Name Input */}
            <div className="flex space-x-2 items-center">
              <Input
                value={pollName}
                onChange={(e) => setPollName(e.target.value)}
                placeholder="Enter poll name(optional)"
                className="flex-1"
              />
              <Button variant="outline" onClick={handlePollNameMagic}>
                <Sparkles />
              </Button>
            </div>

            {/* Choice Input */}
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={newChoice}
                onChange={(e) => setNewChoice(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a choice"
                className="flex-1"
              />
              <Button onClick={addChoice} className="bg-black text-white">
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Helper Text */}
            {choices.length < 2 && (
              <p className="text-gray-500 text-sm text-center">
                Add at least 2 choices to continue.
              </p>
            )}

            {/* Display Choices */}
            {choices.length > 0 && (
              <ol className="space-y-1 text-lg">
                {choices.map((choice, index) => (
                  <li
                    key={index}
                    className="text-gray-700 opacity-0 animate-slide-in"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    - {choice}
                  </li>
                ))}
              </ol>
            )}

            {/* Start Button */}
            <Button
              onClick={startDecision}
              disabled={choices.length < 2 || loading}
              className={`w-full text-lg font-medium flex items-center justify-center ${
                choices.length < 2 || loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-black text-white"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Start <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>

            {/* Slider Section */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Accuracy Multiplier
                  </h4>
                  <p className="text-sm text-gray-600">
                    Higher value means more accurate response
                  </p>
                </div>
                <span className="text-gray-700 font-medium">
                  {sliderMultiplier}
                </span>
              </div>
              <Slider
                value={[sliderMultiplier]}
                onValueChange={(value: number[]) =>
                  setSliderMultiplier(value[0])
                }
                min={1}
                max={5}
                step={1}
                className="mt-3"
              />
              <div className="mt-2 text-gray-700 text-lg">
                Comparisons: {comparisonCount}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updated Custom CSS for More Subtle Animation */}
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
      </div>
      <Footer />
    </>
  );
}
