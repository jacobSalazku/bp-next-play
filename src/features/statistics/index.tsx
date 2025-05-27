"use client";

import ReactEcharts from "echarts-for-react";
import type { StatlineAverageResult } from "./zod";

type ChartsBlockProps = {
  // players: TeamMembers;
  // singleStatline: SinlgePlayerStatline;
  // activityStats: StatlineAverageResult[];
  statsPerActivity: StatlineAverageResult[];
};

const ChartsBlock: React.FC<ChartsBlockProps> = ({ statsPerActivity }) => {
  const chartOption = {
    title: { text: `Assists per Activity` },
    xAxis: {
      type: "category",
      data: statsPerActivity.map((entry) =>
        entry.date
          ? `${new Date(entry.date).toLocaleDateString()} ${entry.title}`
          : "",
      ),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "FG made",
        data: statsPerActivity.map((entry) => entry.value ?? 0),
        type: "bar",
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
  };

  return (
    <div className="w-full gap-2 space-y-4 rounded-lg p-4 md:flex md:space-y-0 md:space-x-4">
      <ReactEcharts
        option={chartOption}
        notMerge={true}
        lazyUpdate={true}
        theme={"theme_name"}
        className="w-2/3 rounded-lg border p-2 text-white"
      />
    </div>
  );
};

export default ChartsBlock;
