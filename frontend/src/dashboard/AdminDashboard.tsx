import { useState, useEffect, useCallback } from 'react';
import { User, apiFetch } from './shared';
import { useTranslation } from '../i18n';
import { useAuth } from '../AuthContext';
import { StatCard } from './Layout';
import AdminUsersTab from './AdminUsersTab';
import AdminNotifsTab from './AdminNotifsTab';

// ─── DEFAULT VALUES & CONSTANTS ─────────────────────────────────────────────
const EXERCICE_DEFAULTS = {
  id: '',
  matiere: '',
  niveau: 'Terminale (2ème Bac)',
  difficulte: 'moyen',
  contenu: '',
  correction: ''
};

const ANNALE_DEFAULTS = {
  id: '',
  matiere: '',
  annee: new Date().getFullYear().toString(),
  niveau: '2bac',
  type: 'examen national',
  contenu: '',
  correction: '',
  fichier: '',
  lien: ''
};

const CONCOURS_DEFAULTS = {
  id: '',
  nom: '',
  school: '',
  seuil: '10',
  dateConcours: '',
  description: '',
  lien: '',
  isPublished: true
};

const ITEMS_PER_PAGE = 10;

// ─── VALIDATION FUNCTIONS ────────────────────────────────────────────────────
const validateExerciceForm = (form: typeof EXERCICE_DEFAULTS): string | null => {
  if (!form.matiere.trim()) return 'La matière est requise';
  if (!form.contenu.trim()) return 'L\'énoncé est requis';
  if (!form.correction.trim()) return 'La correction est requise';
  if (form.contenu.length < 10) return 'L\'énoncé doit faire au moins 10 caractères';
  if (form.correction.length < 5) return 'La correction doit faire au moins 5 caractères';
  return null;
};

const validateAnnaleForm = (form: typeof ANNALE_DEFAULTS): string | null => {
  if (!form.matiere.trim()) return 'La matière est requise';
  if (!form.contenu.trim()) return 'L\'énoncé est requis';
  const year = parseInt(form.annee);
  if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) 
    return 'L\'année doit être entre 2000 et ' + new Date().getFullYear();
  return null;
};

const validateConcoursForm = (form: typeof CONCOURS_DEFAULTS): string | null => {
  if (!form.nom.trim()) return 'Le nom du concours est requis';
  const seuil = parseInt(form.seuil);
  if (isNaN(seuil) || seuil < 0 || seuil > 20) return 'Le seuil doit être entre 0 et 20';
  if (form.dateConcours && new Date(form.dateConcours) < new Date()) 
    return 'La date du concours doit être dans le futur';
  return null;
};


const getErrorMessage = (error: any): string => {
  if (!error) return 'Une erreur est survenue';
  if (error.message === 'Invalid token') return 'Votre session a expiré. Veuillez vous reconnecter.';
  if (error.message === 'Unauthorized') return 'Vous n\'avez pas la permission.';
  if (error.status === 500) return 'Erreur serveur. Veuillez réessayer plus tard.';
  if (error.message?.includes('duplicate')) return 'Cet élément existe déjà.';
  return error.message || 'Une erreur est survenue';
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user, standaloneTab }: { user: User; standaloneTab?: string }) {
  const t = useTranslation();
  const ta = (t.dashboard.admin || {}) as Record<string, any>;
  const { language } = useAuth();
  const lang = (language === 'ar' || language === 'en') ? language : 'fr';
  const isRtl = t.direction === 'rtl';
  const textStart = isRtl ? 'text-right' : 'text-left';
  const [data, setData] = useState<{ eleves: any[]; profs: any[]; parents: any[] }>({ eleves: [], profs: [], parents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('users');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  const navTo = (tabName: string, roleFilter = '') => {
    setTab(tabName);
    if (tabName === 'users') setUserRoleFilter(roleFilter);
  };

  // Exercices
  const [exercices, setExercices] = useState<any[]>([]);
  const [exerciceForm, setExerciceForm] = useState(EXERCICE_DEFAULTS);
  const [exerciceMsg, setExerciceMsg] = useState('');
  const [exerciceSearch, setExerciceSearch] = useState('');
  const [exerciceFilterNiveau, setExerciceFilterNiveau] = useState('');
  const [exerciceFilterDiff, setExerciceFilterDiff] = useState('');
  const [exerciceFilterStatus, setExerciceFilterStatus] = useState('');
  const [exerciceLoading, setExerciceLoading] = useState(false);
  const [exercicePage, setExercicePage] = useState(1);
  
  // Annales
  const [annales, setAnnales] = useState<any[]>([]);
  const [annaleForm, setAnnaleForm] = useState(ANNALE_DEFAULTS);
  const [annaleMsg, setAnnaleMsg] = useState('');
  const [annaleSearch, setAnnaleSearch] = useState('');
  const [annaleFilterNiveau, setAnnaleFilterNiveau] = useState('');
  const [annaleFilterType, setAnnaleFilterType] = useState('');
  const [annaleFilterYear, setAnnaleFilterYear] = useState('');
  const [annaleLoading, setAnnaleLoading] = useState(false);
  const [analePage, setAnalePage] = useState(1);
  
  // Concours
  const [concours, setConcours] = useState<any[]>([]);
  const [concoursForm, setConcoursForm] = useState(CONCOURS_DEFAULTS);
  const [concoursMsg, setConcoursMsg] = useState('');
  const [concoursSearch, setConcoursSearch] = useState('');
  const [concoursFilterPublished, setConcoursFilterPublished] = useState('');
  const [concoursFilterSchool, setConcoursFilterSchool] = useState('');
  const [concoursFilterYear, setConcoursFilterYear] = useState('');
  const [concoursLoading, setConcoursLoading] = useState(false);
  const [concoursPage, setConcoursPage] = useState(1);

  const loadUsers = useCallback(() => {
    apiFetch('/admin/users')
      .then((r) => {
        setData({
          eleves: Array.isArray(r.eleves) ? r.eleves : [],
          profs: Array.isArray(r.profs) ? r.profs : [],
          parents: Array.isArray(r.parents) ? r.parents : [],
        });
      })
      .catch((e) => setError(e.message || 'Impossible de charger les utilisateurs'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // Load exercices, annales, concours
  useEffect(() => {
    Promise.all([
      apiFetch('/exercices'),
      apiFetch('/annales'),
      apiFetch('/concours'),
    ]).then(([ex, an, co]) => {
      setExercices(Array.isArray(ex) ? ex : []);
      setAnnales(Array.isArray(an) ? an : []);
      setConcours(Array.isArray(co) ? co : []);
    }).catch((e: any) => setError(e.message || 'Impossible de charger les ressources.'));
  }, []);

  const addExercice = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateExerciceForm(exerciceForm);
    if (validationError) {
      setExerciceMsg('❌ ' + validationError);
      return;
    }
    setExerciceLoading(true);
    try {
      if (exerciceForm.id) {
        await apiFetch(`/exercices/${exerciceForm.id}`, { method: 'PUT', body: JSON.stringify(exerciceForm) });
      } else {
        await apiFetch('/exercices', { method: 'POST', body: JSON.stringify(exerciceForm) });
      }
      const ex = await apiFetch('/exercices');
      setExercices(Array.isArray(ex) ? ex : []);
      setExerciceMsg('✅ ' + (exerciceForm.id ? 'Exercice modifié' : 'Exercice ajouté') + ' !');
      setExerciceForm(EXERCICE_DEFAULTS);
      setExercicePage(1);
      setTimeout(() => setExerciceMsg(''), 3000);
    } catch (e: any) { 
      setExerciceMsg('❌ Erreur: ' + getErrorMessage(e)); 
    } finally {
      setExerciceLoading(false);
    }
  };

  const deleteExercice = async (id: number) => {
    if (!confirm('Supprimer cet exercice ?')) return;
    try {
      await apiFetch(`/exercices/${id}`, { method: 'DELETE' });
      const ex = await apiFetch('/exercices');
      setExercices(Array.isArray(ex) ? ex : []);
    } catch (e: any) { setExerciceMsg('❌ ' + e.message); }
  };

  const editExercice = (ex: any) => {
    setExerciceForm({ id: ex.id, matiere: ex.matiere, niveau: ex.niveau, difficulte: ex.difficulte, contenu: ex.contenu, correction: ex.correction });
    setExerciceMsg('');
  };

  const addAnnale = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateAnnaleForm(annaleForm);
    if (validationError) {
      setAnnaleMsg('❌ ' + validationError);
      return;
    }
    setAnnaleLoading(true);
    try {
      if (annaleForm.id) {
        await apiFetch(`/annales/${annaleForm.id}`, { method: 'PUT', body: JSON.stringify(annaleForm) });
      } else {
        await apiFetch('/annales', { method: 'POST', body: JSON.stringify(annaleForm) });
      }
      const an = await apiFetch('/annales');
      setAnnales(Array.isArray(an) ? an : []);
      setAnnaleMsg('✅ ' + (annaleForm.id ? 'Annale modifiée' : 'Annale ajoutée') + ' !');
      setAnnaleForm(ANNALE_DEFAULTS);
      setAnalePage(1);
      setTimeout(() => setAnnaleMsg(''), 3000);
    } catch (e: any) { 
      setAnnaleMsg('❌ Erreur: ' + getErrorMessage(e)); 
    } finally {
      setAnnaleLoading(false);
    }
  };

  const deleteAnnale = async (id: number) => {
    if (!confirm('Supprimer cette annale ?')) return;
    try {
      await apiFetch(`/annales/${id}`, { method: 'DELETE' });
      const an = await apiFetch('/annales');
      setAnnales(Array.isArray(an) ? an : []);
    } catch (e: any) { setAnnaleMsg('❌ ' + e.message); }
  };

  const editAnnale = (an: any) => {
    setAnnaleForm({ id: an.id, matiere: an.matiere, annee: an.annee, niveau: an.niveau || '2bac', type: an.type || 'examen national', contenu: an.contenu, correction: an.correction || '', fichier: an.fichier || '', lien: an.lien || '' });
    setAnnaleMsg('');
  };

  const addConcours = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateConcoursForm(concoursForm);
    if (validationError) {
      setConcoursMsg('❌ ' + validationError);
      return;
    }
    setConcoursLoading(true);
    try {
      if (concoursForm.id) {
        await apiFetch(`/concours/${concoursForm.id}`, { method: 'PUT', body: JSON.stringify(concoursForm) });
      } else {
        await apiFetch('/concours', { method: 'POST', body: JSON.stringify(concoursForm) });
      }
      const co = await apiFetch('/concours');
      setConcours(Array.isArray(co) ? co : []);
      setConcoursMsg('✅ ' + (concoursForm.id ? 'Concours modifié' : 'Concours ajouté') + ' !');
      setConcoursForm(CONCOURS_DEFAULTS);
      setConcoursPage(1);
      setTimeout(() => setConcoursMsg(''), 3000);
    } catch (e: any) { 
      setConcoursMsg('❌ Erreur: ' + getErrorMessage(e)); 
    } finally {
      setConcoursLoading(false);
    }
  };

  const deleteConcours = async (id: number) => {
    if (!confirm('Supprimer ce concours ?')) return;
    try {
      await apiFetch(`/concours/${id}`, { method: 'DELETE' });
      const co = await apiFetch('/concours');
      setConcours(Array.isArray(co) ? co : []);
    } catch (e: any) { setConcoursMsg('❌ ' + e.message); }
  };

  const editConcours = (co: any) => {
    setConcoursForm({ id: co.id, nom: co.nom, school: co.school || '', seuil: co.seuil.toString(), dateConcours: co.dateConcours, description: co.description, lien: co.lien, isPublished: co.isPublished !== false });
    setConcoursMsg('');
  };

  if (loading) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      <p className="text-gray-400 text-sm">{t.dashboard.labels.loading} {t.dashboard.labels.adminTitle.toLowerCase()}</p>
    </div>
  );

  if (error) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-4 text-center">
      <div className="text-4xl">⚠️</div>
      <p className="text-rose-600 font-semibold text-sm">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{(t.dashboard.admin || {}).retry || 'Réessayer'}</button>
    </div>
  );

  const activeTab = standaloneTab || tab;

  const annaleYears = [...new Set(annales.map(a => String(a.annee)).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  const concoursSchools = [...new Set(concours.map(c => c.school).filter(Boolean))].sort();
  const concoursYears = [...new Set(concours.map(c => c.dateConcours ? String(new Date(c.dateConcours).getFullYear()) : '').filter(Boolean))].sort((a, b) => b.localeCompare(a));

  const filteredExercices = exercices.filter(ex =>
    (ex.matiere || '').toLowerCase().includes(exerciceSearch.toLowerCase()) &&
    (!exerciceFilterNiveau || ex.niveau === exerciceFilterNiveau) &&
    (!exerciceFilterDiff || ex.difficulte === exerciceFilterDiff) &&
    (!exerciceFilterStatus || String(Boolean(ex.isApproved)) === exerciceFilterStatus)
  );
  const filteredAnnales = annales.filter(an =>
    (an.matiere || '').toLowerCase().includes(annaleSearch.toLowerCase()) &&
    (!annaleFilterNiveau || an.niveau === annaleFilterNiveau) &&
    (!annaleFilterType || an.type === annaleFilterType) &&
    (!annaleFilterYear || String(an.annee) === annaleFilterYear)
  );
  const filteredConcours = concours.filter(co =>
    (co.nom || '').toLowerCase().includes(concoursSearch.toLowerCase()) &&
    (!concoursFilterPublished || String(co.isPublished) === concoursFilterPublished) &&
    (!concoursFilterSchool || co.school === concoursFilterSchool) &&
    (!concoursFilterYear || (co.dateConcours && String(new Date(co.dateConcours).getFullYear()) === concoursFilterYear))
  );

  if (standaloneTab) {
    if (standaloneTab === 'users')  return <AdminUsersTab data={data} onRefresh={loadUsers} />;
    if (standaloneTab === 'notifs') return <AdminNotifsTab data={data} />;
  }

  return (
    <div className="space-y-6">
      {!standaloneTab && (
        <>
          <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#4c0519,#be123c,#e11d48)' }}>
            <p className="text-white/60 text-sm font-medium mb-1">{t.dashboard.labels.adminTitle}</p>
            <h2 className="text-2xl font-black">{user.nom}</h2>
            <p className="text-white/60 text-sm mt-1">{t.dashboard.labels.adminRole}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-2">
            <StatCard icon="🎓" label={t.dashboard.menu.eleves} value={data.eleves.length} color="bg-blue-50 text-blue-600" onClick={() => navTo('users', 'eleve')} />
            <StatCard icon="👨‍🏫" label={t.dashboard.menu.profs} value={data.profs.length} color="bg-purple-50 text-purple-600" onClick={() => navTo('users', 'professeur')} />
            <StatCard icon="👨‍👩‍👧" label={t.dashboard.menu.parents} value={data.parents.length} color="bg-emerald-50 text-emerald-600" onClick={() => navTo('users', 'parent')} />
            <StatCard icon="📝" label={ta.statExercices || 'Exercices'} value={exercices.length} color="bg-amber-50 text-amber-600" onClick={() => navTo('exercices')} />
            <StatCard icon="📚" label={ta.statAnnales || 'Annales'} value={annales.length} color="bg-rose-50 text-rose-600" onClick={() => navTo('annales')} />
            <StatCard icon="🏆" label={ta.statConcours || 'Concours'} value={concours.length} color="bg-violet-50 text-violet-600" onClick={() => navTo('concours')} />
          </div>

          {/* Tabs */}
          <div className="dash-tabs">
            {[[ 'users', `👥 ${t.dashboard.menu.users}` ], [ 'notifs', `🔔 ${t.dashboard.menu.notifications}` ], [ 'exercices', `📝 ${t.dashboard.menu.exercices}` ], [ 'annales', `📚 ${t.dashboard.menu.annales}` ], [ 'concours', `🏆 ${t.dashboard.menu.concours}` ]].map(([k, l]) => (
              <button key={k as string} onClick={() => setTab(k as string)}
                className={`dash-tab ${tab === k ? 'active' : ''}`}
                style={tab === k ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}>
                {l as string}
              </button>
            ))}
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <AdminUsersTab key={userRoleFilter} data={data} onRefresh={loadUsers} initialRoleFilter={userRoleFilter} />
      )}

      {activeTab === 'notifs' && (
        <AdminNotifsTab data={data} />
      )}

      {activeTab === 'exercices' && (
        <div className="space-y-6">
          {/* Pending approval section */}
          <div className="dash-card p-5 border-l-4 border-l-amber-400 bg-amber-50/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <span>⏳</span> {ta.pendingApproval || "Exercices en attente d'approbation"}
              </h3>
            </div>
            {(() => {
              const pending = exercices.filter(ex => !ex.isApproved);
              if (pending.length === 0) return <p className="text-xs text-gray-400">{ta.noPendingExercises || 'Aucun exercice en attente'}</p>;
              return (
                <div className="space-y-2">
                  {pending.map(ex => (
                    <div key={ex.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate">{ex.matiere} — {ex.niveau}</div>
                        <div className="text-xs text-gray-400 truncate">{ex.contenu?.substring(0, 80)}...</div>
                        <div className="text-xs text-violet-500 mt-0.5">Professeur #{ex.professeurId}</div>
                      </div>
                      <div className="flex gap-2 ml-3 flex-shrink-0">
                        <button onClick={async () => {
                          try {
                            await apiFetch(`/exercices/${ex.id}/approve`, { method: 'PATCH', body: JSON.stringify({ approved: true }) });
                            const r = await apiFetch('/exercices');
                            setExercices(Array.isArray(r) ? r : []);
                          } catch (e: any) { setExerciceMsg('❌ ' + e.message); }
                        }} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">{ta.approve || '✓ Approuver'}</button>
                        <button onClick={async () => {
                          if (!confirm(ta.rejectConfirm || 'Refuser cet exercice ? Il sera supprimé.')) return;
                          try {
                            await apiFetch(`/exercices/${ex.id}`, { method: 'DELETE' });
                            const r = await apiFetch('/exercices');
                            setExercices(Array.isArray(r) ? r : []);
                          } catch (e: any) { setExerciceMsg('❌ ' + e.message); }
                        }} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-400 hover:bg-rose-500 transition-colors">{ta.reject || '✕ Refuser'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Rechercher exercices..."
              value={exerciceSearch}
              onChange={(e) => { setExerciceSearch(e.target.value); setExercicePage(1); }}
              className="flex-1 min-w-[180px] px-4 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none"
            />
            <select value={exerciceFilterNiveau} onChange={e => { setExerciceFilterNiveau(e.target.value); setExercicePage(1); }}
              className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 outline-none bg-white">
              <option value="">{ta.level || 'Niveau'} — {ta.all || 'Tous'}</option>
              <option value="Tronc commun">Tronc commun</option>
              <option value="1ère Bac">1ère Bac</option>
              <option value="Terminale (2ème Bac)">Terminale (2ème Bac)</option>
            </select>
            <select value={exerciceFilterDiff} onChange={e => { setExerciceFilterDiff(e.target.value); setExercicePage(1); }}
              className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 outline-none bg-white">
              <option value="">{ta.difficulty || 'Difficulté'} — {ta.all || 'Tous'}</option>
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
            <select value={exerciceFilterStatus} onChange={e => { setExerciceFilterStatus(e.target.value); setExercicePage(1); }}
              className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 outline-none bg-white">
              <option value="">{ta.status || 'Statut'} — {ta.all || 'Tous'}</option>
              <option value="true">{ta.approved || 'Approuvé'}</option>
              <option value="false">{ta.pending || 'En attente'}</option>
            </select>
          </div>
          
          <div className="dash-card p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">
                {exerciceForm.id ? (ta.edit || '✏️ Modifier') : (ta.add || 'Ajouter')} {ta.addExercice || 'un exercice'}
              </h3>
              {exerciceForm.id && <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">{ta.editMode || 'Mode édition'}</span>}
            </div>
            {exerciceMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${exerciceMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{exerciceMsg}</div>}
            <form onSubmit={addExercice} className="space-y-3">
              <input required placeholder="Matière" value={exerciceForm.matiere} onChange={(e) => setExerciceForm({ ...exerciceForm, matiere: e.target.value })}
                className="dash-input" />
              <select value={exerciceForm.niveau} onChange={e => setExerciceForm({ ...exerciceForm, niveau: e.target.value })}
                className="dash-input">
                <option>1ère année Bac</option>
                <option>Terminale (2ème Bac)</option>
              </select>
              <select value={exerciceForm.difficulte} onChange={e => setExerciceForm({ ...exerciceForm, difficulte: e.target.value })}
                className="dash-input">
                <option value="facile">Facile</option>
                <option value="moyen">Moyen</option>
                <option value="difficile">Difficile</option>
              </select>
              <textarea required placeholder="Énoncé de l'exercice..." value={exerciceForm.contenu} onChange={e => setExerciceForm({ ...exerciceForm, contenu: e.target.value })}
                className="dash-input" rows={3} style={{resize:'none'}} />
              <textarea required placeholder="Correction..." value={exerciceForm.correction} onChange={e => setExerciceForm({ ...exerciceForm, correction: e.target.value })}
                className="dash-input" rows={2} style={{resize:'none'}} />
              <div className="flex gap-2">
                <button type="submit" disabled={exerciceLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                  {exerciceLoading ? (ta.inProgress || '⏳ En cours...') : (exerciceForm.id ? (ta.edit || 'Modifier') : (ta.add || 'Ajouter'))}
                </button>
                {exerciceForm.id && <button type="button" onClick={() => { setExerciceForm(EXERCICE_DEFAULTS); setExerciceMsg(''); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">{ta.cancel || 'Annuler'}</button>}
              </div>
            </form>
          </div>

          <div className="dash-card-flat overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.subject || 'Matière'}</th>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.level || 'Niveau'}</th>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.difficulty || 'Difficulté'}</th>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.status || 'Statut'}</th>
                  <th className="px-5 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredExercices
                  .slice((exercicePage - 1) * ITEMS_PER_PAGE, exercicePage * ITEMS_PER_PAGE)
                  .map(ex => (
                  <tr key={ex.id} className="hover:bg-gray-50">
                    <td className={`px-4 py-3 ${textStart}`}>{ex.matiere}</td>
                    <td className={`px-4 py-3 text-gray-500 ${textStart}`}>{ex.niveau}</td>
                    <td className={`px-4 py-3 ${textStart}`}><span className={`px-2 py-1 rounded text-xs font-bold ${ex.difficulte === 'facile' ? 'bg-emerald-100 text-emerald-700' : ex.difficulte === 'moyen' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{ex.difficulte}</span></td>
                    <td className={`px-4 py-3 ${textStart}`}>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${ex.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {ex.isApproved ? (ta.approved || 'Approuvé') : (ta.pending || 'En attente')}
                      </span>
                    </td>
                    <td className={`px-4 py-3 flex gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                      <button onClick={() => editExercice(ex)} className="text-xs text-blue-500 hover:text-blue-700 font-bold">{ta.edit?.replace('✏️ ', '') || ta.editBtn || 'Modifier'}</button>
                      <button onClick={() => deleteExercice(ex.id)} className="text-xs text-rose-500 hover:text-rose-700 font-bold">{ta.delete || 'Supprimer'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredExercices.length > ITEMS_PER_PAGE && (
              <div className="p-4 flex gap-2 justify-center border-t">
                {Array.from({ length: Math.ceil(filteredExercices.length / ITEMS_PER_PAGE) }).map((_, i) => (
                  <button key={i} onClick={() => setExercicePage(i + 1)} 
                    className={`px-3 py-1 rounded text-xs font-bold ${exercicePage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'annales' && (
        <div className="space-y-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Rechercher annales..."
              value={annaleSearch}
              onChange={(e) => { setAnnaleSearch(e.target.value); setAnalePage(1); }}
              className="flex-1 min-w-[180px] px-4 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none"
            />
            <select value={annaleFilterNiveau} onChange={e => { setAnnaleFilterNiveau(e.target.value); setAnalePage(1); }}
              className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 outline-none bg-white">
              <option value="">{ta.level || 'Niveau'} — {ta.all || 'Tous'}</option>
              <option value="tronc commun">Tronc Commun</option>
              <option value="1bac">1ère Bac</option>
              <option value="2bac">2ème Bac</option>
              <option value="licence">Licence</option>
              <option value="master">Master</option>
            </select>
            <select value={annaleFilterType} onChange={e => { setAnnaleFilterType(e.target.value); setAnalePage(1); }}
              className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 outline-none bg-white">
              <option value="">Type — {ta.all || 'Tous'}</option>
              <option value="examen national">Examen National</option>
              <option value="white test">White Test</option>
              <option value="examen blanc">Examen Blanc</option>
              <option value="exercice corrigé">Exercice Corrigé</option>
            </select>
            <select value={annaleFilterYear} onChange={e => { setAnnaleFilterYear(e.target.value); setAnalePage(1); }}
              className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 outline-none bg-white">
              <option value="">{ta.yearLabel || 'Année'} — {ta.all || 'Tous'}</option>
              {annaleYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="dash-card p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">
                {annaleForm.id ? (ta.edit || '✏️ Modifier') : (ta.add || 'Ajouter')} {ta.addAnnale || 'une annale'}
              </h3>
              {annaleForm.id && <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">{ta.editMode || 'Mode édition'}</span>}
            </div>
            {annaleMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${annaleMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{annaleMsg}</div>}
            <form onSubmit={addAnnale} className="space-y-3">
              <input required placeholder="Matière" value={annaleForm.matiere} onChange={(e) => setAnnaleForm({ ...annaleForm, matiere: e.target.value })}
                className="dash-input" />
              <input type="number" min="2000" max={new Date().getFullYear()} placeholder="Année" value={annaleForm.annee} onChange={(e) => setAnnaleForm({ ...annaleForm, annee: e.target.value })}
                className="dash-input" />
              <select value={annaleForm.niveau} onChange={(e) => setAnnaleForm({ ...annaleForm, niveau: e.target.value })}
                className="dash-input">
                <option value="1bac">1ère Bac</option>
                <option value="2bac">2ème Bac</option>
                <option value="tronc commun">Tronc Commun</option>
                <option value="licence">Licence</option>
                <option value="master">Master</option>
              </select>
              <select value={annaleForm.type} onChange={(e) => setAnnaleForm({ ...annaleForm, type: e.target.value })}
                className="dash-input">
                <option value="examen national">Examen National</option>
                <option value="white test">White Test</option>
                <option value="examen blanc">Examen Blanc</option>
                <option value="exercice corrigé">Exercice Corrigé</option>
              </select>
              <textarea required placeholder="Énoncé..." value={annaleForm.contenu} onChange={e => setAnnaleForm({ ...annaleForm, contenu: e.target.value })}
                className="dash-input" rows={3} style={{resize:'none'}} />
              <textarea placeholder="Correction..." value={annaleForm.correction} onChange={e => setAnnaleForm({ ...annaleForm, correction: e.target.value })}
                className="dash-input" rows={2} style={{resize:'none'}} />
              <input placeholder="Lien fichier (optionnel)" value={annaleForm.lien} onChange={(e) => setAnnaleForm({ ...annaleForm, lien: e.target.value })}
                className="dash-input" />
              <div className="flex gap-2">
                <button type="submit" disabled={annaleLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                  {annaleLoading ? (ta.inProgress || '⏳ En cours...') : (annaleForm.id ? (ta.edit || 'Modifier') : (ta.add || 'Ajouter'))}
                </button>
                {annaleForm.id && <button type="button" onClick={() => { setAnnaleForm(ANNALE_DEFAULTS); setAnnaleMsg(''); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">{ta.cancel || 'Annuler'}</button>}
              </div>
            </form>
          </div>

          <div className="dash-card-flat overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.subject || 'Matière'}</th>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.yearLabel || 'Année'}</th>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.level || 'Niveau'}</th>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.typeLabel || 'Type'}</th>
                  <th className="px-5 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAnnales
                  .slice((analePage - 1) * ITEMS_PER_PAGE, analePage * ITEMS_PER_PAGE)
                  .map(an => (
                  <tr key={an.id} className="hover:bg-gray-50">
                    <td className={`px-4 py-3 ${textStart}`}>{an.matiere}</td>
                    <td className={`px-4 py-3 text-gray-500 ${textStart}`}>{an.annee}</td>
                    <td className={`px-4 py-3 ${textStart}`}><span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">{an.niveau || '2bac'}</span></td>
                    <td className={`px-4 py-3 ${textStart}`}><span className="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700">{an.type || 'examen national'}</span></td>
                    <td className={`px-4 py-3 flex gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                      <button onClick={() => editAnnale(an)} className="text-xs text-blue-500 hover:text-blue-700 font-bold">{ta.edit?.replace('✏️ ', '') || ta.editBtn || 'Modifier'}</button>
                      <button onClick={() => deleteAnnale(an.id)} className="text-xs text-rose-500 hover:text-rose-700 font-bold">{ta.delete || 'Supprimer'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAnnales.length > ITEMS_PER_PAGE && (
              <div className="p-4 flex gap-2 justify-center border-t">
                {Array.from({ length: Math.ceil(filteredAnnales.length / ITEMS_PER_PAGE) }).map((_, i) => (
                  <button key={i} onClick={() => setAnalePage(i + 1)} 
                    className={`px-3 py-1 rounded text-xs font-bold ${analePage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'concours' && (
        <div className="space-y-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Rechercher concours..."
              value={concoursSearch}
              onChange={(e) => { setConcoursSearch(e.target.value); setConcoursPage(1); }}
              className="flex-1 min-w-[180px] px-4 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none"
            />
            <select value={concoursFilterSchool} onChange={e => { setConcoursFilterSchool(e.target.value); setConcoursPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 outline-none bg-white">
              <option value="">{ta.schoolLabel || 'École'} — {ta.all || 'Tous'}</option>
              {concoursSchools.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={concoursFilterYear} onChange={e => { setConcoursFilterYear(e.target.value); setConcoursPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 outline-none bg-white">
              <option value="">{ta.dateLabel || 'Date'} — {ta.all || 'Tous'}</option>
              {concoursYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={concoursFilterPublished} onChange={e => { setConcoursFilterPublished(e.target.value); setConcoursPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 outline-none bg-white">
              <option value="">Statut — {ta.all || 'Tous'}</option>
              <option value="true">{ta.published || 'Publié'}</option>
              <option value="false">{ta.draft || 'Brouillon'}</option>
            </select>
          </div>

          <div className="dash-card p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">
                {concoursForm.id ? (ta.edit || '✏️ Modifier') : (ta.add || 'Ajouter')} {ta.addConcours || 'un concours'}
              </h3>
              {concoursForm.id && <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">{ta.editMode || 'Mode édition'}</span>}
            </div>
            {concoursMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${concoursMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{concoursMsg}</div>}
            <form onSubmit={addConcours} className="space-y-3">
              <input required placeholder="Nom du concours" value={concoursForm.nom} onChange={(e) => setConcoursForm({ ...concoursForm, nom: e.target.value })}
                className="dash-input" />
              <input placeholder="École/Source (optionnel)" value={concoursForm.school} onChange={(e) => setConcoursForm({ ...concoursForm, school: e.target.value })}
                className="dash-input" />
              <input type="number" min="0" max="20" placeholder="Seuil de réussite" value={concoursForm.seuil} onChange={(e) => setConcoursForm({ ...concoursForm, seuil: e.target.value })}
                className="dash-input" />
              <input type="date" value={concoursForm.dateConcours} onChange={(e) => setConcoursForm({ ...concoursForm, dateConcours: e.target.value })}
                className="dash-input" />
              <input placeholder="Lien (optionnel)" value={concoursForm.lien} onChange={(e) => setConcoursForm({ ...concoursForm, lien: e.target.value })}
                className="dash-input" />
              <textarea placeholder="Description..." value={concoursForm.description} onChange={e => setConcoursForm({ ...concoursForm, description: e.target.value })}
                className="dash-input" rows={2} style={{resize:'none'}} />
              <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                <input type="checkbox" id="publish" checked={concoursForm.isPublished} onChange={(e) => setConcoursForm({ ...concoursForm, isPublished: e.target.checked })} />
                <label htmlFor="publish" className="text-sm font-medium text-gray-700 cursor-pointer">{ta.publish || 'Publier immédiatement'}</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={concoursLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                  {concoursLoading ? (ta.inProgress || '⏳ En cours...') : (concoursForm.id ? (ta.edit || 'Modifier') : (ta.add || 'Ajouter'))}
                </button>
                {concoursForm.id && <button type="button" onClick={() => { setConcoursForm(CONCOURS_DEFAULTS); setConcoursMsg(''); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">{ta.cancel || 'Annuler'}</button>}
              </div>
            </form>
          </div>

          <div className="dash-card-flat overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.nameLabel || ta.colName || 'Nom'}</th>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.schoolLabel || ta.colSchool || 'École'}</th>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.dateLabel || ta.colDate || 'Date'}</th>
                  <th className={`${textStart} px-5 py-3 font-bold text-gray-600`}>{ta.status || 'Statut'}</th>
                  <th className="px-5 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredConcours
                  .slice((concoursPage - 1) * ITEMS_PER_PAGE, concoursPage * ITEMS_PER_PAGE)
                  .map(co => (
                  <tr key={co.id} className="hover:bg-gray-50">
                    <td className={`px-4 py-3 font-semibold ${textStart}`}>{co.nom}</td>
                    <td className={`px-4 py-3 text-gray-500 ${textStart}`}>{co.school || '—'}</td>
                    <td className={`px-4 py-3 text-gray-500 ${textStart}`}>{co.dateConcours || '—'}</td>
                    <td className={`px-4 py-3 ${textStart}`}>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${co.isPublished !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {co.isPublished !== false ? (ta.published || 'Publié') : (ta.draft || 'Brouillon')}
                      </span>
                    </td>
                    <td className={`px-4 py-3 flex gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                      <button onClick={() => editConcours(co)} className="text-xs text-blue-500 hover:text-blue-700 font-bold">{ta.edit?.replace('✏️ ', '') || ta.editBtn || 'Modifier'}</button>
                      <button onClick={() => deleteConcours(co.id)} className="text-xs text-rose-500 hover:text-rose-700 font-bold">{ta.delete || 'Supprimer'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredConcours.length > ITEMS_PER_PAGE && (
              <div className="p-4 flex gap-2 justify-center border-t">
                {Array.from({ length: Math.ceil(filteredConcours.length / ITEMS_PER_PAGE) }).map((_, i) => (
                  <button key={i} onClick={() => setConcoursPage(i + 1)} 
                    className={`px-3 py-1 rounded text-xs font-bold ${concoursPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
