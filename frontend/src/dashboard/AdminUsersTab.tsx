import { useState } from 'react';
import { createPortal } from 'react-dom';
import { apiFetch } from './shared';
import { useTranslation } from '../i18n';

interface AdminUsersTabProps {
  data: { eleves: any[]; profs: any[]; parents: any[] };
  onRefresh: () => void;
  initialRoleFilter?: string;
}

const ROLE_FIELDS: Record<string, string[]> = {
  eleve: ['nom', 'email', 'niveau', 'filiere', 'filiere_autre', 'ville', 'typeFormation', 'niveauPostBac', 'niveauPostBac_autre'],
  professeur: ['nom', 'email', 'specialite'],
  parent: ['nom', 'email'],
};


const ROLE_BADGE: Record<string, string> = {
  eleve: 'bg-blue-100 text-blue-700',
  professeur: 'bg-violet-100 text-violet-700',
  parent: 'bg-emerald-100 text-emerald-700',
};

export default function AdminUsersTab({ data, onRefresh, initialRoleFilter = '' }: AdminUsersTabProps) {
  const t = useTranslation();
  const ta = t.dashboard.admin || {};
  const isRtl = t.direction === 'rtl';
  const textStart = isRtl ? 'text-right' : 'text-left';
  const textEnd = isRtl ? 'text-left' : 'text-right';

  const ROLE_LABELS: Record<string, string> = {
    eleve: ta.recipientEleve || 'Élève',
    professeur: ta.recipientProf || 'Professeur',
    parent: ta.recipientParent || 'Parent',
    admin: ta.roleAdmin || 'Admin',
  };

  const FIELD_LABELS: Record<string, string> = {
    nom: ta.fieldNom || 'Nom complet',
    email: ta.emailLabel || 'Email',
    niveau: ta.fieldNiveau || 'Niveau',
    filiere: ta.fieldFiliere || 'Filière',
    filiere_autre: ta.fieldFiliereAutre || 'Filière (préciser)',
    ville: ta.fieldVille || 'Ville',
    typeFormation: ta.fieldTypeFormation || 'Type de formation',
    niveauPostBac: ta.fieldNiveauPostBac || 'Niveau post-bac',
    niveauPostBac_autre: ta.fieldNiveauPostBacAutre || 'Niveau post-bac (préciser)',
    specialite: ta.fieldSpecialite || 'Spécialité',
    eleveId: ta.fieldEleveId || 'Élève associé (ID)',
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState(initialRoleFilter);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  // Passwords are stored hashed: the admin can set a new one, never read the old one
  const [newPassword, setNewPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const allUsers = [
    ...data.eleves.map(u => ({ ...u, role: 'eleve' as const })),
    ...data.profs.map(u => ({ ...u, role: 'professeur' as const })),
    ...data.parents.map(u => ({ ...u, role: 'parent' as const })),
  ];

  const filteredUsers = allUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q ||
      u.nom.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const openUser = (user: any) => {
    setSelectedUser(user);
    setEditMode(false);
    setNewPassword('');
    setPasswordMsg(null);
    const fields = ROLE_FIELDS[user.role] ?? ['nom', 'email'];
    const form: Record<string, string> = {};
    fields.forEach(f => { form[f] = user[f] ?? ''; });
    setEditForm(form);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setEditMode(false);
    setNewPassword('');
    setPasswordMsg(null);
  };

  const resetPassword = async () => {
    if (newPassword.length < 6) {
      setPasswordMsg({ ok: false, text: ta.passwordTooShort || 'Au moins 6 caractères requis' });
      return;
    }
    setResettingPassword(true);
    setPasswordMsg(null);
    try {
      await apiFetch(`/admin/users/${selectedUser.role}/${selectedUser._id}/password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword }),
      });
      setNewPassword('');
      setPasswordMsg({ ok: true, text: ta.passwordResetDone || 'Mot de passe réinitialisé. Communiquez-le à l\'utilisateur.' });
    } catch (e: any) {
      setPasswordMsg({ ok: false, text: e.message });
    } finally {
      setResettingPassword(false);
    }
  };

  const handleToggleEdit = () => {
    if (editMode) {
      // Cancel — reset form to original values
      const fields = ROLE_FIELDS[selectedUser.role] ?? ['nom', 'email'];
      const form: Record<string, string> = {};
      fields.forEach(f => { form[f] = selectedUser[f] ?? ''; });
      setEditForm(form);
    }
    setEditMode(prev => !prev);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(`/admin/users/${selectedUser.role}/${selectedUser._id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      onRefresh();
      closeModal();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(ta.confirmDeleteUser || 'Supprimer cet utilisateur ?')) return;
    try {
      await apiFetch(`/admin/users/${role}/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allFilteredIds = filteredUsers.map(u => u._id as string);
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.has(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        allFilteredIds.forEach(id => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds(prev => new Set([...prev, ...allFilteredIds]));
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.size;
    if (!confirm((ta.confirmBulkDelete || 'Supprimer {count} utilisateur(s) sélectionné(s) ?').replace('{count}', String(count)))) return;
    const toDelete = filteredUsers.filter(u => selectedIds.has(u._id as string));
    await Promise.all(toDelete.map(u => apiFetch(`/admin/users/${u.role}/${u._id}`, { method: 'DELETE' }).catch(() => {})));
    setSelectedIds(new Set());
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <input
          type="text"
          placeholder={ta.searchUsersPlaceholder || 'Rechercher par nom, email ou rôle...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={`flex-1 px-4 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none ${isRtl ? 'text-right' : 'text-left'}`}
          dir={isRtl ? 'rtl' : 'ltr'}
        />
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{ta.filterBy || 'Filtrer par'}</span>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setSelectedIds(new Set()); }}
            className="px-3 py-2.5 rounded-xl border border-violet-300 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none bg-white text-gray-700"
          >
            <option value="">{ta.allRoles || 'Tous les rôles'}</option>
            <option value="eleve">{ta.recipientEleve || 'Élève'}</option>
            <option value="professeur">{ta.recipientProf || 'Professeur'}</option>
            <option value="parent">{ta.recipientParent || 'Parent'}</option>
          </select>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl bg-violet-50 border border-violet-200 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-semibold text-violet-700">
            {(ta.selectedCount || '{count} sélectionné(s)').replace('{count}', String(selectedIds.size))}
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
          >
            {ta.deleteSelection || 'Supprimer la sélection'}
          </button>
        </div>
      )}

      <div className="dash-card-flat overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="accent-violet-600 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{ta.nameLabel || 'Nom'}</th>
              <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{ta.emailLabel || 'Email'}</th>
              <th className={`${textStart} px-5 py-3 text-xs font-bold text-gray-500 uppercase`}>{ta.roleLabel || 'Rôle'}</th>
              <th className="px-5 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((u, i) => (
              <tr
                key={i}
                onClick={() => openUser(u)}
                className={`hover:bg-violet-50/40 cursor-pointer transition-colors ${selectedIds.has(u._id) ? 'bg-violet-50/60' : ''}`}
              >
                <td className="px-4 py-3.5 text-center" onClick={e => toggleSelect(u._id, e)}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(u._id)}
                    onChange={() => {}}
                    className="accent-violet-600 w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className={`px-5 py-3.5 text-sm font-semibold text-gray-800 ${textStart}`}>{u.nom}</td>
                <td className={`px-5 py-3.5 text-sm text-gray-500 ${textStart}`}>{u.email}</td>
                <td className={`px-5 py-3.5 ${textStart}`}>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </td>
                <td className={`px-5 py-3.5 ${textEnd}`}>
                  <button
                    onClick={e => handleDelete(u.role, u._id, e)}
                    className="text-xs text-rose-400 hover:text-rose-600 font-medium"
                  >
                    {ta.deleteUser || 'Supprimer'}
                  </button>
                </td>
              </tr>
            ))}
            {!filteredUsers.length && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">{ta.noUsers || 'Aucun utilisateur'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User detail modal — rendered via portal so fixed positioning is always relative to the viewport */}
      {selectedUser && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg shrink-0">
                  {selectedUser.nom?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 leading-tight">{selectedUser.nom}</h2>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${ROLE_BADGE[selectedUser.role] ?? 'bg-gray-100 text-gray-600'}`}>
                    {ROLE_LABELS[selectedUser.role] ?? selectedUser.role}
                  </span>
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none font-bold">×</button>
            </div>

            {/* Fields */}
            <div className="px-6 py-4 space-y-3 overflow-y-auto flex-1">
              {(ROLE_FIELDS[selectedUser.role] ?? ['nom', 'email']).map(field => {
                const displayValue = selectedUser[field];
                if (!editMode && (displayValue === undefined || displayValue === null || displayValue === '')) return null;
                return (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      {FIELD_LABELS[field] ?? field}
                    </label>
                    {editMode ? (
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={editForm[field] ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 font-medium">{String(displayValue)}</p>
                    )}
                  </div>
                );
              })}
              {/* eleveId for parent — display only */}
              {selectedUser.role === 'parent' && selectedUser.eleveId && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    {FIELD_LABELS.eleveId}
                  </label>
                  <p className="text-sm text-gray-500 font-mono">{String(selectedUser.eleveId)}</p>
                </div>
              )}

              {/* Password row */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  {ta.passwordLabel || 'Mot de passe'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setPasswordMsg(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !resettingPassword) resetPassword(); }}
                    placeholder={ta.newPasswordPlaceholder || 'Nouveau mot de passe (min. 6 caractères)'}
                    maxLength={128}
                    autoComplete="new-password"
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 font-mono text-sm text-gray-700"
                  />
                  <button
                    onClick={resetPassword}
                    disabled={resettingPassword || !newPassword}
                    className="shrink-0 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {resettingPassword ? '…' : (ta.resetPassword || 'Réinitialiser')}
                  </button>
                </div>
                <p className={`text-xs mt-1.5 ${passwordMsg ? (passwordMsg.ok ? 'text-emerald-600' : 'text-red-600') : 'text-gray-400'}`}>
                  {passwordMsg ? passwordMsg.text : (ta.passwordHashedNote || 'Les mots de passe sont chiffrés et ne peuvent pas être affichés.')}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleToggleEdit}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  editMode
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                {editMode ? (ta.cancelEdit || 'Annuler') : (ta.editUser || 'Modifier')}
              </button>
              {editMode && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
                >
                  {saving ? (ta.savingChanges || 'Enregistrement...') : (ta.saveChanges || 'Confirmer les modifications')}
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
