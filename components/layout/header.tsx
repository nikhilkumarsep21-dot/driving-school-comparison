"use client";

import Link from "next/link";
import { Container } from "./container";
import { GraduationCap, GitCompare } from "lucide-react";
import { useComparisonStore } from "@/store/comparison-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FloatingHeader } from "@/components/ui/floating-header";

export function Header() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute left-0 right-0 top-0 z-50 w-full">
        <FloatingHeader />
      </div>
    </div>
  );
}
