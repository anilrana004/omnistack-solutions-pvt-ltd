import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientTitle',
      title: 'Client Title/Position',
      type: 'string',
      description: 'e.g., "CEO", "Founder", "Marketing Director"',
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    }),
    defineField({
      name: 'avatar',
      title: 'Client Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(50).max(500),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      initialValue: 5,
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          {title: 'Web Development', value: 'web'},
          {title: 'Mobile App', value: 'mobile'},
          {title: 'AI & Automation', value: 'ai'},
          {title: 'Cloud & DevOps', value: 'cloud'},
          {title: 'E-commerce', value: 'ecommerce'},
          {title: 'Branding & PR', value: 'branding'},
          {title: 'Consultation', value: 'consultation'},
          {title: 'General', value: 'general'},
        ]
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Testimonial',
      type: 'boolean',
      initialValue: false,
      description: 'Show this testimonial prominently',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Link to client\'s LinkedIn profile (for verification)',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Company Website',
      type: 'url',
      description: 'Link to client\'s company website',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified Testimonial',
      type: 'boolean',
      initialValue: false,
      description: 'Mark if client identity has been verified',
    }),
    defineField({
      name: 'isEnabled',
      title: 'Is Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this testimonial',
    }),
    defineField({
      name: 'receivedAt',
      title: 'Received Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'testimonial',
      media: 'avatar',
      company: 'companyName',
      rating: 'rating',
      featured: 'featured',
      verified: 'isVerified',
    },
    prepare(selection) {
      const {title, subtitle, media, company, rating, featured, verified} = selection
      const stars = '⭐'.repeat(rating || 0)
      return {
        title: `${title}${featured ? ' 🔥' : ''}${verified ? ' ✅' : ''}`,
        subtitle: `${company} - ${stars} - ${subtitle?.substring(0, 60)}...`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'order',
      by: [{field: 'order', direction: 'asc'}]
    },
    {
      title: 'Featured First',
      name: 'featured',
      by: [{field: 'featured', direction: 'desc'}, {field: 'rating', direction: 'desc'}]
    },
    {
      title: 'Rating (Highest First)',
      name: 'rating',
      by: [{field: 'rating', direction: 'desc'}]
    },
  ],
})