import { signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { apiClient } from "@/lib/api-client";
export async function syncSession(user: User | null) {
  if (user) {
    await apiClient.post("/auth/session", undefined, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  } else {
    await apiClient.delete("/auth/session");
  }
}
export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await syncSession(credential.user);
  return credential;
}
export async function signOutUser() {
  await syncSession(null);
  await signOut(auth);
}
export function authError(error: unknown): string {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
  switch (code) {
    case "auth/invalid-email": return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "The email or password is incorrect.";
    case "auth/too-many-requests": return "Too many attempts. Please try again later.";
    case "auth/network-request-failed": return "Check your internet connection and try again.";
    default: return "Could not complete your request. Please try again.";
  }
}
