import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getResults } from "@/utils/api";
import {
  ExternalLink,
  Loader2,
  RotateCw,
  Share2,
  Trophy,
  Users,
} from "lucide-react";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Result() {
  const [pollName, setPollName] = useState("...");
  const [totalVotesCount, setTotalVotesCount] = useState(1);
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
      <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100 px-4">
        <p className="text-lg text-gray-600 mb-4">{pollName}</p>
        <Card className="w-full max-w-lg p-4 sm:p-6 lg:p-8 shadow-xl rounded-3xl bg-white">
          <CardContent className="flex flex-col space-y-6">
            {/* Your Ranking Heading */}
            <div className="text-center">
              <Trophy className="w-12 h-12 text-black mx-auto" />
              <h1 className="text-2xl font-bold pb-4 pt-2">Results</h1>
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-6 h-6" />
                <p className="text-gray-500 text-md">
                  {totalVotesCount} voters
                </p>
              </div>
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

                <div>
                  <p className="text-gray-500 text-center text-sm mt-4 mb-2">
                    Share this with others and let them decide too!
                  </p>
                  <div className="bg-white border border-gray-300 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-gray-700 truncate">
                      {window.location.origin}/decide/{id}
                    </span>
                    <button
                      onClick={handleSharePollLink}
                      className="text-gray-600 hover:text-black"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Start Over and Share Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button
                    className="bg-black text-white flex items-center space-x-2 px-4 py-2 w-full sm:w-auto"
                    onClick={handleRestart}
                  >
                    <RotateCw className="w-5 h-5" />
                    <span>Create new poll</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 px-4 py-2 w-full sm:w-auto"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share Results</span>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
