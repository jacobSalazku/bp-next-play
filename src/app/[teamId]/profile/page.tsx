import { getUser } from "@/api/user";
import UserUpdateForm from "@/features/auth/components/update-profile";
import withAuth from "@/features/auth/components/with-auth";

async function ProfilePage() {
  const { user } = await getUser();
  console.log("user", user);
  return <UserUpdateForm user={user} />;
}
export default withAuth(ProfilePage);
