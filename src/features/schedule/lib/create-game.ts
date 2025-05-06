import { api } from "@/trpc/react";

export const createGameActivity = (teamId: string, onClose: () => void) => {
  const utils = api.useUtils();

  const createGame = api.activity.createGame.useMutation({
    onSuccess: () => {
      void utils.activity.getActivities.invalidate({ teamId: teamId });
      onClose();
    }, // Add missing comma here
    onError: (error) => {
      console.error("Error creating game:", error);
    },
  });

  return createGame;
};
