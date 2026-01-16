import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingHeader() {
  const [open, setOpen] = React.useState(false);
  const links = [
    {
      label: "Browse Schools",
      href: "/schools",
    },
    {
      label: "Compare",
      href: "/compare",
    },
  ];
  return (
    <header
      className={cn(
        "fixed left-1/2 top-5 z-50 -translate-x-1/2",
        "mx-auto w-full max-w-3xl rounded-lg border shadow",
        "bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg"
      )}
    >
      <nav className="mx-auto flex items-center justify-between p-1.5">
        <Link
          href="/"
          className="flex cursor-pointer items-center rounded-md px-2 py-1"
        >
          <div className="relative h-8 w-24 sm:h-10 sm:w-32">
            <Image
              src="/logo/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="hidden items-center gap-1 lg:flex ml-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(!open)}
            >
              <MenuIcon className="size-4" />
            </Button>
            <SheetContent
              className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
              showClose={false}
              side="left"
            >
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    className={buttonVariants({
                      variant: "ghost",
                      className: "justify-start",
                    })}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
