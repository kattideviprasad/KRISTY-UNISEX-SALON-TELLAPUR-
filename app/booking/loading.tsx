export default function BookingLoading() {
  return (
    <div
      style={{
        backgroundColor: '#f2f1ed',
        minHeight: '100vh',
        paddingTop: '64px',
      }}
    >
      {/* Header skeleton */}
      <div
        style={{
          backgroundColor: '#000000',
          paddingTop: '80px',
          paddingBottom: '80px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              width: '100px',
              height: '14px',
              backgroundColor: '#1f1f1f',
              borderRadius: '4px',
              marginBottom: '24px',
            }}
          />
          <div
            style={{
              width: '320px',
              height: '42px',
              backgroundColor: '#1f1f1f',
              borderRadius: '4px',
              marginBottom: '16px',
            }}
          />
          <div
            style={{
              width: '440px',
              height: '20px',
              backgroundColor: '#1f1f1f',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      {/* Content skeleton */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '72px',
          paddingBottom: '96px',
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div
                style={{
                  width: '120px',
                  height: '14px',
                  backgroundColor: '#e5e3dc',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#ffffff',
                  borderRadius: '5px',
                  border: '1px solid #d8d4cb',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
