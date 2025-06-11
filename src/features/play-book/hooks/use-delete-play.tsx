import { useTeam } from "@/context/team-context";
import { toastStyling } from "@/features/toast-notification/styling";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const useDeletePlay = () => {
  const { teamSlug } = useTeam();
  const utils = api.useUtils();

  const deletePlay = api.play.deletePlay.useMutation({
    onSuccess: async () => {
      await utils.play.getPlays.invalidate();
      console.log("Successfully deleted play");

      toast.success("Play has been Deleted", {
        position: "top-right",
        icon: "🗑️",
        ...toastStyling,
      });

      redirect(`/${teamSlug}/playbook-library`);
    },
  });

  return deletePlay;
};
