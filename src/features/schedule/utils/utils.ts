import { Trophy, Users } from "lucide-react";
type ActivityType = "Game" | "Practice" | "Other";

export function getTypeBgColor(type: string): string {
  switch (type.toLowerCase()) {
    case "game":
      return "bg-indigo-300 text-indigo-800"; // closest to #a5b4fc
    case "practice":
      return "bg-green-300 text-green-700"; // closest to #a7f3d0
    case "other":
      return "bg-red-200 text-red-950"; // closest to #fecaca
    default:
      return "bg-slate-200 text-slate-950"; // closest to #cbd5e1
  }
}

export function getActivityStyle(type: string) {
  switch (type) {
    case "Game":
      return {
        bgColor: "bg-yellow-900",
        textColor: "text-yellow-300",
        Icon: Trophy,
      };
    case "Practice":
      return {
        bgColor: "bg-blue-900",
        textColor: "text-blue-300",
        Icon: Users,
      };
    default:
      return {
        bgColor: "bg-gray-900",
        textColor: "text-gray-300",
        Icon: Users,
      };
  }
}
