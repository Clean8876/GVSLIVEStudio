import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-primary px-5 py-3 text-primary-foreground focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
