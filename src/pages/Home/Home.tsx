import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md p-4 sm:p-6 lg:p-8 shadow-lg rounded-2xl bg-white">
        <CardContent className="flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-semibold">Decision</h1>
          <Button
            className="w-full text-lg font-medium"
            onClick={() => navigate("/create")}
          >
            Start
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
