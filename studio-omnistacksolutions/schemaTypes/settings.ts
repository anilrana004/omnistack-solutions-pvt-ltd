import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
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
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Square image for browser tab icon',
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          title: 'Email',
          type: 'email',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'X (Twitter) URL',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
        }),
        defineField({
          name: 'github',
          title: 'GitHub URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'phoneNumber',
          title: 'WhatsApp Phone Number',
          type: 'string',
          description: 'Phone number without + or spaces (e.g., 916396309659)',
        }),
        defineField({
          name: 'defaultMessage',
          title: 'Default Message',
          type: 'string',
          initialValue: 'Hello OmniStack Solutions',
        }),
        defineField({
          name: 'isEnabled',
          title: 'Enable WhatsApp Button',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Global SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'defaultMetaTitle',
          title: 'Default Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'defaultMetaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'defaultOgImage',
          title: 'Default OG Image',
          type: 'image',
          description: 'Default image for social media sharing',
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
          name: 'siteUrl',
          title: 'Site URL',
          type: 'url',
          description: 'Full URL of your website (e.g., https://omnistack.co.in)',
        }),
      ],
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics & Tracking',
      type: 'object',
      fields: [
        defineField({
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'GA4 Measurement ID (e.g., G-XXXXXXXXXX)',
        }),
        defineField({
          name: 'googleTagManagerId',
          title: 'Google Tag Manager ID',
          type: 'string',
          description: 'GTM Container ID (e.g., GTM-XXXXXXX)',
        }),
      ],
    }),
    defineField({
      name: 'footerContent',
      title: 'Footer Content',
      type: 'object',
      fields: [
        defineField({
          name: 'companyDescription',
          title: 'Company Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          initialValue: 'OmniStack Solutions. All rights reserved.',
        }),
      ],
    }),
    defineField({
      name: 'featureFlags',
      title: 'Feature Flags',
      type: 'object',
      description: 'Toggle website features without deploying code',
      fields: [
        defineField({
          name: 'showBlogs',
          title: 'Show Blogs Section',
          type: 'boolean',
          initialValue: true,
          description: 'Enable/disable the blogs and news section',
        }),
        defineField({
          name: 'showCareers',
          title: 'Show Careers Section',
          type: 'boolean',
          initialValue: false,
          description: 'Enable/disable careers page and job listings',
        }),
        defineField({
          name: 'showTestimonials',
          title: 'Show Testimonials',
          type: 'boolean',
          initialValue: true,
          description: 'Enable/disable client testimonials section',
        }),
        defineField({
          name: 'showPortfolio',
          title: 'Show Portfolio',
          type: 'boolean',
          initialValue: true,
          description: 'Enable/disable portfolio/case studies section',
        }),
        defineField({
          name: 'enableChatbot',
          title: 'Enable AI Chatbot',
          type: 'boolean',
          initialValue: false,
          description: 'Show AI-powered chat widget',
        }),
        defineField({
          name: 'enableNewsletter',
          title: 'Enable Newsletter Signup',
          type: 'boolean',
          initialValue: false,
          description: 'Show newsletter subscription forms',
        }),
        defineField({
          name: 'enableWhatsApp',
          title: 'Enable WhatsApp Button',
          type: 'boolean',
          initialValue: true,
          description: 'Show floating WhatsApp contact button',
        }),
        defineField({
          name: 'enableInstagramFeed',
          title: 'Enable Instagram Feed',
          type: 'boolean',
          initialValue: true,
          description: 'Show Instagram posts section',
        }),
        defineField({
          name: 'showPricing',
          title: 'Show Pricing Section',
          type: 'boolean',
          initialValue: true,
          description: 'Enable/disable pricing plans section',
        }),
        defineField({
          name: 'enableContactForm',
          title: 'Enable Contact Forms',
          type: 'boolean',
          initialValue: true,
          description: 'Enable all contact forms across the site',
        }),
      ],
    }),
    defineField({
      name: 'maintenanceMode',
      title: 'Maintenance Mode',
      type: 'object',
      fields: [
        defineField({
          name: 'isEnabled',
          title: 'Enable Maintenance Mode',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'message',
          title: 'Maintenance Message',
          type: 'text',
          rows: 2,
          initialValue: 'We are currently performing scheduled maintenance. Please check back soon.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Configure your website settings',
      }
    },
  },
})