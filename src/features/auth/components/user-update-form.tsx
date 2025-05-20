"use client";

import { Button } from "@/components/button/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useUpdateUser } from "../hooks/use-update-user";
import { updateUserSchema, type UpdateUserData } from "../zod";

const UserUpdateForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      phone: "",
      height: 0,
      weight: 0,
      dominantHand: "Right",
    },
  });

  const updateUser = useUpdateUser();

  const onSubmit = async (data: UpdateUserData) => {
    console.log("data", data);
    const date = new Date(data.dateOfBirth);

    const userData = {
      ...data,
      dateOfBirth: date.toISOString(),
      height: Number(data.height),
      weight: Number(data.weight),
      hasOnBoarded: true,
    };
    console.log("userData", userData);
    await updateUser.mutateAsync(userData);
    redirect("/create");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-xl flex-col gap-8 rounded-lg border border-neutral-500 bg-white px-6 py-8 dark:bg-gray-900"
    >
      <span className="font-righteous w-full text-center text-2xl font-medium text-gray-500">
        Please fill in your details
      </span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="dateOfBirth"
          label="Date of Birth"
          aria-label="Date of Birth"
          type="date"
          className="w-full"
          placeholder="YYYY-MM-DD"
          error={errors.dateOfBirth}
          errorMessage={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />
        <Input
          id="phone"
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
      <div className="flex w-full flex-col gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-white">
          Position
        </span>
        <div>
          <Controller
            name="dominantHand"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-row gap-4 text-black"
              >
                {["Left", "Right"].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <RadioGroupItem value={option} id={`position-${option}`} />
                    <label htmlFor={`position-${option}`} className="text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          {errors.dominantHand && <p>{errors.dominantHand.message}</p>}
        </div>
      </div>
      <Button type="submit" className="bg-black">
        Continue
      </Button>
    </form>
  );
};

export default UserUpdateForm;
