import "server-only";
import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { EventRepository } from "@/features/events/services/event-repository";

export async function authenticatedRepository(request: Request) {
  const token = /^Bearer (.+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
  if (!token) return null;
  const app = initializeServerApp(firebaseConfig, { authIdToken: token });
  const auth = getAuth(app);
  await auth.authStateReady();
  if (!auth.currentUser) return null;
  return new EventRepository(getFirestore(app), auth.currentUser.uid);
}
