export default {
  title: 'Repro facebook/docusaurus#8485',
  url: 'https://example.com',
  baseUrl: '/',
  presets: [['classic', {docs: false, blog: false}]],
  themeConfig: {
    navbar: {
      title: 'Repro #8485',
      items: [
        // The config from the issue: a dropdown without `to`
        {
          label: 'Dropdown',
          type: 'dropdown',
          position: 'left',
          items: [
            {label: 'Test API', to: '/a-link'},
            {label: 'Test API 2', to: '/a-link'},
          ],
        },
        // A dropdown with a `to` link
        {
          label: 'Dropdown with to',
          type: 'dropdown',
          position: 'left',
          to: '/a-link',
          items: [
            {label: 'Internal', to: '/a-link'},
            {label: 'External', href: 'https://example.com'},
          ],
        },
      ],
    },
  },
};
