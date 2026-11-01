import { ArrowUpRight, Phone, Radio } from "lucide-react";
import { siteConfig } from "@/config/constants";
import { Brand } from "./Brand";
export function Footer() {
  return (
    <footer className="bg-navy py-12 text-white">
      <div className="page-container">
        <div className="grid gap-9 md:grid-cols-[1.1fr_1.1fr_.65fr] lg:grid-cols-[1.15fr_1.15fr_.7fr_1fr]">
          <div>
            <Brand light />
            <p className="mt-4 max-w-[250px] font-body text-sm leading-relaxed text-white/65">
              Bringing people together through the moments that matter.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold">Contact Girish</h2>
            <div className="mt-4 flex items-start gap-3">
              <Phone className="mt-1 size-5 shrink-0 text-gold" />
              <div className="space-y-2">
                {siteConfig.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="block font-body text-lg font-semibold tracking-wide text-white/90 hover:text-white"
                  >
                    {phone.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-col items-start gap-3 text-sm text-white/75"
          >
            {siteConfig.navigation.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Radio className="size-6 text-gold" />
            <p className="mt-3 text-sm font-semibold">
              Every moment, shared live.
            </p>
            <a
              href="#contact"
              className="mt-3 inline-flex items-center gap-1 text-sm text-white/65 hover:text-white"
            >
              Let’s talk about your event
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-5 font-body text-xs text-white/55 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} GVS Live. All rights reserved.
          </p>
          <p>Made for moments. Shared with everyone.</p>
        </div>
      </div>
    </footer>
  );
}
