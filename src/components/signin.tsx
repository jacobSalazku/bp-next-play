"use client";

import { signIn } from "next-auth/react";
import { Button } from "./foundation/button/button";

const SigninForm = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white">
      <Button
        aria-label="signin with google"
        variant="light"
        className="flex w-96 justify-center rounded-md border border-black px-20 py-8 text-sm text-neutral-500 hover:bg-white md:text-lg"
        onClick={() => signIn("google", { callbackUrl: "/create/onboarding" })}
      >
        Sign In with Google
      </Button>
    </div>
  );
};

export default SigninForm;
