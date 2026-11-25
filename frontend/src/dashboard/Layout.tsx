// ─── Header ───────────────────────────────────────────────────────────────────
import { useAuth } from '../AuthContext';
import { useTranslation } from '../i18n';

function Header({ title, subtitle, onMenuClick, notifCount, onNotifClick }: {
  title: string; subtitle?: string; onMenuClick: () => void; notifCount?: number; onNotifClick?: () => void;
}) {
  const t = useTranslation();
  const { language, setLanguage } = useAuth();
  return (
    <div className="dash-header">
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <button onClick={onMenuClick} className="mobile-menu-toggle" style={{ width:36, height:36, borderRadius:10, background:'#f5f3ff', border:'none', cursor:'pointer', fontSize:16, alignItems:'center', justifyContent:'center', color:'#7c3aed' }}>
          ☰
        </button>
        <div>
          <h1 className="dash-header-title">{title}</h1>
          {subtitle && <p className="dash-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', background:'#f5f3ff', borderRadius:999, padding:'3px 4px', gap:2, border:'1px solid rgba(124,58,237,0.15)' }}>
          {(['ar', 'fr', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                padding:'5px 10px', borderRadius:999, fontSize:11, fontWeight:700,
                cursor:'pointer', border:'none', transition:'all 0.2s',
                background: language === lang ? '#7c3aed' : 'transparent',
                color: language === lang ? '#fff' : '#7c3aed',
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        {notifCount !== undefined && notifCount > 0 && (
          <button
            onClick={onNotifClick}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:999, background:'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(168,85,247,0.08))', border:'1px solid rgba(124,58,237,0.15)', cursor: onNotifClick ? 'pointer' : 'default' }}
          >
            <span style={{ fontSize:13 }}>🔔</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#7c3aed' }}>{notifCount} {notifCount > 1 ? t.dashboard.notifications.plural : t.dashboard.notifications.singular}</span>
          </button>
        )}
        <div style={{ width:8, height:8, borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#34d399)', boxShadow:'0 0 8px rgba(16,185,129,0.5)' }} title={t.dashboard.footer} />
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, onClick }: { icon: string; label: string; value: string | number | null; color: string; onClick?: () => void }) {
  const displayValue = value !== null && value !== undefined ? value : '—';
  const bgMap: Record<string, string> = {
    'bg-violet-50 text-violet-600':  'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(168,85,247,0.06))',
    'bg-blue-50 text-blue-600':      'linear-gradient(135deg,rgba(29,78,216,0.1),rgba(59,130,246,0.05))',
    'bg-emerald-50 text-emerald-600':'linear-gradient(135deg,rgba(4,120,87,0.1),rgba(16,185,129,0.05))',
    'bg-rose-50 text-rose-600':      'linear-gradient(135deg,rgba(190,18,60,0.1),rgba(225,29,72,0.05))',
    'bg-amber-50 text-amber-600':    'linear-gradient(135deg,rgba(180,83,9,0.1),rgba(245,158,11,0.05))',
    'bg-purple-50 text-purple-600':  'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(168,85,247,0.05))',
  };
  const iconBg = bgMap[color] || 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(168,85,247,0.05))';
  return (
    <div className={`dash-stat${onClick ? ' clickable' : ''}`} onClick={onClick}>
      <div className="dash-stat-icon" style={{ background: iconBg }}>{icon}</div>
      <div className="dash-stat-value">{displayValue}</div>
      <div className="dash-stat-label">{label}</div>
      {onClick && (
        <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 11, color: '#a78bfa', fontWeight: 700, opacity: 0.8 }}>→</div>
      )}
    </div>
  );
}

export { Header, StatCard };
