import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getResults } from "@/utils/api";
import { Loader2, RotateCw, Share2 } from "lucide-react";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/Footer";

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [rankedChoices, setRankedChoices] = useState<
    { id: number; text: string; score: number; rank: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getResults(id!);
      if (!data || !data.rankedChoices || data.rankedChoices.length === 0) {
        setError("Results are not available yet.");
      } else {
        setRankedChoices(data.rankedChoices);
      }
    } catch (error) {
      setError("Failed to fetch results. Please try again.");
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    navigate("/"); // Redirect to the home page to start over
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/result/${id}`;
      const shareData = {
        title: "Decide - Voting Results",
        text: "Check out my ranked results from Decide!",
        url: shareUrl,
      };

      if (navigator.share) {
        await navigator.share(shareData);
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
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <Card className="w-full max-w-lg p-4 sm:p-6 lg:p-8 shadow-xl rounded-3xl bg-white">
          <CardContent className="flex flex-col space-y-6">
            {/* Your Ranking Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">Your Ranking</h1>
              <p className="text-gray-500 text-md pb-2">
                Based on your choices, here's how the options ranked.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
              </div>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                <ul className="space-y-2 text-lg">
                  {rankedChoices.map((item) => (
                    <li
                      key={item.id}
                      className="text-gray-700 flex justify-between border-b pb-2"
                    >
                      <span className="font-semibold">
                        {item.rank}. {item.text}
                      </span>
                      <span className="text-gray-500">
                        Score: {item.score.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Start Over and Share Buttons */}
                <div className="flex justify-between space-x-4">
                  <Button
                    className="bg-black text-white flex items-center space-x-2 px-4 py-2"
                    onClick={handleRestart}
                  >
                    <RotateCw className="w-5 h-5" />
                    <span>Start Over</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 px-4 py-2"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </Button>
                </div>

                {/* Consensus-based Ranking Info */}
                <p className="text-gray-500 text-sm text-center mt-4">
                  This ranking was generated using a consensus-based algorithm.
                  It reflects the overall preferences based on your individual
                  choices.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
