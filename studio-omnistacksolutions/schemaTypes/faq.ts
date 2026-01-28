import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'General', value: 'general'},
          {title: 'Services', value: 'services'},
          {title: 'Pricing', value: 'pricing'},
          {title: 'Process', value: 'process'},
          {title: 'Technical', value: 'technical'},
          {title: 'Support', value: 'support'},
        ]
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show this FAQ prominently',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: 'isEnabled',
      title: 'Is Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this FAQ',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'answer',
      category: 'category',
      featured: 'featured',
      isEnabled: 'isEnabled',
    },
    prepare(selection) {
      const {title, subtitle, category, featured, isEnabled} = selection
      return {
        title: `${title}${featured ? ' ⭐' : ''}`,
        subtitle: `${category} - ${subtitle.substring(0, 80)}... - ${isEnabled ? 'Enabled' : 'Disabled'}`,
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
      title: 'Category',
      name: 'category',
      by: [{field: 'category', direction: 'asc'}, {field: 'order', direction: 'asc'}]
    },
  ],
})