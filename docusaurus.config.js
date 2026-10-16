module.exports = {
  title: 'Repro facebook/docusaurus#8623',
  url: 'https://example.com',
  baseUrl: '/',
  presets: [['classic', {docs: {routeBasePath: '/'}, blog: false}]],
  themes: ['docusaurus-theme-search-typesense'],
  themeConfig: {
    // Placeholder server: no Typesense server is needed to build the site
    typesense: {
      typesenseCollectionName: 'DocusaurusCollection',
      typesenseServerConfig: {
        nodes: [{host: 'localhost', port: 8108, protocol: 'http'}],
        apiKey: 'xyz',
      },
      typesenseSearchParameters: {},
      contextualSearch: true,
    },
  },
};
