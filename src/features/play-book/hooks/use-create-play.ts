import { api } from "@/trpc/react";
import { redirect } from "next/navigation";

export const useCreatePlay = (teamId: string) => {
  const utils = api.useUtils();

  const createPlay = api.play.createPlay.useMutation({
    onSuccess: async () => {
      void utils.play.getAllPlays.invalidate({ teamId });
      redirect(`/${teamId}/playbook-library`);
    }, // Add missing comma here
    onError: (error) => {
      console.error("Error creating play:", error);
    },
  });

  return createPlay;
};
