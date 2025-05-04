"use client";
import { signIn } from "next-auth/react";
const SigninForm = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white">
      <button
        className="hover:bg-opacity-25 flex w-80 justify-center rounded-md border border-black px-2 py-4 text-sm text-neutral-500 hover:bg-white"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Sign In with Google
      </button>
      <button
        className="hover:bg-opacity-25 flex w-80 justify-center rounded-md border border-black px-2 py-4 text-sm text-neutral-500 hover:bg-white"
        onClick={() => signIn("discord", { callbackUrl: "/" })}
      >
        Sign in with Discord
      </button>
    </div>
  );
};

export default SigninForm;
