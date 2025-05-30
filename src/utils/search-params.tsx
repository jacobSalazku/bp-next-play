import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const boxScoreSearchParams = {
  activityId: parseAsString.withDefault(""),
  id: parseAsString.withDefault(""),
};

export const boxScoreSearchParamsCache =
  createSearchParamsCache(boxScoreSearchParams);
