import { StudioAuthGate } from "@/components/layout/StudioAuthGate";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-primary px-5 py-3 text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <div className="min-h-[65vh] bg-secondary/60">
        <div className="page-container py-9 sm:py-12"><StudioAuthGate>{children}</StudioAuthGate></div>
      </div>
      <Footer />
    </>
  );
}
