import { api } from "@/trpc/react";

export const useAttendance = (onClose: () => void) => {
  const submiteAttendance = api.attendance.submitAttendance.useMutation({
    onSuccess: async () => {
      onClose();
      console.log("submitted attendance successfully");
    }, // Add missing comma here
    onError: (error) => {
      console.error("Error creating game:", error);
    },
  });

  return submiteAttendance;
};
