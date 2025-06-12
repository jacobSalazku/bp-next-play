import { useTeam } from "@/context/team-context";
import { toastStyling } from "@/features/toast-notification/styling";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const useAttendance = (onClose: () => void) => {
  const { teamSlug } = useTeam();
  const submiteAttendance = api.attendance.submitAttendance.useMutation({
    onSuccess: async () => {
      onClose();
      toast.success("Attendance submitted successfully!", toastStyling);
      redirect(`/${teamSlug}/schedule`);
    },
    onError: (error) => {
      console.error("Error creating game:", error);
    },
  });

  return submiteAttendance;
};
