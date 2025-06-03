import { activityRouter } from "./routers/activity";
import { attendanceRouter } from "./routers/attendance";
import { memberRouter } from "./routers/member";
import { playRouter } from "./routers/play";
import { statsRouter } from "./routers/statline";
import { teamRouter } from "./routers/team";
import { userRouter } from "./routers/user";

import { createCallerFactory, createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  play: playRouter,
  team: teamRouter,
  user: userRouter,
  activity: activityRouter,
  stats: statsRouter,
  member: memberRouter,
  attendance: attendanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
