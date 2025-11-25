import { clerk } from "@/src/lib/clerk";
import { logger } from "@/src/utils/logger";

export async function revokedUserSessions({
  id,
  reason,
}: {
  id: string;
  reason?: string;
}) {
  let sessionsList = await clerk.sessions.getSessionList({
    userId: id,
    status: "active",
    limit: 100,
  });

  // Loop until no sessions remain for the user
  while (true) {
    const userSessions = sessionsList.data;

    if (userSessions.length === 0) {
      break; // no more sessions to revoke
    }

    for (const session of userSessions) {
      // Revoke the session
      logger.info(`Revoking User session`, {
        sessionId: session.id,
        reason: reason,
        clerkId: id,
        actor: session.actor,
      });
      await clerk.sessions.revokeSession(session.id);
    }

    // Fetch updated session list again for next iteration
    sessionsList = await clerk.sessions.getSessionList({
      userId: id,
      status: "active",
      limit: 100,
    });
  }
}
