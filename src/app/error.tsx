"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-container flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
      <h1 className="text-3xl font-bold">We couldn’t load this page.</h1>
      <p className="font-body text-lg text-muted-foreground">
        Please try again. You can also reach Girish on +91 9663336789.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
