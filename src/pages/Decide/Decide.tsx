import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getNextComparison, submitComparison } from "@/utils/api";
import { ExternalLink, Loader2 } from "lucide-react";
import { enqueueSnackbar } from "notistack";
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
      const shareUrl = `${window.location.origin}/decide/${id}`;
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
              <h1 className="text-4xl font-bold text-gray-900">
                This or <span className="text-blue-600">That?</span>
              </h1>
              <p className="text-lg text-gray-600">
                Choose the option you prefer. Your choices will help rank all
                options.
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              {comparison ? (
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full p-8 text-lg rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
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
                    className="w-full p-8 text-lg rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
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
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-center text-sm mb-3">
                  Share this with others and let them decide too!
                </p>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 truncate">
                    {window.location.origin}/decide/{id}
                  </span>
                  <button
                    onClick={handleSharePollLink}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-5 h-5" />
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
