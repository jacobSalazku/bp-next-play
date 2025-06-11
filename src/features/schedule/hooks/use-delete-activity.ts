import { toastStyling } from "@/features/toast-notification/styling";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useDeleteActivity = (teamId: string) => {
  const utils = api.useUtils();

  const createPractice = api.activity.deleteActivity.useMutation({
    onSuccess: async () => {
      await utils.activity.getActivities.refetch({
        teamId: teamId,
      });

      toast.success("Gameplan has been Deleted", {
        position: "top-right",
        icon: "🗑️",
        ...toastStyling,
      });
    },
    onError: (error) => {
      console.error("Error creating practice:", error);
    },
  });

  return createPractice;
};
