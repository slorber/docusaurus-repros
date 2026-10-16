export default {
  title: 'Repro facebook/docusaurus#8938',
  url: 'https://example.com',
  baseUrl: '/',
  presets: [['classic', {docs: false, blog: false}]],
  themeConfig: {
    // Same values as the defaults, written out for clarity
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
  },
};
