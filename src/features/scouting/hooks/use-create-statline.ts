import { api } from "@/trpc/react";

export const useCreateNewStatline = () => {
  const utils = api.useUtils();
  const createStatline = api.stats.submit.useMutation({
    onSuccess: async () => {
      void utils.stats.invalidate();
      console.log("Statline created successfully");
    },
    onError: (error) => {
      console.error("Error creating statline:", error);
    },
  });
  return createStatline;
};
