import { useTeam } from "@/context/team-context";
import { toastStyling } from "@/features/toast-notification/styling";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const useDeletePlay = () => {
  const { teamSlug } = useTeam();
  const utils = api.useUtils();

  const deletePlay = api.user.deleteTeamMember.useMutation({
    onSuccess: async () => {
      await utils.member.getTeamMembers.invalidate();

      toast.error("Player has been kicked off team", {
        position: "top-right",
        icon: "🗑️",
        ...toastStyling,
      });
      redirect(`/${teamSlug}/players`);
    },
  });

  return deletePlay;
};
