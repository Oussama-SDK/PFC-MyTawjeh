import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { User, apiFetch } from './shared';

// ─── EYE ICON ────────────────────────────────────────────────────────────────
function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

// ─── PASSWORD TAB ─────────────────────────────────────────────────────────────
function PasswordTab({ pw, setPw, pwMsg, pwLoading, onSubmit }: {
  pw: { current: string; next: string; confirm: string };
  setPw: React.Dispatch<React.SetStateAction<{ current: string; next: string; confirm: string }>>;
  pwMsg: { type: string; text: string } | null;
  pwLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const t = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [show, setShow] = useState({ current: false, next: false, confirm: false });

  if (!showForm) return (
    <div style={{ textAlign:'center', padding:'8px 0' }}>
      <div style={{ fontSize:36, marginBottom:10 }}>🔑</div>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:14 }}>{t.dashboard.profile.passwordIntro}</p>
      <button
        onClick={() => setShowForm(true)}
        style={{ width:'100%', padding:10, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}
      >
        {t.dashboard.profile.changePasswordBtn}
      </button>
    </div>
  );

  const fields: { k: keyof typeof pw; l: string }[] = [
    { k: 'current', l: t.dashboard.profile.currentPasswordLabel },
    { k: 'next',    l: t.dashboard.profile.newPasswordLabel },
    { k: 'confirm', l: t.dashboard.profile.confirmLabel },
  ];

  return (
    <form onSubmit={onSubmit}>
      {pwMsg && (
        <div style={{ marginBottom:10, padding:'8px 12px', borderRadius:8, fontSize:12, background:pwMsg.type==='success'?'#f0fdf4':'#fef2f2', color:pwMsg.type==='success'?'#16a34a':'#dc2626' }}>
          {pwMsg.text}
        </div>
      )}
      {fields.map(f => (
        <div key={f.k} style={{ marginBottom:10 }}>
          <label style={{ fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', display:'block', marginBottom:4 }}>{f.l}</label>
          <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
            <input
              type={show[f.k] ? 'text' : 'password'}
              value={pw[f.k]}
              onChange={e => setPw(p => ({ ...p, [f.k]: e.target.value }))}
              required
              placeholder="••••••••"
              style={{ width:'100%', padding:'8px 36px 8px 10px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, [f.k]: !s[f.k] }))}
              style={{ position:'absolute', right:8, background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:2, display:'flex', alignItems:'center' }}
              title={show[f.k] ? 'Masquer' : 'Afficher'}
            >
              <EyeIcon visible={show[f.k]} />
            </button>
          </div>
        </div>
      ))}
      <div style={{ display:'flex', gap:8 }}>
        <button type="button" onClick={() => { setShowForm(false); setShow({ current:false, next:false, confirm:false }); }} style={{ flex:1, padding:9, background:'#f1f5f9', color:'#64748b', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
          {t.dashboard.profile.cancel}
        </button>
        <button type="submit" disabled={pwLoading} style={{ flex:2, padding:9, background:pwLoading?'#c4b5fd':'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:pwLoading?'not-allowed':'pointer' }}>
          {pwLoading ? t.dashboard.profile.modifying : t.dashboard.profile.confirm}
        </button>
      </div>
    </form>
  );
}

// ─── PROFILE POPUP ────────────────────────────────────────────────────────────
function ProfilePopup({ user, onLogout, onRetakeOnet }: { user: User; onLogout: () => void; onRetakeOnet?: () => void }) {
  const t = useTranslation();
  const isRtl = t.direction === 'rtl';
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('password');
  const [pw, setPw] = useState({ current:'', next:'', confirm:'' });
  const [pwMsg, setPwMsg] = useState<{ type:string; text:string }|null>(null);
  const [pwLoading, setPwLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [linkedEleve, setLinkedEleve] = useState<any>(null);
  const [linkMsg, setLinkMsg] = useState<{ type:string; text:string }|null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) {
      document.addEventListener('mousedown', handler);
      if (user.role === 'parent') {
        apiFetch('/auth/linked-student').then(r => setLinkedEleve(r.eleve)).catch(() => {});
      }
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [open, user.role]);

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) { setPwMsg({ type:'error', text:t.dashboard.profile.passwordMismatch }); return; }
    if (pw.next.length < 6) { setPwMsg({ type:'error', text:t.dashboard.profile.passwordTooShort }); return; }
    setPwLoading(true); setPwMsg(null);
    try {
      const r = await apiFetch('/auth/change-password', { method:'POST', body:JSON.stringify({ currentPassword:pw.current, newPassword:pw.next }) });
      setPwMsg({ type:'success', text: r.message });
      setPw({ current:'', next:'', confirm:'' });
    } catch(e: any) { setPwMsg({ type:'error', text:e.message }); }
    finally { setPwLoading(false); }
  };

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkLoading(true); setLinkMsg(null);
    try {
      const r = await apiFetch('/auth/link-student', { method:'POST', body:JSON.stringify({ eleveEmail: studentEmail }) });
      setLinkMsg({ type:'success', text:r.message });
      setLinkedEleve(r.eleve);
      setStudentEmail('');
    } catch(e: any) { setLinkMsg({ type:'error', text:e.message }); }
    finally { setLinkLoading(false); }
  };

  const roleColors: Record<string,string> = { eleve:'#7c3aed', parent:'#059669', professeur:'#2563eb', admin:'#dc2626' };
  const roleLabels: Record<string,string> = (t.dashboard.profile.roles as Record<string,string>);
  const initials = user.nom.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  const tabs = [
    { k:'password', l:t.dashboard.profile.tabPassword },
    ...(user.role==='parent'?[{ k:'student', l:t.dashboard.profile.tabStudent }]:[]),
    ...(user.role==='eleve'?[{ k:'onet', l:t.dashboard.profile.tabOnet }]:[]),
  ];

  return (
    <div ref={ref} style={{ position:'relative' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o=>!o)}
        aria-haspopup="true"
        aria-expanded={open}
        style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:10, padding:'6px 10px', borderRadius:10, transition:'background .2s', background:'transparent', border:'none' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
      >
        <div style={{
          width:36, height:36, borderRadius:'50%', background:roleColors[user.role]||'#7c3aed',
          display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13,
          border:'2px solid rgba(255,255,255,0.2)', flexShrink:0,
        }}>{initials}</div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{user.nom}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>{roleLabels[user.role]}</div>
        </div>
        <span style={{ marginLeft:4, color:'rgba(255,255,255,0.4)', fontSize:12 }}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 8px)', left: isRtl ? 'auto' : 0, right: isRtl ? 0 : 'auto', zIndex:1000, background:'#fff',
          borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,0.18)', width:320, overflow:'hidden',
        }}>
          {/* Header */}
          <div style={{ padding:'14px 18px', background:'linear-gradient(135deg,#0f2044,#1a3a6e)', color:'#fff' }}>
            <p style={{ margin:0, fontWeight:700, fontSize:14 }}>{user.nom}</p>
            <p style={{ margin:'2px 0 0', fontSize:12, opacity:.6 }}>{user.email}</p>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', borderBottom:'1px solid #f1f5f9', background:'#f8fafc' }}>
            {tabs.map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                flex:1, padding:'9px 4px', fontSize:11, fontWeight:600, border:'none', cursor:'pointer',
                background:tab===t.k?'#fff':'transparent', color:tab===t.k?'#0f2044':'#94a3b8',
                borderBottom:tab===t.k?'2px solid #7c3aed':'2px solid transparent',
              }}>{t.l}</button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding:18 }}>
            {tab==='password' && (
              <PasswordTab pw={pw} setPw={setPw} pwMsg={pwMsg} pwLoading={pwLoading} onSubmit={handleChangePw} />
            )}

            {tab==='student' && (
              <div>
                {linkedEleve && (
                  <div style={{ background:'#f0fdf4', borderRadius:10, padding:12, marginBottom:14 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#16a34a', marginBottom:4, textTransform:'uppercase' }}>{t.dashboard.profile.linkedStudent}</p>
                    <p style={{ margin:0, fontWeight:700, color:'#0f2044', fontSize:14 }}>{linkedEleve.nom}</p>
                    <p style={{ margin:'2px 0 0', fontSize:12, color:'#64748b' }}>{linkedEleve.email}</p>
                  </div>
                )}
                {linkMsg && <div style={{ marginBottom:10, padding:'8px 12px', borderRadius:8, fontSize:12, background:linkMsg.type==='success'?'#f0fdf4':'#fef2f2', color:linkMsg.type==='success'?'#16a34a':'#dc2626' }}>{linkMsg.text}</div>}
                <form onSubmit={handleLink}>
                  <label style={{ fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', display:'block', marginBottom:6 }}>{t.dashboard.profile.studentEmailLabel}</label>
                  <input type="email" value={studentEmail} onChange={e=>setStudentEmail(e.target.value)} required placeholder={t.dashboard.profile.linkPlaceholder}
                    style={{ width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:10 }} />
                  <button type="submit" disabled={linkLoading} style={{ width:'100%', padding:9, background:linkLoading?'#6ee7b7':'linear-gradient(135deg,#059669,#10b981)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:linkLoading?'not-allowed':'pointer' }}>
                    {linkLoading? t.dashboard.profile.searchLoading : linkedEleve ? t.dashboard.profile.linkButtonChange : t.dashboard.profile.linkButtonLink}
                  </button>
                </form>
              </div>
            )}

            {tab==='onet' && (
              <div>
                <p style={{ fontSize:12, color:'#64748b', marginBottom:12 }}>{t.dashboard.profile.retakeOnet}</p>
                <button onClick={() => { setOpen(false); if(onRetakeOnet) onRetakeOnet(); }} style={{ width:'100%', padding:10, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  {t.dashboard.profile.onetRetakeButton}
                </button>
                <p style={{ fontSize:11, color:'#94a3b8', textAlign:'center', marginTop:8 }}>{t.dashboard.profile.previousResultsReplaced}</p>
              </div>
            )}
          </div>

          {/* Footer — logout */}
          <div style={{ borderTop:'1px solid #f1f5f9', padding:'12px 18px' }}>
            <button onClick={() => { setOpen(false); onLogout(); }} style={{ width:'100%', padding:8, background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              {t.dashboard.profile.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { PasswordTab, ProfilePopup };
