import { Button } from "@/components/foundation/button/button";
import { cn } from "@/utils/tw-merge";
import type { FC } from "react";
import type { StatlineData } from "../../zod/player-stats";

type StatsButtonProps = {
  statKey: keyof StatlineData;
  label: string;
  value: number;
  onIncrement: (key: keyof StatlineData) => void;
  className?: string;
};

const StatButton: FC<StatsButtonProps> = ({
  statKey,
  label,
  value,
  onIncrement,
  className,
}) => (
  <Button
    type="button"
    variant="outline"
    onClick={() => onIncrement(statKey)}
    className={cn(
      className,
      "flex flex-col items-center justify-center rounded-xl py-10",
    )}
  >
    <span className="text-sm font-medium text-white">{label}</span>
    <span className="text-xl font-bold">{value}</span>
  </Button>
);

export { StatButton };
