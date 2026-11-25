import { useState, useEffect } from 'react';
import { Notification, apiFetch } from './dashboard/shared';
import { useAuth } from './AuthContext';
import { translations } from './translations';
import OnetTest from './dashboard/OnetTest';
import Sidebar from './dashboard/Sidebar';
import { Header } from './dashboard/Layout';
import NotesPage from './dashboard/NotesPage';
import ChatbotPage from './dashboard/ChatbotPage';
import RoadmapPage from './dashboard/RoadmapPage';
import ExercicesPage from './dashboard/ExercicesPage';
import ConcoursPage from './dashboard/ConcoursPage';
import BoursePage from './dashboard/BoursePage';
import NotificationsPage from './dashboard/NotificationsPage';
import EleveDashboard from './dashboard/EleveDashboard';
import ProfDashboard from './dashboard/ProfDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import ParentDashboard from './dashboard/ParentDashboard';
import ActualitesPage from './dashboard/ActualitesPage';
import MonProfilPage from './dashboard/MonProfilPage';
import BacPathDashPage from './dashboard/BacPathDashPage';
import FormationsDashPage from './dashboard/FormationsDashPage';
import PrivateSchoolsPage from './dashboard/PrivateSchoolsPage';

export default function Dashboard() {
  const { user, logout, language } = useAuth();
  const t = translations[language];
  const m = t.dashboard.menu;
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showOnetTest, setShowOnetTest] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'eleve' || user.role === 'professeur') {
      apiFetch(`/notifications/${user.id}`)
        .then((ns: Notification[]) => setNotifCount(ns.filter(n => !n.lu).length))
        .catch(() => {});
      return;
    }

    if (user.role === 'parent') {
      // Count unread from own notifications (addressed to parent) + linked student's
      const ownPromise = apiFetch(`/notifications/${user.id}`)
        .then((ns: Notification[]) => ns.filter(n => !n.lu).length)
        .catch(() => 0);
      const studentPromise = apiFetch('/auth/linked-student')
        .then(async (r) => {
          const eleveId = r?.eleve?.id;
          if (!eleveId) return 0;
          const ns: Notification[] = await apiFetch(`/notifications/${eleveId}`);
          return ns.filter(n => !n.lu).length;
        })
        .catch(() => 0);
      Promise.all([ownPromise, studentPromise])
        .then(([own, student]) => setNotifCount(own + student))
        .catch(() => setNotifCount(0));
    }
  }, [user?.id, user?.role]);

  if (!user) return null;

  if (showOnetTest) {
    return <OnetTest onComplete={() => setShowOnetTest(false)} onSkip={() => setShowOnetTest(false)} />;
  }

  const handleRetakeOnet = () => setShowOnetTest(true);

  const pageTitles: Record<string, { title: string; subtitle?: string }> = {
    bac:           { title: m.bac,           subtitle: t.bacPath?.headingLarge },
    formations:    { title: m.formations,    subtitle: t.formations?.headingLarge },
    privateSchools:{ title: m.privateSchools, subtitle: undefined },
    dashboard:     { title: m.dashboard,     subtitle: `${language === 'ar' ? 'مرحباً' : language === 'fr' ? 'Bienvenue' : 'Welcome'}, ${user.nom}` },
    profil:        { title: m.profil,        subtitle: t.dashboard.sections.profil },
    actualites:    { title: m.actualites,    subtitle: t.news?.headingLarge },
    notes:         { title: m.notes,         subtitle: t.dashboard.labels.notesRecorded },
    exercices:     { title: m.exercices,     subtitle: t.dashboard.labels.exercisesDone },
    roadmap:       { title: m.roadmap,       subtitle: t.dashboard.roadmap.generatedNote },
    chatbot:       { title: m.chatbot,       subtitle: t.dashboard.labels.newsLive },
    concours:      { title: m.concours,      subtitle: t.dashboard.sections.concours },
    bourses:       { title: m.bourses,       subtitle: t.dashboard.sections.bourses },
    annales:       { title: m.annales,       subtitle: t.dashboard.sections.annales },
    notifications: { title: m.notifications, subtitle: t.dashboard.labels.notificationsTitle },
    eleves:        { title: m.eleves,        subtitle: t.dashboard.sections.eleves },
    users:         { title: m.users,         subtitle: t.dashboard.sections.users },
    suivi:         { title: m.dashboard,     subtitle: user.nom },
  };

  const renderPage = () => {
    if (user.role === 'eleve') {
      switch (active) {
        case 'dashboard':     return <EleveDashboard user={user} setActive={setActive} onRetakeOnet={handleRetakeOnet} notifCount={notifCount} />;
        case 'profil':        return <MonProfilPage user={user} onRetakeOnet={handleRetakeOnet} />;
        case 'actualites':    return <ActualitesPage />;
        case 'notes':         return <NotesPage user={user} />;
        case 'exercices':     return <ExercicesPage user={user} />;
        case 'roadmap':       return <RoadmapPage user={user} />;
        case 'chatbot':       return <ChatbotPage user={user} />;
        case 'bac':           return <BacPathDashPage />;
        case 'formations':    return <FormationsDashPage />;
        case 'privateSchools':return <PrivateSchoolsPage />;
        case 'concours':      return <ConcoursPage />;
        case 'bourses':       return <BoursePage />;
        case 'annales':       return <ConcoursPage initialTab="annales" />;
        case 'notifications': return <NotificationsPage user={user} onUpdateCount={setNotifCount} />;
      }
    }
    if (user.role === 'professeur') {
      switch (active) {
        case 'dashboard':     return <ProfDashboard user={user} />;
        case 'eleves':        return <ProfDashboard user={user} initialTab="eleves" />;
        case 'exercices':     return <ExercicesPage user={user} />;
        case 'notifications': return <NotificationsPage user={user} />;
      }
    }
    if (user.role === 'admin') {
      switch (active) {
        case 'dashboard':     return <AdminDashboard user={user} />;
        case 'users':         return <AdminDashboard user={user} standaloneTab="users" />;
        case 'notifications': return <AdminDashboard user={user} standaloneTab="notifs" />;
        case 'exercices':     return <AdminDashboard user={user} standaloneTab="exercices" />;
        case 'annales':       return <AdminDashboard user={user} standaloneTab="annales" />;
        case 'concours':      return <AdminDashboard user={user} standaloneTab="concours" />;
      }
    }
    if (user.role === 'parent') {
      switch (active) {
        case 'dashboard':      return <ParentDashboard user={user} />;
        case 'actualites':     return <ActualitesPage />;
        case 'notifications':  return <NotificationsPage user={user} onUpdateCount={setNotifCount} />;
        case 'bac':            return <BacPathDashPage />;
        case 'formations':     return <FormationsDashPage />;
        case 'privateSchools': return <PrivateSchoolsPage />;
        case 'concours':       return <ConcoursPage />;
        case 'annales':        return <ConcoursPage initialTab="annales" />;
        default:               return <ParentDashboard user={user} />;
      }
    }
    return <div style={{ padding: 24, color: '#94a3b8' }}>الصفحة قيد الإنشاء...</div>;
  };

  const current = pageTitles[active] || { title: active };

  return (
    <div className="dash-shell">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} onRetakeOnet={handleRetakeOnet} />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }} className="lg:hidden">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', width: 280, height: '100%' }}>
            <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} mobile onClose={() => setSidebarOpen(false)} onRetakeOnet={handleRetakeOnet} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="dash-main">
        <Header
          title={current.title}
          subtitle={current.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          notifCount={notifCount}
          onNotifClick={() => setActive('notifications')}
        />
        <div className="dash-content dash-page-enter">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
