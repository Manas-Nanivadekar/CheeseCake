import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

const mockLeaderboardData = [
  { id: "1", name: "Alex Thompson", score: 2840, rank: 1 },
  { id: "2", name: "Sarah Chen", score: 2720, rank: 2 },
  { id: "3", name: "Mike Rodriguez", score: 2650, rank: 3 },
  { id: "4", name: "Emma Wilson", score: 2500 },
  { id: "5", name: "James Lee", score: 2480 },
];

const Leaderboard = ({ entries = mockLeaderboardData }) => {
  const getRankStyles = (rank: any) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case 2:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
      case 3:
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      default:
        return "bg-white dark:bg-gray-800/30 border-gray-100 dark:border-gray-700";
    }
  };

  const getRankIcon = (rank: any) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${getRankStyles(
                  entry.rank
                )}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {entry.name}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {entry.score.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
