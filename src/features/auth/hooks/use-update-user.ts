import { api } from "@/trpc/react";

export const useUpdateUser = () => {
  const updateUser = api.user.updateUser.useMutation({
    onSuccess: () => {
      console.log("User updated successfully");
    }, // Add missing comma here
    onError: (error) => {
      console.error("Error creating game:", error);
    },
  });

  return updateUser;
};
