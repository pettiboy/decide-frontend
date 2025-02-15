import { forwardRef } from "react";

interface RankedChoice {
  id: number;
  text: string;
  score: number;
  rank: number;
}

interface ResultImageProps {
  pollName: string;
  totalVotesCount: number;
  rankedChoices: RankedChoice[];
}

const ResultImage = forwardRef<HTMLDivElement, ResultImageProps>(
  ({ pollName, totalVotesCount, rankedChoices }, ref) => {
    // Truncate long text
    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    };

    return (
      <div
        ref={ref}
        className="hidden"
        style={{
          width: "1080px",
          height: "1080px", // 1:1 aspect ratio
          background: "white",
          padding: "80px 60px", // Adjusted padding for better layout
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {truncateText(pollName, 50)}
          </h1>
          <p className="text-lg text-gray-600">
            {totalVotesCount} {totalVotesCount === 1 ? "voter" : "voters"}{" "}
            decided
          </p>
        </div>

        {/* Results List */}
        <div className="space-y-4 flex-grow">
          {rankedChoices.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-gray-200 pb-4"
            >
              <span className="text-2xl font-bold text-blue-600">
                {item.rank}
              </span>
              <div className="flex-1">
                <p className="text-lg text-gray-900">
                  {truncateText(item.text, 100)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Score: {item.score.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xl font-bold text-white px-4 py-2 rounded-full inline-block">
            decide.somehow.dev
          </p>
        </div>
      </div>
    );
  }
);

ResultImage.displayName = "ResultImage";

export default ResultImage;
