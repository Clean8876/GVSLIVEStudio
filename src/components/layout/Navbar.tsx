"use client";
import { Menu, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/constants";
import { Brand } from "./Brand";
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => onAuthStateChanged(auth, (user) => setSignedIn(Boolean(user))), []);
  const navigation = siteConfig.navigation.filter((item) => item.href !== "/studio/events" || signedIn);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/95 backdrop-blur-md">
      <div className="page-container flex h-[88px] items-center justify-between gap-6">
        <Brand />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-3 text-[13px] font-semibold text-foreground/85 transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button asChild className="hidden h-11 gap-2 px-5 sm:inline-flex">
          <a href={siteConfig.phones[0].href}>
            <Phone className="size-4" />
            Contact Girish
          </a>
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              className="size-11 lg:hidden"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[min(360px,90vw)]">
            <SheetHeader className="pt-12">
              <SheetTitle>GVS Live Stream</SheetTitle>
              <SheetDescription>
                Watch, celebrate and stay connected.
              </SheetDescription>
            </SheetHeader>
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-2 p-6"
            >
              {navigation.map((item) => (
                <SheetClose asChild key={item.href}>
                  <a
                    className="rounded-md px-4 py-4 text-base font-semibold hover:bg-muted"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </SheetClose>
              ))}
              <Button asChild className="mt-5">
                <a href={siteConfig.phones[0].href}>
                  <Phone />
                  Contact Girish
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
