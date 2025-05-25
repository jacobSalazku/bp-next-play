import {
  addDays,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const getWeeksOfMonth = (year: number, month: number) => {
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);

  // Ensure we start on the Monday before or on the 1st of the month
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  // Ensure we end on the Sunday after or on the last day of the month
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weekStarts = eachWeekOfInterval(
    { start: calendarStart, end: calendarEnd },
    {
      weekStartsOn: 1,
    },
  );

  const weeks = weekStarts.map((weekStart, index) => {
    const weekEnd = addDays(weekStart, 6);
    return {
      label: `Week ${index + 1}`,
      start: format(weekStart, "MMM d"),
      end: format(weekEnd, "MMM d"),
    };
  });

  return weeks;
};
