import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'section',
  title: 'Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title (Internal)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Internal reference name - not displayed on site',
    }),
    defineField({
      name: 'identifier',
      title: 'Section Identifier',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Unique identifier for this section (e.g., "hero", "services", "testimonials")',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Section Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
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
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'White', value: 'white'},
          {title: 'Gray Light', value: 'gray-light'},
          {title: 'Gray Dark', value: 'gray-dark'},
          {title: 'Olive Light', value: 'olive-light'},
          {title: 'Olive Dark', value: 'olive-dark'},
        ]
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'isEnabled',
      title: 'Is Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this section',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.integer().positive(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      identifier: 'identifier',
      isEnabled: 'isEnabled',
      order: 'order',
    },
    prepare(selection) {
      const {title, identifier, isEnabled, order} = selection
      return {
        title,
        subtitle: `${identifier} - Order: ${order} - ${isEnabled ? 'Enabled' : 'Disabled'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'order',
      by: [{field: 'order', direction: 'asc'}]
    },
  ],
})