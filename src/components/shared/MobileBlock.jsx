import { Smartphone, Apple } from 'lucide-react';

// App binaries served from cashbook/public/downloads/ (see that folder's README).
const APK_URL = '/downloads/CashBook.apk';
const IPA_URL = '/downloads/CashBook.ipa';

export default function MobileBlock() {
  // Offer the platform-appropriate build as the primary bottom-banner action.
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isIOS = /iPad|iPhone|iPod/i.test(ua);
  const primaryHref = isIOS ? IPA_URL : APK_URL;

  const dlBtnBase = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '12px 14px', borderRadius: 10, fontWeight: 700, fontSize: 14,
    textDecoration: 'none', flex: 1, whiteSpace: 'nowrap',
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff' }}>

      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        <div style={{
          width: 28, height: 28, background: '#2563EB', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 15,
        }}>C</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>CashBook</span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '32px 24px 100px',
      }}>

        {/* App icon */}
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <div style={{
            width: 84, height: 84, background: '#2563EB', borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 46, fontWeight: 900, letterSpacing: -2,
            boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
          }}>C</div>
          {/* notification dot */}
          <div style={{
            position: 'absolute', top: 4, right: 4,
            width: 18, height: 18, background: '#22C55E',
            borderRadius: '50%', border: '2.5px solid #fff',
          }} />
        </div>

        {/* App name */}
        <div style={{
          fontSize: 26, fontWeight: 800, color: '#2563EB',
          marginBottom: 32, letterSpacing: '-0.3px',
        }}>
          CashBook
        </div>

        {/* Info box */}
        <div style={{
          width: '100%', maxWidth: 340,
          border: '1px solid #E5E7EB', borderRadius: 12,
          padding: '18px 20px', background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {[
            'CashBook Web is not supported on mobile devices.',
            'Please use laptop/desktop to access CashBook Web.',
            'Download iOS/Android CashBook app for uninterrupted services on Mobile.',
          ].map((text, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              marginBottom: i < arr.length - 1 ? 14 : 0,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#374151', flexShrink: 0, marginTop: 7,
              }} />
              <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Download buttons */}
        <div style={{ width: '100%', maxWidth: 340, marginTop: 20, display: 'flex', gap: 10 }}>
          <a
            href={APK_URL}
            download
            style={{ ...dlBtnBase, background: '#2563EB', color: '#fff', border: '1.5px solid #2563EB' }}
          >
            <Smartphone size={16} />
            Android (APK)
          </a>
          <a
            href={IPA_URL}
            download
            style={{ ...dlBtnBase, background: '#fff', color: '#2563EB', border: '1.5px solid #2563EB' }}
          >
            <Apple size={16} />
            iOS (IPA)
          </a>
        </div>
      </div>

      {/* Sticky bottom banner */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#1D4ED8',
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
      }}>
        <p style={{
          color: '#fff', fontSize: 13, lineHeight: 1.5,
          flex: 1, margin: 0,
        }}>
          Get our iOS/Android app for uninterrupted services. Thank you.
        </p>
        <a
          href={primaryHref}
          download
          style={{
            background: '#fff', color: '#1D4ED8',
            border: 'none', borderRadius: 8,
            padding: '9px 16px', fontWeight: 700,
            fontSize: 13, cursor: 'pointer', flexShrink: 0,
            whiteSpace: 'nowrap', lineHeight: 1.3, textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          Download<br />App
        </a>
      </div>
    </div>
  );
}
