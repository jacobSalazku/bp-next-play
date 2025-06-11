import { api } from "@/trpc/react";

export const useCreateGameActivity = (teamId: string, onClose: () => void) => {
  const utils = api.useUtils();

  const createGame = api.activity.createGame.useMutation({
    onSuccess: async () => {
      await utils.activity.getActivities.invalidate({ teamId: teamId });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating game:", error);
    },
  });

  return createGame;
};
