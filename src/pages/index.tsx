import {useEffect, useState} from 'react';
import {Person} from '../proto/msg';

function encodeDecodePerson(): string {
  const bytes = Person.toBinary(Person.create({name: 'Ada', years: 36}));
  const decoded = Person.fromBinary(bytes);
  return `${Person.typeName} ${Person.toJsonString(decoded)}`;
}

export default function Home() {
  const [clientResult, setClientResult] = useState(
    'client not run: the page did not hydrate, check the browser console',
  );

  useEffect(() => {
    try {
      setClientResult(`client ok: ${encodeDecodePerson()}`);
    } catch (error) {
      setClientResult(`client error: ${error}`);
    }
  }, []);

  return (
    <main>
      <h1>facebook/docusaurus#7606</h1>
      <p id="ssr-result">SSR ok: {encodeDecodePerson()}</p>
      <p id="client-result">{clientResult}</p>
    </main>
  );
}
