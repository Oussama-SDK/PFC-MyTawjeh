import { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';
import { useTranslation } from '../i18n';
import { useAuth } from '../AuthContext';

// ─── MON PROFIL PAGE ──────────────────────────────────────────────────────────
function MonProfilPage({ user, onRetakeOnet }: { user: User; onRetakeOnet?: () => void }) {
  const [profil, setProfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslation();
  const { language } = useAuth();

  useEffect(() => {
    apiFetch('/onet/profile').then(r => setProfil(r.profil)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const riasec = t.dashboard.profile.riasec || {};
  const RIASEC_FALLBACKS: Record<string, Record<string, { label: string; desc: string }>> = {
    fr: {
      R: { label: 'Réaliste',      desc: 'Travail manuel, technique, concret' },
      I: { label: 'Investigateur', desc: 'Recherche, analyse, sciences' },
      A: { label: 'Artistique',    desc: 'Créativité, expression, art' },
      S: { label: 'Social',        desc: 'Aide, enseignement, relations humaines' },
      E: { label: 'Entreprenant',  desc: 'Leadership, vente, management' },
      C: { label: 'Conventionnel', desc: 'Organisation, données, procédures' },
    },
    en: {
      R: { label: 'Realistic',      desc: 'Manual, technical, hands-on work' },
      I: { label: 'Investigative',  desc: 'Research, analysis, science' },
      A: { label: 'Artistic',       desc: 'Creativity, expression, art' },
      S: { label: 'Social',         desc: 'Helping, teaching, human relations' },
      E: { label: 'Enterprising',   desc: 'Leadership, sales, management' },
      C: { label: 'Conventional',   desc: 'Organization, data, procedures' },
    },
    ar: {
      R: { label: 'واقعي',      desc: 'عمل يدوي، تقني، ملموس' },
      I: { label: 'استقصائي',  desc: 'بحث، تحليل، علوم' },
      A: { label: 'فني',        desc: 'إبداع، تعبير، فنون' },
      S: { label: 'اجتماعي',   desc: 'مساعدة، تعليم، علاقات إنسانية' },
      E: { label: 'مبادر',      desc: 'قيادة، مبيعات، إدارة' },
      C: { label: 'تقليدي',    desc: 'تنظيم، بيانات، إجراءات' },
    },
  };
  const fb = RIASEC_FALLBACKS[language] || RIASEC_FALLBACKS.fr;
  const CAT: Record<string, { label: string; color: string; emoji: string; desc: string }> = {
    R: { label: riasec.R?.label || fb.R.label, color: '#ef4444', emoji: '🔧', desc: riasec.R?.desc || fb.R.desc },
    I: { label: riasec.I?.label || fb.I.label, color: '#3b82f6', emoji: '🔬', desc: riasec.I?.desc || fb.I.desc },
    A: { label: riasec.A?.label || fb.A.label, color: '#ec4899', emoji: '🎨', desc: riasec.A?.desc || fb.A.desc },
    S: { label: riasec.S?.label || fb.S.label, color: '#10b981', emoji: '🤝', desc: riasec.S?.desc || fb.S.desc },
    E: { label: riasec.E?.label || fb.E.label, color: '#f59e0b', emoji: '💼', desc: riasec.E?.desc || fb.E.desc },
    C: { label: riasec.C?.label || fb.C.label, color: '#8b5cf6', emoji: '📊', desc: riasec.C?.desc || fb.C.desc },
  };

  const CAREER_MAPS: Record<string, Record<string, string[]>> = {
    fr: {
      RIA: ['Architecte','Designer industriel','Ingénieur mécanique'],
      RIS: ['Médecin généraliste','Vétérinaire','Infirmier spécialisé'],
      RIC: ['Ingénieur informatique','Technicien réseau','Électronicien'],
      IAS: ['Psychologue','Chercheur sciences humaines','Anthropologue'],
      IAE: ["Directeur artistique","Architecte d'intérieur",'Chef de projet créatif'],
      ISA: ['Médecin psychiatre','Conseiller pédagogique','Ergothérapeute'],
      ISE: ["Directeur d'école",'RH','Coach professionnel'],
      IEC: ["Avocat d'affaires",'Consultant','Analyste financier'],
      ASE: ['Journaliste','Chargé de communication','Relations publiques'],
      SEC: ['Gestionnaire RH','Assistant social','Coordinateur de projet'],
      ECS: ['Manager commercial','Entrepreneur','Directeur marketing'],
      CSE: ['Comptable','Contrôleur de gestion','Auditeur'],
      IRE: ['Ingénieur civil','Géomètre','Topographe'],
      IRA: ['Médecin biologiste','Chimiste','Physicien'],
      EIS: ["Directeur d'hôpital",'Responsable qualité','Manager RH'],
    },
    en: {
      RIA: ['Architect','Industrial Designer','Mechanical Engineer'],
      RIS: ['General Practitioner','Veterinarian','Specialized Nurse'],
      RIC: ['Computer Engineer','Network Technician','Electronics Technician'],
      IAS: ['Psychologist','Social Science Researcher','Anthropologist'],
      IAE: ['Art Director','Interior Architect','Creative Project Manager'],
      ISA: ['Psychiatrist','Educational Counselor','Occupational Therapist'],
      ISE: ['School Principal','HR Manager','Career Coach'],
      IEC: ['Business Lawyer','Consultant','Financial Analyst'],
      ASE: ['Journalist','Communications Officer','Public Relations'],
      SEC: ['HR Manager','Social Worker','Project Coordinator'],
      ECS: ['Sales Manager','Entrepreneur','Marketing Director'],
      CSE: ['Accountant','Management Controller','Auditor'],
      IRE: ['Civil Engineer','Surveyor','Topographer'],
      IRA: ['Medical Biologist','Chemist','Physicist'],
      EIS: ['Hospital Director','Quality Manager','HR Director'],
    },
    ar: {
      RIA: ['معماري','مصمم صناعي','مهندس ميكانيكي'],
      RIS: ['طبيب عام','طبيب بيطري','ممرض متخصص'],
      RIC: ['مهندس معلوماتية','تقني شبكات','تقني إلكترونيك'],
      IAS: ['عالم نفس','باحث علوم إنسانية','أنثروبولوجي'],
      IAE: ['مدير فني','مصمم داخلي','مدير مشروع إبداعي'],
      ISA: ['طبيب نفسي','مستشار تربوي','معالج وظيفي'],
      ISE: ['مدير مدرسة','مسؤول موارد بشرية','مدرب مهني'],
      IEC: ['محامي أعمال','مستشار','محلل مالي'],
      ASE: ['صحفي','مسؤول اتصال','علاقات عامة'],
      SEC: ['مدير موارد بشرية','أخصائي اجتماعي','منسق مشاريع'],
      ECS: ['مدير تجاري','رائد أعمال','مدير تسويق'],
      CSE: ['محاسب','مراقب إداري','مراجع حسابات'],
      IRE: ['مهندس مدني','مساح','طبوغرافي'],
      IRA: ['طبيب بيولوجي','كيميائي','فيزيائي'],
      EIS: ['مدير مستشفى','مسؤول جودة','مدير موارد بشرية'],
    },
  };
  const CAREER_MAP = CAREER_MAPS[language] || CAREER_MAPS.fr;

  const getCareerSuggestions = () => {
    if (!profil) return [];
    const code = `${profil.primaryInterest}${profil.secondaryInterest}${profil.tertiaryInterest}`;
    return CAREER_MAP[code]
      || CAREER_MAP[`${profil.primaryInterest}${profil.secondaryInterest}E`]
      || CAREER_MAP[`${profil.primaryInterest}${profil.secondaryInterest}S`]
      || [tp.noCareerSuggestion || ''];
  };

  const tp = t.dashboard.profile;

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
    </div>
  );

  if (!profil) return (
    <div className="">
      <div className="dash-card dash-empty">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{tp.noProfile}</h3>
        <p className="text-gray-400 text-sm mb-6">{tp.noProfileDesc}</p>
        <button onClick={onRetakeOnet} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
          {tp.takeTestBtn}
        </button>
      </div>
    </div>
  );

  const code = `${profil.primaryInterest}${profil.secondaryInterest}${profil.tertiaryInterest}`;
  const testLevelFallbacks: Record<string, Record<number, string>> = {
    fr: { 10: '⚡ Découverte', 30: '🔍 Exploration', 60: '🎯 Profil Complet' },
    en: { 10: '⚡ Discovery', 30: '🔍 Exploration', 60: '🎯 Full Profile' },
    ar: { 10: '⚡ استكشاف سريع', 30: '🔍 استكشاف', 60: '🎯 ملف كامل' },
  };
  const testLabel = (tp.testLevelLabels)?.[profil.testLevel] ?? (testLevelFallbacks[language] || testLevelFallbacks.fr)[profil.testLevel] ?? '🎯';
  const careers = getCareerSuggestions();

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed,#a855f7)' }}>
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#fff,transparent)' }} />
        <p className="text-white/60 text-sm mb-1">{tp.riasecCodeLabel}</p>
        <h2 className="text-5xl font-black tracking-widest mb-2">{code}</h2>
        <div className="flex items-center gap-3 text-white/70 text-sm flex-wrap">
          <span>{testLabel}</span>
          {profil.language && <span>· {profil.language.toUpperCase()}</span>}
          {profil.completedAt && <span>· {new Date(profil.completedAt).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR')}</span>}
        </div>
      </div>

      {/* RIASEC Bars */}
      <div className="dash-card p-5">
        <h3 className="dash-section-title">{tp.detailedScores}</h3>
        <div className="space-y-4">
          {(() => {
            const maxQ = Math.round((profil.testLevel || 60) / 6);
            const allScores = ['R','I','A','S','E','C'].map(c => profil[`scores${c}`] || 0);
            const maxScore = Math.max(...allScores, 1);
            return ['R','I','A','S','E','C'].map((cat) => {
              const info = CAT[cat];
              const score = profil[`scores${cat}`] || 0;
              const pct = Math.round((score / maxScore) * 100);
              const absPct = maxQ > 0 ? Math.round((score / maxQ) * 100) : 0;
              const isPrimary = cat === profil.primaryInterest;
              const isSecondary = cat === profil.secondaryInterest;
              const isTertiary = cat === profil.tertiaryInterest;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: isPrimary ? 800 : 500, color: (isPrimary || isSecondary || isTertiary) ? info.color : '#94a3b8', fontSize: 13 }}>
                      <span style={{ fontSize: 16 }}>{info.emoji}</span>
                      {info.label}
                      {isPrimary && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: info.color, color: '#fff', fontWeight: 700 }}>{tp.primary}</span>}
                      {isSecondary && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: info.color, color: '#fff', fontWeight: 700, opacity: 0.85 }}>{tp.secondary}</span>}
                      {isTertiary && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: info.color, color: '#fff', fontWeight: 700, opacity: 0.7 }}>{tp.tertiary}</span>}
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

      {/* Career suggestions */}
      <div className="dash-card p-5">
        <h3 className="dash-section-title">{tp.careerSuggestionsFor} {code}</h3>
        <div className="flex flex-wrap gap-2">
          {careers.map((c, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}>{c}</span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">{tp.roadmapTip}</p>
      </div>

      {/* Dreams */}
      {(profil.dreamUni || profil.dreamJob) && (
        <div className="dash-card p-5" style={{borderColor:"rgba(245,158,11,0.2)"}}>
          <h3 className="dash-section-title">{tp.objectives}</h3>
          {profil.dreamUni && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎓</span>
              <div><p className="text-xs text-gray-400">{tp.dreamUniLabel}</p><p className="font-bold text-gray-800">{profil.dreamUni}</p></div>
            </div>
          )}
          {profil.dreamJob && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <div><p className="text-xs text-gray-400">{tp.dreamJobLabel}</p><p className="font-bold text-gray-800">{profil.dreamJob}</p></div>
            </div>
          )}
        </div>
      )}

      {/* Job Zone */}
      <div className="dash-card p-5">
        <h3 className="dash-section-title">{tp.educationLevel}</h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            {profil.jobZone}
          </div>
          <div>
            <p className="font-bold text-gray-800">Zone {profil.jobZone}</p>
            <p className="text-sm text-gray-500">{(tp.jobZoneLabels || [])[profil.jobZone] || ''}</p>
          </div>
        </div>
      </div>

      <button onClick={onRetakeOnet} className="w-full py-3 rounded-2xl text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
        {tp.retakeTestBtn}
      </button>
    </div>
  );
}

export default MonProfilPage;
