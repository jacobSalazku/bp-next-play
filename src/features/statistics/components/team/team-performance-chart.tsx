import { Button } from "@/components/foundation/button/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import { useTeam } from "@/context/team-context";
import { useState } from "react";
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
import { useWeeklyTeamAverages } from "../../hooks/use-weekly-team-averages";

const TeamPerfomanceChart = ({ title }: { title: string }) => {
  const { teamSlug } = useTeam();
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;

  const weeklyStats = useWeeklyTeamAverages({
    teamId: teamSlug,
  });

  const paginatedData = weeklyStats[0]?.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage,
  );

  const totalItems = weeklyStats[0]?.length;

  const handlePrevPage = () => {
    setPage((currentPage) => Math.max(0, currentPage - 1));
  };

  // Handler to go to next page
  const handleNextPage = () => {
    setPage((currentPage) =>
      (currentPage + 1) * itemsPerPage < totalItems
        ? currentPage + 1
        : currentPage,
    );
  };

  return (
    <Card className="w-full border-gray-800 bg-gray-950 px-4 py-4 backdrop-blur-sm">
      <CardHeader className="py-2">
        <CardTitle className="px-2 py-3 text-2xl text-white">{title}</CardTitle>
        <div className="mt-2 flex justify-center space-x-4">
          <Button onClick={handlePrevPage} disabled={page === 0}>
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={(page + 1) * itemsPerPage >= totalItems}
          >
            Next
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={paginatedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="weekStart" stroke="#9CA3AF" fontSize={12} />
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
              dataKey="averages.pointsPerGame"
              stroke="#FB923C"
              strokeWidth={3}
              name="Points"
            />
            <Line
              type="monotone"
              dataKey="averages.assists"
              stroke="#FDBA74"
              strokeWidth={3}
              name="Assists"
            />
            <Line
              type="monotone"
              dataKey="averages.rebounds"
              stroke="#FED7AA"
              strokeWidth={3}
              name="Rebounds"
            />
            <Line
              type="monotone"
              dataKey="averages.blocks"
              stroke="#FFEDD5"
              strokeWidth={3}
              name="Blocks"
            />
            <Line
              type="monotone"
              dataKey="averages.steals"
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

export default TeamPerfomanceChart;
