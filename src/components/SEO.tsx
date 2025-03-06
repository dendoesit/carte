import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title = 'DocuTech - Platformă de Documentație Tehnică',
  description = 'DocuTech oferă soluții moderne pentru crearea și gestionarea documentației tehnice. Simplificăm procesul de documentare tehnică pentru ingineri și echipe tehnice.',
  keywords = 'documentație tehnică, documentare tehnică, managementul documentelor, documente tehnice, platformă documentație, inginerie, documentație online',
  image = '/og-image.jpg', // Make sure to add this image to your public folder
  url = 'https://docutech.ro' // Update with your actual domain
}: SEOProps) {
  const siteTitle = 'DocuTech';

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Romanian" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="DocuTech" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
} 