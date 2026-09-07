'use client';

type ReviewsSocialCardProps = {
  branchSlug: string;
};

export default function ReviewsSocialCard({ branchSlug }: ReviewsSocialCardProps) {
  const googleReviewUrl =
    branchSlug === 'gopanpally'
      ? 'https://maps.app.goo.gl/v7sPXjeLXPjM9j2TA' // Gopanpally Google Review link
      : 'https://maps.app.goo.gl/dQdoLTQgLuYSvUjd9'; // Tellapur Google Review link

  return (
    <div
      style={{
        maxWidth: '560px',
        width: '100%',
        margin: '0 auto',
        backgroundColor: '#111111',
        border: '1px solid rgba(201,169,110,0.2)',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
          fontSize: '24px',
          color: '#c9a96e',
          marginBottom: '16px',
        }}
      >
        Love Your New Look?
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
          fontSize: '15px',
          color: '#b4aeac',
          marginBottom: '32px',
          lineHeight: 1.6,
        }}
      >
        Leave us a Google review or tag us in your selfies! Your support helps us grow and continue providing excellent service.
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#000000',
            backgroundColor: '#c9a96e',
            padding: '14px 32px',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            display: 'inline-block',
            width: '100%',
            textAlign: 'center',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Leave us a Google Review
        </a>
        <a
          href="https://www.instagram.com/kristyunisex"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#ffffff',
            backgroundColor: 'transparent',
            border: '1px solid #c9a96e',
            padding: '14px 32px',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            display: 'inline-block',
            width: '100%',
            textAlign: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Follow us on Instagram
        </a>
      </div>
    </div>
  );
}
