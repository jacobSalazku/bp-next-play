"use client";

import { Button } from "@/components/button/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { createPracticeActivity } from "../../lib/create-practice";
import { practiceSchema, PracticeType, type PracticeData } from "../../zod";

type PracticeProps = {
  onClose: () => void;
  selectedDate: Date;
  team: string;
};

const PracticeForm: FC<PracticeProps> = ({ onClose, selectedDate, team }) => {
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PracticeData>({
    resolver: zodResolver(practiceSchema),
    defaultValues: {
      date: formattedDate,
    },
  });

  const createPractice = createPracticeActivity(team, onClose);

  const onSubmit = async (data: PracticeData) => {
    const date = new Date(data.date);
    await createPractice.mutateAsync({
      ...data,
      date: date.toISOString(),
      teamId: team,
      type: "Practice",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border border-gray-800 bg-black">
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="text-lg font-normal sm:text-xl">Create Practice</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-400 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-white"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="voorbereiding wedstrijd"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("title")}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-100">
              Practice Type
            </label>
            <div className="flex flex-col gap-3">
              {Object.values(PracticeType).map((practice) => (
                <label key={practice} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value={practice}
                    {...register("practiceType", {
                      required: "Please select a practice type",
                    })}
                    className="form-radio text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">{practice}</span>
                </label>
              ))}
            </div>
            {errors.practiceType && (
              <p className="mt-1 text-sm text-red-500">
                {errors.practiceType.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="time"
              className="mb-1 block text-sm font-medium text-white"
            >
              Start Time
            </label>
            <input
              id="time"
              type="time"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("time")}
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-400">{errors.time.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="duration"
              className="mb-1 block text-sm font-medium text-white"
            >
              Duration (hours)
            </label>
            <input
              id="duration"
              type="number"
              step="0.5"
              min="0.5"
              placeholder="E.g. 2"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("duration", {
                required: "Duration is required",
                min: 0.5,
              })}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-400">
                {errors.duration.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="date"
              className="mb-1 block text-sm font-medium text-white"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("date")}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createPractice.status == "pending"
                ? "Creating..."
                : "Create Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PracticeForm;
