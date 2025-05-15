import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const boxScoreSearchParams = {
  activityId: parseAsString.withDefault(""),
  teamId: parseAsString.withDefault(""),
};

export const boxScoreSearchParamsCache =
  createSearchParamsCache(boxScoreSearchParams);
