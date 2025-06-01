import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type Team = RouterOutput["team"]["getTeams"][number];

export type Activity = RouterOutput["activity"]["getActivities"][number];

export type TeamMember = RouterOutput["member"]["getTeamMembers"][number];

export type UserRequests = RouterOutput["team"]["requestToJoin"];

export type PendingRequest =
  RouterOutput["team"]["getIncomingRequests"][number];

export type TeamInformation = RouterOutput["team"]["getTeam"];

export type User = RouterOutput["user"]["getUser"];

export type TeamMembers = RouterOutput["member"]["getActiveTeamMembers"];

export type Role = RouterOutput["team"]["getTeamRole"];

export type PlayerInformation = RouterOutput["member"]["getTeamMember"];

export type UserTeamMember = RouterOutput["user"]["getUser"]["teamMember"];

export type AverageStatline = RouterOutput["stats"]["getStatlineAverage"];

export type Statlines = RouterOutput["stats"]["getStatlineAverage"];

export type StatlinesPerGame = RouterOutput["stats"]["getStatsPerGame"];

export type TeamStats = RouterOutput["stats"]["getTeamStats"];

export type ActivityInformation = RouterOutput["activity"]["getActivity"];
