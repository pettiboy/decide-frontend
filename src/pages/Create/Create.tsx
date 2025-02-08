import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [choices, setChoices] = useState<string[]>([]);
  const [newChoice, setNewChoice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // Auto-focus input field
  }, []);

  const addChoice = () => {
    if (newChoice.trim()) {
      setChoices([...choices, newChoice.trim()]);
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

  const startDecision = () => {
    if (choices.length < 2) {
      enqueueSnackbar("Add at least 2 choices to start!", { variant: "error" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 10);
      navigate(`/decide/${id}`);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-lg p-4 sm:p-6 lg:p-8 shadow-lg rounded-2xl bg-white animate-fade-in">
        <CardContent className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={newChoice}
              onChange={(e) => setNewChoice(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a choice"
              className="flex-1"
            />
            <Button
              onClick={addChoice}
              className="bg-black text-white hover:scale-105 transition-transform"
            >
              Add
            </Button>
          </div>

          {choices.length > 0 && (
            <ul className="space-y-1 text-lg animate-slide-in">
              {choices.map((choice, index) => (
                <li key={index} className="text-gray-700">
                  - {choice}
                </li>
              ))}
            </ul>
          )}

          <Button
            onClick={startDecision}
            disabled={loading}
            className={`w-full text-lg font-medium flex items-center justify-center ${
              choices.length < 2 || loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:scale-105 transition-transform"
            }`}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Start"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
