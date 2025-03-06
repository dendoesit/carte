import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from '@/components/SEO';

const SocialIcon = ({ children, href, label }: { children: React.ReactNode, href: string, label: string }) => (
  <a 
    href={href}
    target="_blank" 
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors"
    aria-label={label}
  >
    {children}
  </a>
);

// Define static image paths
const IMAGES = {
  timeSaving: '/images/time-saving.png',
  easyUse: '/images/easy-use.png',
  digitalDocs: '/images/digital-docs.png'
} as const;

export default function Landing() {
  return (
    <>
      <SEO />
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

        {/* Updated Banner Section with optimized image handling */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                  <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                      Documentație Tehnică la Standardele Moderne
                    </h2>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                      Platforma noastră oferă instrumente avansate pentru crearea, 
                      gestionarea și partajarea documentației tehnice. De la scheme 
                      tehnice până la manuale complete, CarteTech este soluția 
                      completă pentru nevoile tale de documentare.
                    </p>
                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <Link
                          to="/signup"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                        >
                          Începe Gratuit
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                    <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                      <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                        <img
                          className="w-full object-cover object-center"
                          src="/technical-documentation.jpg"
                          alt="Documentație tehnică și scheme"
                          width={1920}
                          height={1080}
                          loading="eager"
                          style={{
                            aspectRatio: "16/9",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
                  </div>
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
                    src={IMAGES.timeSaving}
                    alt="Economisire timp" 
                    className="h-32 w-32"
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
                    src={IMAGES.easyUse}
                    alt="Ușor de folosit" 
                    className="h-32 w-32"
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
                    src={IMAGES.digitalDocs}
                    alt="Copii digitale" 
                    className="h-32 w-32"
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
                    <SocialIcon href="https://facebook.com/cartetech" label="Facebook">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 320 512">
                        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                      </svg>
                    </SocialIcon>
                    <SocialIcon href="https://linkedin.com/company/cartetech" label="LinkedIn">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
                      </svg>
                    </SocialIcon>
                    <SocialIcon href="https://instagram.com/cartetech" label="Instagram">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                      </svg>
                    </SocialIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 