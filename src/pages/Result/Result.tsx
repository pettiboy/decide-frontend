import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function Result() {
  const { decisionId } = useParams();
  const rankedChoices = [
    { rank: 1, choice: "choice 3" },
    { rank: 2, choice: "choice 2" },
    { rank: 3, choice: "choice 1" },
    { rank: 4, choice: "choice 4" },
    { rank: 5, choice: "choice 5" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-lg p-4 sm:p-6 lg:p-8 shadow-xl rounded-3xl bg-white">
        <CardContent className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-center">Results</h1>
          <ul className="space-y-2 text-lg">
            {rankedChoices.map((item) => (
              <li key={item.rank} className="text-gray-700">
                {item.rank}. {item.choice}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
