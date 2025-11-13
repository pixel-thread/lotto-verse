import { SignUp } from "@clerk/nextjs";

export default function page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp routing="hash" signInUrl="/auth" />
    </div>
  );
}
