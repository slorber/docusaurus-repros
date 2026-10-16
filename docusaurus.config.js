// @ts-check

/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'Repro #7728',
  url: 'https://example.com',
  baseUrl: '/',
  presets: [
    [
      'classic',
      {
        docs: {routeBasePath: '/'},
        blog: false,
      },
    ],
  ],
  themes: ['docusaurus-theme-search-typesense'],
  themeConfig: {
    typesense: {
      typesenseCollectionName: 'docs',
      typesenseServerConfig: {
        nodes: [{host: 'typesense.example.com', port: 443, protocol: 'https'}],
        apiKey: 'placeholder',
      },
    },
  },
};
