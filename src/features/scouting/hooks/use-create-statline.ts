import { api } from "@/trpc/react";

export const useCreateNewStatline = () => {
  const utils = api.useUtils();

  const createStatline = api.stats.submit.useMutation({
    // onSuccess: async () => {
    //       await utils.stats.getStatlines.invalidate();
    onError: (error) => {
      console.error("Error creating statline:", error);
    },
  });
  return createStatline;
};
