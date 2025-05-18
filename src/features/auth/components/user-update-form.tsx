"use client";

import { Button } from "@/components/button/button";
import { Link } from "@/components/button/link";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "../hooks/use-update-user";
import { updateUserSchema, type UpdateUserData } from "../zod";

const UserUpdateForm = () => {
  const [formSubmit, setFormSubmit] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
  });

  const updateUser = useUpdateUser();

  useEffect(() => {
    const hasSubmitted = localStorage.getItem("formSubmitted") === "true";
    if (hasSubmitted) {
      setFormSubmit(true);
    }
  }, []);

  const onSubmit = async (data: UpdateUserData) => {
    console.log("subitform:", data);
    try {
      await updateUser.mutateAsync({
        ...data,
        DateOfBirth: new Date(data.DateOfBirth).toISOString(),
      });
      localStorage.setItem("formSubmitted", "true");
      setFormSubmit(true);
      console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return !formSubmit ? (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-xl flex-col gap-8 rounded-lg border border-gray-500 bg-white px-6 py-8 dark:bg-gray-900"
    >
      <span className="w-full text-center font-medium text-gray-900">
        Please fill in your details
      </span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="DateOfBirth"
          label="Date of Birth"
          aria-label="Date of Birth"
          type="date"
          labelColor="default"
          className="w-full"
          placeholder="YYYY-MM-DD"
          error={errors.DateOfBirth}
          errorMessage={errors.DateOfBirth?.message}
          {...register("DateOfBirth")}
        />
        <Input
          id="PhoneNumber"
          label="Phone Number"
          aria-label="Phone Number"
          type="tel"
          placeholder="+32 123 456 789"
          className="w-full"
          error={errors.phone}
          errorMessage={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="height"
          label="Height"
          aria-label="Height"
          type="number"
          step={1}
          className="w-full"
          placeholder="180 cm"
          error={errors.height}
          errorMessage={errors.height?.message}
          {...register("height")}
        />
        <Input
          id="weight"
          label="Weight"
          aria-label="Weight"
          type="number"
          step={1}
          className="w-full"
          placeholder="75 kg"
          error={errors.weight}
          errorMessage={errors.weight?.message}
          {...register("weight")}
        />
      </div>
      {/* <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-white">
            Position(s)
          </span>
         <div className="grid grid-cols-2 gap-2">
            {positionOptions.map((option) => (
              <label
                key={option.value}
                htmlFor={option.value}
                className="flex items-center gap-2 text-sm text-gray-800 dark:text-white"
              >
                <Checkbox
                  id={option.value}
                  value={option.value}
                  {...register("position")}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div> 
        </div>*/}
      <Input
        id="dominantHand"
        label="Dominant Hand"
        aria-label="Dominant Hand"
        type="text"
        className="w-full"
        placeholder="Right / Left"
        error={errors.dominantHand}
        errorMessage={errors.dominantHand?.message}
        {...register("dominantHand")}
      />

      <Button type="submit">Continue</Button>
    </form>
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-white px-4 py-16">
      <h2 className="font-righteous text-4xl text-neutral-500">To continue</h2>
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <Link href="/create/create-team">Create Team</Link>
        <Link href="/create/join-team">Request to Join</Link>
      </div>
    </div>
  );
};

export default UserUpdateForm;
