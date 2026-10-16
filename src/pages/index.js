import React from 'react';
import Layout from '@theme/Layout';
import TableGrid from '../components/TableGrid';

export default function Home() {
  return (
    <Layout>
      <main className="container margin-vert--lg">
        <TableGrid />
      </main>
    </Layout>
  );
}
