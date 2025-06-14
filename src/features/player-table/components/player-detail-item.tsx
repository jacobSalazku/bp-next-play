export const PlayerDetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="flex flex-col gap-0.5 text-lg text-white">
    <span className="font-medium text-orange-300/70">{label}</span>
    <span className="text-white/90">
      {value !== null && value !== undefined && value !== "" ? value : "—"}
    </span>
  </div>
);
