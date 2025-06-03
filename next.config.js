/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/api/trpc/:pahth*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=90, max-age=90",
          },
        ],
      },
    ];
  },
};

export default config;
