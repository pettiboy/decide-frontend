import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getNextComparison, submitComparison } from "@/utils/api";
import { Loader2, InfoIcon, Share2 } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Decide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<{
    choice1: { id: number; text: string };
    choice2: { id: number; text: string };
    comparisonsRemaining: number;
    totalComparisons: number;
    decision: { title: string };
  } | null>(null);

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
      enqueueSnackbar("Invalid decision code. Please check and try again.", {
        variant: "error",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextComparison();
  }, [id, navigate]);

  const handleChoice = async (chosenOption: string) => {
    if (!comparison) return;
    try {
      setLoading(true);
      // Remove focus and active states from all buttons
      const buttons = document.querySelectorAll("button");
      buttons.forEach((button) => {
        button.blur();
        button.classList.remove("active");
      });

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

  const handleSharePollLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/vote/${id}`;
      const shareData = {
        title: "Decide - Vote on your Choices",
        text: "Vote on my poll on Decide!",
        url: shareUrl,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        await navigator.clipboard.writeText(shareUrl);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        enqueueSnackbar("Link copied to clipboard!", { variant: "success" });
      }
    } catch (error) {
      console.error("Error sharing link:", error);
      enqueueSnackbar("Failed to share the result.", { variant: "error" });
    }
  };

  return (
    <>
      <Navbar
        progress={
          comparison
            ? {
                current:
                  comparison.totalComparisons -
                  comparison.comparisonsRemaining +
                  1,
                total: comparison.totalComparisons,
              }
            : undefined
        }
      />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="text-center space-y-4 mb-12">
              {comparison?.decision.title && (
                <h1 className="text-4xl font-bold text-gray-900">
                  {comparison.decision.title}
                </h1>
              )}
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                This or <span className="text-blue-600">That?</span>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  </PopoverTrigger>
                  <PopoverContent className="text-sm text-gray-600 w-[260px]">
                    Choose the option you prefer. Your choices will help rank
                    all options.
                  </PopoverContent>
                </Popover>
              </h2>
            </div>

            {/* Main Content */}
            <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              {comparison ? (
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full p-8 text-lg rounded-xl 
                              hover:bg-blue-50 hover:border-blue-200 
                              focus:bg-transparent focus:border-gray-200
                              active:bg-transparent active:border-gray-200
                              transition-all duration-300
                              touch-none"
                    onClick={() => handleChoice("choice 1")}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-6 h-6" />
                    ) : (
                      comparison.choice1?.text
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full p-8 text-lg rounded-xl 
                              hover:bg-blue-50 hover:border-blue-200 
                              focus:bg-transparent focus:border-gray-200
                              active:bg-transparent active:border-gray-200
                              transition-all duration-300
                              touch-none"
                    onClick={() => handleChoice("choice 2")}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-6 h-6" />
                    ) : (
                      comparison.choice2?.text
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="animate-spin w-8 h-8 text-blue-600 mx-auto" />
                </div>
              )}

              {/* Share Section */}
              <div className="pt-8 border-t border-gray-100">
                <p className="text-gray-600 text-center mb-4">
                  Share this with others and let them decide too!
                </p>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 text-sm truncate">
                    {window.location.origin}/vote/{id}
                  </span>
                  <button
                    onClick={handleSharePollLink}
                    className="text-blue-600 hover:text-blue-700 ml-2"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
