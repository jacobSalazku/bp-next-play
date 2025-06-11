import { getUser } from "@/api/user";
import { redirect } from "next/navigation";
import React from "react";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const WithAuthComponent = async (props: P) => {
    const user = await getUser();
    console.log("User in withAuth:", user);
    if (!user) {
      redirect("/login");
    }

    return <WrappedComponent {...props} />;
  };
  WithAuthComponent.displayName = "WithAuthComponent";
  return WithAuthComponent;
};

export default withAuth;
