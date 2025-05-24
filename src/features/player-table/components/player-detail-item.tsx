const PlayerDetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="flex flex-col text-sm">
    <h4 className="text-muted-foreground mb-1 font-medium">{label}</h4>
    <p>{value}</p>
  </div>
);

export default PlayerDetailItem;
