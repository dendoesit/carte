export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Politica de Confidențialitate</h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-4">Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</p>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">1. Introducere</h2>
              <p>Protecția datelor dumneavoastră personale este importantă pentru noi. Această politică de confidențialitate explică ce date colectăm, cum le folosim și cum le protejăm.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">2. Date Personale Colectate</h2>
              <p>Colectăm următoarele tipuri de date personale:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Nume și prenume</li>
                <li>Adresă de email</li>
                <li>Informații despre cont</li>
                <li>Date de utilizare a platformei</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">3. Utilizarea Datelor</h2>
              <p>Utilizăm datele dumneavoastră pentru:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Furnizarea serviciilor noastre</li>
                <li>Îmbunătățirea platformei</li>
                <li>Comunicări despre serviciu</li>
                <li>Asistență tehnică</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">4. Protecția Datelor</h2>
              <p>Implementăm măsuri de securitate pentru a proteja datele dumneavoastră:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Criptarea datelor în tranzit și în repaus</li>
                <li>Acces restricționat la date personale</li>
                <li>Monitorizare continuă a securității</li>
                <li>Backup-uri regulate</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">5. Drepturile Dumneavoastră</h2>
              <p>Aveți următoarele drepturi privind datele personale:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Dreptul de acces la date</li>
                <li>Dreptul la rectificare</li>
                <li>Dreptul la ștergere ("dreptul de a fi uitat")</li>
                <li>Dreptul la restricționarea prelucrării</li>
                <li>Dreptul la portabilitatea datelor</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">6. Cookie-uri</h2>
              <p>Utilizăm cookie-uri pentru:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Funcționalitatea esențială a site-ului</li>
                <li>Îmbunătățirea performanței</li>
                <li>Analiza utilizării site-ului</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
              <p>Pentru orice întrebări despre confidențialitatea datelor, ne puteți contacta la:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Email: privacy@cartetech.ro</li>
                <li>Adresă: Strada Exemplu nr. 123, București</li>
                <li>Telefon: +40 123 456 789</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 border-t pt-6">
            <p className="text-gray-600">
              Această politică de confidențialitate poate fi actualizată periodic. Vă rugăm să o consultați regulat pentru a fi la curent cu modificările.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 