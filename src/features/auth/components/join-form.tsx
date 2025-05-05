"use client";
import { Button } from "@/components/button/button";
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
    formState: { errors },
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
        <label
          htmlFor="teamCode"
          className="mb-2 block text-sm font-semibold text-neutral-500"
        >
          Enter team code:
        </label>
        <input
          type="text"
          id="teamCode"
          {...register("teamId")}
          className="focus:shadow-outline w-full rounded border border-neutral-300 px-3 py-2 leading-tight text-black shadow focus:outline-none"
        />
        {errors.teamId && (
          <p className="text-xs text-red-500 italic">{errors.teamId.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button type="submit" variant="outline" disabled={isPending}>
          {isPending ? "Creating..." : "Request to Join"}
        </Button>
      </div>
    </form>
  );
};

export { JoinTeamForm };
