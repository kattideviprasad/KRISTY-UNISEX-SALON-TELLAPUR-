import type { Metadata } from 'next';
import { heading, body } from './fonts';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'KRISTY UNISEX SALON — Premium Hair & Beauty in Tellapur, Hyderabad',
  description:
    'Book your appointment at KRISTY UNISEX SALON, a unisex beauty & grooming salon in Tellapur, Hyderabad. Rated 4.8★ by 299 Google reviews. Call 095156 25554.',
  keywords: [
    'salon Tellapur',
    'unisex salon Hyderabad',
    'hair salon Tellapur',
    'beauty salon Osman Nagar',
    'KRISTY UNISEX SALON',
    'grooming Hyderabad',
  ],
  openGraph: {
    title: 'KRISTY UNISEX SALON — Tellapur, Hyderabad',
    description:
      'A unisex beauty & grooming salon rated 4.8★ on Google. Door No 27, Osman Nagar Rd, Tellapur, Hyderabad.',
    type: 'website',
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: 'KRISTY UNISEX SALON',
  address: {
    '@type': 'PostalAddress',
    streetAddress:
      'Door No 27, 14/32, Osman Nagar Rd, beside Vision Arsha, Tellapur',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '502034',
    addressCountry: 'IN',
  },
  telephone: '+91-9515625554',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '299',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(heading.variable, body.variable, "font-sans")}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body className="bg-bone text-ink font-sans">{children}</body>
    </html>
  );
}
