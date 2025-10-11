'use client';

import Link from 'next/link';
import { Container } from './container';
import { GraduationCap, GitCompare } from 'lucide-react';
import { useComparisonStore } from '@/store/comparison-store';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
  const schools = useComparisonStore((state) => state.schools);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isGoldHeader = pathname === '/schools' || pathname === '/compare';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          className={cn(
            'backdrop-blur-xl rounded-3xl transition-all duration-300',
            scrolled ? 'shadow-xl' : 'shadow-lg'
          )}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-soft">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">Simple</span>
                <span className="text-xs text-gray-500">Compare & Choose</span>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
              >
                Home
              </Link>
              <Link
                href="/schools"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
              >
                Browse Schools
              </Link>
              <Link
                href="/compare"
                className="relative flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
              >
                <GitCompare className="h-4 w-4" />
                Compare
                {schools.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                    {schools.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
