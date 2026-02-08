import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gray-200 bg-gradient-to-br from-gold-600 to-gold-700">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />
      <Container className="relative">
        <div className="grid gap-8 py-8 md:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="relative h-14 w-36">
                <Image
                  src="/logo/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            </div>
            <p className="text-sm text-gold-100">
              Find and compare the best driving schools in Dubai. Make an
              informed decision for your driver training.
            </p>
          </div>

          <div>
            <h3 className="font-heading mb-4 text-sm font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gold-100 transition-colors hover:text-white"
                >
                  All Schools
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-sm text-gold-100 transition-colors hover:text-white"
                >
                  Compare Schools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              License Types
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-gold-100">Motorcycle</li>
              <li className="text-sm text-gold-100">Light Motor Vehicle</li>
              <li className="text-sm text-gold-100">Heavy Truck</li>
              <li className="text-sm text-gold-100">Light Bus</li>
              <li className="text-sm text-gold-100">Heavy Bus</li>
              <li className="text-sm text-gold-100">Light Forklift</li>
              <li className="text-sm text-gold-100">Heavy Forklift</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Contact</h3>
            <ul className="space-y-3">
              {/* <li className="flex items-center gap-2 text-sm text-gold-100">
                <MapPin className="h-4 w-4 text-white" />
                Dubai, UAE
              </li> */}
              <li className="flex items-center gap-2 text-sm text-gold-100">
                <Mail className="h-4 w-4 text-white" />
                info@simpleuae.ae
              </li>
              {/* <li className="flex items-center gap-2 text-sm text-gold-100">
                <Phone className="h-4 w-4 text-white" />
                +971-4-XXX-XXXX
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6">
          <p className="text-center text-sm text-gold-100">
            © {new Date().getFullYear()} Simpleuae.ae All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
