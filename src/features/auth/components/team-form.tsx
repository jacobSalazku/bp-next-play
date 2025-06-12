"use client";

import { Button } from "@/components/foundation/button/button";
import { Input } from "@/components/foundation/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createTeamSchema, type CreateTeamData } from "../zod";

const CreateTeamForm = () => {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<CreateTeamData>({
    resolver: zodResolver(createTeamSchema),
  });

  const createTeam = api.team.createTeam.useMutation();
  const router = useRouter();

  const onSubmit = (data: CreateTeamData) => {
    startTransition(() => {
      createTeam.mutate(
        {
          ...data,
        },
        {
          onSuccess: () => {
            createTeam.reset();
            router.push("/");
          },
        },
      );
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-1/2">
      <div className="mb-4">
        <Input
          id="name"
          label="Team Name"
          type="text"
          {...register("name")}
          error={errors.name}
          errorMessage={errors.name?.message}
        />
      </div>
      <div className="mb-4">
        <Input
          id="name"
          label="Age group"
          type="text"
          {...register("ageGroup")}
          error={errors.ageGroup}
          errorMessage={errors.ageGroup?.message}
        />
      </div>

      <div className="flex items-center justify-between py-4">
        <Button
          className="w-full py-5 text-sm hover:border-gray-950 hover:bg-gray-600 hover:text-white sm:w-1/3"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Team"}
        </Button>
      </div>
    </form>
  );
};

export default CreateTeamForm;
