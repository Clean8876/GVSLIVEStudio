import "server-only";
import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { cookies } from "next/headers";
import { firebaseConfig } from "./config";

export async function verifyFirebaseToken(token?: string) {
  if (!token) return null;
  try {
    const app = initializeServerApp(firebaseConfig, { authIdToken: token });
    const auth = getAuth(app);
    await auth.authStateReady();
    return auth.currentUser ? { app, user: auth.currentUser } : null;
  } catch {
    return null;
  }
}

export async function getServerSession() {
  return verifyFirebaseToken((await cookies()).get("gvs_session")?.value);
}

