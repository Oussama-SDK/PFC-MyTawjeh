import { useState, useEffect } from 'react';
import { User, Notification, apiFetch } from './shared';
import { useTranslation } from '../i18n';

function NotificationsPage({ user, onUpdateCount }: { user: User; onUpdateCount?: (count: number) => void }) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const t = useTranslation();

  const load = () => {
    apiFetch(`/notifications/${user.id}`)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setNotifs(list);
        onUpdateCount?.(list.filter((n: any) => !n.lu).length);
      })
      .catch(() => setError('Impossible de charger les notifications.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [user.id]);

  const updateLocal = (updated: any[]) => {
    setNotifs(updated);
    onUpdateCount?.(updated.filter(n => !n.lu).length);
  };

  const markRead = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
      updateLocal(notifs.map((n: any) => n._id === id ? { ...n, lu: true } : n));
    } catch (e: any) { alert(e.message); }
  };

  const markUnread = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/unread`, { method: 'PATCH' });
      updateLocal(notifs.map((n: any) => n._id === id ? { ...n, lu: false } : n));
    } catch (e: any) { alert(e.message); }
  };

  const markAllRead = async () => {
    const unread = (notifs as any[]).filter(n => !n.lu);
    try {
      await Promise.all(unread.map(n => apiFetch(`/notifications/${n._id}/read`, { method: 'PATCH' })));
      updateLocal((notifs as any[]).map(n => ({ ...n, lu: true })));
    } catch (e: any) { alert(e.message); }
  };

  const markAllUnread = async () => {
    const read = (notifs as any[]).filter(n => n.lu);
    try {
      await Promise.all(read.map(n => apiFetch(`/notifications/${n._id}/unread`, { method: 'PATCH' })));
      updateLocal((notifs as any[]).map(n => ({ ...n, lu: false })));
    } catch (e: any) { alert(e.message); }
  };

  const typeIcon: Record<string, string> = { note: '📊', revision: '📝', info: 'ℹ️', success: '✅' };
  const typeColor: Record<string, string> = { note: 'rgba(29,78,216,0.08)', revision: 'rgba(124,58,237,0.08)', info: 'rgba(15,118,110,0.06)', success: 'rgba(16,185,129,0.08)' };

  const unreadCount = (notifs as any[]).filter(n => !n.lu).length;
  const readCount = notifs.length - unreadCount;

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: 'flex', gap: 14, padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.9)' }}>
          <div className="dash-skeleton" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="dash-skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 8, width: '80%' }} />
            <div className="dash-skeleton" style={{ height: 11, borderRadius: 6, width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="dash-empty">
      <div className="dash-empty-icon">⚠️</div>
      <p className="dash-empty-title">{error}</p>
      <button onClick={() => window.location.reload()} className="dash-btn dash-btn-primary" style={{ marginTop: 16 }}>{t.dashboard.labels.retry}</button>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0f0c29', margin: 0 }}>{t.dashboard.labels.notificationsTitle}</h2>
          {unreadCount > 0 && (
            <span style={{ padding: '2px 10px', borderRadius: 999, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
              {unreadCount} {unreadCount > 1 ? t.dashboard.notifications.plural : t.dashboard.notifications.singular}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>
              {t.dashboard.labels.markAllRead}
            </button>
          )}
          {readCount > 0 && (
            <button onClick={markAllUnread} style={{ fontSize: 12, color: '#64748b', fontWeight: 700, background: 'rgba(100,116,139,0.08)', border: '1px solid rgba(100,116,139,0.2)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>
              Tout marquer non lu
            </button>
          )}
        </div>
      </div>

      {notifs.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">🔔</div>
          <p className="dash-empty-title">{t.dashboard.labels.allClear}</p>
          <p className="dash-empty-desc">{t.dashboard.labels.noNotifications}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(notifs as any[]).map(n => (
            <div key={n._id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '16px 18px', borderRadius: 14,
              background: n.lu ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)',
              border: n.lu ? '1px solid rgba(139,92,246,0.06)' : '1px solid rgba(124,58,237,0.18)',
              boxShadow: n.lu ? 'none' : '0 2px 12px rgba(124,58,237,0.08)',
              opacity: n.lu ? 0.65 : 1,
              transition: 'all .2s',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: typeColor[n.type] || '#f8f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {typeIcon[n.type] || '🔔'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: n.lu ? '#64748b' : '#0f0c29', fontWeight: n.lu ? 400 : 600, margin: 0 }}>
                  {n.contenu}
                </p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  {new Date(n.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {!n.lu ? (
                <button onClick={() => markRead(n._id)} style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', flexShrink: 0 }}>
                  ✓ Lu
                </button>
              ) : (
                <button onClick={() => markUnread(n._id)} style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', flexShrink: 0 }}>
                  ↩ Non lu
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
