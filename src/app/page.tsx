import { englishDict, hindiDict } from '../locales';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>
        {hindiDict.brand.name} ({englishDict.brand.name})
      </h1>
      <p>{hindiDict.brand.plantLocation}</p>
    </main>
  );
}
