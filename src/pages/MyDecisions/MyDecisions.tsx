import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getMyDecisions, getVoterCount } from "@/utils/api";
import { Loader2, Plus, Vote, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

interface Decision {
  id: string;
  title: string | null;
  createdAt: string;
  voterCount?: number;
}

type DecisionType = "all" | "created" | "voted";

export default function MyDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<DecisionType>("all");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchDecisions(type);
  }, [type]);

  const fetchDecisions = async (type: DecisionType) => {
    try {
      setLoading(true);
      const data = await getMyDecisions(type);

      const decisionsWithVoters = await Promise.all(
        data.decisions.map(async (decision: Decision) => {
          const voterData = await getVoterCount(decision.id);
          return {
            ...decision,
            voterCount: voterData.numberOfVoters,
          };
        })
      );

      setDecisions(decisionsWithVoters);
    } catch (error) {
      console.error("Error fetching decisions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent, decisionId: string) => {
    e.stopPropagation();
    try {
      const shareUrl = `${window.location.origin}/decide/${decisionId}`;
      const shareData = {
        title: `Vote on "${
          decisions.find((d) => d.id === decisionId)?.title ||
          "Untitled Decision"
        }"`,
        text: "Help make this decision on Decide!",
        url: shareUrl,
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
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold text-gray-900">
                My <span className="text-blue-600">Decisions</span>
              </h1>
              <div className="flex justify-center gap-4">
                <Button
                  variant={type === "all" ? "default" : "outline"}
                  className={`px-6 py-2 rounded-full ${
                    type === "all" ? "bg-blue-600 hover:bg-blue-700" : ""
                  }`}
                  onClick={() => setType("all")}
                >
                  All
                </Button>
                <Button
                  variant={type === "created" ? "default" : "outline"}
                  className={`px-6 py-2 rounded-full ${
                    type === "created" ? "bg-blue-600 hover:bg-blue-700" : ""
                  }`}
                  onClick={() => setType("created")}
                >
                  Created
                </Button>
                <Button
                  variant={type === "voted" ? "default" : "outline"}
                  className={`px-6 py-2 rounded-full ${
                    type === "voted" ? "bg-blue-600 hover:bg-blue-700" : ""
                  }`}
                  onClick={() => setType("voted")}
                >
                  Voted
                </Button>
              </div>
            </div>

            {/* Create New Decision Button */}
            <div className="mb-8">
              <Button
                className="w-full bg-white border border-gray-200 hover:border-blue-200 
                           text-gray-700 hover:text-blue-600 shadow-sm hover:shadow-md 
                           transition-all duration-300 p-6 rounded-xl"
                onClick={() => navigate("/create")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Decision
              </Button>
            </div>

            {/* Decisions List */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
                </div>
              ) : decisions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No decisions found
                </div>
              ) : (
                decisions.map((decision) => (
                  <div
                    key={decision.id}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md 
                             cursor-pointer transition-all duration-300 border border-gray-100"
                    onClick={() => navigate(`/decide/${decision.id}`)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {decision.title || "Untitled Decision"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created{" "}
                          {new Date(decision.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Vote className="w-4 h-4" />
                          {decision.voterCount || 0}{" "}
                          {decision.voterCount === 1 ? "voter" : "voters"}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-blue-600"
                        onClick={(e) => handleShare(e, decision.id)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
