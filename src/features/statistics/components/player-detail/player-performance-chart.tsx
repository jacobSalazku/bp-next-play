import { Button } from "@/components/foundation/button/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import { ChevronLeft } from "lucide-react";
import { useState, type FC } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStatsPerGame } from "../../hooks/use-stats-per-game";
import type { PlayerStatRow } from "../../utils/types";

type PlayerPerformanceChartProps = {
  player: PlayerStatRow;
  title: string;
};

export const PlayerPerformanceChart: FC<PlayerPerformanceChartProps> = ({
  player,
  title,
}) => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const weeklyStatsQuery = useStatsPerGame({
    teamMemberId: player.teamMemberId,
    year,
    month,
  });

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const fallbackData = [
    {
      gameTitle: "No Games",
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
    },
  ];

  console.log("statPerGame", weeklyStatsQuery[0]);
  return (
    <Card className="border-gray-800 bg-gray-950 px-4 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-4 py-2">
        <Button onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4 text-orange-300" />
        </Button>
        <span className="text-lg font-bold text-white">
          {new Date(year, month - 1).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <Button onClick={nextMonth}>
          {" "}
          <ChevronLeft className="h-4 w-4 rotate-180 text-orange-300" />
        </Button>
      </div>
      <CardHeader className="py-2">
        <CardTitle className="px-2 py-3 text-2xl text-white">{title}</CardTitle>
        s
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={
              weeklyStatsQuery[0] && weeklyStatsQuery[0].length > 0
                ? weeklyStatsQuery[0]
                : fallbackData
            }
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="gameTitle" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F3F4F6",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#FB923C"
              strokeWidth={3}
              name="Points"
            />
            <Line
              type="monotone"
              dataKey="assists"
              stroke="#FDBA74"
              strokeWidth={3}
              name="Assists"
            />
            <Line
              type="monotone"
              dataKey="rebounds"
              stroke="#FED7AA"
              strokeWidth={3}
              name="Rebounds"
            />
            <Line
              type="monotone"
              dataKey="blocks"
              stroke="#FFEDD5"
              strokeWidth={3}
              name="Blocks"
            />
            <Line
              type="monotone"
              dataKey="steals"
              stroke="#FFEDD5"
              strokeWidth={3}
              name="Steals"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
