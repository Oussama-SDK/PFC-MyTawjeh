import { User } from './shared';
import { ProfilePopup } from './ProfilePopup';
import { useTranslation } from '../i18n';
import {
  IcDashboard, IcNotes, IcExercices, IcRoadmap, IcChatbot,
  IcBac, IcFormations, IcConcours, IcAnnales, IcNotifications,
  IcActualites, IcProfil, IcEleves, IcAdmin, IcClose, IcPrivate, IcBourse,
} from './icons';

// ─── Icon size helper ─────────────────────────────────────────────────────────
const SZ = { size: 17 };

// ─── Menus ───────────────────────────────────────────────────────────────────
const elevMenu = (t: any) => [
  { id: 'dashboard',     label: t.dashboard.menu.dashboard,      icon: <IcDashboard {...SZ} /> },
  { id: 'profil',        label: t.dashboard.menu.profil,         icon: <IcProfil {...SZ} /> },
  { id: 'notes',         label: t.dashboard.menu.notes,          icon: <IcNotes {...SZ} /> },
  { id: 'exercices',     label: t.dashboard.menu.exercices,      icon: <IcExercices {...SZ} /> },
  { id: 'roadmap',       label: t.dashboard.menu.roadmap,        icon: <IcRoadmap {...SZ} /> },
  { id: 'chatbot',       label: t.dashboard.menu.chatbot,        icon: <IcChatbot {...SZ} /> },
  { id: 'bac',           label: t.dashboard.menu.bac,            icon: <IcBac {...SZ} /> },
  { id: 'formations',    label: t.dashboard.menu.formations,     icon: <IcFormations {...SZ} /> },
  { id: 'privateSchools',label: t.dashboard.menu.privateSchools, icon: <IcPrivate {...SZ} /> },
  { id: 'concours',      label: t.dashboard.menu.concours,       icon: <IcConcours {...SZ} /> },
  { id: 'bourses',       label: t.dashboard.menu.bourses,        icon: <IcBourse {...SZ} /> },
  { id: 'annales',       label: t.dashboard.menu.annales,        icon: <IcAnnales {...SZ} /> },
  { id: 'notifications', label: t.dashboard.menu.notifications,  icon: <IcNotifications {...SZ} /> },
  { id: 'actualites',    label: t.dashboard.menu.actualites,     icon: <IcActualites {...SZ} /> },
];

const profMenu = (t: any) => [
  { id: 'dashboard',     label: t.dashboard.menu.dashboard,      icon: <IcDashboard {...SZ} /> },
  { id: 'eleves',        label: t.dashboard.menu.eleves,         icon: <IcEleves {...SZ} /> },
  { id: 'exercices',     label: t.dashboard.menu.exercices,      icon: <IcExercices {...SZ} /> },
  { id: 'notifications', label: t.dashboard.menu.notifications,  icon: <IcNotifications {...SZ} /> },
];

const adminMenu = (t: any) => [
  { id: 'dashboard',     label: t.dashboard.menu.dashboard,      icon: <IcDashboard {...SZ} /> },
  { id: 'users',         label: t.dashboard.menu.users,          icon: <IcAdmin {...SZ} /> },
  { id: 'notifications', label: t.dashboard.menu.notifications,  icon: <IcNotifications {...SZ} /> },
  { id: 'exercices',     label: t.dashboard.menu.exercices,      icon: <IcExercices {...SZ} /> },
  { id: 'annales',       label: t.dashboard.menu.annales,        icon: <IcAnnales {...SZ} /> },
  { id: 'concours',      label: t.dashboard.menu.concours,       icon: <IcConcours {...SZ} /> },
];

const parentMenu = (t: any) => [
  { id: 'dashboard',     label: t.dashboard.menu.dashboard,      icon: <IcDashboard {...SZ} /> },
  { id: 'actualites',    label: t.dashboard.menu.actualites,     icon: <IcActualites {...SZ} /> },
  { id: 'notifications', label: t.dashboard.menu.notifications,  icon: <IcNotifications {...SZ} /> },
  { id: 'chatbot',       label: t.dashboard.menu.chatbot,        icon: <IcChatbot {...SZ} /> },
  { id: 'bac',           label: t.dashboard.menu.bac,            icon: <IcBac {...SZ} /> },
  { id: 'formations',    label: t.dashboard.menu.formations,     icon: <IcFormations {...SZ} /> },
  { id: 'privateSchools',label: t.dashboard.menu.privateSchools, icon: <IcPrivate {...SZ} /> },
  { id: 'concours',      label: t.dashboard.menu.concours,       icon: <IcConcours {...SZ} /> },
  { id: 'annales',       label: t.dashboard.menu.annales,        icon: <IcAnnales {...SZ} /> },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  user, active, setActive, onLogout, mobile, onClose, onRetakeOnet,
}: {
  user: User; active: string; setActive: (s: string) => void;
  onLogout: () => void; mobile?: boolean; onClose?: () => void; onRetakeOnet?: () => void;
}) {
  const t = useTranslation();
  const menu =
    user.role === 'eleve'      ? elevMenu(t)
    : user.role === 'professeur' ? profMenu(t)
    : user.role === 'admin'      ? adminMenu(t)
    : parentMenu(t);

  const roleGradients: Record<string, string> = {
    eleve:      'linear-gradient(135deg,#7c3aed,#a855f7)',
    professeur: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    admin:      'linear-gradient(135deg,#be123c,#e11d48)',
    parent:     'linear-gradient(135deg,#047857,#10b981)',
  };

  const menuSections: Record<string, string> = t.dashboard.sections;

  return (
    <div className="dash-sidebar" style={{ width: mobile ? '100%' : '260px' }}>
      {/* Logo */}
      <div className="dash-sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: roleGradients[user.role],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)', flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 17 }}>M</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 17, color: '#fff', letterSpacing: '-0.01em' }}>
              My<span style={{ background: 'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tawjeh</span>
            </span>
          </div>
          {mobile && onClose && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
            >
              <IcClose size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="dash-sidebar-profile">
        <ProfilePopup user={user} onLogout={onLogout} onRetakeOnet={onRetakeOnet} />
      </div>

      {/* Nav */}
      <nav className="dash-sidebar-nav">
        {menu.reduce((groups, item) => {
          const section = menuSections[item.id] || '';
          if (!groups.length || groups[groups.length - 1].section !== section) {
            groups.push({ section, items: [item] });
          } else {
            groups[groups.length - 1].items.push(item);
          }
          return groups;
        }, [] as Array<{ section: string; items: typeof menu }>)
          .map((group) => (
            <div key={group.section || 'main'}>
              {group.section && <div className="dash-nav-section">{group.section}</div>}
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActive(item.id); onClose?.(); }}
                  className={`dash-nav-item ${active === item.id ? 'active' : ''}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: active === item.id ? 1 : 0.7 }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {active === item.id && <span className="nav-dot" />}
                </button>
              ))}
            </div>
          ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {t.dashboard.footer}
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
