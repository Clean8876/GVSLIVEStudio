"use client";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { authError, signIn, signOutUser } from "../services/auth";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => onAuthStateChanged(auth, (current) => { setUser(current); setLoading(false); }), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try { await signIn(email.trim(), password); }
    catch (error) { setError(authError(error)); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); setError("");
    try { await signOutUser(); }
    catch (error) { setError(authError(error)); }
    finally { setBusy(false); }
  }
  return (
    <main className="flex min-h-screen flex-col bg-[#f6f7f9] px-5 py-7 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" aria-label="GVS Live Stream home" className="flex items-center gap-3">
          <span className="relative size-11 overflow-hidden rounded-lg bg-white"><Image src="/images/gvs-logo.jpg" alt="" fill sizes="44px" className="object-contain" /></span>
          <span className="text-sm font-extrabold leading-tight text-navy">GVS Live Stream<span className="mt-0.5 block font-body text-xs font-normal text-muted-foreground">Every moment, shared.</span></span>
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 font-body text-sm font-semibold text-muted-foreground hover:text-navy"><ArrowLeft className="size-4" /> Back to website</Link>
      </div>
      <div className="flex flex-1 items-center justify-center py-12">
        <section aria-labelledby="login-heading" className="w-full max-w-md rounded-2xl border border-border bg-white p-7 shadow-[0_18px_60px_-35px_rgba(25,47,86,0.28)] sm:p-10">
          <span className="flex size-12 items-center justify-center rounded-xl bg-gold-light text-gold"><LockKeyhole className="size-5" aria-hidden="true" /></span>
          <h1 id="login-heading" className="mt-6 text-3xl font-extrabold tracking-tight text-navy">{user ? "You’re signed in." : "Welcome back."}</h1>
          <p className="mt-2 font-body text-base leading-relaxed text-muted-foreground">{user ? user.email : "Sign in to manage your GVS live events."}</p>
          {loading ? <p className="mt-8 font-body text-sm text-muted-foreground">Checking sign-in…</p> : user ? (
            <div className="mt-8 space-y-4">
              <Button asChild className="h-12 w-full"><Link href="/studio/events">Your events</Link></Button>
              <Button type="button" variant="outline" onClick={logout} disabled={busy} className="h-12 w-full">{busy ? "Signing out…" : "Sign out"}</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5">
              <div><Label htmlFor="admin-email">Email address</Label><Input id="admin-email" name="email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 h-12" /></div>
              <div><Label htmlFor="admin-password">Password</Label><Input id="admin-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2 h-12" /></div>
              <Button type="submit" disabled={busy} className="h-12 w-full">{busy ? "Please wait…" : "Sign in"}</Button>
            </form>
          )}
          {error && <p role="alert" className="mt-4 font-body text-sm text-destructive">{error}</p>}
        </section>
      </div>
      <p className="text-center font-body text-xs text-muted-foreground">GVS Live Stream · Every moment, shared.</p>
    </main>
  );
}
