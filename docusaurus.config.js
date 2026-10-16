export default {
  title: 'Repro facebook/docusaurus#8952',
  url: 'https://example.com',
  baseUrl: '/',
  presets: [['classic', {docs: false, blog: false}]],
  themeConfig: {
    // The public search-only DocSearch credentials of docusaurus.io
    // A real index is needed: the bug happens when results show up mid-IME
    algolia: {
      appId: 'X1Z85QJPUV',
      apiKey: 'bf7211c161e8205da2f933a02534105a',
      indexName: 'docusaurus-2',
      contextualSearch: false,
    },
  },
};
