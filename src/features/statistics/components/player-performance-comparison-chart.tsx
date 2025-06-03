import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import type { Statlines } from "@/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PerformanceComparisonChartProps = {
  statsList: Statlines;
};

export const PerformanceComparisonChart = ({
  statsList,
}: PerformanceComparisonChartProps) => {
  const chartData = statsList.map((player) => ({
    name: player.name,
    points: player.averages.pointsPerGame,
    assists: player.averages.assists,
    rebounds:
      Number(player.averages.offensiveRebound) +
      Number(player.averages.defensiveRebound),
    blocks: player.averages.blocks,
  }));

  return (
    <Card className="w-full border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          Player Performance Comparison
        </CardTitle>
        <CardDescription className="text-gray-400">
          Top Player Statistics
        </CardDescription>
      </CardHeader>

      <ResponsiveContainer className="w-full" width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F3F4F6",
            }}
          />
          <Legend className="text-sm" />
          <Bar
            dataKey="points"
            fill="#FB923C"
            name="Points"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="assists"
            fill="#FDBA74"
            name="Assists"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="rebounds"
            fill="#FED7AA"
            name="Rebounds"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="blocks"
            fill="#FFEDD5"
            name="Blocks"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
