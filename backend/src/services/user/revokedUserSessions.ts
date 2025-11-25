import { clerk } from "@/src/lib/clerk";

export async function revokedUserSessions({ id }: { id: string }) {
  let sessionsList = await clerk.sessions.getSessionList({ userId: id });

  // Loop until no sessions remain for the user
  while (true) {
    const userSessions = sessionsList.data;

    if (userSessions.length === 0) {
      break; // no more sessions to revoke
    }

    for (const session of userSessions) {
      await clerk.sessions.revokeSession(session.id);
    }

    // Fetch updated session list again for next iteration
    sessionsList = await clerk.sessions.getSessionList({ userId: id });
  }
}
