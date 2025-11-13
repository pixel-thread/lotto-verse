import { SignIn } from "@clerk/nextjs";

export default function page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn routing="hash" signUpUrl="/auth/sign-up" />
    </div>
  );
}
