import { toastStyling } from "@/features/toast-notification/styling";
import { useCoachDashboardStore } from "@/store/use-coach-dashboard-store";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateGameplan = (teamId: string, onClose: () => void) => {
  const { setActiveCoachTab } = useCoachDashboardStore();
  const router = useRouter();

  const createPlay = api.gameplan.createGamePlan.useMutation({
    onSuccess: async () => {
      setActiveCoachTab("gameplan");

      toast.success("Your gameplan has been succesfully created", {
        ...toastStyling,
        position: "top-right",
      });

      onClose();
      router.refresh();
    },
    onError: (error) => {
      console.error("Error creating play:", error);
    },
  });

  return createPlay;
};
