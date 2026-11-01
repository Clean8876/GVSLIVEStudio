"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export function StudioAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => onAuthStateChanged(auth, (user) => {
    setSignedIn(Boolean(user));
    if (!user) router.replace("/admin/login");
  }), [router]);
  return signedIn ? children : <p role="status">Checking sign-in…</p>;
}
