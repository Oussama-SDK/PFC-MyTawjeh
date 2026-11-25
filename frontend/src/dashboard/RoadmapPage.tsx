import { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';
import { useTranslation } from '../i18n';

function RoadmapPage({ user }: { user: User }) {
  const t = useTranslation();
  const tr = t.dashboard.roadmap;
  const [roadmap, setRoadmap] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    apiFetch(`/roadmap/${user.id}`)
      .then((r) => {
        if (r?.parcours) {
          try { setRoadmap(JSON.parse(r.parcours)); }
          catch { setFetchError(tr.generateErrorCorrupt); }
        }
      })
      .catch(() => setFetchError(tr.fetchError))
      .finally(() => setFetching(false));
  }, [user.id]);

  const handleGenerate = async () => {
    if (roadmap) {
      const ok = window.confirm(tr.regenerateConfirm);
      if (!ok) return;
    }
    setGenerating(true);
    setGenerateError('');
    try {
      const data = await apiFetch('/roadmap/generate', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      if (data?.result) {
        setRoadmap(data.result);
        setFetchError('');
      }
    } catch (err: any) {
      setGenerateError(err?.message || tr.generateErrorApiKey);
    } finally {
      setGenerating(false);
    }
  };

  if (fetching) return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div className="dash-skeleton" style={{ height:80, borderRadius:14 }} />
      {[1,2,3].map(i => <div key={i} className="dash-skeleton" style={{ height:100, borderRadius:14 }} />)}
    </div>
  );

  if (fetchError || !roadmap) return (
    <div className="dash-empty" style={{ background:'rgba(255,255,255,0.9)', borderRadius:20, padding:'60px 32px', textAlign:'center' }}>
      <div className="dash-empty-icon">🧭</div>
      <p className="dash-empty-title">{fetchError || tr.noRoadmapTitle}</p>
      <p className="dash-empty-desc">{tr.noRoadmapDesc}</p>
      {generateError && (
        <p style={{ color:'#dc2626', fontSize:13, marginTop:12, maxWidth:400, margin:'12px auto 0' }}>{generateError}</p>
      )}
      <button
        onClick={handleGenerate}
        disabled={generating}
        style={{
          marginTop:24, padding:'12px 28px',
          background: generating ? '#c4b5fd' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
          color:'#fff', border:'none', borderRadius:12,
          fontSize:14, fontWeight:800, cursor: generating ? 'not-allowed' : 'pointer',
          boxShadow:'0 8px 20px rgba(124,58,237,0.3)',
        }}
      >
        {generating ? tr.generating : tr.generateNewButton}
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontSize:17, fontWeight:900, color:'#0f0c29', margin:0 }}>{t.dashboard.menu.roadmap}</h2>
          <p style={{ fontSize:12, color:'#94a3b8', marginTop:3 }}>{tr.generatedNote}</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            padding:'8px 16px',
            background: generating ? '#f1f5f9' : '#f5f3ff',
            color: generating ? '#94a3b8' : '#7c3aed',
            border:'1.5px solid rgba(124,58,237,0.25)',
            borderRadius:10, fontSize:12, fontWeight:800,
            cursor: generating ? 'not-allowed' : 'pointer',
          }}
        >
          {generating ? tr.generating : tr.regenerate}
        </button>
      </div>

      {generateError && (
        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#dc2626' }}>
          {generateError}
        </div>
      )}

      <div className="space-y-4">
        {/* Métier */}
        <div className="dash-card p-6" style={{borderColor:"rgba(124,58,237,0.15)"}}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>🎯</div>
            <div>
              <div className="text-xs font-bold text-violet-600 uppercase tracking-wider">{tr.recommendedJob}</div>
              <div className="text-xl font-black text-gray-900">{roadmap.metier}</div>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{roadmap.description}</p>
        </div>

        {/* Étapes */}
        {roadmap.etapes?.length > 0 && (
          <div className="dash-card p-6">
            <h3 className="dash-section-title">{tr.stepsTitle}</h3>
            <div className="space-y-3">
              {roadmap.etapes.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{i + 1}</div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Universities */}
        {roadmap.universites?.length > 0 && (
          <div className="dash-card p-5" style={{borderColor:"rgba(59,130,246,0.15)"}}>
            <h3 className="dash-section-title">{tr.universitiesTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {roadmap.universites.map((u: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">{u}</span>
              ))}
            </div>
          </div>
        )}

        {/* Alertes */}
        {roadmap.alertes?.length > 0 && roadmap.alertes[0] !== '' && (
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-sm">
            <h3 className="text-sm font-bold text-amber-700 mb-3 uppercase tracking-wider">{tr.alertsTitle}</h3>
            <ul className="space-y-1.5">
              {roadmap.alertes.map((a: string, i: number) => (
                <li key={i} className="text-sm text-amber-800 flex items-start gap-2"><span className="flex-shrink-0">•</span>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Matières clés + Conseils */}
        <div className="grid md:grid-cols-2 gap-4">
          {roadmap.matieresCles?.length > 0 && (
            <div className="dash-card p-5">
              <h3 className="dash-section-title">{tr.keySubjectsTitle}</h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.matieresCles.map((m: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">{m}</span>
                ))}
              </div>
            </div>
          )}
          {roadmap.conseils && (
            <div className="dash-card p-5" style={{borderColor:"rgba(245,158,11,0.2)"}}>
              <h3 className="dash-section-title">{tr.adviceTitle}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{roadmap.conseils}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoadmapPage;
