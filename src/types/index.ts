import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type Team = RouterOutput["team"]["getTeams"][number];
export type Activity = RouterOutput["activity"]["getActivities"][number];
export type TeamMember =
  RouterOutput["team"]["getTeamMembers"]["members"][number];
export type UserRequests = RouterOutput["team"]["requestToJoin"];
export type PendingRequest =
  RouterOutput["team"]["getIncomingRequests"][number];

export type TeamInformation = RouterOutput["team"]["getTeam"];

export type User = RouterOutput["user"]["getUser"];

export type TeamMembers = RouterOutput["user"]["getTeamMembers"];
