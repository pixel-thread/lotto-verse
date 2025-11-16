import { UserProfile } from "@clerk/nextjs";

export default function page() {
  return (
    <div className="h-screen flex items-center justify-center">
      <UserProfile />
    </div>
  );
}
