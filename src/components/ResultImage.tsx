import React from "react";

interface RankedChoice {
  id: number;
  text: string;
  score: number;
  rank: number;
}

interface ResultImageProps {
  ref: React.Ref<HTMLDivElement>;
  pollName: string;
  totalVotesCount: number;
  rankedChoices: RankedChoice[];
}

const ResultImage: React.FC<ResultImageProps> = ({
  ref,
  pollName,
  totalVotesCount,
  rankedChoices,
}) => {
  // Use smaller padding if there are many choices
  const containerPadding = rankedChoices.length > 5 ? "p-6" : "p-12";
  const itemPadding = rankedChoices.length > 5 ? "p-2" : "p-4";

  return (
    <div
      ref={ref}
      className={`${containerPadding} bg-white rounded-2xl border border-gray-200 hidden`}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{pollName}</h1>
        <p className="text-lg text-gray-600">
          Based on {totalVotesCount} {totalVotesCount === 1 ? "vote" : "votes"}
        </p>
      </div>
      <div className="space-y-4">
        {rankedChoices.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between ${itemPadding} bg-gray-50 rounded-xl`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-blue-600">
                #{item.rank}
              </span>
              <span className="text-lg text-gray-900">{item.text}</span>
            </div>
            <span className="text-sm text-gray-500">
              Score: {item.score.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="text-center mt-8 mb-4">
        <p className="text-sm text-gray-500">Powered by decide.somehow.dev</p>
      </div>
    </div>
  );
};

export default ResultImage;
