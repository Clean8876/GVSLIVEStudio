import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
export function Brand({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/#home"
      aria-label="GVS Live Stream home"
      className={cn("inline-flex shrink-0 items-center gap-3", className)}
    >
      <span className="relative h-[62px] w-[46px] overflow-hidden rounded-sm bg-white">
        <Image
          src="/images/gvs-logo.jpg"
          alt=""
          fill
          sizes="46px"
          className="object-contain"
        />
      </span>
      <span>
        <span
          className={cn(
            "block text-[17px] font-extrabold tracking-tight sm:text-xl",
            light && "text-white",
          )}
        >
          GVS Live Stream
        </span>
        <span
          className={cn(
            "mt-0.5 block font-body text-xs sm:text-sm",
            light ? "text-white/70" : "text-muted-foreground",
          )}
        >
          Together for every occasion.
        </span>
      </span>
    </Link>
  );
}
