import { getPendingRequests } from "@/api/team";

async function ProfilePage() {
  const { requests } = await getPendingRequests();

  if (!requests) {
    return (
      <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-row items-center justify-center border-2">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white px-4">
            <div> There are no Requests found</div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      {/* <TeamRequests request={requests} /> */}
    </main>
  );
}
export default ProfilePage;
