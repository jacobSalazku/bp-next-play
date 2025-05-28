"use client";

import type { Statlines } from "@/types";
import { PlayerAveragesTable } from "./components/player-stats-table";

type ChartsBlockProps = {
  statsList: Statlines;
};

const ChartsBlock: React.FC<ChartsBlockProps> = ({ statsList }) => {
  return (
    <div className="w-full gap-2 space-y-4 rounded-lg p-4 md:flex md:space-y-0 md:space-x-4">
      {/* <ReactEcharts
        option={chartOption}
        notMerge={true}
        lazyUpdate={true}
        theme={"theme_name"}
        className="w-2/3 rounded-lg border p-2 text-white"
      /> */}
      <PlayerAveragesTable statsList={statsList} />
    </div>
  );
};

export default ChartsBlock;
