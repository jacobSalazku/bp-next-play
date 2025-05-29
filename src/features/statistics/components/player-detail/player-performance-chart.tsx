import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import type { StatlinesPerGame } from "@/types";
import type { FC } from "react";
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

type PlayerPerformanceChartProps = {
  data: StatlinesPerGame | null;
  title: string;
  //   description: string
  //   timeFrame: "weekly" | "monthly";
};

export const PlayerPerformanceChart: FC<PlayerPerformanceChartProps> = ({
  data,
  title,
}) => {
  console.log("PlayerPerformanceChart data:", data);
  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {/* <CardDescription className="text-gray-400">
          {description}
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data ?? []}>
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
              name="Blocks"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
