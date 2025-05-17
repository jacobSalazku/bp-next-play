"use client";
import { Button } from "@/components/button/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { type JoinTeamFormData, joinTeamSchema } from "../zod";

const JoinTeamForm = () => {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<JoinTeamFormData>({
    resolver: zodResolver(joinTeamSchema),
  });
  const joinTeam = api.team.requestToJoin.useMutation();
  const router = useRouter();

  const onSubmit = (data: JoinTeamFormData) => {
    startTransition(() => {
      joinTeam.mutate(data, {
        onSuccess: () => {
          // Handle success (e.g., reset form, show success message)
          console.log("request to join team successfully!");
          joinTeam.reset();
          router.push("/");
        },
        onError: (error) => {
          // Handle error (e.g., display error message)
          console.error("Error creating team:", error);
        },
      });
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Enter team code:"
          aria-label="Enter team code:"
          type="text"
          id="teamCode"
          variant="dark"
          {...register("teamCode")}
          className="border-gray-700 bg-white text-black focus:ring-2 focus:ring-yellow-500 focus:outline-none"
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Creating..." : "Request to Join"}
        </Button>
      </div>
    </form>
  );
};

export { JoinTeamForm };
