import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ResultImage from "@/components/ResultImage";
import { Button } from "@/components/ui/button";
import { getResults, getVoterCount } from "@/utils/api";
import html2canvas from "html2canvas";

import { Loader2, RotateCw, Share2, Trophy } from "lucide-react";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Result() {
  const [pollName, setPollName] = useState("...");
  const [voterCount, setVoterCount] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [rankedChoices, setRankedChoices] = useState<
    { id: number; text: string; score: number; rank: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [resultData, voterData] = await Promise.all([
        getResults(id!),
        getVoterCount(id!),
      ]);

      if (
        !resultData ||
        !resultData.rankedChoices ||
        resultData.rankedChoices.length === 0
      ) {
        setError("Results are not available yet.");
      } else {
        setRankedChoices(resultData.rankedChoices);
        setPollName(resultData.decision.title || "Untitled Decision");
        setVoterCount(voterData.numberOfVoters);
      }
    } catch (error) {
      setError("Failed to fetch results. Please try again.");
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    navigate("/create");
  };

  const handleShare = async () => {
    if (!resultRef.current) return;
    try {
      resultRef.current.style.display = "block";
      const canvas = await html2canvas(resultRef.current, {
        logging: false,
        width: 1080,
        height: 1080,
        allowTaint: true,
      });
      const blob: BlobPart = await new Promise((resolve, reject) =>
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob."));
          }
        }, "image/png")
      );
      const file = new File([blob], "result.png", { type: "image/png" });
      resultRef.current.style.display = "none";

      const shareUrl = `${window.location.origin}/result/${id}`;
      const shareData = {
        title: `Results: ${pollName}`,
        text: `Check out the results of "${pollName}" on Decide! ${voterCount} ${
          voterCount === 1 ? "person has" : "people have"
        } voted.`,
        url: shareUrl,
        files: [file],
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          console.log("Web Share API failed, falling back to clipboard", error);
        }
      }

      // Modern fallback using Clipboard API
      const clipboardItem = new ClipboardItem({
        "text/plain": new Blob([shareUrl], { type: "text/plain" }),
      });
      try {
        await navigator.clipboard.write([clipboardItem]);
        enqueueSnackbar("Link copied to clipboard!", { variant: "success" });
      } catch {
        enqueueSnackbar("Failed to copy link. Please try again.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error sharing link:", error);
      enqueueSnackbar("Failed to share the result.", { variant: "error" });
    }
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="text-center space-y-4 mb-12">
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <Trophy className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">{pollName}</h1>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  {voterCount} {voterCount === 1 ? "voter" : "voters"}{" "}
                  participated
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
                </div>
              ) : error ? (
                <p className="text-center text-red-500 py-8">{error}</p>
              ) : (
                <>
                  {/* Results List */}
                  <div className="space-y-4">
                    {rankedChoices.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-blue-600">
                            #{item.rank}
                          </span>
                          <span className="text-lg text-gray-900">
                            {item.text}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Score: {item.score.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl
                                shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleShare}
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share With Image
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 py-6 rounded-xl hover:bg-blue-50"
                      onClick={handleRestart}
                    >
                      <RotateCw className="w-5 h-5 mr-2" />
                      Start New Poll
                    </Button>
                  </div>

                  {/* Share Section */}
                  <div className="pt-8 border-t border-gray-100">
                    <p className="text-gray-600 text-center mb-4">
                      Share this with others and let them decide too!
                    </p>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-700 text-sm truncate">
                        {window.location.origin}/result/{id}
                      </span>
                      <button
                        onClick={handleShare}
                        className="text-blue-600 hover:text-blue-700 ml-2"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <div>
        <ResultImage
          ref={resultRef}
          pollName={pollName}
          totalVotesCount={voterCount}
          rankedChoices={rankedChoices}
        />
      </div>
    </div>
  );
}
