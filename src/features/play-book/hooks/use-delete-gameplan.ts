import { toastStyling } from "@/features/toast-notification/styling";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const useDeleteGameplan = (teamId: string) => {
  const utils = api.useUtils();

  const deletePlay = api.gameplan.deleteGamePlan.useMutation({
    onSuccess: async () => {
      await utils.gameplan.invalidate();
      console.log("Successfully deleted Gameplan");

      toast.success("Gameplan has been Deleted", {
        position: "top-right",
        icon: "🗑️",
        ...toastStyling,
      });

      redirect(`/${teamId}/playbook-library`);
    },
  });

  return deletePlay;
};
