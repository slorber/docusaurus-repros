import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Tabs, {type Props as TabsProps} from '@theme/Tabs';
import TabItem from '@theme/TabItem';

// The @theme/Tabs props extend a type from '@docusaurus/theme-common/internal'.
// If TypeScript could not resolve that subpath, the props would be `any`,
// this line would not error, and the unused @ts-expect-error would fail.
// @ts-expect-error: groupId must be a string
const invalidTabsProps: TabsProps = {children: null, groupId: 42};

export default function TabsPage(): ReactNode {
  return (
    <Layout title="Tabs">
      <main className="container margin-vert--lg">
        <Tabs groupId="os">
          <TabItem value="mac" label="macOS">
            macOS content
          </TabItem>
          <TabItem value="win" label="Windows">
            Windows content
          </TabItem>
        </Tabs>
      </main>
    </Layout>
  );
}
