import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().max(120),
      description: 'Brief description shown on service cards',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: 'Detailed description shown in service modal/page',
    }),
    defineField({
      name: 'icon',
      title: 'Service Icon',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(3),
      description: 'Step-by-step process for this service',
    }),
    defineField({
      name: 'tools',
      title: 'Tools & Technologies',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      description: 'Technologies and tools used for this service',
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(2),
      description: 'What the client receives upon completion',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Get Started',
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing Information',
      type: 'object',
      fields: [
        defineField({
          name: 'startingPrice',
          title: 'Starting Price',
          type: 'number',
        }),
        defineField({
          name: 'priceRange',
          title: 'Price Range',
          type: 'string',
          description: 'e.g., "$5,000 - $15,000"',
        }),
        defineField({
          name: 'pricingModel',
          title: 'Pricing Model',
          type: 'string',
          options: {
            list: [
              {title: 'Fixed Price', value: 'fixed'},
              {title: 'Hourly Rate', value: 'hourly'},
              {title: 'Monthly Retainer', value: 'retainer'},
              {title: 'Custom Quote', value: 'custom'},
            ]
          },
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Service',
      type: 'boolean',
      initialValue: false,
      description: 'Show this service prominently',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ]
      },
      initialValue: 'published',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      featured: 'featured',
      status: 'status',
    },
    prepare(selection) {
      const {title, subtitle, featured, status} = selection
      return {
        title: `${title}${featured ? ' ⭐' : ''}`,
        subtitle: `${subtitle} - ${status}`,
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
      by: [{field: 'featured', direction: 'desc'}, {field: 'order', direction: 'asc'}]
    },
  ],
})