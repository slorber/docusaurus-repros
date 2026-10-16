export default {
  title: 'Repro facebook/docusaurus#8357',
  url: 'https://example.com',
  baseUrl: '/',
  markdown: {mermaid: true},
  themes: ['@docusaurus/theme-mermaid'],
  presets: [['classic', {docs: false, blog: false}]],
};
