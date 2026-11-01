import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null;
  const url = (number: number) => `${basePath}?page=${number}`;
  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={url(page - 1)} className={buttonVariants({ variant: "outline" })}>
          <ChevronLeft className="size-4" /> Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={`${buttonVariants({ variant: "outline" })} opacity-50`}><ChevronLeft className="size-4" /> Previous</span>
      )}
      <span className="font-body text-sm text-muted-foreground" aria-current="page">Page {page} of {totalPages}</span>
      {page < totalPages ? (
        <Link href={url(page + 1)} className={buttonVariants({ variant: "outline" })}>
          Next <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span aria-disabled="true" className={`${buttonVariants({ variant: "outline" })} opacity-50`}>Next <ChevronRight className="size-4" /></span>
      )}
    </nav>
  );
}
