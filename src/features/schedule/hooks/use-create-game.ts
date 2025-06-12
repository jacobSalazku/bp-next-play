import { toastStyling } from "@/features/toast-notification/styling";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useCreateGameActivity = (teamId: string, onClose: () => void) => {
  const utils = api.useUtils();

  const createGame = api.activity.createGame.useMutation({
    onSuccess: async () => {
      await utils.activity.getActivities.invalidate({ teamId: teamId });
      onClose();
      toast.success("Your Game has been successfully created", {
        ...toastStyling,
        position: "top-right",
      });
    },
    onError: (error) => {
      console.error("Error creating game:", error);
    },
  });

  return createGame;
};
