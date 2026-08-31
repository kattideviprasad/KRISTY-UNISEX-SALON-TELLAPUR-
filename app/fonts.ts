import { Cormorant_Garamond, Inter } from 'next/font/google';

export const heading = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  variable: '--font-heading',
  display: 'swap',
});

export const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});
