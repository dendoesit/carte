import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TimeSavingIcon from '@/assets/icons/time-saving.svg';
import EasyUseIcon from '@/assets/icons/easy-use.svg';
import DigitalDocsIcon from '@/assets/icons/digital-docs.svg';
import FacebookIcon from '@/assets/icons/facebook.svg';
import LinkedinIcon from '@/assets/icons/linkedin.svg';
import InstagramIcon from '@/assets/icons/instagram.svg';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">CarteTech</h1>
            </div>
            <div>
              <Link to="/login">
                <Button variant="outline">Autentificare</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Documentație tehnică</span>
          <span className="block text-blue-600">simplificată</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Platforma modernă pentru gestionarea și crearea documentației tehnice
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <Link to="/signup">
            <Button className="w-full sm:w-auto">Începe Gratuit</Button>
          </Link>
        </div>
      </div>

      {/* New Banner Section - Add after Hero and before Features */}
      <div className="relative py-16 bg-white overflow-hidden">
        <div className="relative">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <div className="mt-6">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Documentație Tehnică la Standardele Moderne
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Platforma noastră oferă instrumente avansate pentru crearea, 
                    gestionarea și partajarea documentației tehnice. De la scheme 
                    tehnice până la manuale complete, CarteTech este soluția 
                    completă pentru nevoile tale de documentare.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/signup"
                      className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Începe Gratuit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="/technical-documentation.jpg"
                  alt="Documentație tehnică și scheme"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex justify-center">
                <img 
                  src={TimeSavingIcon}
                  alt="Economisire timp" 
                  className="h-20 w-20"
                />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Economisești Timp
              </h3>
              <p className="mt-2 text-gray-500">
                Creează și gestionează documentația tehnică rapid și eficient
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex justify-center">
                <img 
                  src={EasyUseIcon}
                  alt="Ușor de folosit" 
                  className="h-20 w-20"
                />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Ușor de Folosit
              </h3>
              <p className="mt-2 text-gray-500">
                Interfață intuitivă și proces simplificat de creare a documentelor
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex justify-center">
                <img 
                  src={DigitalDocsIcon}
                  alt="Copii digitale" 
                  className="h-20 w-20"
                />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Copii Digitale
              </h3>
              <p className="mt-2 text-gray-500">
                Acces permanent la toate documentele tale, stocate în siguranță în cloud
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Pregătit să începi?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Creează-ți cont gratuit și începe să-ți gestionezi documentația tehnică mai eficient.
            </p>
            <div className="mt-8">
              <Link to="/signup">
                <Button variant="secondary" size="lg">
                  Înregistrează-te Acum
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4">CarteTech</h2>
              <p className="text-gray-400 mb-4">
                Soluția modernă pentru gestionarea și crearea documentației tehnice. 
                Transformăm procesul de documentare într-unul simplu și eficient.
              </p>
              <p className="text-gray-400">
                © 2024 CarteTech. Toate drepturile rezervate.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:contact@cartetech.ro" className="hover:text-white">
                    contact@cartetech.ro
                  </a>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+40 123 456 789</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>București, România</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Link-uri Rapide</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="hover:text-white">
                    Despre Noi
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Termeni și Condiții
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Politica de Confidențialitate
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>

              {/* Social Media Icons */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com/cartetech" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <img src={FacebookIcon} alt="Facebook" className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/cartetech" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <img src={LinkedinIcon} alt="LinkedIn" className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://instagram.com/cartetech" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <img src={InstagramIcon} alt="Instagram" className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 