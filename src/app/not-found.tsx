import { Link } from "@/components/foundation/button/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  openGraph: {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
  },
};

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 px-4 text-white">
      <div className="flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className="font-righteous mb-4 text-5xl font-bold md:text-6xl">
          Welcome to NextPlay
        </h1>
        <h2 className="mb-2 text-2xl font-semibold md:text-3xl">
          Sorry, the page you are looking for does not exist or has been moved.
        </h2>
        <Link className="p-7" href="/">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
