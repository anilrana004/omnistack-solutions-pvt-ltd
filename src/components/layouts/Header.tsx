"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/src/components/ui/Logo";
import type { SanitySettings } from "@/src/lib/sanity.types";

interface HeaderProps {
  settings?: SanitySettings | null;
  className?: string;
}

// Default navigation when CMS is unavailable
const defaultNavLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ settings, className = "" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use settings for logo or fallback to default
  const logoSrc = settings?.logo ? undefined : "/logo/omnistack-logo.svg.png"; // urlForImage(settings.logo) would be used here
  const logoAlt = `${settings?.title || 'OmniStack Solutions'} Logo`;

  // Navigation links (can be extended to come from CMS in the future)
  const navLinks = defaultNavLinks;

  return (
    <nav
      className={`
        sticky top-0 left-0 right-0 z-[1000] 
        bg-white/95 backdrop-blur-lg
        transition-all duration-200 ease-out
        ${isScrolled ? "border-b border-gray-200/60 shadow-sm" : ""}
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="group-hover:opacity-80 transition-opacity duration-200">
              <Logo 
                size={48} 
                src={logoSrc}
                alt={logoAlt}
              />
            </div>
            {settings?.title && (
              <span className="ml-3 text-lg font-bold text-gray-900 hidden sm:block">
                {settings.title}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-olive-600 font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-olive-600 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-gray-700 hover:text-olive-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}