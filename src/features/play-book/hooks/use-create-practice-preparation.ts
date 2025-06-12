import { toastStyling } from "@/features/toast-notification/styling";
import { useCoachDashboardStore } from "@/store/use-coach-dashboard-store";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreatePracticePreparation = (
  onClose: () => void,
  resetForm: () => void,
) => {
  const { setActiveCoachTab } = useCoachDashboardStore();
  const utils = api.useUtils();
  const router = useRouter();

  const createPracticePreparation =
    api.practice.createPracticePreparation.useMutation({
      onSuccess: async () => {
        setActiveCoachTab("gameplan");
        await utils.gameplan.invalidate();
        onClose();

        toast.success("Your gameplan has been successfully created", {
          ...toastStyling,
          position: "top-right",
        });

        resetForm();
        void router.refresh();
      },
      onError: () => {
        toast.error("Failed to create gameplan. Please try again.", {
          ...toastStyling,
          position: "top-right",
        });
      },
    });

  return createPracticePreparation;
};
