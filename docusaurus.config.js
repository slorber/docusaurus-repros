export default {
  title: 'Repro facebook/docusaurus#8095',
  url: 'https://example.com',
  baseUrl: '/',
  presets: [['classic', {blog: false}]],
  themeConfig: {
    navbar: {
      title: 'Repro #8095',
      items: [
        {type: 'doc', docId: 'intro', label: 'Docs'},
        {to: '/', label: 'Home', position: 'right'},
      ],
    },
  },
};
