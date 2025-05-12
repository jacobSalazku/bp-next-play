import { api } from "@/trpc/react";

export const editPracticeActivity = (teamId: string, onClose: () => void) => {
  const utils = api.useUtils();

  const editPractice = api.activity.editPractice.useMutation({
    onSuccess: () => {
      void utils.activity.getActivities.invalidate({ teamId: teamId });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating practice:", error);
    },
  });

  return editPractice;
};

export const editGameActivity = (teamId: string, onClose: () => void) => {
  const utils = api.useUtils();

  const editPractice = api.activity.editGame.useMutation({
    onSuccess: () => {
      void utils.activity.getActivities.invalidate({ teamId: teamId });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating practice:", error);
    },
  });

  return editPractice;
};
