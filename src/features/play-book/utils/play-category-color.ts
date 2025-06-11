export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "offense":
      return "bg-orange-900 text-orange-300 border-orange-500/30";
    case "defense":
      return "bg-blue-900 text-blue-400 border-blue-300";
    default:
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  }
};
