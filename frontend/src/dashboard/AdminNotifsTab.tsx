import { useState, useEffect } from 'react';
import { apiFetch } from './shared';
import { useTranslation } from '../i18n';

type RecipientType = 'all_eleves' | 'eleve' | 'parent' | 'professeur';

// ALL_LABEL is built dynamically from i18n in the component

interface AdminNotifsTabProps {
  data: { eleves: any[]; profs: any[]; parents: any[] };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminNotifsTab({ data }: AdminNotifsTabProps) {
  const t = useTranslation();
  const ta = t.dashboard.admin || {};
  const isRtl = t.direction === 'rtl';
  const textStart = isRtl ? 'text-right' : 'text-left';

  const ALL_LABEL: Record<string, string> = {
    eleve: ta.sendToAllEleves || 'Tous les élèves',
    parent: ta.sendToAllParents || 'Tous les parents',
    professeur: ta.sendToAllProfs || 'Tous les professeurs',
  };

  const [recipientType, setRecipientType] = useState<RecipientType>('all_eleves');
  const [sendToAll, setSendToAll] = useState(false);
  const [notifForm, setNotifForm] = useState({ contenu: '', type: 'info', recipientId: '' });
  const [notifMsg, setNotifMsg] = useState('');
  const [notifLoading, setNotifLoading] = useState(false);
  const [sentNotifs, setSentNotifs] = useState<any[]>([]);
  const [sentLoading, setSentLoading] = useState(true);

  useEffect(() => {
    apiFetch('/notifications/sent')
      .then((r: any) => setSentNotifs(Array.isArray(r) ? r : []))
      .catch(() => {})
      .finally(() => setSentLoading(false));
  }, []);

  const recipientList = (): any[] => {
    if (recipientType === 'eleve') return data.eleves;
    if (recipientType === 'parent') return data.parents;
    if (recipientType === 'professeur') return data.profs;
    return [];
  };

  const isAllMode = recipientType === 'all_eleves' || sendToAll;

  const validate = (): string | null => {
    if (!notifForm.contenu.trim()) return 'Le message est requis';
    if (notifForm.contenu.length < 5) return 'Le message doit faire au moins 5 caractères';
    if (!isAllMode && !notifForm.recipientId) return 'Sélectionnez un destinataire';
    return null;
  };

  const sendNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setNotifMsg('❌ ' + err); return; }
    setNotifLoading(true);
    try {
      if (isAllMode) {
        const targetRole = recipientType === 'all_eleves' ? 'all' : recipientType;
        await apiFetch('/notifications/bulk', {
          method: 'POST',
          body: JSON.stringify({ contenu: notifForm.contenu, type: notifForm.type, targetRole }),
        });
        const label = targetRole === 'all' ? (ta.recipientAllUsers || 'tous les utilisateurs') : (ALL_LABEL[recipientType] ?? 'tous');
        setNotifMsg((ta.notifSentToLabel || '✅ Envoyé à {label} !').replace('{label}', label));
      } else {
        await apiFetch('/notifications', {
          method: 'POST',
          body: JSON.stringify({
            contenu: notifForm.contenu,
            type: notifForm.type,
            eleveId: recipientType === 'eleve' ? notifForm.recipientId : undefined,
            recipientId: notifForm.recipientId,
            recipientType,
          }),
        });
        setNotifMsg(t.dashboard.labels.notifSent || '✅ Notification envoyée !');
      }
      setNotifForm({ contenu: '', type: 'info', recipientId: '' });
      // Refresh sent list
      const updated = await apiFetch('/notifications/sent');
      setSentNotifs(Array.isArray(updated) ? updated : []);
      setTimeout(() => setNotifMsg(''), 3000);
    } catch (e: any) {
      setNotifMsg('❌ ' + (e.message || t.dashboard.labels.notifSendError));
    } finally {
      setNotifLoading(false);
    }
  };

  const typeOptions: RecipientType[] = ['all_eleves', 'eleve', 'parent', 'professeur'];
  const typeLabel: Record<RecipientType, string> = {
    all_eleves: ta.recipientAllUsers || 'Tous les utilisateurs',
    eleve: ta.recipientEleve || 'Élève',
    parent: ta.recipientParent || 'Parent',
    professeur: ta.recipientProf || 'Professeur',
  };

  return (
    <div className="space-y-6">
      {/* Send form */}
      <div className="dash-card p-6 max-w-lg">
        <h3 className="text-sm font-bold text-gray-700 mb-4">{t.dashboard.labels.sendNotificationHeading}</h3>
        {notifMsg && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${notifMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {notifMsg}
          </div>
        )}
        <form onSubmit={sendNotif} className="space-y-3">
          {/* Recipient type tabs */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {ta.recipientType || 'Destinataire'}
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { setRecipientType(opt); setSendToAll(false); setNotifForm(f => ({ ...f, recipientId: '' })); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    recipientType === opt
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {typeLabel[opt]}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient selector (hidden for all_eleves) */}
          {recipientType !== 'all_eleves' && (
            <div className="space-y-2">
              <select
                value={notifForm.recipientId}
                onChange={e => setNotifForm(f => ({ ...f, recipientId: e.target.value }))}
                disabled={sendToAll}
                className="dash-input disabled:opacity-40"
              >
                <option value="">{ta.selectRecipient || 'Sélectionner...'}</option>
                {recipientList().map((u: any) => (
                  <option key={u._id} value={u._id}>{u.nom}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  checked={sendToAll}
                  onChange={e => { setSendToAll(e.target.checked); setNotifForm(f => ({ ...f, recipientId: '' })); }}
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm font-semibold text-violet-700">
                  {ALL_LABEL[recipientType] ?? 'Envoyer à tous'}
                </span>
              </label>
            </div>
          )}

          {/* Type */}
          <select
            value={notifForm.type}
            onChange={e => setNotifForm(f => ({ ...f, type: e.target.value }))}
            className="dash-input"
          >
            {['info', 'note', 'revision'].map(v => <option key={v}>{v}</option>)}
          </select>

          {/* Message */}
          <textarea
            value={notifForm.contenu}
            onChange={e => setNotifForm(f => ({ ...f, contenu: e.target.value }))}
            required
            rows={3}
            placeholder={t.dashboard.labels.notificationMessagePlaceholder || 'Message de la notification...'}
            className="dash-input"
            style={{ resize: 'none' }}
          />

          <button
            type="submit"
            disabled={notifLoading}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
          >
            {notifLoading ? (ta.inProgress || '⏳ Envoi...') : (t.dashboard.labels.send || 'Envoyer')}
          </button>
        </form>
      </div>

      {/* Sent notifications list */}
      <div className="dash-card-flat overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
          <span className="text-lg">📤</span>
          <h3 className="text-sm font-bold text-gray-700">{ta.sentNotifs || 'Notifications envoyées'}</h3>
          {!sentLoading && (
            <span className="ml-auto text-xs text-gray-400">{sentNotifs.length} total</span>
          )}
        </div>

        {sentLoading ? (
          <div className="p-6 text-center text-gray-400 text-sm">{t.dashboard.labels.loading || '⏳ chargement...'}</div>
        ) : sentNotifs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">{ta.noSentNotifs || 'Aucune notification envoyée.'}</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{ta.typeLabel || 'Type'}</th>
                <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{ta.recipientType || 'Destinataire'}</th>
                <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{ta.messageLabel || 'Message'}</th>
                <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{ta.dateLabel || 'Date'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sentNotifs.map((n: any) => (
                <tr key={n._id} className="hover:bg-gray-50/60">
                  <td className={`px-5 py-3 ${textStart}`}>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      n.type === 'note' ? 'bg-blue-100 text-blue-700' :
                      n.type === 'revision' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{n.type || 'info'}</span>
                  </td>
                  <td className={`px-5 py-3 text-xs ${textStart}`}>
                    {n.recipientName ? (
                      <span className="font-medium text-gray-700">
                        {n.recipientName}
                        {n.recipientCount != null && (
                          <span className="ms-1 text-gray-400">({n.recipientCount})</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400">{n.recipientType || 'élève'}</span>
                    )}
                  </td>
                  <td className={`px-5 py-3 text-gray-700 max-w-xs truncate ${textStart}`}>{n.contenu}</td>
                  <td className={`px-5 py-3 text-gray-400 text-xs whitespace-nowrap ${textStart}`}>{formatDate(n.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
