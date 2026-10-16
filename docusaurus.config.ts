import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Repro #8226',
  url: 'https://example.com',
  baseUrl: '/',
  presets: [
    [
      'classic',
      {
        docs: {routeBasePath: '/'},
        blog: false,
      } satisfies Preset.Options,
    ],
  ],
};

export default config;
