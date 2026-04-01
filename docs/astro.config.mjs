// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://solanticai.github.io',
  base: '/VibeCheck',
  integrations: [
    starlight({
      title: 'VibeCheck',
      description: 'AI coding guardrails framework with runtime enforcement.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/solanticai/VibeCheck' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started' },
            { label: 'Configuration', slug: 'configuration' },
            { label: 'CLI Reference', slug: 'cli' },
          ],
        },
        {
          label: 'Rules',
          items: [
            { label: 'Overview', slug: 'rules/overview' },
            { label: 'Security', slug: 'rules/security' },
            { label: 'Quality', slug: 'rules/quality' },
            { label: 'Workflow', slug: 'rules/workflow' },
          ],
        },
        {
          label: 'Presets',
          autogenerate: { directory: 'presets' },
        },
        {
          label: 'Adapters',
          autogenerate: { directory: 'adapters' },
        },
        {
          label: 'Guides',
          items: [
            { label: 'Rule Authoring', slug: 'guides/rule-authoring' },
            { label: 'Plugin Authoring', slug: 'guides/plugin-authoring' },
          ],
        },
      ],
    }),
  ],
});
