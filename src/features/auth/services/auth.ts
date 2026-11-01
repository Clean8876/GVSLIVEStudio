import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
export const signIn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const signOutUser = () => signOut(auth);
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
