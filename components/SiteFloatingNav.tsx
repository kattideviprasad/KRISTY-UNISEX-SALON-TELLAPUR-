'use client';

import { FloatingNav } from '@/components/ui/floating-navbar';
import {
  IconHome,
  IconScissors,
  IconUser,
  IconPhoto,
  IconPhone,
} from '@tabler/icons-react';

const navItems = [
  { name: 'Home',     link: '/',         icon: <IconHome     className="h-4 w-4" /> },
  { name: 'Services', link: '#services', icon: <IconScissors className="h-4 w-4" /> },
  { name: 'About',    link: '#about',    icon: <IconUser     className="h-4 w-4" /> },
  { name: 'Gallery',  link: '#gallery',  icon: <IconPhoto    className="h-4 w-4" /> },
  { name: 'Contact',  link: '#contact',  icon: <IconPhone    className="h-4 w-4" /> },
];

export default function SiteFloatingNav() {
  return <FloatingNav navItems={navItems} />;
}
