export type ServiceDetail = {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  processSteps: string[]
  tools: string[]
  deliverables: string[]
  ctaText: string
}

export const services: ServiceDetail[] = [
  {
    id: 'full-stack-web-development',
    title: 'Full-Stack Web Development',
    shortDescription: 'Modern, scalable web applications built for long-term growth.',
    fullDescription:
      'We design and build scalable, secure, and high-performance web applications tailored to business needs — from MVPs to enterprise-grade platforms.',
    processSteps: [
      'Requirement discovery & planning',
      'UI/UX wireframing and architecture',
      'Backend API & database design',
      'Frontend development',
      'Testing, optimization & security',
      'Deployment & scaling',
    ],
    tools: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
    deliverables: [
      'Fully functional web app',
      'Clean & maintainable codebase',
      'Secure backend',
      'Scalable architecture',
      'Deployment-ready system',
    ],
    ctaText: 'Start Your Web Project',
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    shortDescription: 'Cross-platform mobile applications for iOS and Android.',
    fullDescription:
      'We build cross-platform mobile apps with native performance and seamless user experience for Android and iOS.',
    processSteps: [
      'App strategy & user flow',
      'UI/UX mobile design',
      'Cross-platform development',
      'API & backend integration',
      'Performance optimization',
      'App store deployment',
    ],
    tools: ['React Native', 'TypeScript', 'Firebase', 'AWS', 'Stripe'],
    deliverables: ['Android & iOS app', 'Optimized performance', 'Cloud-backed backend', 'App store ready build'],
    ctaText: 'Build My App',
  },
  {
    id: 'ai-and-automation',
    title: 'AI & Automation',
    shortDescription: 'AI-powered systems and workflow automation to streamline operations.',
    fullDescription:
      'We implement AI-powered systems and automation to reduce manual work, increase efficiency, and improve decision-making.',
    processSteps: [
      'Business problem identification',
      'Data & workflow analysis',
      'AI logic / automation design',
      'System integration',
      'Monitoring & improvement',
    ],
    tools: ['Python', 'OpenAI APIs', 'FastAPI', 'Docker', 'Kubernetes'],
    deliverables: ['AI-driven automation', 'Reduced operational costs', 'Scalable intelligent systems'],
    ctaText: 'Automate My Business',
  },
  {
    id: 'cloud-and-devops',
    title: 'Cloud & DevOps',
    shortDescription: 'Scalable cloud infrastructure and deployment pipelines.',
    fullDescription:
      'We design and manage secure cloud infrastructure with automated deployments and high availability.',
    processSteps: [
      'Infrastructure planning',
      'CI/CD pipeline setup',
      'Cloud security configuration',
      'Monitoring & logging',
      'Cost optimization',
    ],
    tools: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions'],
    deliverables: ['Secure cloud setup', 'Zero-downtime deployments', 'Scalable infrastructure'],
    ctaText: 'Setup Cloud Infrastructure',
  },
  {
    id: 'seo-and-digital-growth',
    title: 'SEO & Digital Growth',
    shortDescription: 'Data-driven strategies to improve online visibility and traffic.',
    fullDescription:
      'We help businesses grow online visibility, traffic, and conversions using data-driven strategies.',
    processSteps: [
      'Website & SEO audit',
      'Technical SEO fixes',
      'Content & keyword strategy',
      'Conversion optimization',
      'Performance reporting',
    ],
    tools: ['Google Analytics', 'Search Console', 'Ahrefs'],
    deliverables: ['Improved rankings', 'Increased organic traffic', 'Growth reports'],
    ctaText: 'Grow My Business',
  },
  {
    id: 'maintenance-and-support',
    title: 'Maintenance & Support',
    shortDescription: 'Ongoing maintenance and updates to keep systems running securely.',
    fullDescription:
      'We provide ongoing maintenance, updates, and support to keep your systems secure and stable.',
    processSteps: [
      'Monitoring & alerts',
      'Bug fixes & updates',
      'Performance optimization',
      'Feature improvements',
      'Priority support',
    ],
    tools: [],
    deliverables: ['Stable systems', 'Reduced downtime', 'Long-term reliability'],
    ctaText: 'Get Support',
  },
  {
    id: 'personal-branding-and-pr',
    title: 'Personal Branding & PR',
    shortDescription: 'Strategic content and PR management for digital presence.',
    fullDescription:
      'We help individuals and founders build authority and credibility through strategic branding and content.',
    processSteps: [
      'Brand positioning',
      'Content strategy',
      'Profile optimization',
      'Consistent publishing',
      'Growth tracking',
    ],
    tools: ['LinkedIn', 'Instagram', 'Content Analytics'],
    deliverables: ['Strong personal brand', 'Increased visibility', 'Authority positioning'],
    ctaText: 'Build My Brand',
  },
]

