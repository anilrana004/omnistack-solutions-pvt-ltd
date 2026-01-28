import type { CaseStudyContent } from "@/types";

export const caseStudies: Record<string, CaseStudyContent> = {
  "saas-analytics-dashboard": {
    summary: "A real-time analytics platform demonstrating scalable data visualization and team collaboration capabilities.",
    overview: {
      what: "A comprehensive analytics dashboard that provides real-time insights through customizable visualizations, data filtering, and collaborative features for teams.",
      why: "Built as a concept demonstration to showcase how modern web technologies can create powerful, responsive analytics interfaces that handle large datasets efficiently."
    },
    problem: "Businesses need intuitive ways to visualize complex data in real-time. Traditional analytics tools often lack the flexibility for custom dashboards or require expensive enterprise solutions. This concept addresses the challenge of making data accessible and actionable for teams of any size.",
    solution: "The platform uses a component-based architecture with React for the UI layer, enabling rapid dashboard customization. Real-time updates are handled through WebSocket connections, while PostgreSQL manages time-series data efficiently. The design prioritizes clean, minimal interfaces that don't overwhelm users with information density.",
    techStack: {
      frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "Express", "WebSockets"],
      infrastructure: ["PostgreSQL", "AWS RDS", "AWS S3", "AWS CloudFront"],
      tools: ["Docker", "Git", "Postman", "Vercel"]
    },
    highlights: {
      performance: "Optimized queries and caching strategies enable smooth interactions with large datasets.",
      scalability: "Architecture supports horizontal scaling and can handle growing data volumes.",
      security: "Role-based access control and secure API authentication protect sensitive business data.",
      ux: "Progressive data loading and smooth animations create a responsive user experience without feeling sluggish."
    },
    outcome: "This concept demonstrates our capability to build enterprise-grade analytics platforms. It's suitable for SaaS companies, e-commerce platforms, and any business requiring real-time data visualization and collaborative analytics tools."
  },
  "ecommerce-platform": {
    summary: "An internal build showcasing modern e-commerce architecture with seamless payment processing and inventory management.",
    overview: {
      what: "A full-stack e-commerce platform featuring product catalog management, shopping cart functionality, payment processing, order management, and admin dashboard capabilities.",
      why: "Developed internally to demonstrate best practices in e-commerce architecture, payment integration, and scalable inventory management systems for client reference."
    },
    problem: "Building reliable e-commerce platforms requires careful integration of multiple systems—payment processing, inventory management, order fulfillment, and customer management. This internal build addresses the architectural patterns needed to create maintainable, scalable e-commerce solutions.",
    solution: "The platform follows a microservices-inspired architecture with clear separation between frontend presentation, API layer, and data services. Payment processing uses Stripe's secure APIs with proper webhook handling. The inventory system tracks stock levels in real-time, preventing overselling. The admin interface provides comprehensive control without complexity.",
    techStack: {
      frontend: ["Next.js", "TypeScript", "Tailwind CSS", "React Hook Form"],
      backend: ["Node.js", "MongoDB", "Mongoose"],
      infrastructure: ["Vercel", "MongoDB Atlas", "Stripe API"],
      tools: ["Stripe CLI", "MongoDB Compass", "Git"]
    },
    highlights: {
      performance: "Server-side rendering and static generation ensure fast page loads and SEO optimization.",
      scalability: "Database indexing and efficient query patterns support growing product catalogs and user bases.",
      security: "Secure payment tokenization, input validation, and proper error handling protect customer data and transactions.",
      ux: "Streamlined checkout process with clear progress indicators and responsive design across all devices."
    },
    outcome: "This internal build serves as a reference for businesses looking to launch or modernize their e-commerce presence. It's particularly relevant for retail brands, digital marketplaces, and businesses transitioning from legacy e-commerce systems."
  },
  "ai-business-chatbot": {
    summary: "A concept project illustrating intelligent customer support using natural language processing and CRM integration.",
    overview: {
      what: "An AI-powered chatbot that handles customer inquiries through natural language understanding, provides contextual responses, and integrates with CRM systems for seamless customer support workflows.",
      why: "Created as a concept demonstration to showcase how modern AI APIs can be integrated into customer support systems, reducing response times while maintaining quality interactions."
    },
    problem: "Customer support teams face increasing volumes of repetitive inquiries that consume significant time. While automated chatbots exist, many fail due to poor understanding or lack of context. This concept explores how AI can augment human support rather than replace it entirely.",
    solution: "The chatbot uses OpenAI's language models for natural conversation flow, combined with retrieval-augmented generation (RAG) to access company-specific knowledge. It identifies when human intervention is needed and smoothly transitions to human agents. All interactions are logged in the CRM for continuity and analysis.",
    techStack: {
      frontend: ["React", "TypeScript", "Tailwind CSS"],
      backend: ["Python", "FastAPI", "OpenAI API"],
      infrastructure: ["Docker", "Redis", "PostgreSQL"],
      tools: ["OpenAI SDK", "LangChain", "Postman"]
    },
    highlights: {
      performance: "Optimized API calls and caching reduce response latency to near-instant for common queries.",
      scalability: "Async processing and queue management handle concurrent conversations efficiently.",
      security: "Data encryption, API key management, and privacy-compliant logging ensure customer information protection.",
      ux: "Conversational interface feels natural, with clear typing indicators and helpful suggestions when the bot is uncertain."
    },
    outcome: "This concept demonstrates our ability to integrate AI capabilities into customer-facing applications. It's suitable for businesses with high support volumes, SaaS companies, and organizations seeking to improve customer experience through automation."
  },
  "cloud-migration-platform": {
    summary: "An internal tool demonstrating enterprise cloud migration workflows and AWS automation strategies.",
    overview: {
      what: "A platform that simplifies cloud migration processes through automated infrastructure provisioning, resource assessment, migration planning, and execution monitoring for AWS environments.",
      why: "Built internally to demonstrate enterprise cloud migration expertise and provide a reference implementation for organizations planning cloud transitions."
    },
    problem: "Cloud migration projects are complex, involving assessment of existing infrastructure, planning resource allocation, executing migrations, and managing ongoing operations. Without proper tools and workflows, migrations can become time-consuming and error-prone.",
    solution: "The platform provides a structured approach to migration: first assessing current infrastructure, then generating migration plans based on best practices. It uses Infrastructure as Code (Terraform) to provision AWS resources consistently. Migration execution includes validation steps and rollback capabilities. The interface presents progress clearly without overwhelming technical details.",
    techStack: {
      frontend: ["React", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "AWS SDK"],
      infrastructure: ["AWS EC2", "AWS S3", "AWS Lambda", "Docker", "Terraform"],
      tools: ["AWS CLI", "Terraform CLI", "Git"]
    },
    highlights: {
      performance: "Parallel processing of migration tasks reduces overall migration timeframes.",
      scalability: "Platform can handle migrations of various sizes, from small applications to enterprise-scale infrastructures.",
      security: "AWS IAM roles and policies ensure secure access, and all migration activities are audited and logged.",
      ux: "Clear visualization of migration progress and status helps teams understand where they are in the process."
    },
    outcome: "This internal build demonstrates our cloud migration capabilities and serves as a reference for enterprises planning AWS migrations. It's relevant for organizations modernizing their infrastructure, consolidating data centers, or adopting cloud-first strategies."
  },
  "tech-founder-personal-branding": {
    summary: "Client project under NDA. Personal branding strategy for a tech CEO including LinkedIn positioning and thought leadership.",
    overview: {
      what: "A comprehensive personal branding strategy focused on establishing the client as a thought leader in their industry through strategic content creation, LinkedIn optimization, media relations, and consistent messaging across platforms.",
      why: "Developed for a client under NDA to elevate their professional presence, increase industry visibility, and support business development goals."
    },
    problem: "Tech founders and executives often have deep expertise but struggle to communicate their value proposition effectively. Building authentic thought leadership requires consistent strategy, quality content, and strategic media placement.",
    solution: "We developed a content strategy aligned with the client's expertise and industry positioning. This included regular LinkedIn content creation, optimized profile presentation, strategic media outreach, and thought leadership pieces placed in relevant publications. All efforts were coordinated to reinforce a consistent brand message.",
    techStack: {
      frontend: [],
      backend: [],
      infrastructure: [],
      tools: ["LinkedIn", "Content Strategy", "Media Relations", "PR Outreach", "Analytics"]
    },
    highlights: {
      ux: "Content presented in formats optimized for each platform while maintaining consistent messaging and visual identity."
    },
    outcome: "Client project delivered under NDA. This type of work is suitable for tech founders, C-level executives, consultants, and professionals seeking to build their personal brand and industry authority."
  },
  "ecommerce-brand-social-media-growth": {
    summary: "Client project under NDA. Multi-platform social media management and PR campaign focusing on brand visibility.",
    overview: {
      what: "An integrated social media and PR campaign spanning multiple platforms, including content creation, influencer partnerships, media relations, and growth strategy execution for an e-commerce brand.",
      why: "Executed for a client under NDA to increase brand visibility, drive engagement, and secure media coverage in relevant e-commerce and retail publications."
    },
    problem: "E-commerce brands compete in crowded marketplaces where visibility is essential. Standing out requires coordinated efforts across social platforms, strategic partnerships, and earned media coverage that builds credibility.",
    solution: "We executed a unified campaign strategy across Instagram, Facebook, and other relevant platforms. This included content creation tailored to each platform's audience, influencer collaboration, strategic PR outreach to e-commerce publications, and analytics-driven optimization. All activities were aligned to reinforce brand messaging and drive specific business objectives.",
    techStack: {
      frontend: [],
      backend: [],
      infrastructure: [],
      tools: ["Instagram", "Facebook", "Content Creation", "Influencer PR", "Growth Strategy"]
    },
    highlights: {
      ux: "Content created with platform-specific best practices in mind, ensuring optimal engagement and presentation."
    },
    outcome: "Client project delivered under NDA. This approach is suitable for e-commerce brands, retail companies, and consumer product businesses seeking to grow their social presence and media visibility."
  },
  "full-stack-customer-experience-platform": {
    summary: "A concept demonstration of an end-to-end platform architecture combining frontend, APIs, and database systems.",
    overview: {
      what: "A complete full-stack platform featuring customer-facing portals, admin tooling, real-time analytics, and RESTful APIs connecting all system components.",
      why: "Built as a concept demonstration to showcase full-stack architecture capabilities, API design patterns, and how modern frontend frameworks integrate with backend services."
    },
    problem: "Many businesses need integrated platforms that serve both customer-facing and internal operational needs. Building such systems requires careful API design, data modeling, and ensuring that different system components work together seamlessly without creating maintenance burdens.",
    solution: "The platform uses Next.js for server-rendered customer interfaces while providing a clean API layer built with Node.js. PostgreSQL serves as the central data store with well-designed schemas. The architecture separates concerns cleanly: frontend focuses on presentation, APIs handle business logic, and the database manages data persistence. This separation makes the system maintainable and allows independent scaling of components.",
    techStack: {
      frontend: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
      backend: ["Node.js", "Express", "PostgreSQL"],
      infrastructure: ["Vercel", "PostgreSQL", "REST APIs"],
      tools: ["Git", "Postman", "pgAdmin"]
    },
    highlights: {
      performance: "Server-side rendering and API response caching ensure fast load times for both customer and admin interfaces.",
      scalability: "Stateless API design and database connection pooling support growth in user base and data volume.",
      security: "Authentication and authorization handled at the API layer, with proper input validation and SQL injection prevention.",
      ux: "Consistent design patterns across customer and admin interfaces create intuitive user experiences while maintaining clear functional distinctions."
    },
    outcome: "This concept demonstrates our full-stack development capabilities. It's relevant for SaaS companies, service platforms, and businesses needing integrated customer and operational systems."
  }
};

