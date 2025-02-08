import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Decide() {
  const { decisionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const choices = ["choice 1", "choice 2", "choice 3", "choice 4", "choice 5"];
  const totalRounds = 25;

  const handleChoice = (choice: string) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  };

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= totalRounds) {
    navigate(`/result/${decisionId}`);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-xl p-4 sm:p-6 lg:p-8 shadow-xl rounded-3xl bg-white animate-fade-in">
        <CardContent className="flex flex-col space-y-6">
          <div className="space-y-4 animate-slide-in">
            <Button
              variant="outline"
              className="text-lg py-10 rounded-xl w-full transition-transform hover:scale-105 active:scale-95"
              onClick={() => handleChoice(choices[0])}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                choices[0]
              )}
            </Button>
            <Button
              variant="outline"
              className="text-lg py-10 rounded-xl w-full transition-transform hover:scale-105 active:scale-95"
              onClick={() => handleChoice(choices[1])}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                choices[1]
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip
          </Button>

          <div className="text-center text-gray-600 text-lg font-medium">
            {currentIndex + 1}/{totalRounds}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
