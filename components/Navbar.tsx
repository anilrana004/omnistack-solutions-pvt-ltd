"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/services/pr", label: "PR & Personal Branding" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-[1000] bg-white transition-all duration-200 ease-out ${
        isScrolled
          ? "border-b border-gray-200/60"
          : ""
      }`}
      style={{
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="flex items-center justify-between h-[52px] md:h-[56px]">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="group-hover:opacity-80 transition-opacity duration-200">
              <Logo size={48} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-olive-700 transition-colors hover:text-olive-500"
                style={{
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  lineHeight: '1.25',
                  fontFamily: 'system-ui, -apple-system, "Inter", sans-serif'
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-4 py-1.5 rounded-full text-[13px] text-white bg-gradient-to-r from-olive-600 via-olive-700 to-olive-800 hover:opacity-90 transition-opacity duration-200"
              style={{
                fontWeight: 500,
                letterSpacing: '0.01em',
                lineHeight: '1.25',
                fontFamily: 'system-ui, -apple-system, "Inter", sans-serif'
              }}
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileMenu navLinks={navLinks} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({ 
  navLinks
}: { 
  navLinks: { href: string; label: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-olive-900 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      {isOpen && (
        <div className="fixed top-[52px] left-0 right-0 bg-white border-t border-gray-200/60 z-[1000] md:hidden">
          <div className="flex flex-col px-5 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] text-olive-700 hover:text-olive-500 py-2.5 transition-colors"
                style={{
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  lineHeight: '1.3',
                  fontFamily: 'system-ui, -apple-system, "Inter", sans-serif'
                }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 px-4 py-2 rounded-full text-[13px] text-white bg-gradient-to-r from-olive-600 via-olive-700 to-olive-800 text-center hover:opacity-90 transition-opacity duration-200"
              style={{
                fontWeight: 500,
                letterSpacing: '0.01em',
                lineHeight: '1.25',
                fontFamily: 'system-ui, -apple-system, "Inter", sans-serif'
              }}
              onClick={() => setIsOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

