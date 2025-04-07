import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import Fuse from 'fuse.js';

interface FormItem {
  name: string;
  url: string;
  isLocal: boolean;
}

interface FormCategory {
  title: string;
  forms: FormItem[];
}

const initialFormCategories: FormCategory[] = [
  {
    title: 'Formulare dosar obiectiv',
    forms: [
      { name: 'Comunicare privind începerea execuției lucrărilor de construcții', url: 'https://isc.gov.ro/files/2021/Formulare/Formular%20F.14%20Comunicare%20privind%20inceperea%20executiei%20lucrarilor.pdf', isLocal: false },
      { name: 'Cerere avizare Program pentru controlul calității lucrărilor de construcții in faze determinante', url: 'https://isc.gov.ro/files/2021/Formulare/Cerere%20avizare%20Program%20pentru%20controlul%20calitatii%20lucrarilor%20de%20construc%C8%9Bii%20in%20faze%20determinante.pdf', isLocal: false },
      { name: 'Comunicare privind încheierea execuției lucrărilor de construcții', url: 'https://isc.gov.ro/files/2022/Formulare/Formular%20F%2016%20-29,09,2022.pdf', isLocal: false },
      { name: 'Solicitare desemnare reprezentant comisie de recepţie la terminarea lucrărilor', url: 'https://isc.gov.ro/files/2024/formulare/10.01.2023%20Solicitare%20desemnare%20reprezentant%20in%20comisie%20RTL.pdf', isLocal: false },
      { name: 'Comunicare incepere activitate comisie de recepţie la terminarea lucrărilor', url: 'https://isc.gov.ro/files/2020/formulare/Poz14-2ComunicareIncepereActivitateComisieRTL.pdf', isLocal: false },
      { name: 'A9R - Solicitare adeverință rectificativă', url: 'https://isc.gov.ro/files/2024/formulare/Formular%20A9R%20-%20Cerere%20privind%20eliberarea%20adeverintei%20rectificative.pdf', isLocal: false },
      { name: 'Cerere de restituire a sumelor plătite în plus sau necuvenit în contul I.S.C. faţă de obligaţia legală', url: 'https://isc.gov.ro/files/2021/Formulare/Formular%20A2%20-%20Solicitare%20de%20restituire.pdf', isLocal: false },
      { name: 'Formular de convocare verificare lucrări ajunse în faze determinante ale execuţiei', url: '/forms/formular_convocare.docx', isLocal: true },
    ]
  },
  {
    title: 'Formulare Diriginti de santier',
    forms: [
      { name: 'Modelul cererii de autorizare a dirigintilor de santier', url: '/forms/cerere_de_autorizare.doc', isLocal: true },
      { name: 'Declaratie pe propria raspundere', url: 'https://isc.gov.ro/files/2015/Formulare/declaratie%20pe%20propia%20raspundere.pdf', isLocal: false },
      { name: 'Model cerere - tip pentru depunerea registrului de evidenţă a activităţii de diriginte de şantier', url: 'https://isc.gov.ro/files/2016/Autorizari/Cerere.pdf', isLocal: false },
      { name: 'Model de registru de evidenţă a activităţii de diriginte de şantier', url: 'https://isc.gov.ro/files/2016/Autorizari/Registru.pdf', isLocal: false },
      { name: 'Registru de evidenţă a activităţii de diriginte de şantier', url: '/forms/Model_registru_diriginte.doc', isLocal: true },
    ]
  },
  {
    title: 'Alte Formulare ISC',
    forms: [
      { name: 'Cerere tip pentru obținerea Avizului tehnic I.S.C. – Conform ANEXEI nr. 1 la Ordinul Ministrului dezvoltării regionale și administrației publice  nr. 901/2015 – privind aprobarea Metodologiei  de emitere a avizului', url: 'https://isc.gov.ro/files/2015/Formulare/CERERE%20TIP%20AVIZ%20TEHNIC%20ISC.pdf', isLocal: false },
      { name: 'Cerere Acord I.S.C. pentru intervenţii asupra construcţiilor existente.', url: '/forms/cerere_interventie.docx', isLocal: true },
      { name: 'Cerere de acreditare pe lângă Inspectoratul de Stat în Construcții (formular destinat instituțiilor de presă)', url: 'https://isc.gov.ro/files/2016/Formulare/Formular%20pentru%20punctul%201%20%20Cerere%20de%20acreditare.pdf', isLocal: false },
      { name: 'Model mandat poștal', url: '/forms/mandat_postal.pdf', isLocal: true },
    ]
  }
];

const Formulare: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const allForms = useMemo(() => initialFormCategories.flatMap(category =>
    category.forms.map(form => ({ ...form, categoryTitle: category.title }))
  ), []);

  const fuse = useMemo(() => new Fuse(allForms, {
    keys: ['name'],
    includeScore: true,
    threshold: 0.4,
  }), [allForms]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return initialFormCategories;
    }
    const results = fuse.search(searchTerm);
    const matchedFormsByCategory: { [key: string]: FormItem[] } = {};
    results.forEach(result => {
      const form = result.item;
      if (!matchedFormsByCategory[form.categoryTitle]) {
        matchedFormsByCategory[form.categoryTitle] = [];
      }
      matchedFormsByCategory[form.categoryTitle].push(form);
    });
    return initialFormCategories
      .filter(category => matchedFormsByCategory[category.title])
      .map(category => ({
        ...category,
        forms: matchedFormsByCategory[category.title]
      }));
  }, [searchTerm, fuse]);

  const handleFormDownload = (form: FormItem) => {
    if (form.isLocal) {
      const link = document.createElement('a');
      link.href = form.url;
      
      const filename = form.url.substring(form.url.lastIndexOf('/') + 1);
      link.download = filename || form.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } else {
      window.open(form.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeft className="text-gray-600" size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Formulare</h1>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Caută formular..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCategories.map((category, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                  {category.title}
                </h2>
                <ul className="space-y-3">
                  {category.forms.map((form, j) => (
                    <li key={`${i}-${j}`}>
                      <button 
                        onClick={() => handleFormDownload(form)}
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline text-left w-full group" 
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-2 flex-shrink-0 text-gray-500 group-hover:text-blue-700 transition-colors" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        <span className="flex-grow">{form.name}</span>
                        {form.isLocal && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 ml-2 flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            Niciun formular găsit pentru "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
};

export default Formulare; 