import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
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
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
      description: 'Brief project summary for cards and previews',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
      description: 'Show in featured projects section',
    }),
    defineField({
      name: 'category',
      title: 'Project Category',
      type: 'string',
      options: {
        list: [
          {title: 'Web Development', value: 'web'},
          {title: 'Mobile App', value: 'mobile'},
          {title: 'AI & Automation', value: 'ai'},
          {title: 'Cloud & DevOps', value: 'cloud'},
          {title: 'E-commerce', value: 'ecommerce'},
          {title: 'Branding & PR', value: 'branding'},
          {title: 'Concept/Internal', value: 'concept'},
        ]
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
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
      name: 'thumbnailImage',
      title: 'Thumbnail Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
      description: 'Smaller image for project cards and listings',
    }),
    defineField({
      name: 'overview',
      title: 'Project Overview',
      type: 'object',
      fields: [
        defineField({
          name: 'what',
          title: 'What',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'why',
          title: 'Why',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'problem',
      title: 'Problem Statement',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'object',
      fields: [
        defineField({
          name: 'frontend',
          title: 'Frontend',
          type: 'array',
          of: [{type: 'string'}],
          options: {layout: 'tags'},
        }),
        defineField({
          name: 'backend',
          title: 'Backend',
          type: 'array',
          of: [{type: 'string'}],
          options: {layout: 'tags'},
        }),
        defineField({
          name: 'infrastructure',
          title: 'Infrastructure',
          type: 'array',
          of: [{type: 'string'}],
          options: {layout: 'tags'},
        }),
        defineField({
          name: 'tools',
          title: 'Tools',
          type: 'array',
          of: [{type: 'string'}],
          options: {layout: 'tags'},
        }),
      ],
    }),
    defineField({
      name: 'highlights',
      title: 'Key Highlights',
      type: 'object',
      fields: [
        defineField({
          name: 'performance',
          title: 'Performance',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'scalability',
          title: 'Scalability',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'security',
          title: 'Security',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'ux',
          title: 'User Experience',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'outcome',
      title: 'Outcome & Results',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isUnderNDA',
      title: 'Under NDA',
      type: 'boolean',
      initialValue: false,
      description: 'Mark if this is a client project under NDA',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      description: 'Link to live project (if available)',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      description: 'Link to repository (if public)',
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
      subtitle: 'summary',
      media: 'thumbnailImage',
      category: 'category',
      featured: 'featured',
      isUnderNDA: 'isUnderNDA',
    },
    prepare(selection) {
      const {title, subtitle, media, category, featured, isUnderNDA} = selection
      return {
        title: `${title}${featured ? ' ⭐' : ''}${isUnderNDA ? ' 🔒' : ''}`,
        subtitle: `${category} - ${subtitle}`,
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
      by: [{field: 'featured', direction: 'desc'}, {field: 'order', direction: 'asc'}]
    },
  ],
})