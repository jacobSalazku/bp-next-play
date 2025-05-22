import { api } from "@/trpc/react";

export const useCreateNewStatline = () => {
  const createStatline = api.stats.submit.useMutation({
    onSuccess: async () => {
      console.log("Statline created successfully");
    },
    onError: (error) => {
      console.error("Error creating statline:", error);
    },
  });
  return createStatline;
};
