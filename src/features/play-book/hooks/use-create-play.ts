import { toastStyling } from "@/features/toast-notification/styling";
import { useCoachDashboardStore } from "@/store/use-coach-dashboard-store";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const useCreatePlay = (teamId: string) => {
  const utils = api.useUtils();
  const { setActiveCoachTab } = useCoachDashboardStore();

  const createPlay = api.play.createPlay.useMutation({
    onSuccess: async () => {
      void utils.play.getPlays.invalidate({ teamId });
      setActiveCoachTab("play");

      toast.success("Your play has been successfully created", {
        ...toastStyling,
        position: "top-right",
      });

      redirect(`/${teamId}/playbook-library`);
    },
  });

  return createPlay;
};
