import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main className="page-container flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
      <p className="font-body text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-bold">This moment isn’t here.</h1>
      <p className="font-body text-lg text-muted-foreground">
        The page may have moved. Find your next event on the homepage.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
