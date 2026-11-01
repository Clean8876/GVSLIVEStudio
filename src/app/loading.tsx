export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="page-container flex min-h-[60vh] items-center justify-center"
    >
      <p role="status" className="font-body text-lg text-muted-foreground">
        Getting the celebrations ready…
      </p>
    </main>
  );
}
