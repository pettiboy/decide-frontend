import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ResultImage from "@/components/ResultImage";
import { Button } from "@/components/ui/button";
import { getResults, getVoterCount, getNextComparison } from "@/utils/api";
import html2canvas from "html2canvas";
import { HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Loader2,
  RotateCw,
  Share2,
  Users,
  Copy,
  MessageSquare,
  Plus,
} from "lucide-react";
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
  const [hasVoted, setHasVoted] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resultData, voterData, hasVotedStatus] = await Promise.all([
          getResults(id!),
          getVoterCount(id!),
          checkIfUserHasVoted(),
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
          setHasVoted(hasVotedStatus);
        }
      } catch (error) {
        setError("Failed to fetch results. Please try again.");
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleRestart = () => {
    navigate("/create");
  };

  const handleShare = async () => {
    if (!resultRef.current) return;

    setIsSharing(true);
    const shareText = `🤔 Help me decide: "${pollName}"

📊 ${voterCount} people have voted so far!

Cast your vote: ${window.location.origin}/vote/${id} \n`;

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

      const shareData = {
        title: `Help me decide: ${pollName}`,
        text: shareText,
        url: `${window.location.origin}/vote/${id}`,
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

      // Fallback to copying text if image sharing fails
      await navigator.clipboard.writeText(shareText);
      enqueueSnackbar("Share link copied to clipboard!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error sharing:", error);
      // Final fallback - just copy the text
      await navigator.clipboard.writeText(shareText);
      enqueueSnackbar("Share link copied to clipboard!", {
        variant: "success",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(
        id ? `${window.location.origin}/vote/${id}` : ""
      );
      enqueueSnackbar("ID copied to clipboard!", { variant: "success" });
    } catch {
      enqueueSnackbar("Failed to copy ID", { variant: "error" });
    }
  };

  const checkIfUserHasVoted = async () => {
    try {
      const data = await getNextComparison(id!);
      return !data || data.comparisonsRemaining === 0;
    } catch (error) {
      console.error("Error checking vote status:", error);
      return true; // Assume voted on error
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl font-bold text-gray-900">{pollName}</h1>

              {/* Decision ID and Share Button */}
              <div className="flex items-center justify-center">
                <div className="relative flex items-center bg-gray-50/80 px-6 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <code className="text-gray-700 font-mono text-lg tracking-wide bg-white px-3 py-1 rounded-md border border-gray-100">
                      {id}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-white/80 transition-colors"
                      onClick={handleCopyId}
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                      <span className="sr-only">Copy poll ID</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-blue-50 transition-colors"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 text-blue-600" />
                      <span className="sr-only">Share results</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Animated Voters Count as chip */}
              <div className="inline-flex items-center gap-2">
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">
                    {voterCount} {voterCount === 1 ? "voter" : "voters"}
                  </span>
                  <div className="flex items-center gap-1">
                    {/* Subtle pulsing red dot */}
                    <div className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute w-2 h-2 bg-red-500/80 rounded-full animate-pulse"></span>
                    </div>
                    <span className="text-xs text-red-500 font-semibold">
                      LIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-gray-600">Loading results...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Collective Leaderboard
                      </h2>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="inline-flex items-center text-gray-400 hover:text-gray-600">
                            <HelpCircle className="w-4 h-4" />
                            <span className="sr-only">
                              Learn more about ranking
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">
                              How These Rankings Work
                            </h4>
                            <p className="text-sm text-gray-600">
                              Each option's score comes from head-to-head
                              comparisons made by voters. The more often an
                              option is preferred, the higher it ranks. Every
                              vote helps make these rankings more accurate.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Based on {voterCount}{" "}
                      {voterCount === 1
                        ? "person's choices"
                        : "people's choices"}
                    </p>
                  </div>

                  {/* Results List */}
                  <div className="space-y-4">
                    {rankedChoices.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-blue-600 min-w-[48px]">
                            #{item.rank}
                          </span>
                          <span className="text-lg text-gray-900">
                            {item.text}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 min-w-[100px] text-right">
                          Score: {item.score.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {!hasVoted ? (
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl
                                  shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => navigate(`/vote/${id}`)}
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Vote on this Poll
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl
                                  shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={handleShare}
                        disabled={isSharing}
                      >
                        {isSharing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Preparing Share Image...
                          </>
                        ) : (
                          <>
                            <Share2 className="w-5 h-5 mr-2" />
                            Share Results
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="flex-1 py-6 rounded-xl hover:bg-blue-50"
                      onClick={handleRestart}
                    >
                      <RotateCw className="w-5 h-5 mr-2" />
                      Start New Poll
                    </Button>
                  </div>

                  {/* Next Steps */}
                  <div className="mt-8 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      What's Next?
                    </h3>
                    <ul className="space-y-3">
                      {!hasVoted ? (
                        <li className="flex items-start gap-3">
                          <div className="p-1.5 bg-blue-100 rounded-full mt-0.5">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">
                              Cast your vote
                            </p>
                            <p className="text-sm text-gray-600">
                              Each vote helps build a more accurate ranking
                            </p>
                          </div>
                        </li>
                      ) : (
                        <li className="flex items-start gap-3">
                          <div className="p-1.5 bg-blue-100 rounded-full mt-0.5">
                            <Share2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">
                              Share with others
                            </p>
                            <p className="text-sm text-gray-600">
                              More votes = more accurate results
                            </p>
                          </div>
                        </li>
                      )}
                      <li className="flex items-start gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-full mt-0.5">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            Discuss the results
                          </p>
                          <p className="text-sm text-gray-600">
                            Use these rankings to guide your final decision
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-full mt-0.5">
                          <Plus className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            Create another poll
                          </p>
                          <p className="text-sm text-gray-600">
                            Have more decisions to make? Start a new poll
                          </p>
                        </div>
                      </li>
                    </ul>
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
          rankedChoices={rankedChoices}
        />
      </div>
    </div>
  );
}
