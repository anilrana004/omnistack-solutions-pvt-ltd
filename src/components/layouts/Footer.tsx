import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import Logo from "@/src/components/ui/Logo";
import type { SanitySettings } from "@/src/lib/sanity.types";

interface FooterProps {
  settings?: SanitySettings | null;
  className?: string;
}

// Default footer data when CMS is unavailable
const defaultFooterData = {
  companyName: "OmniStack Solutions",
  description: "Building Everything. Empowering Everyone.",
  companyDescription: "Full-stack, AI, and cloud solutions for growing businesses. We deliver end-to-end technology solutions that scale.",
  contact: {
    email: "admin@omnistack.co.in",
    phone: "+91 6396309659",
    address: "11-174 near fountain chowk, Rajeev Nagar, Nehru Colony, Dharampur, Dehradun, Uttarakhand 248001, India",
  },
  socialMedia: {
    facebook: "https://www.facebook.com/profile.php?id=61586898450703",
    instagram: "https://www.instagram.com/omnistack.dev/",
    linkedin: "https://www.linkedin.com/company/111559343/admin/dashboard/",
    twitter: "https://x.com/omnistack_01",
    youtube: "https://www.youtube.com/channel/UCTCCDLqNNoppWoAHGqQye3A",
  },
  copyrightText: "OmniStack Solutions. All rights reserved.",
};

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blogs", label: "Blog" },
];

export default function Footer({ settings, className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Use settings data or fallback to defaults
  const footerData = {
    companyName: settings?.title || defaultFooterData.companyName,
    description: settings?.description || defaultFooterData.description,
    companyDescription: settings?.footerContent?.companyDescription || defaultFooterData.companyDescription,
    contact: settings?.contact || defaultFooterData.contact,
    socialMedia: settings?.socialMedia || defaultFooterData.socialMedia,
    copyrightText: settings?.footerContent?.copyrightText || defaultFooterData.copyrightText,
  };

  const logoSrc = settings?.logo ? undefined : "/logo/omnistack-logo.svg.png"; // urlForImage would be used for CMS logo
  const logoAlt = `${footerData.companyName} Logo`;

  // Social media icons mapping
  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook {...iconProps} />;
      case 'instagram': return <Instagram {...iconProps} />;
      case 'linkedin': return <Linkedin {...iconProps} />;
      case 'twitter': case 'x': return <Twitter {...iconProps} />;
      case 'youtube': return <Youtube {...iconProps} />;
      default: return null;
    }
  };

  // Build social links array
  const socialLinks = Object.entries(footerData.socialMedia)
    .filter(([_, url]) => url) // Only include links that have URLs
    .map(([platform, url]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      href: url!,
      icon: getSocialIcon(platform),
    }))
    .filter(link => link.icon); // Only include supported platforms

  // Add WhatsApp if configured
  if (settings?.whatsapp?.isEnabled && settings?.whatsapp?.phoneNumber) {
    socialLinks.push({
      name: "WhatsApp",
      href: `https://wa.me/${settings.whatsapp.phoneNumber}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    });
  }

  return (
    <footer className={`bg-olive-900 text-white border-t border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left: Logo and Description */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Logo 
                size={40} 
                src={logoSrc}
                alt={logoAlt}
              />
              <span className="text-xl font-bold">{footerData.companyName}</span>
            </div>
            <p className="text-gray-400 max-w-md mb-3">
              {footerData.description}
            </p>
            <p className="text-gray-500 text-sm max-w-md mb-4">
              {footerData.companyDescription}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                <span className="font-medium text-gray-300">Email:</span>{" "}
                <a 
                  href={`mailto:${footerData.contact.email}`}
                  className="hover:text-olive-400 transition-colors"
                >
                  {footerData.contact.email}
                </a>
              </p>
              <p>
                <span className="font-medium text-gray-300">Phone:</span>{" "}
                <a 
                  href={`tel:${footerData.contact.phone}`}
                  className="hover:text-olive-400 transition-colors"
                >
                  {footerData.contact.phone}
                </a>
              </p>
              {footerData.contact.address && (
                <p>
                  <span className="font-medium text-gray-300">Address:</span>{" "}
                  <span>{footerData.contact.address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Center: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-olive-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-olive-400 hover:scale-110 transition-all duration-300"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} {footerData.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}