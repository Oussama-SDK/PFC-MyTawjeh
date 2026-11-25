import { useState, useEffect } from 'react';
import { User, Note, apiFetch } from './shared';
import { useTranslation } from '../i18n';
import NotesEvolutionChart from './NotesEvolutionChart';
import { IcClose } from './icons';

// ─── NOTES PAGE ───────────────────────────────────────────────────────────────
function NotesPage({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ matiere: '', valeur: '', coefficient: '1', periode: 'S1', type: 'Contrôle' });

  useEffect(() => {
    apiFetch(`/eleves/${user.id}/notes`)
      .then(data => setNotes(Array.isArray(data) ? data : []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, [user.id]);

  const moyenneGenerale = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(2)
    : '—';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const note = await apiFetch('/notes', {
        method: 'POST',
        body: JSON.stringify({ ...form, valeur: parseFloat(form.valeur), coefficient: parseFloat(form.coefficient), eleveId: user.id }),
      });
      if (note && note.id) setNotes([note, ...notes]);
      setShowForm(false);
      setForm({ matiere: '', valeur: '', coefficient: '1', periode: 'S1', type: 'Contrôle' });
    } catch {
      // form stays open so user can retry
    }
  };

  const deleteNote = async (id: number) => {
    await apiFetch(`/notes/${id}`, { method: 'DELETE' });
    setNotes(notes.filter((n) => n.id !== id));
  };

  const colorVal = (v: number) =>
    v >= 14 ? 'text-emerald-600 bg-emerald-50' : v >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50';

  const t = useTranslation();
  const isRtl = t.direction === 'rtl';
  const textStart = isRtl ? 'text-right' : 'text-left';

  return (
    <div className="">
      {notes.length >= 2 && <div className="mb-6"><NotesEvolutionChart notes={notes} /></div>}
      {notes.length === 1 && (
        <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
          {t.dashboard.labels.chartHint || 'Le graphique nécessite au moins 2 notes pour afficher votre évolution.'}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">{t.dashboard.menu.notes}</h2>
          <p className="text-sm text-gray-400">{t.dashboard.labels.averageGeneral} : <span className="font-bold text-violet-700">{moyenneGenerale}</span></p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="dash-btn dash-btn-primary">
          <span>+</span> {t.dashboard.labels.addNote}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="dash-card p-6" style={{borderColor:"rgba(124,58,237,0.15)"}}>
          <h3 className="text-sm font-bold text-gray-700 mb-4">{t.dashboard.labels.newNote}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input required placeholder={t.dashboard.labels.noteMatiereLabel || 'Matière'} value={form.matiere} onChange={(e) => setForm({ ...form, matiere: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
            <input required type="number" min="0" max="20" step="0.25" placeholder={t.dashboard.labels.noteValueLabel || 'Note /20'} value={form.valeur} onChange={(e) => setForm({ ...form, valeur: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
            <input type="number" min="1" max="5" step="0.5" placeholder={t.dashboard.labels.noteCoeffLabel || 'Coefficient'} value={form.coefficient} onChange={(e) => setForm({ ...form, coefficient: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
            <select value={form.periode} onChange={(e) => setForm({ ...form, periode: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 outline-none">
              <option>S1</option><option>S2</option><option>Annuel</option>
            </select>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 outline-none">
              <option>Contrôle</option><option>Devoir</option><option>Examen</option><option>TP</option>
            </select>
            <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              {t.dashboard.labels.save}
            </button>
          </div>
        </form>
      )}

      {loading ? (
      <div className="text-center py-16 text-gray-400">{t.dashboard.labels.loading}</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-400 font-medium">{t.dashboard.labels.noNotes}</p>
          <p className="text-sm text-gray-300 mt-1">{t.dashboard.labels.startByAddingFirstNote}</p>
        </div>
      ) : (
        <div className="dash-card-flat overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className={`${textStart} px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider`}>{t.dashboard.labels.tableSubject||'Matière'}</th>
                <th className={`${textStart} px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider`}>{t.dashboard.labels.tableGrade||'Note'}</th>
                <th className={`${textStart} px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider`}>{t.dashboard.labels.tableCoeff||'Coeff.'}</th>
                <th className={`${textStart} px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider`}>{t.dashboard.labels.tablePeriod||'Période'}</th>
                <th className={`${textStart} px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider`}>{t.dashboard.labels.tableType||'Type'}</th>
                <th className="px-5 py-3.5 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className={`px-5 py-4 text-sm font-semibold text-gray-800 ${textStart}`}>{note.matiere}</td>
                  <td className={`px-5 py-4 ${textStart}`}>
                    <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${colorVal(note.valeur)}`}>
                      {note.valeur}/20
                    </span>
                  </td>
                  <td className={`px-5 py-4 text-sm text-gray-500 ${textStart}`}>{note.coefficient}</td>
                  <td className={`px-5 py-4 text-sm text-gray-500 ${textStart}`}>{note.periode}</td>
                  <td className={`px-5 py-4 ${textStart}`}>
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">{note.type}</span>
                  </td>
                  <td className={`px-5 py-4 flex items-center ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <button onClick={() => deleteNote(note.id)} className="text-gray-300 hover:text-rose-500 transition-colors flex items-center"><IcClose size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NotesPage;
