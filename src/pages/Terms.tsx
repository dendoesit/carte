export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Termeni și Condiții</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-4">Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</p>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">1. Acceptarea Termenilor</h2>
              <p>Prin accesarea și utilizarea platformei CarteTech, acceptați să respectați și să fiți obligat de următorii termeni și condiții de utilizare. Vă rugăm să citiți cu atenție acești termeni înainte de a utiliza serviciile noastre.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">2. Descrierea Serviciilor</h2>
              <p>CarteTech oferă o platformă online pentru crearea și gestionarea documentației tehnice. Serviciile noastre includ, dar nu se limitează la:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Crearea și editarea documentelor tehnice</li>
                <li>Stocarea și organizarea documentației</li>
                <li>Colaborarea în timp real</li>
                <li>Exportul documentelor în diverse formate</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">3. Contul Utilizatorului</h2>
              <p>Pentru a utiliza serviciile CarteTech, trebuie să creați un cont. Sunteți responsabil pentru:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Menținerea confidențialității datelor de autentificare</li>
                <li>Toate activitățile care au loc în contul dumneavoastră</li>
                <li>Notificarea imediată a oricărei utilizări neautorizate a contului</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">4. Proprietate Intelectuală</h2>
              <p>Conținutul creat în platformă rămâne proprietatea dumneavoastră. Cu toate acestea, ne acordați dreptul de a:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Găzdui și stoca conținutul</li>
                <li>Efectua copii de backup</li>
                <li>Afișa conținutul în cadrul platformei</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">5. Limitarea Răspunderii</h2>
              <p>CarteTech nu își asumă răspunderea pentru:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Pierderea datelor cauzată de factori externi</li>
                <li>Întreruperi temporare ale serviciului</li>
                <li>Daune indirecte sau consecvente</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">6. Modificări ale Termenilor</h2>
              <p>Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările vor intra în vigoare imediat după publicarea lor pe platformă. Utilizarea continuă a serviciilor după modificări constituie acceptarea noilor termeni.</p>
            </section>
          </div>

          <div className="mt-8 border-t pt-6">
            <p className="text-gray-600">
              Pentru întrebări despre acești termeni, vă rugăm să ne contactați la{' '}
              <a href="mailto:contact@cartetech.ro" className="text-blue-600 hover:text-blue-500">
                contact@cartetech.ro
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 