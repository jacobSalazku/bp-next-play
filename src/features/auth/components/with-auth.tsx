import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const WithAuthComponent = async (props: P) => {
    const user = await auth();

    if (!user) {
      redirect("/login");
    }

    return <WrappedComponent {...props} />;
  };
  WithAuthComponent.displayName = "WithAuthComponent";
  return WithAuthComponent;
};

export default withAuth;
