"use client";

import { Button } from "@/components/foundation/button/button";
import { Input } from "@/components/foundation/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
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
    setValue,
    formState: { errors },
  } = useForm<CreateTeamData>({
    resolver: zodResolver(createTeamSchema),
  });

  const createTeam = api.team.createTeam.useMutation();
  const router = useRouter();

  const handleFile = (selected: File) => {
    setFile(selected);
    setValue("image", selected.name);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setValue("image", "");
  };

  const onSubmit = (data: CreateTeamData) => {
    startTransition(() => {
      createTeam.mutate(
        {
          ...data,
          image: file ? file.name : undefined,
        },
        {
          onSuccess: (newTeam) => {
            createTeam.reset();
            router.push("/");
          },
        },
      );
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
      {!previewUrl ? (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="mb-4 cursor-pointer rounded-md border border-dashed border-neutral-400 p-6 text-center hover:border-neutral-600 hover:bg-neutral-100"
        >
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/cloud-icon.svg"
              alt="Upload"
              width={100}
              height={100}
              className="mb-4 h-16 w-16 object-contain"
            />
            <p className="text-sm text-gray-600">
              Drag & drop image or {""}
              <label className="cursor-pointer text-indigo-600 underline">
                Browse
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </p>
          </div>
        </div>
      ) : (
        <div className="relative mb-4">
          <Image
            width={100}
            height={100}
            src={previewUrl}
            alt="Preview"
            className="max-h-64 w-full rounded object-contain shadow"
          />
          <button
            aria-label="Remove file"
            onClick={removeFile}
            type="button"
            className="absolute top-2 right-2 rounded-full bg-white p-1 text-lg text-gray-700 hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

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

      <div className="flex items-center justify-between">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Team"}
        </Button>
      </div>
    </form>
  );
};

export default CreateTeamForm;
