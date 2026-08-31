import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — KRISTY UNISEX SALON',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
        color: '#f2f1ed',
      }}
    >
      {children}
    </div>
  );
}
