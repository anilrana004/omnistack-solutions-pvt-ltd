import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'OmniStack Solutions Studio',

  projectId: 'kvjr9xh2',
  dataset: 'production',
  apiVersion: '2024-01-01',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

