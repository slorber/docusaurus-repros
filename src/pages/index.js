import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout title="Home">
      <main style={{padding: '2rem'}}>
        <h1>Repro facebook/docusaurus#8938</h1>
        <p>
          Pick a color mode with the navbar toggle, then change the color scheme
          of your operating system.
        </p>
      </main>
    </Layout>
  );
}
