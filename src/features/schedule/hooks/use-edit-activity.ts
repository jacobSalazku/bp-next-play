import { api } from "@/trpc/react";

export const useEditPracticeActivity = (
  teamId: string,
  onClose: () => void,
) => {
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

export const useEditGameActivity = (teamId: string, onClose: () => void) => {
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
