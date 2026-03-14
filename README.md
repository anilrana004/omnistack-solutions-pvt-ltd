# OmniStack Solutions - Marketing Website

A production-ready, fully responsive marketing website built with Next.js, TypeScript, and Tailwind CSS.

OmniStack Solutions Pvt. Ltd. builds scalable websites, applications, AI systems, and cloud solutions for modern businesses. We focus on clean architecture, performance, and long-term growth.

**Performance:** The site is optimized for fast loading—hero preloads, deferred non-critical UI (e.g. WhatsApp), dynamic imports for below-the-fold sections, AVIF/WebP images, long-lived cache headers, and tree-shaken dependencies (`lucide-react`, `@sanity/client`).

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)
- **Sanity CMS** (Content Management)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Install dependencies:

```bash
npm install
```

or

```bash
pnpm install
```

or

```bash
yarn install
```

### Logo Setup

Place your logo file at:
```
public/omnistack-logo.png
```

The logo should be in PNG format and will be used in:
- Navbar (left side)
- Footer (left side)

If you don't have a logo yet, you can use a placeholder image or create a simple "OS" lettermark.

### Running the Development Server

Start the development server:

```bash
npm run dev
```

or

```bash
pnpm dev
```

or

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### Building for Production

Build the production version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── projects/          # Projects page
│   ├── services/          # Services page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ServicesSection.tsx
│   ├── ProjectsSection.tsx
│   ├── WhyChooseUs.tsx
│   ├── CTASection.tsx
│   └── ContactForm.tsx
├── types/                 # TypeScript type definitions
│   └── index.ts
├── public/                # Static assets
│   └── omnistack-logo.png # Your logo file (place it here)
└── ...config files
```

## Features

- ✅ Fully responsive design (mobile-first)
- ✅ Modern, clean UI with Tailwind CSS
- ✅ Smooth scrolling navigation
- ✅ Form validation on contact page
- ✅ Hover animations and transitions
- ✅ SEO-friendly structure
- ✅ TypeScript for type safety
- ✅ Reusable component architecture
- ✅ Sanity CMS integration
- ✅ Preview mode for content editing

## Pages

1. **Home (`/`)** - Hero, services, projects, why choose us, CTA
2. **Services (`/services`)** - Detailed service descriptions and tech stack
3. **Projects (`/projects`)** - Portfolio showcase
4. **About (`/about`)** - Company information, process, and values
5. **Contact (`/contact`)** - Contact form with validation

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme. The current theme uses:
- Navy blue for backgrounds and text
- Orange to blue gradient for accents

### Content

All content is editable in the respective component files in the `components/` and `app/` directories.

## License

© 2024 OmniStack Solutions. All rights reserved.
