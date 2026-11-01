import "server-only";
import { getFirestore } from "firebase/firestore";
import { verifyFirebaseToken } from "./session-server";
import { EventRepository } from "@/features/events/services/event-repository";

export async function authenticatedRepository(request: Request) {
  const token = /^Bearer (.+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
  const session = await verifyFirebaseToken(token);
  return session ? new EventRepository(getFirestore(session.app), session.user.uid) : null;
}
