import { toastStyling } from "@/features/toast-notification/styling";
import { useCoachDashboardStore } from "@/store/use-coach-dashboard-store";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const useCreateGameplan = (teamId: string, onClose: () => void) => {
  const { setActiveCoachTab } = useCoachDashboardStore();

  const createPlay = api.play.createGamePlan.useMutation({
    onSuccess: async () => {
      setActiveCoachTab("gameplan");

      toast.success("Your gameplan has been succesfully created", {
        ...toastStyling,
        position: "top-right",
      });

      onClose();
      redirect(`/${teamId}/playbook-library`);
    },
    onError: (error) => {
      console.error("Error creating play:", error);
    },
  });

  return createPlay;
};
