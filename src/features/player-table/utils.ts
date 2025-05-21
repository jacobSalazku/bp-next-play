export const getFullPosition = (position: string | null) => {
  switch (position) {
    case "PG":
      return "Point Guard";
    case "SG":
      return "Shooting Guard";
    case "SF":
      return "Small Forward";
    case "PF":
      return "Power Forward";
    case "C":
      return "Center";
    default:
      return null;
  }
};
