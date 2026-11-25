import { useState, useEffect, FormEvent } from 'react';
import { User, Note, apiFetch } from './shared';
import NotesEvolutionChart from './NotesEvolutionChart';
import { StatCard } from './Layout';
import { useTranslation } from '../i18n';
import { useAuth } from '../AuthContext';

type LinkedEleve = { id: string; _id: string; nom: string; email: string; niveau?: string; filiere?: string };

export default function ParentDashboard({ user }: { user: User }) {
  const t = useTranslation();
  const tp = t.dashboard.parent || {};
  const tr = t.dashboard.profile?.riasec || {};
  const { language } = useAuth();
  const lang = (language === 'ar' || language === 'en') ? language : 'fr';
  const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', ar: 'ar-SA' };
  const locale = localeMap[lang] || 'fr-FR';

  const CAT: Record<string, { label: string; color: string; emoji: string; desc: string }> = {
    R: { label: tr.R?.label || 'Realistic',      color: '#ef4444', emoji: '🔧', desc: tr.R?.desc || '' },
    I: { label: tr.I?.label || 'Investigative',  color: '#3b82f6', emoji: '🔬', desc: tr.I?.desc || '' },
    A: { label: tr.A?.label || 'Artistic',       color: '#ec4899', emoji: '🎨', desc: tr.A?.desc || '' },
    S: { label: tr.S?.label || 'Social',         color: '#10b981', emoji: '🤝', desc: tr.S?.desc || '' },
    E: { label: tr.E?.label || 'Enterprising',   color: '#f59e0b', emoji: '💼', desc: tr.E?.desc || '' },
    C: { label: tr.C?.label || 'Conventional',   color: '#8b5cf6', emoji: '📊', desc: tr.C?.desc || '' },
  };
  const [eleves, setEleves] = useState<LinkedEleve[]>([]);
  const [selected, setSelected] = useState<LinkedEleve | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [parentNotifs, setParentNotifs] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [onetProfil, setOnetProfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'notes' | 'notifs' | 'roadmap' | 'profil'>('notes');

  // Link form
  const [linkEmail, setLinkEmail] = useState('');
  const [linkMsg, setLinkMsg] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);

  const loadStudentData = async (eleve: LinkedEleve) => {
    const eleveId = eleve._id || eleve.id;
    const [notesData, notifsData, roadmapData, onetData] = await Promise.allSettled([
      apiFetch(`/eleves/${eleveId}/notes`),
      apiFetch(`/notifications/${eleveId}`),
      apiFetch(`/roadmap/${eleveId}`),
      apiFetch(`/onet/profile/${eleveId}`),
    ]);
    setNotes(notesData.status === 'fulfilled' && Array.isArray(notesData.value) ? notesData.value : []);
    setParentNotifs(notifsData.status === 'fulfilled' && Array.isArray(notifsData.value) ? notifsData.value : []);
    if (roadmapData.status === 'fulfilled' && roadmapData.value?.parcours) {
      try { setRoadmap(JSON.parse(roadmapData.value.parcours)); } catch { setRoadmap(null); }
    } else { setRoadmap(null); }
    setOnetProfil(onetData.status === 'fulfilled' ? onetData.value?.profil || null : null);
  };

  useEffect(() => {
    apiFetch('/auth/linked-student')
      .then(r => {
        const list: LinkedEleve[] = Array.isArray(r.eleves) ? r.eleves
          : r.eleve ? [r.eleve]
          : [];
        setEleves(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selected) {
      setTab('notes');
      loadStudentData(selected);
    }
  }, [selected?._id, selected?.id]);

  const selectEleve = (eleve: LinkedEleve) => setSelected(eleve);

  const linkStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!linkEmail.trim()) { setLinkMsg(tp.emailRequired || "Veuillez saisir l'email de l'élève."); return; }
    setLinkLoading(true);
    setLinkMsg('');
    try {
      const res = await apiFetch('/auth/link-student', {
        method: 'POST',
        body: JSON.stringify({ eleveEmail: linkEmail.trim() }),
      });
      const fullList: LinkedEleve[] = Array.isArray(res.eleves) && res.eleves.length > 0
        ? res.eleves
        : res.eleve ? [...eleves, res.eleve] : eleves;
      setEleves(fullList);
      setLinkEmail('');
      setShowLinkForm(false);
      setLinkMsg(tp.linkSuccess || '✅ Élève lié avec succès !');
      setTimeout(() => setLinkMsg(''), 3000);
    } catch (e: any) {
      setLinkMsg('❌ ' + (e.message || tp.linkFailed || "Impossible de lier l'élève."));
    } finally {
      setLinkLoading(false);
    }
  };

  const unlinkStudent = async (eleve: LinkedEleve) => {
    if (!window.confirm(`${tp.dissociate || 'Dissocier'} ${eleve.nom} ?`)) return;
    try {
      await apiFetch('/auth/link-student', {
        method: 'DELETE',
        body: JSON.stringify({ eleveId: eleve._id || eleve.id }),
      });
      const id = eleve._id || eleve.id;
      setEleves(prev => {
        const updated = prev.filter(e => (e._id || e.id) !== id);
        setSelected(s => {
          if (!s) return null;
          return (s._id || s.id) === id ? (updated[0] ?? null) : s;
        });
        return updated;
      });
    } catch (e: any) {
      alert(e.message || tp.unlinkFailed || "Impossible de dissocier l'élève.");
    }
  };

  const markNotifRead = async (notifId: string) => {
    try {
      await apiFetch(`/notifications/${notifId}/read`, { method: 'PATCH' });
      setParentNotifs(prev => prev.map(n => n._id === notifId ? { ...n, lu: true } : n));
    } catch (_) {}
  };

  const markAllRead = async () => {
    await Promise.all(parentNotifs.filter(n => !n.lu).map(n => apiFetch(`/notifications/${n._id}/read`, { method: 'PATCH' })));
    setParentNotifs(prev => prev.map(n => ({ ...n, lu: true })));
  };

  const markAllUnread = async () => {
    await Promise.all(parentNotifs.filter(n => n.lu).map(n => apiFetch(`/notifications/${n._id}/unread`, { method: 'PATCH' })));
    setParentNotifs(prev => prev.map(n => ({ ...n, lu: false })));
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(1)
    : '—';
  const lowGrades = notes.filter(n => n.valeur < 10);
  const unreadAlerts = parentNotifs.filter(n => !n.lu).length;

  return (
    <div className="space-y-5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#064e3b,#059669,#10b981)' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>{tp.spaceTitle || 'Espace Parent'}</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>{user.nom}</h2>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '4px solid #d1fae5', borderTopColor: '#059669', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : eleves.length === 0 ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👦</div>
          <p style={{ fontWeight: 800, color: '#0f0c29', fontSize: 16, marginBottom: 8 }}>{tp.noStudentLinked || 'Aucun élève lié'}</p>
          <p style={{ color: '#64748b', fontSize: 13, maxWidth: 320, margin: '0 auto 20px' }}>
            {tp.noStudentDesc || "Saisissez l'email de votre enfant pour l'associer à votre compte."}
          </p>
          <form onSubmit={linkStudent} style={{ display: 'grid', gap: 12, maxWidth: 420, margin: '0 auto' }}>
            <input type="email" value={linkEmail} onChange={e => setLinkEmail(e.target.value)}
              placeholder={tp.studentEmailPlaceholder || "Email de l'élève"} className="dash-input" required />
            <button type="submit" className="dash-btn dash-btn-primary" style={{ justifyContent: 'center' }}>
              {linkLoading ? (tp.linkLoading || '⏳ Liaison en cours...') : (tp.linkBtn || 'Lier mon enfant')}
            </button>
          </form>
          {linkMsg && <p style={{ marginTop: 14, color: linkMsg.startsWith('✅') ? '#047857' : '#b91c1c', fontSize: 13 }}>{linkMsg}</p>}
        </div>
      ) : (
        <>
          {/* Students grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontWeight: 800, fontSize: 14, color: '#0f0c29', margin: 0 }}>{tp.myStudents || 'Mes élèves'} ({eleves.length})</h3>
              <button onClick={() => setShowLinkForm(v => !v)}
                style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>
                {showLinkForm ? (tp.cancel || 'Annuler') : (tp.addStudent || '+ Ajouter un élève')}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
              {eleves.map(eleve => {
                const isSelected = (selected?._id || selected?.id) === (eleve._id || eleve.id);
                return (
                  <div key={eleve._id || eleve.id} onClick={() => selectEleve(eleve)}
                    style={{
                      padding: '14px 16px', borderRadius: 14, cursor: 'pointer', transition: 'all .18s',
                      background: isSelected ? 'linear-gradient(135deg,#059669,#10b981)' : 'rgba(255,255,255,0.9)',
                      border: isSelected ? '2px solid #059669' : '2px solid rgba(5,150,105,0.15)',
                      boxShadow: isSelected ? '0 4px 16px rgba(5,150,105,0.25)' : '0 1px 4px rgba(0,0,0,0.06)',
                      position: 'relative',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: isSelected ? 'rgba(255,255,255,0.25)' : 'linear-gradient(135deg,#059669,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>
                        {eleve.nom?.charAt(0)?.toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 800, fontSize: 13, margin: 0, color: isSelected ? '#fff' : '#0f0c29', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{eleve.nom}</p>
                        <p style={{ fontSize: 11, margin: '2px 0 0', color: isSelected ? 'rgba(255,255,255,0.75)' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{eleve.email}</p>
                      </div>
                    </div>
                    {eleve.niveau && (
                      <p style={{ fontSize: 11, margin: 0, color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748b' }}>
                        {eleve.niveau}{eleve.filiere ? ` · ${eleve.filiere}` : ''}
                      </p>
                    )}
                    <button onClick={ev => { ev.stopPropagation(); unlinkStudent(eleve); }}
                      style={{ position: 'absolute', top: 8, [lang === 'ar' ? 'left' : 'right']: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: isSelected ? 'rgba(255,255,255,0.6)' : '#cbd5e1', lineHeight: 1 }}
                      title={tp.dissociate || 'Dissocier'}>✕</button>
                  </div>
                );
              })}
            </div>
            {showLinkForm && (
              <div className="dash-card p-5 mt-4" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f0c29', marginBottom: 12 }}>{tp.linkNewTitle || 'Lier un nouvel élève'}</h3>
                <form onSubmit={linkStudent} style={{ display: 'flex', gap: 10 }}>
                  <input type="email" value={linkEmail} onChange={e => setLinkEmail(e.target.value)}
                    placeholder={tp.studentEmailPlaceholder || "Email de l'élève"} className="dash-input" required style={{ flex: 1 }} />
                  <button type="submit" className="dash-btn dash-btn-primary" style={{ flexShrink: 0 }}>
                    {linkLoading ? '⏳' : (tp.link || 'Lier')}
                  </button>
                </form>
                {linkMsg && <p style={{ marginTop: 10, fontSize: 13, color: linkMsg.startsWith('✅') ? '#047857' : '#b91c1c' }}>{linkMsg}</p>}
              </div>
            )}
          </div>

          {selected && (
            <>
              <div style={{ height: 1, background: 'rgba(5,150,105,0.12)', margin: '4px 0' }} />

              {/* Low grade alert */}
              {lowGrades.length > 0 && (
                <div style={{ padding: '12px 18px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>⚠️</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#dc2626', fontSize: 13 }}>
                      {selected.nom} — {lowGrades.length} {tp.belowAverage || 'matière(s) sous la moyenne'}
                    </p>
                    <p style={{ margin: '2px 0 0', color: '#ef4444', fontSize: 12 }}>
                      {lowGrades.map(n => `${n.matiere} (${n.valeur}/20)`).join(' · ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon="📊" label={tp.average || 'Moyenne'} value={notes.length ? `${moyenne}/20` : '—'} color="bg-emerald-50 text-emerald-600" />
                <StatCard icon="📝" label={tp.grades || 'Notes'} value={notes.length} color="bg-blue-50 text-blue-600" />
                <StatCard icon="🧭" label={tp.roadmapLabel || 'Roadmap'} value={roadmap ? '✓' : '—'} color="bg-violet-50 text-violet-600" />
                <StatCard icon="🔔" label={tp.alertsLabel || 'Alertes'} value={unreadAlerts > 0 ? unreadAlerts : '✓'} color="bg-amber-50 text-amber-600" />
              </div>

              {notes.length >= 2 && <NotesEvolutionChart notes={notes} />}

              {/* Tabs */}
              <div className="dash-tabs">
                <button onClick={() => setTab('notes')} className={`dash-tab ${tab === 'notes' ? 'active' : ''}`}>📊 {tp.tabNotes || 'Notes'}</button>
                <button onClick={() => setTab('roadmap')} className={`dash-tab ${tab === 'roadmap' ? 'active' : ''}`}>🧭 {tp.tabRoadmap || 'Roadmap'}</button>
                <button onClick={() => setTab('profil')} className={`dash-tab ${tab === 'profil' ? 'active' : ''}`}>🎯 {tp.tabOnet || 'Profil O*NET'}</button>
                <button onClick={() => setTab('notifs')} className={`dash-tab ${tab === 'notifs' ? 'active' : ''}`}>
                  🔔 {tp.tabAlerts || 'Alertes'} {unreadAlerts > 0 && <span style={{ marginLeft: 6, padding: '1px 7px', borderRadius: 999, background: '#7c3aed', color: '#fff', fontSize: 10 }}>{unreadAlerts}</span>}
                </button>
              </div>

              {/* Notes tab */}
              {tab === 'notes' && (
                notes.length === 0 ? (
                  <div className="dash-empty"><div className="dash-empty-icon">📊</div><p className="dash-empty-title">{tp.noNoteAvailable || 'Aucune note disponible'}</p></div>
                ) : (
                  <div className="dash-card-flat overflow-hidden">
                    <table className="dash-table">
                      <thead><tr><th>{tp.tableSubject||'Matière'}</th><th>{tp.tableGrade||'Note'}</th><th>{tp.tableCoeff||'Coeff.'}</th><th>{tp.tablePeriod||'Période'}</th><th>{tp.tableType||'Type'}</th></tr></thead>
                      <tbody>
                        {notes.map((n, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600, color: '#0f0c29' }}>{n.matiere}</td>
                            <td><span className={`score-chip ${n.valeur >= 14 ? 'dash-badge-green' : n.valeur >= 10 ? 'dash-badge-blue' : 'dash-badge-red'}`}>{n.valeur}/20</span></td>
                            <td style={{ color: '#64748b' }}>{n.coefficient}</td>
                            <td style={{ color: '#64748b' }}>{n.periode}</td>
                            <td style={{ color: '#64748b' }}>{n.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* Roadmap tab */}
              {tab === 'roadmap' && (
                !roadmap ? (
                  <div className="dash-empty">
                    <div className="dash-empty-icon">🧭</div>
                    <p className="dash-empty-title">{tp.noRoadmapAvailable || 'Aucun roadmap disponible'}</p>
                    <p className="dash-empty-desc">{selected.nom} {tp.noRoadmapYet || "n'a pas encore de roadmap généré."}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="dash-card p-6" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎯</div>
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', margin: 0 }}>{tp.recommendedJob || 'Métier recommandé'}</p>
                          <p style={{ fontSize: 18, fontWeight: 900, color: '#0f0c29', margin: 0 }}>{roadmap.metier}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{roadmap.description}</p>
                    </div>
                    {roadmap.etapes?.length > 0 && (
                      <div className="dash-card p-5">
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{tp.pathSteps || 'Étapes du parcours'}</p>
                        <div className="space-y-3">
                          {roadmap.etapes.map((step: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                              <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {roadmap.universites?.length > 0 && (
                      <div className="dash-card p-5">
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{tp.universities || '🎓 Universités recommandées'}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {roadmap.universites.map((u: string, i: number) => (
                            <span key={i} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>{u}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {roadmap.conseils && (
                      <div className="dash-card p-5" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{tp.advice || '💡 Conseils'}</p>
                        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{roadmap.conseils}</p>
                      </div>
                    )}
                  </div>
                )
              )}

              {/* O*NET Profile tab */}
              {tab === 'profil' && (
                !onetProfil ? (
                  <div className="dash-empty">
                    <div className="dash-empty-icon">🎯</div>
                    <p className="dash-empty-title">{tp.noOnetProfile || 'Aucun profil O*NET'}</p>
                    <p className="dash-empty-desc">{selected.nom} {tp.noOnetYet || "n'a pas encore passé le test O*NET."}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Code hero */}
                    <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed,#a855f7)' }}>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '0 0 4px' }}>{tp.riasecCodeOf || 'Code RIASEC de'} {selected.nom}</p>
                      <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '0.1em', color: '#fff', margin: 0 }}>
                        {onetProfil.primaryInterest}{onetProfil.secondaryInterest}{onetProfil.tertiaryInterest}
                      </h2>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 6 }}>
                        {onetProfil.dreamJob && `${tp.dreamJobOf || 'Métier de rêve :'} ${onetProfil.dreamJob}`}
                        {onetProfil.dreamUni && ` · ${tp.dreamUniOf || 'Université cible :'} ${onetProfil.dreamUni}`}
                      </p>
                    </div>
                    {/* Bars */}
                    <div className="dash-card p-5">
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{tp.detailedScores || 'Scores détaillés'}</p>
                      <div className="space-y-4">
                        {(() => {
                          const maxQ = Math.round((onetProfil.testLevel || 60) / 6);
                          const allScores = ['R','I','A','S','E','C'].map(c => onetProfil[`scores${c}`] || 0);
                          const maxScore = Math.max(...allScores, 1);
                          return ['R','I','A','S','E','C'].map(cat => {
                            const info = CAT[cat];
                            const score = onetProfil[`scores${cat}`] || 0;
                            const pct = Math.round((score / maxScore) * 100);
                            const absPct = maxQ > 0 ? Math.round((score / maxQ) * 100) : 0;
                            const isPrimary = cat === onetProfil.primaryInterest;
                            const isSecondary = cat === onetProfil.secondaryInterest;
                            const isTertiary = cat === onetProfil.tertiaryInterest;
                            return (
                              <div key={cat}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: isPrimary ? 800 : 500, color: (isPrimary || isSecondary || isTertiary) ? info.color : '#94a3b8' }}>
                                    <span style={{ fontSize: 16 }}>{info.emoji}</span>
                                    {info.label}
                                    {isPrimary && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: info.color, color: '#fff', fontWeight: 700 }}>{t.dashboard.profile?.primary || 'Primaire'}</span>}
                                    {isSecondary && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: info.color, color: '#fff', fontWeight: 700, opacity: 0.85 }}>{t.dashboard.profile?.secondary || 'Secondaire'}</span>}
                                    {isTertiary && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: info.color, color: '#fff', fontWeight: 700, opacity: 0.7 }}>{t.dashboard.profile?.tertiary || 'Tertiaire'}</span>}
                                  </span>
                                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{score}/{maxQ} · {absPct}%</span>
                                </div>
                                <div className="dash-progress-track" style={{ height: 10 }}>
                                  <div className="dash-progress-fill" style={{ width: `${Math.max(pct, score > 0 ? 3 : 0)}%`, background: info.color }} />
                                </div>
                                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{info.desc}</p>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                    {/* Job zone */}
                    <div className="dash-card p-5">
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{tp.educationLevel || "Niveau d'études visé"}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                          {onetProfil.jobZone}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: '#0f0c29', margin: 0 }}>{tp.zonePrefix || 'Zone'} {onetProfil.jobZone}</p>
                          <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>
                            {(tp.jobZoneLabels || [])[onetProfil.jobZone] || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Notifications tab */}
              {tab === 'notifs' && (
                parentNotifs.length === 0 ? (
                  <div className="dash-empty"><div className="dash-empty-icon">🔔</div><p className="dash-empty-title">{tp.noAlerts || 'Aucune alerte'}</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(unreadAlerts > 0 || parentNotifs.some(n => n.lu)) && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#3730a3' }}>
                          {unreadAlerts > 0 ? `${unreadAlerts} ${tp.unreadAlerts || 'alerte(s) non lue(s)'}` : (tp.allAlertsRead || 'Toutes les alertes sont lues')}
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {unreadAlerts > 0 && (
                            <button onClick={markAllRead} style={{ fontSize: 12, color: '#4338ca', fontWeight: 700, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>{tp.markAllReadShort || 'Tout marquer lu'}</button>
                          )}
                          {parentNotifs.some(n => n.lu) && (
                            <button onClick={markAllUnread} style={{ fontSize: 12, color: '#64748b', fontWeight: 700, background: 'rgba(100,116,139,0.08)', border: '1px solid rgba(100,116,139,0.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>{tp.markAllUnread || 'Tout marquer non lu'}</button>
                          )}
                        </div>
                      </div>
                    )}
                    {parentNotifs.map((n: any) => {
                      const typeIcon: Record<string, string> = { note: '📊', revision: '📝', info: 'ℹ️' };
                      return (
                        <div key={n._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px', borderRadius: 12, background: n.lu ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)', border: n.lu ? '1px solid rgba(139,92,246,0.06)' : '1px solid rgba(124,58,237,0.18)', opacity: n.lu ? 0.7 : 1 }}>
                          <span style={{ fontSize: 18 }}>{typeIcon[n.type] || '🔔'}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 13.5, color: '#0f0c29', fontWeight: n.lu ? 400 : 600 }}>{n.contenu}</p>
                            <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>
                              {formatDate(n.createdAt)}
                            </p>
                          </div>
                          {!n.lu ? (
                            <button onClick={() => markNotifRead(n._id)} style={{ fontSize: 11, color: '#4338ca', fontWeight: 700, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', flexShrink: 0 }}>{tp.markRead || '✓ Lu'}</button>
                          ) : (
                            <button onClick={async () => {
                              try {
                                await apiFetch(`/notifications/${n._id}/unread`, { method: 'PATCH' });
                                setParentNotifs(prev => prev.map(x => x._id === n._id ? { ...x, lu: false } : x));
                              } catch (_) {}
                            }} style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', flexShrink: 0 }}>{tp.markUnread || '↩ Non lu'}</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
