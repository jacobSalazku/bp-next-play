import NextAuth from "next-auth";
import { cache } from "react";
import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const cachedAuth = cache(uncachedAuth);

export { uncachedAuth as auth, cachedAuth, handlers, signIn, signOut };
