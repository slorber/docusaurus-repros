export default {
  title: 'Repro facebook/docusaurus#7918',
  url: 'https://example.com',
  baseUrl: '/',
  presets: [
    [
      'classic',
      {
        docs: {routeBasePath: '/'},
        blog: false,
        pages: false,
        // Uncomment to apply the CSS workaround (see README.md)
        // theme: {customCss: './src/css/custom.css'},
      },
    ],
  ],
  themeConfig: {
    docs: {
      sidebar: {hideable: true},
    },
  },
};
