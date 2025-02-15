import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ResultImage from "@/components/ResultImage";
import { Button } from "@/components/ui/button";
import { getResults, getVoterCount } from "@/utils/api";
import html2canvas from "html2canvas";

import { Camera, Loader2, RotateCw, Share2, Trophy } from "lucide-react";
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
    navigate("/");
  };

  const handleShare = async () => {
    if (!resultRef.current) return;
    try {
      resultRef.current.style.display = "block";
      const canvas = await html2canvas(resultRef.current, {
        scale: 5,
        logging: false,
        backgroundColor: "#ffffff",
        width: 1080,
        height: 1080,
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
        title: "Decide - Voting Results",
        text: "Check out my ranked results from Decide!",
        url: shareUrl,
        files: [file],
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

  const handleShareToInstagram = async () => {
    if (!resultRef.current) return;
    try {
      resultRef.current.style.display = "block";
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
        width: 1080,
        height: 1920,
      });
      resultRef.current.style.display = "none";

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob as Blob), "image/png", 1.0);
      });

      const file = new File([blob], "result.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Decide - Voting Results",
          text: `Check out the results for "${pollName}"!`,
        });
      } else {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "decide-result.png";
        link.click();
        enqueueSnackbar("Image downloaded successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
      enqueueSnackbar("Failed to create shareable image.", {
        variant: "error",
      });
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
                      onClick={handleRestart}
                    >
                      <RotateCw className="w-5 h-5 mr-2" />
                      Create New Poll
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 py-6 rounded-xl hover:bg-blue-50"
                      onClick={handleShare}
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share Link
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 py-6 rounded-xl hover:bg-blue-50"
                      onClick={handleShareToInstagram}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Share Image
                    </Button>
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
