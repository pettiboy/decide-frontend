import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getNextComparison, submitComparison } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Decide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<{
    choice1: { id: number; text: string };
    choice2: { id: number; text: string };
    comparisonsRemaining: number;
    totalComparisons: number;
  } | null>(null);

  useEffect(() => {
    fetchNextComparison();
  }, []);

  const fetchNextComparison = async () => {
    try {
      setLoading(true);
      const data = await getNextComparison(id!);
      if (!data || data.comparisonsRemaining === 0) {
        navigate(`/result/${id}`);
        return;
      }
      setComparison(data);
    } catch (error) {
      console.error("Error fetching next comparison:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (chosenOption: string) => {
    if (!comparison) return;
    try {
      setLoading(true);
      console.log(`User chose: ${chosenOption}`);
      await submitComparison(
        id!,
        comparison.choice1.id,
        comparison.choice2.id,
        chosenOption
      );
      fetchNextComparison();
    } catch (error) {
      console.error("Error submitting choice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-xl p-4 sm:p-6 shadow-xl rounded-3xl bg-white">
        <CardContent className="flex flex-col space-y-6">
          {/* Heading Section */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">This or That?</h1>
            <p className="text-gray-500 text-md pb-2">
              Choose the option you prefer. Your choices will help rank all
              options.
            </p>
          </div>

          {comparison ? (
            <>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="text-lg py-10 rounded-xl w-full"
                  onClick={() => handleChoice("choice 1")}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    comparison.choice1.text
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="text-lg py-10 rounded-xl w-full"
                  onClick={() => handleChoice("choice 2")}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    comparison.choice2.text
                  )}
                </Button>
              </div>

              {/* Skip Button (if needed) */}
              {/* <Button
                className="text-gray-500"
                variant="ghost"
                onClick={() => handleChoice("skip")} 
                disabled={loading}
              >
                Skip
              </Button> */}

              <div className="text-center text-gray-600 text-lg font-medium">
                {comparison.totalComparisons -
                  comparison.comparisonsRemaining +
                  1}
                /{comparison.totalComparisons}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600">Loading...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
