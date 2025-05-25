"use client";

import type { TeamMembers } from "@/types";
import ReactEcharts from "echarts-for-react";
import { getWeeksOfMonth } from "./utils/get-weeks";

const ChartsBlock = ({ players }: { players: TeamMembers }) => {
  type Week = { label: string; start: string; end: string };
  const weeks: Week[] = getWeeksOfMonth(2025, 1);
  const weekLabels = weeks.map((week: Week) => `${week.label} (${week.start})`);

  const chartOption = {
    xAxis: {
      type: "category",
      data: weekLabels,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
    tooltip: {},
    grid: {},
  };

  return (
    <div className="w-full rounded-lg">
      <ReactEcharts
        option={chartOption}
        notMerge={true}
        lazyUpdate={true}
        theme={"theme_name"}
      />
    </div>
  );
};

export default ChartsBlock;
