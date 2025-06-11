import { toastStyling } from "@/features/toast-notification/styling";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const useDeletePracticePreparation = (teamId: string) => {
  const utils = api.useUtils();

  const deletePlay = api.gameplan.deleteGamePlan.useMutation({
    onSuccess: async () => {
      await utils.gameplan.invalidate();
      console.log("Successfully deleted Practice Preparation");

      toast.success("Praparation has been Deleted", {
        position: "top-right",
        icon: "🗑️",
        ...toastStyling,
      });

      redirect(`/${teamId}/playbook-library`);
    },
  });

  return deletePlay;
};
