import SigninForm from "@/components/signin";

export default async function Login() {
  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-row items-center justify-center border-2">
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-neutral-950 py-16"></div>
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-white px-4 py-16">
          <h2 className="text-4xl text-neutral-500"> Log in bij NextPlay</h2>
          <SigninForm />
        </div>
      </div>
    </main>
  );
}
