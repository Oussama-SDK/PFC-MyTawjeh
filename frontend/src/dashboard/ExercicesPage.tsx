import { useState, useEffect, useRef } from 'react';
import { User, Exercice, apiFetch } from './shared';
import { useTranslation } from '../i18n';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

function ExercicesPage({ user }: { user: User }) {
  const t = useTranslation();
  const ex = t.dashboard.exercices;
  const isProf = (user as any).role === 'professeur';
  const specialite = (user as any).specialite || '';

  const NIVEAUX_VALUES = ['Tronc commun', '1ère Bac', 'Terminale (2ème Bac)'];

  // List state
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMatiere, setFilterMatiere] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterNiveau, setFilterNiveau] = useState('');

  // Student state
  const [selected, setSelected] = useState<Exercice | null>(null);
  const [reponse, setReponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  // Chat state
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Prof form state
  const FORM_EMPTY = { id: '', matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' };
  const [form, setForm] = useState({ ...FORM_EMPTY, matiere: specialite });
  const [formMsg, setFormMsg] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const matieres = [...new Set(exercices.map(e => e.matiere))];

  const localDiffColor = (d: string) =>
    d === 'facile' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : d === 'difficile' ? 'bg-rose-50 text-rose-700 border-rose-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

  const diffLabel = (d: string) =>
    (ex.difficulties as any)?.[d] ?? d;

  const loadExercices = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterMatiere) params.set('matiere', filterMatiere);
    if (filterDiff) params.set('difficulte', filterDiff);
    if (filterNiveau) params.set('niveau', filterNiveau);
    apiFetch(`/exercices?${params}`)
      .then(data => setExercices(Array.isArray(data) ? data : []))
      .catch(() => setExercices([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if ((user as any).role === 'eleve') {
      apiFetch(`/exercices/resultats/${user.id}`)
        .then((r: any[]) => setDoneIds(new Set(Array.isArray(r) ? r.map((x: any) => String(x.exerciceId)) : [])))
        .catch(() => {});
    }
  }, [user.id]);

  useEffect(() => { loadExercices(); }, [filterMatiere, filterDiff, filterNiveau]);

  // ── Student: submit answer ──────────────────────────────────────────────────
  const submit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const exId = (selected as any)._id || selected.id;
      const data = await apiFetch(`/exercices/${exId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ reponse }),
      });
      setResult({ score: data.score, feedback: data.feedback });
      setDoneIds(prev => new Set([...prev, String(exId)]));
      setSubmitted(true);
    } catch (e: any) {
      setSubmitError(e.message || ex.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Student: send chat message ─────────────────────────────────────────────
  const sendChat = async () => {
    if (!selected || !chatInput.trim() || chatLoading) return;
    const exId = (selected as any)._id || selected.id;
    const userMsg: ChatMsg = { role: 'user', content: chatInput.trim() };
    const newHistory = [...chatMsgs, userMsg];
    setChatMsgs(newHistory);
    setChatInput('');
    setChatLoading(true);
    try {
      const data = await apiFetch(`/exercices/${exId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ message: userMsg.content, history: chatMsgs }),
      });
      setChatMsgs([...newHistory, { role: 'assistant', content: data.reply }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch {
      setChatMsgs([...newHistory, { role: 'assistant', content: ex.chatError }]);
    } finally {
      setChatLoading(false);
    }
  };

  // ── Prof: save (create or update) ──────────────────────────────────────────
  const saveEx = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMsg('');
    try {
      if (form.id) {
        await apiFetch(`/exercices/${form.id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiFetch('/exercices', { method: 'POST', body: JSON.stringify(form) });
      }
      loadExercices();
      setFormMsg(form.id ? ex.exerciseModified : ex.exerciseCreated);
      setForm({ ...FORM_EMPTY, matiere: specialite });
      setTimeout(() => setFormMsg(''), 2500);
    } catch (err: any) {
      setFormMsg('❌ ' + (err.message || ex.deleteError));
    } finally {
      setFormLoading(false);
    }
  };

  const editEx = (exercise: any) => {
    setForm({ id: exercise._id || exercise.id, matiere: exercise.matiere, niveau: exercise.niveau, difficulte: exercise.difficulte, contenu: exercise.contenu, correction: exercise.correction || '' });
    setFormMsg('');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const deleteEx = async (exercise: any) => {
    if (!confirm(ex.deleteConfirm)) return;
    try {
      await apiFetch(`/exercices/${exercise._id || exercise.id}`, { method: 'DELETE' });
      setExercices(prev => prev.filter(e => (e as any)._id !== (exercise._id || exercise.id) && e.id !== (exercise._id || exercise.id)));
    } catch (err: any) {
      alert(err.message || ex.deleteError);
    }
  };

  const resetForm = () => { setForm({ ...FORM_EMPTY, matiere: specialite }); setFormMsg(''); };

  // ── Exercise detail view ────────────────────────────────────────────────────
  if (selected) {
    return (
      <div>
        <button onClick={() => { setSelected(null); setSubmitted(false); setReponse(''); setResult(null); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#7c3aed', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
          {t.dashboard.labels.backToExercises}
        </button>
        <div className="dash-card p-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${localDiffColor(selected.difficulte)}`}>{diffLabel(selected.difficulte)}</span>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>{selected.matiere} · {selected.niveau}</span>
          </div>
          <div style={{ background: '#f8f7ff', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 14, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap', border: '1px solid rgba(124,58,237,0.08)' }}>
            {selected.contenu}
          </div>

          {isProf ? (
            <div className="space-y-4">
              {selected.correction && (
                <div style={{ background: '#f8f7ff', borderRadius: 12, padding: 16, border: '1px solid rgba(124,58,237,0.12)' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                    {ex.correctionOfficial}
                  </p>
                  <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7 }}>{selected.correction}</p>
                </div>
              )}
              <button onClick={() => { editEx(selected); setSelected(null); }}
                className="dash-btn dash-btn-primary" style={{ fontSize: 13 }}>
                {ex.profEditButton}
              </button>
            </div>
          ) : submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {result && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14,
                  background: result.score >= 10 ? '#f0fdf4' : '#fff7ed',
                  border: `1px solid ${result.score >= 10 ? '#bbf7d0' : '#fed7aa'}` }}>
                  <span style={{ fontSize: 32 }}>{result.score >= 15 ? '🌟' : result.score >= 10 ? '✅' : '💪'}</span>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 900, color: result.score >= 10 ? '#15803d' : '#c2410c', marginBottom: 2 }}>{result.score}/20</p>
                    <p style={{ fontSize: 12, color: '#64748b' }}>{ex.scoreObtained}</p>
                  </div>
                </div>
              )}
              {result?.feedback && (
                <div style={{ background: '#f8f7ff', borderRadius: 12, padding: 16, border: '1px solid rgba(124,58,237,0.15)' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{ex.aiFeedbackLabel}</p>
                  <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{result.feedback}</p>
                </div>
              )}
              <button onClick={() => { setSubmitted(false); setReponse(''); setResult(null); setChatMsgs([]); setShowSubmit(false); }}
                className="dash-btn dash-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {ex.retryExercise}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Chat messages */}
              <div style={{ height: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 4px', marginBottom: 12 }}>
                {chatMsgs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🤖</div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{ex.tutorTitle}</p>
                    <p style={{ fontSize: 12, marginTop: 4 }}>{ex.tutorDesc}</p>
                  </div>
                )}
                {chatMsgs.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '82%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#f1f5f9',
                      color: msg.role === 'user' ? '#fff' : '#334155',
                      fontSize: 13.5, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ padding: '10px 16px', borderRadius: '16px 16px 16px 4px', background: '#f1f5f9', color: '#94a3b8', fontSize: 13 }}>
                      {ex.tutorThinking}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                  placeholder={ex.chatPlaceholder}
                  className="dash-input"
                  style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
                  disabled={chatLoading}
                />
                <button onClick={sendChat} disabled={!chatInput.trim() || chatLoading}
                  className="dash-btn dash-btn-primary" style={{ padding: '10px 16px', fontSize: 13, flexShrink: 0 }}>
                  {ex.sendButton}
                </button>
              </div>

              {/* Submit final answer toggle */}
              {!showSubmit ? (
                <button onClick={() => setShowSubmit(true)}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px dashed #c4b5fd', background: 'transparent', color: '#7c3aed', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  {ex.readyToSubmit}
                </button>
              ) : (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {ex.finalAnswerLabel}
                  </label>
                  <textarea value={reponse} onChange={e => setReponse(e.target.value)}
                    placeholder={ex.finalAnswerPlaceholder} rows={5}
                    className="dash-input" style={{ resize: 'vertical' }} />
                  {submitError && (
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#cc1f1a', fontSize: 13 }}>
                      {submitError}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setShowSubmit(false)}
                      className="dash-btn dash-btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                      {ex.cancelButton}
                    </button>
                    <button onClick={submit} disabled={!reponse.trim() || submitting}
                      className="dash-btn dash-btn-primary" style={{ flex: 2, justifyContent: 'center', fontSize: 14 }}>
                      {submitting ? ex.correctionInProgress : ex.submitAndCorrect}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── List view ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0f0c29', margin: 0, marginRight: 8 }}>{t.dashboard.menu.exercices}</h2>
        <select value={filterMatiere} onChange={e => setFilterMatiere(e.target.value)} className="dash-input" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}>
          <option value="">{ex.allSubjects}</option>
          {matieres.map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="dash-input" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}>
          <option value="">{ex.allDifficulties}</option>
          {['facile', 'moyen', 'difficile'].map(d => (
            <option key={d} value={d}>{diffLabel(d)}</option>
          ))}
        </select>
        <select value={filterNiveau} onChange={e => setFilterNiveau(e.target.value)} className="dash-input" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}>
          <option value="">{ex.allLevels}</option>
          {NIVEAUX_VALUES.map((val, i) => (
            <option key={val} value={val}>{(ex.levels as string[])?.[i] ?? val}</option>
          ))}
        </select>
        {(filterMatiere || filterDiff || filterNiveau) && (
          <button onClick={() => { setFilterMatiere(''); setFilterDiff(''); setFilterNiveau(''); }}
            style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            {ex.resetFilter}
          </button>
        )}
      </div>

      {/* Exercise grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="dash-skeleton" style={{ height: 120, borderRadius: 14 }} />)}
        </div>
      ) : exercices.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">📝</div>
          <p className="dash-empty-title">{t.dashboard.labels.noNotes}</p>
          <p className="dash-empty-desc">{isProf ? ex.profNoExercice : t.dashboard.labels.startByAddingFirstNote}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
          {exercices.map(exercise => {
            const exId = String((exercise as any)._id || exercise.id);
            const isEditing = form.id === exId;
            return (
              <div key={exId} className="dash-card p-5 text-left" style={{ border: isEditing ? '2px solid #2563eb' : undefined, position: 'relative' }}>
                <button onClick={() => { setSelected(exercise); setSubmitted(false); setReponse(''); setResult(null); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${localDiffColor(exercise.difficulte)}`}>{diffLabel(exercise.difficulte)}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{exercise.niveau}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f0c29', marginBottom: 6 }}>{exercise.matiere}</div>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {exercise.contenu?.substring(0, 100)}...
                  </p>
                  {!isProf && doneIds.has(exId) && (
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>{ex.doneLabel}</span>
                    </div>
                  )}
                </button>

                {isProf && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 12, borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                    <button onClick={() => editEx(exercise)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                      {ex.modifyBtn}
                    </button>
                    <button onClick={() => deleteEx(exercise)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors">
                      {ex.deleteBtn}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Prof: create / edit form */}
      {isProf && (
        <div className="dash-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-700">
              {form.id ? ex.editExerciseTitle : ex.newExerciseTitle}
            </h3>
            {form.id && (
              <button onClick={resetForm} className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                {ex.cancelModif}
              </button>
            )}
          </div>
          {formMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${formMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{formMsg}</div>
          )}
          <form onSubmit={saveEx} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{ex.subjectLabel}</label>
                <input value={form.matiere} onChange={e => setForm(p => ({ ...p, matiere: e.target.value }))} required placeholder={ex.subjectLabel?.replace(' *','')} className="dash-input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{ex.levelLabel}</label>
                <select value={form.niveau} onChange={e => setForm(p => ({ ...p, niveau: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                  {NIVEAUX_VALUES.map((val, i) => (
                    <option key={val} value={val}>{(ex.levels as string[])?.[i] ?? val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{ex.difficultyLabel}</label>
                <select value={form.difficulte} onChange={e => setForm(p => ({ ...p, difficulte: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                  {['facile', 'moyen', 'difficile'].map(d => (
                    <option key={d} value={d}>{diffLabel(d)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{ex.contentLabel}</label>
              <textarea value={form.contenu} onChange={e => setForm(p => ({ ...p, contenu: e.target.value }))} required rows={4} placeholder={ex.contentPlaceholder} className="dash-input" style={{ resize: 'none' }} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{ex.correctionLabel}</label>
              <textarea value={form.correction} onChange={e => setForm(p => ({ ...p, correction: e.target.value }))} rows={3} placeholder={ex.correctionPlaceholder} className="dash-input" style={{ resize: 'none' }} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={formLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
                {formLoading ? ex.savingBtn : form.id ? ex.saveBtn : ex.createBtn}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">
                  {ex.cancelButton}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ExercicesPage;
