"use client";

import { api } from "@/trpc/react";

export const useUpdateUser = () => {
  const updateUser = api.user.updateUser.useMutation({
    onSuccess: () => {
      console.log("User updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  return updateUser;
};
