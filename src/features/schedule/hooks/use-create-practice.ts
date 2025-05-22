import { api } from "@/trpc/react";

export const useCreatePracticeActivity = (
  teamId: string,
  onClose: () => void,
) => {
  const utils = api.useUtils();

  const createPractice = api.activity.createPractice.useMutation({
    onSuccess: () => {
      void utils.activity.getActivities.invalidate({ teamId: teamId });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating practice:", error);
    },
  });

  return createPractice;
};
