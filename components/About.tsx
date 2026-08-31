import Image from 'next/image';

export default function About() {
  return (
    <section
      id="about"
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
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* Text column */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: '#646464',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Our Story
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
              fontSize: 'clamp(30px, 3.5vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.48px',
              color: '#000000',
              fontWeight: 400,
              marginBottom: '32px',
            }}
          >
            A Salon Built for
            <br />
            Everyone.
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '16px',
                lineHeight: 1.65,
                color: '#000000',
              }}
            >
              KRISTY UNISEX SALON is a full-service beauty and grooming salon
              serving Tellapur and the surrounding neighbourhoods of Hyderabad.
              We are a unisex salon — every chair, every service, every
              experience is designed to welcome all guests without distinction.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '16px',
                lineHeight: 1.65,
                color: '#000000',
              }}
            >
              Our team brings together skilled stylists and beauty professionals
              committed to precision, attentiveness, and the quiet confidence
              that comes from doing the work well. We keep the space calm and
              uncluttered so that every visit can be what it ought to be — a
              moment of genuine care.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '16px',
                lineHeight: 1.65,
                color: '#000000',
              }}
            >
              You will find us beside Vision Arsha on Osman Nagar Road,
              Tellapur. Walk in anytime before 10 PM, or book your appointment
              online to secure your preferred time.
            </p>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: '48px',
              marginTop: '48px',
              paddingTop: '40px',
              borderTop: '1px solid #f2f1ed',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                  fontSize: '32px',
                  lineHeight: 1,
                  color: '#000000',
                  fontWeight: 400,
                  marginBottom: '6px',
                }}
              >
                4.8&#9733;
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#646464',
                }}
              >
                Google rating
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                  fontSize: '32px',
                  lineHeight: 1,
                  color: '#000000',
                  fontWeight: 400,
                  marginBottom: '6px',
                }}
              >
                299
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#646464',
                }}
              >
                Verified reviews
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                  fontSize: '32px',
                  lineHeight: 1,
                  color: '#000000',
                  fontWeight: 400,
                  marginBottom: '6px',
                }}
              >
                10pm
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#646464',
                }}
              >
                Closing time
              </p>
            </div>
          </div>
        </div>

        {/* Image column */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            borderRadius: '5px',
            overflow: 'hidden',
            backgroundColor: '#f2f1ed',
          }}
        >
          <Image
            src="/about-hero.jpg"
            alt="KRISTY UNISEX SALON reception and signage"
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            quality={85}
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        </div>
      </div>
    </section>
  );
}
