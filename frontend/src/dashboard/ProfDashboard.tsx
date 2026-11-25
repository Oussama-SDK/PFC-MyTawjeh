import React, { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';
import { StatCard } from './Layout';
import { useTranslation } from '../i18n';
import { useAuth } from '../AuthContext';

// ─── PROF DASHBOARD ───────────────────────────────────────────────────────────
function ProfDashboard({ user, initialTab = 'eleves' }: { user: User; initialTab?: 'eleves' | 'resultats' | 'creer' | 'exercices' }) {
  const t = useTranslation();
  const tp = (t.dashboard as any).prof || {};
  const { language } = useAuth();
  const lang = (language === 'ar' || language === 'en') ? language : 'fr';
  const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', ar: 'ar-SA' };
  const locale = localeMap[lang] || 'fr-FR';
  const isRtl = t.direction === 'rtl';
  const textStart = isRtl ? 'text-right' : 'text-left';
  const [eleves, setEleves] = useState<any[]>([]);
  const [resultats, setResultats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(initialTab);
  const specialite = (user as any).specialite || '';
  const FORM_DEFAULTS = { id: '', matiere: specialite, niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' };
  const [form, setForm] = useState(FORM_DEFAULTS);
  const [formMsg, setFormMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'scoreDesc' | 'scoreAsc' | 'eleve'>('scoreDesc');
  const [expandAll, setExpandAll] = useState(false);
  const [notifStudent, setNotifStudent] = useState<any | null>(null);
  const [notifText, setNotifText] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifLoading, setNotifLoading] = useState(false);
  const [openResultId, setOpenResultId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);

  const notifTemplates = [
    { id: 'revision',      label: tp.tplRevision || 'Rappel de révision',     text: tp.tplRevisionText || 'Bonjour {nom}, je vous invite à revoir les notions clés.' },
    { id: 'encouragement', label: tp.tplEncouragement || 'Message encourageant', text: tp.tplEncouragementText || 'Bonjour {nom}, continuez vos efforts.' },
    { id: 'programme',     label: tp.tplPlan || "Plan d'action",               text: tp.tplPlanText || 'Bonjour {nom}, organisez une session de révision.' },
  ];

  useEffect(() => { setTab(initialTab); }, [initialTab]);

  useEffect(() => {
    Promise.all([
      apiFetch('/prof/eleves-faibles'),
      apiFetch('/prof/stats'),
      apiFetch('/exercices'),
    ]).then(([el, st, ex]) => {
      setEleves(Array.isArray(el) ? el : []);
      setResultats(Array.isArray(st.resultats) ? st.resultats : []);
      setExercises(Array.isArray(ex) ? ex : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const scoreValue = (r: any) => Number(r.score || 0);
  const filteredResultats = resultats
    .filter((r) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return [r.eleveName, r.eleveEmail, r.exMatiere, r.exContenu, r.score?.toString()].some((v) =>
        String(v || '').toLowerCase().includes(query)
      );
    })
    .filter((r) => {
      const score = scoreValue(r);
      if (scoreFilter === 'low') return score < 10;
      if (scoreFilter === 'mid') return score >= 10 && score < 14;
      if (scoreFilter === 'high') return score >= 14;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'eleve') return String(a.eleveName || '').localeCompare(String(b.eleveName || ''));
      if (sortBy === 'scoreAsc') return scoreValue(a) - scoreValue(b);
      return scoreValue(b) - scoreValue(a);
    });

  const averageScore = resultats.length
    ? (resultats.reduce((sum, r) => sum + scoreValue(r), 0) / resultats.length).toFixed(1)
    : '—';

  const weakStudents = eleves.filter(e => parseFloat(e.moyenne) < 12);

  const sendNotifToStudent = async (student: any) => {
    if (!notifText.trim()) { setNotifMsg(tp.notifRequired || "Veuillez saisir un message."); return; }
    setNotifLoading(true); setNotifMsg('');
    try {
      await apiFetch('/notifications', { method: 'POST', body: JSON.stringify({ contenu: notifText.trim(), type: 'revision', eleveId: student.id }) });
      setNotifMsg(t.dashboard.labels.notifSent);
      setNotifText('');
    } catch (err: any) {
      setNotifMsg('❌ ' + (err.message || t.dashboard.labels.notifSendError));
    } finally { setNotifLoading(false); }
  };

  const sendNotifToAllWeak = async () => {
    if (!notifText.trim()) { setNotifMsg(tp.notifRequiredAll || "Veuillez saisir un message."); return; }
    if (!weakStudents.length) { setNotifMsg(tp.noWeakStudents || "Aucun élève en difficulté."); return; }
    setNotifLoading(true); setNotifMsg('');
    try {
      await Promise.all(weakStudents.map((s) => apiFetch('/notifications', { method: 'POST', body: JSON.stringify({ contenu: notifText.trim(), type: 'revision', eleveId: s.id }) })));
      setNotifMsg(t.dashboard.labels.notifSentCount.replace('{count}', String(weakStudents.length)));
      setNotifText('');
    } catch (err: any) {
      setNotifMsg('❌ ' + (err.message || t.dashboard.labels.notifSendError));
    } finally { setNotifLoading(false); }
  };

  const saveEx = async (e: React.FormEvent) => {
    e.preventDefault(); setFormMsg('');
    try {
      if (form.id) {
        await apiFetch(`/exercices/${form.id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiFetch('/exercices', { method: 'POST', body: JSON.stringify(form) });
      }
      const ex = await apiFetch('/exercices');
      setExercises(Array.isArray(ex) ? ex : []);
      setFormMsg(form.id ? (tp.saveSuccess || '✅ Exercice modifié !') : (tp.createSuccess || '✅ Exercice créé !'));
      setForm({ id: '', matiere: specialite, niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' });
      setTimeout(() => setFormMsg(''), 2500);
    } catch (err: any) {
      setFormMsg('❌ ' + (err.message || 'Erreur'));
    }
  };

  const editEx = (ex: any) => {
    setForm({ id: ex.id || ex._id, matiere: ex.matiere, niveau: ex.niveau, difficulte: ex.difficulte, contenu: ex.contenu, correction: ex.correction || '' });
    setFormMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEx = async (ex: any) => {
    if (!confirm(tp.deleteConfirm || 'Supprimer cet exercice ?')) return;
    try {
      await apiFetch(`/exercices/${ex.id || ex._id}`, { method: 'DELETE' });
      setExercises(prev => prev.filter(e => (e.id || e._id) !== (ex.id || ex._id)));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb,#1d4ed8)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">{tp.dashboardTitle || 'Tableau de bord'}</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">{tp.teacherRole || 'Professeur'} · {(user as any).specialite || user.email}</p>
        {(user as any).specialite && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
            <span>📚</span> {tp.subjectTaught || 'Matière enseignée'} : <span className="font-bold">{(user as any).specialite}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-2">
        <StatCard icon="👥" label={tp.statWeak || 'En difficulté'} value={eleves.length} color="bg-rose-50 text-rose-600" />
        <StatCard icon="📊" label={tp.statSubmissions || 'Soumissions reçues'} value={resultats.length} color="bg-violet-50 text-violet-600" />
        <StatCard icon="⭐" label={tp.statAverage || 'Moyenne'} value={averageScore} color="bg-blue-50 text-blue-600" />
        <StatCard icon="⚠️" label={tp.statBelow10 || 'Sous 10/20'} value={eleves.filter(e => parseFloat(e.moyenne) < 10).length} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {(['eleves', 'resultats', 'exercices'] as const).map((k, i) => {
          const labels = [tp.tabStudents || '👥 Élèves en difficulté', tp.tabResults || '📊 Soumissions', tp.tabExercises || '📝 Mes exercices'];
          return (
            <button key={k} onClick={() => setTab(k)}
              className={`dash-tab ${tab === k ? 'active' : ''}`}
              style={tab === k ? { background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' } : {}}>
              {labels[i]}
            </button>
          );
        })}
      </div>

      {tab === 'eleves' && weakStudents.length > 0 && (
        <div className="dash-card p-4 bg-violet-50 border border-violet-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-violet-700">{tp.alertPanel || 'Alerter les élèves en difficulté'}</p>
              <p className="text-xs text-violet-600">{tp.alertPanelDesc || 'Sélectionnez un élève pour envoyer un message personnalisé.'}</p>
            </div>
            <button onClick={() => setNotifStudent(weakStudents[0])} className="dash-btn dash-btn-primary" style={{ minWidth: 220 }}>
              {notifStudent
                ? (tp.editAlertBtn || "Modifier l'alerte")
                : `${tp.alertBtn || 'Alerter'} ${weakStudents.length} ${weakStudents.length > 1 ? (tp.alertBtnStudentsPlural || 'élèves') : (tp.alertBtnStudents || 'élève')}`}
            </button>
          </div>
        </div>
      )}

      {tab === 'eleves' && notifStudent && (
        <div className="dash-card p-4 border border-violet-100">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-800">{tp.sendNotifTo || 'Envoyer une notification à'} {notifStudent.nom}</p>
            <p className="text-xs text-gray-500">{tp.sendNotifDesc || 'Le message sera envoyé directement à l\'élève lié.'}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            {notifTemplates.map((tpl) => (
              <button key={tpl.id} type="button"
                onClick={() => setNotifText(tpl.text.replace('{nom}', notifStudent.nom))}
                className="dash-btn dash-btn-ghost text-xs" style={{ padding: '10px 12px', minHeight: 44 }}>
                {tpl.label}
              </button>
            ))}
          </div>
          <textarea value={notifText} onChange={(e) => setNotifText(e.target.value)}
            placeholder={tp.notifPlaceholder || "Rédigez votre message d'alerte ici..."}
            className="dash-input" style={{ minHeight: 120, resize: 'vertical' }} />
          <div className="mt-3 flex flex-col sm:flex-row items-center gap-3 justify-end">
            <button type="button" onClick={() => { setNotifStudent(null); setNotifText(''); setNotifMsg(''); }}
              className="dash-btn dash-btn-ghost" style={{ minWidth: 130 }}>
              {tp.cancelBtn || 'Annuler'}
            </button>
            <button type="button" onClick={() => sendNotifToAllWeak()} disabled={notifLoading}
              className="dash-btn dash-btn-secondary" style={{ minWidth: 150 }}>
              {notifLoading ? (tp.sending || 'Envoi...') : `${tp.alertBtn || 'Alerter'} ${weakStudents.length} ${weakStudents.length > 1 ? (tp.alertBtnStudentsPlural || 'élèves') : (tp.alertBtnStudents || 'élève')}`}
            </button>
            <button type="button" onClick={() => sendNotifToStudent(notifStudent)} disabled={notifLoading}
              className="dash-btn dash-btn-primary" style={{ minWidth: 130 }}>
              {notifLoading ? (tp.sending || 'Envoi...') : (tp.sendNotif || 'Envoyer la notification')}
            </button>
          </div>
          {notifMsg && <p className="mt-3 text-sm" style={{ color: notifMsg.startsWith('✅') ? '#047857' : '#b91c1c' }}>{notifMsg}</p>}
        </div>
      )}

      {/* Students tab */}
      {tab === 'eleves' && (
        loading ? (
          <div className="text-center py-10"><div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto" /></div>
        ) : eleves.length === 0 ? (
          <div className="dash-card dash-empty">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-400 text-sm">
              {specialite
                ? `${tp.allGoodSpeciality || 'Tous les élèves sont en bonne progression en'} ${specialite}`
                : (tp.allGood || 'Tous les élèves sont en bonne progression')}
            </p>
          </div>
        ) : (
          <div className="dash-card-flat overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase grid grid-cols-5 gap-2">
              <span>{tp.colStudent || 'Élève'}</span>
              <span>{tp.colLevel || 'Niveau'}</span>
              <span>{tp.colTrack || 'Filière'}</span>
              <span className="text-right">{tp.colAverage || 'Moyenne'}</span>
              <span className="text-right">{tp.colAction || 'Action'}</span>
            </div>
            {eleves.map((e: any, i: number) => (
              <div key={i} className={`grid grid-cols-5 gap-2 items-center px-5 py-4 ${i < eleves.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                    {e.nom?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{e.nom}</div>
                    <div className="text-xs text-gray-400">
                      {e.email}
                      {e.weakestSubject && (
                        <span className="ml-2">· {tp.weakSubject || 'Matière faible'} : <span className="font-semibold text-gray-700">{e.weakestSubject}</span></span>
                      )}
                    </div>
                    {e.weakestExercise && (
                      <div className="text-xs text-gray-500 mt-1">« {e.weakestExercise} »</div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{e.niveau || '—'}</span>
                <span className="text-xs text-gray-500">{e.filiere || '—'}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black text-right ml-auto block w-fit ${parseFloat(e.moyenne) < 10 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                  {e.moyenne ? `${e.moyenne}/20` : 'N/A'}
                </span>
                <div className="text-right">
                  <button onClick={() => {
                    setNotifStudent(e);
                    setNotifText(`${notifTemplates[0].text.split('{nom}')[0]}${e.nom}${notifTemplates[0].text.split('{nom}')[1] || ''}`);
                    setNotifMsg('');
                  }} className="text-xs font-bold text-violet-600 hover:text-violet-800">
                    {tp.alertAction || 'Alerter'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Results tab */}
      {tab === 'resultats' && (
        <div className="space-y-4">
          <div className="dash-card p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tp.searchPlaceholder || 'Rechercher par élève, matière ou score...'}
                className="dash-input" style={{ flex: 1 }} />
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">{tp.filterLabel || 'Filtrer'}</label>
                <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value as any)} className="dash-input w-auto">
                  <option value="all">{tp.filterAll || 'Tous'}</option>
                  <option value="low">{tp.filterLow || 'À revoir (<10)'}</option>
                  <option value="mid">{tp.filterMid || 'Bon (10-13)'}</option>
                  <option value="high">{tp.filterHigh || 'Excellent (14+)'}</option>
                </select>
                <label className="text-xs font-semibold text-gray-400 uppercase">{tp.sortLabel || 'Trier'}</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="dash-input w-auto">
                  <option value="scoreDesc">{tp.sortScoreDesc || 'Score décroissant'}</option>
                  <option value="scoreAsc">{tp.sortScoreAsc || 'Score croissant'}</option>
                  <option value="eleve">{tp.sortStudent || 'Élève'}</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500">{filteredResultats.length}/{resultats.length} {tp.results || 'résultats'}</div>
              <button type="button" onClick={() => {
                setExpandAll(!expandAll);
                if (expandAll) setOpenResultId(null);
              }} className="text-sm font-bold text-violet-600 hover:text-violet-800">
                {expandAll ? (tp.collapseAll || 'Réduire tout') : (tp.expandAll || 'Voir toutes les réponses')}
              </button>
            </div>
          </div>

          <div className="dash-card-flat overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{tp.colStudent || t.dashboard.labels.tableStudent || 'Élève'}</th>
                  <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{tp.colExercise || t.dashboard.labels.tableExercise || 'Exercice'}</th>
                  <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{tp.colScore || t.dashboard.labels.tableScore || 'Score'}</th>
                  <th className="px-5 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredResultats.map((r: any, i: number) => (
                  <React.Fragment key={r.id || i}>
                    <tr className="hover:bg-gray-50/50">
                      <td className={`px-5 py-3.5 ${textStart}`}>
                        <div className="text-sm font-semibold text-gray-800">{r.eleveName || '—'}</div>
                        <div className="text-xs text-gray-400">{r.eleveEmail}</div>
                      </td>
                      <td className={`px-5 py-3.5 ${textStart}`}>
                        <div className="text-xs font-bold text-gray-600">{r.exMatiere}</div>
                        <div className="text-xs text-gray-400">{r.exContenu}...</div>
                      </td>
                      <td className={`px-5 py-3.5 ${textStart}`}>
                        <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${parseFloat(r.score) >= 14 ? 'text-emerald-600 bg-emerald-50' : parseFloat(r.score) >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'}`}>
                          {r.score}/20
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 ${isRtl ? 'text-left' : 'text-right'}`}>
                        <button onClick={() => {
                          if (expandAll) { setExpandAll(false); return; }
                          setOpenResultId(openResultId === r.id ? null : r.id);
                        }} className="text-xs font-bold text-violet-600 hover:text-violet-800">
                          {expandAll ? (tp.collapseAll || 'Réduire tout') : openResultId === r.id ? (tp.hideAnswer || 'Masquer réponse') : (tp.showAnswer || 'Voir réponse')}
                        </button>
                      </td>
                    </tr>
                    {(expandAll || openResultId === r.id) && (
                      <tr key={`${r.id}-detail`} className="bg-gray-50">
                        <td colSpan={4} className="px-5 py-4 text-sm text-gray-600">
                          <div className="mb-2 text-xs uppercase tracking-[0.12em] text-gray-500 font-semibold">{tp.studentAnswer || "Réponse de l'élève"}</div>
                          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }} className="border border-gray-200 rounded-xl p-4 bg-white">
                            {r.reponse || (tp.noAnswer || 'Aucune réponse fournie.')}
                          </div>
                          {r.feedback && (
                            <div className="mt-3 text-sm text-gray-500">
                              <span className="font-semibold">{tp.aiFeedback || 'Feedback IA'} : </span>{r.feedback}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {!filteredResultats.length && (
                  <tr><td colSpan={4} className="py-12 text-center text-gray-400 text-sm">{tp.noSearchResults || 'Aucun résultat ne correspond à votre recherche.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exercises tab */}
      {tab === 'exercices' && (
        <div className="space-y-6">
          {/* Create / Edit form */}
          <div className="dash-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">
                {form.id ? `✏️ ${tp.editExercise || "Modifier l'exercice"}` : `➕ ${tp.newExercise || 'Nouvel exercice'}`}
              </h3>
              {form.id && (
                <button onClick={() => { setForm(FORM_DEFAULTS); setFormMsg(''); }}
                  className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                  {tp.cancelEdit || 'Annuler la modification'}
                </button>
              )}
            </div>
            {formMsg && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${formMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{formMsg}</div>
            )}
            <form onSubmit={saveEx} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{tp.subjectLabel || 'Matière *'}</label>
                  <input value={form.matiere} onChange={e => setForm(p => ({...p, matiere: e.target.value}))} required placeholder="Mathématiques" className="dash-input" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{tp.levelLabel || 'Niveau'}</label>
                  <select value={form.niveau} onChange={e => setForm(p => ({...p, niveau: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                    {['Tronc commun','1ère Bac','Terminale (2ème Bac)'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{tp.diffLabel || 'Difficulté'}</label>
                  <select value={form.difficulte} onChange={e => setForm(p => ({...p, difficulte: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                    {['facile','moyen','difficile'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{tp.contentLabel || 'Énoncé *'}</label>
                <textarea value={form.contenu} onChange={e => setForm(p => ({...p, contenu: e.target.value}))} required rows={4}
                  placeholder={tp.contentPlaceholder || "Contenu de l'exercice..."} className="dash-input" style={{resize:'none'}} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{tp.correctionLabel || 'Correction'}</label>
                <textarea value={form.correction} onChange={e => setForm(p => ({...p, correction: e.target.value}))} rows={3}
                  placeholder={tp.correctionPlaceholder || 'Correction détaillée...'} className="dash-input" style={{resize:'none'}} />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
                  {form.id ? (tp.saveEdit || 'Enregistrer les modifications') : (tp.createEx || "Créer l'exercice")}
                </button>
                {form.id && (
                  <button type="button" onClick={() => { setForm(FORM_DEFAULTS); setFormMsg(''); }}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">
                    {tp.cancelBtn || 'Annuler'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Exercise list */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">{tp.myExercises || 'Mes exercices'} ({exercises.length})</h3>
          </div>

          {exercises.length === 0 ? (
            <div className="dash-card p-10 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-400 text-sm">{tp.noExercises || 'Aucun exercice créé pour le moment. Utilisez le formulaire ci-dessus.'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((ex) => (
                <div key={ex.id || ex._id} className={`dash-card p-4 border-l-4 ${form.id === (ex.id || ex._id) ? 'border-l-blue-500 bg-blue-50/30' : 'border-l-gray-200'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h4 className="text-sm font-bold text-gray-800">{ex.matiere}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${ex.difficulte === 'facile' ? 'bg-emerald-100 text-emerald-700' : ex.difficulte === 'moyen' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                          {ex.difficulte}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">{ex.niveau}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1.5 line-clamp-2">{ex.contenu?.substring(0, 150)}</p>
                      <span className="text-xs text-gray-400">
                        {tp.createdOn || 'Créé le'} {new Date(ex.createdAt).toLocaleDateString(locale)}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => editEx(ex)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                        {tp.modifyBtn || 'Modifier'}
                      </button>
                      <button onClick={() => deleteEx(ex)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors">
                        {tp.deleteBtn || 'Supprimer'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfDashboard;
