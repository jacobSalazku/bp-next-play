"use client";
import { Button } from "@/components/button/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { positionOptions } from "../utils/constants";
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
          console.log("request to join team successfully!");
          joinTeam.reset();
          router.push("/");
        },
        onError: (error) => {
          console.error("Error creating team:", error);
        },
      });
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("Validation errors:", errors);
      })}
      className="space-y-4"
    >
      <Input
        id="teamCode"
        aria-label="Enter team code:"
        label="Enter team code:"
        type="text"
        {...register("teamCode")}
        error={errors.teamCode}
        errorMessage={errors.teamCode?.message}
      />
      <RadioGroup className="flex flex-row gap-4">
        {positionOptions.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              id={`position-${option.value}`}
              {...register("position")}
            />
            <label
              htmlFor={`position-${option.value}`}
              className="text-sm text-gray-800 dark:text-white"
            >
              {option.value}
            </label>
          </div>
        ))}
      </RadioGroup>
      <Input
        id="teamCode"
        aria-label="Enter Jersey Number:"
        label="Jersey Number"
        type="text"
        variant="dark"
        {...register("number")}
        error={errors.number}
        errorMessage={errors.number?.message}
      />
      <div className="space-2 flex items-center justify-between pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Joining..." : "Request to Join"}
        </Button>
      </div>
    </form>
  );
};

export { JoinTeamForm };
