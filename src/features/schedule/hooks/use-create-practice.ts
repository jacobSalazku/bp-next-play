import { toastStyling } from "@/features/toast-notification/styling";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useCreatePracticeActivity = (
  teamId: string,
  onClose: () => void,
) => {
  const utils = api.useUtils();

  const createPractice = api.activity.createPractice.useMutation({
    onSuccess: () => {
      void utils.activity.getActivities.invalidate({ teamId: teamId });

      toast.success("Practice created successfully!", toastStyling);

      onClose();
    },
    onError: (error) => {
      console.error("Error creating practice:", error);
    },
  });

  return createPractice;
};
