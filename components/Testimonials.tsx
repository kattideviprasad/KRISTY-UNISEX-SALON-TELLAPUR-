type Testimonial = {
  id: number;
  quote: string;
  name: string;
  detail: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      'Kristy herself is a genius with hair – she listened attentively to what I wanted and worked her magic to create a stunning look that exceeded my expectations. The salon has a cozy and welcoming atmosphere… The attention to detail and professionalism are top-notch.',
    name: 'Amair Syed',
    detail: 'Google review',
  },
  {
    id: 2,
    quote:
      'I have got done my hair smoothening. It was a nice experience. Staff was very humble and co-operative — Mr. Soaib and Mr. Afzal did a great job.',
    name: 'Shruti Katare',
    detail: 'Google review',
  },
  {
    id: 3,
    quote:
      'I like the service from the hairdresser Bunny — he did my hair cut and spa so well. The salon is unisex, so my sister came along and tried the facial and pedicure, which she really enjoyed. Thank you Kristy Unisex.',
    name: 'Sai Kiran Bellamkonda',
    detail: 'Google review',
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      style={{
        backgroundColor: '#ffffff',
        paddingTop: '96px',
        paddingBottom: '96px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: '#646464',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Guest Voices
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
              fontSize: 'clamp(32px, 4vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.48px',
              color: '#000000',
              fontWeight: 400,
              marginBottom: '12px',
            }}
          >
            What Our Clients Say
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              color: '#646464',
              letterSpacing: '0.03em',
            }}
          >
            4.8&#9733; &middot; 299 Google reviews
          </p>
        </div>

        {/* Testimonial cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <TestimonialCard key={t.id} testimonial={t} index={idx} />
          ))}
        </div>


      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  // Every middle card gets cocoa background for tonal rhythm
  const isAccent = index === 1;
  const bg = isAccent ? '#3b3429' : '#f2f1ed';
  const textMain = isAccent ? '#ffffff' : '#000000';
  const textSub = isAccent ? '#b4aeac' : '#646464';

  return (
    <div
      style={{
        backgroundColor: bg,
        borderRadius: '5px',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Opening mark */}
      <span
        style={{
          fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
          fontSize: '48px',
          lineHeight: 1,
          color: isAccent ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          userSelect: 'none',
        }}
      >
        &ldquo;
      </span>

      <p
        style={{
          fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
          fontSize: '18px',
          lineHeight: 1.55,
          color: textMain,
          fontWeight: 400,
          flexGrow: 1,
          marginTop: '-28px',
        }}
      >
        {testimonial.quote}
      </p>

      <div
        style={{
          paddingTop: '20px',
          borderTop: isAccent
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid #b4aeac',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '14px',
            color: textMain,
            fontWeight: 500,
            marginBottom: '4px',
          }}
        >
          {testimonial.name}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '12px',
            color: textSub,
            letterSpacing: '0.04em',
          }}
        >
          {testimonial.detail}
        </p>
      </div>
    </div>
  );
}
