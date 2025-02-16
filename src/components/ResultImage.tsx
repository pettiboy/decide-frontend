import { Trophy } from "lucide-react";
import { forwardRef } from "react";

interface RankedChoice {
  id: number;
  text: string;
  score: number;
  rank: number;
}

interface ResultImageProps {
  pollName: string;
  rankedChoices: RankedChoice[];
}

const ResultImage = forwardRef<HTMLDivElement, ResultImageProps>(
  ({ pollName, rankedChoices }, ref) => {
    // Truncate long text
    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    };

    return (
      <div
        ref={ref}
        style={{
          display: "none",
          width: "1080px",
          height: "1080px",
          background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
          padding: "60px",
          flexDirection: "column",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            background:
              "repeating-linear-gradient(45deg, #6366f1 0, #6366f1 1px, transparent 0, transparent 50px)",
            zIndex: 0,
          }}
        />

        {/* Content Container */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                background: "#EEF2FF",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Trophy
                style={{ width: "40px", height: "40px", color: "#4F46E5" }}
              />
            </div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#1F2937",
                marginBottom: "16px",
                lineHeight: 1.2,
              }}
            >
              {truncateText(pollName, 40)}
            </h1>
          </div>

          {/* Results List */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {rankedChoices.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#4F46E5",
                    minWidth: "60px",
                  }}
                >
                  #{item.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "24px",
                      color: "#1F2937",
                      fontWeight: "500",
                    }}
                  >
                    {truncateText(item.text, 60)}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      color: "#6B7280",
                      marginTop: "4px",
                    }}
                  >
                    Score: {item.score.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "40px",
              textAlign: "center",
              // background: "#4F46E5",
              padding: "12px 32px",
              borderRadius: "999px",
              display: "inline-block",
              alignSelf: "center",
            }}
          >
            Powered by{" "}
            <p
              style={{
                fontSize: "24px",
                fontWeight: "500",
                verticalAlign: "center",
              }}
            >
              decide.somehow.dev
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ResultImage.displayName = "ResultImage";

export default ResultImage;
