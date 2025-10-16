import Link from "next/link";
import { Container } from "./container";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-sand-50">
      <Container>
        <div className="grid gap-8 py-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">Simple</span>
                <span className="text-xs text-gray-500">Compare & Choose</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Find and compare the best driving schools in Dubai. Make an
              informed decision for your driver training.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gold-600"
                >
                  All Schools
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-sm text-gray-600 transition-colors hover:text-gold-600"
                >
                  Compare Schools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              License Types
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">Motorcycle</li>
              <li className="text-sm text-gray-600">Light Motor Vehicle</li>
              <li className="text-sm text-gray-600">Heavy Truck</li>
              <li className="text-sm text-gray-600">Light Bus</li>
              <li className="text-sm text-gray-600">Heavy Bus</li>
              <li className="text-sm text-gray-600">Light Forklift</li>
              <li className="text-sm text-gray-600">Heavy Forklift</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gold-500" />
                Dubai, UAE
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gold-500" />
                info@dubaidrive.ae
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gold-500" />
                +971-4-XXX-XXXX
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Simple.ae All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
