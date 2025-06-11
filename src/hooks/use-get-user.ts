import { api } from "@/trpc/react";

export function useGetUser() {
  const user = api.user.getUser.useSuspenseQuery();

  return user;
}
