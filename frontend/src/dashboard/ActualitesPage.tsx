import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTranslation } from '../i18n';

// ─── Category key → display label per language ───────────────────────────────
const CAT_LABELS: Record<string, { fr: string; en: string; ar: string }> = {
  concours:    { fr: 'Concours',    en: 'Competition',  ar: 'مباراة'      },
  universite:  { fr: 'Université',  en: 'University',   ar: 'جامعة'       },
  bourse:      { fr: 'Bourse',      en: 'Scholarship',  ar: 'منحة'        },
  orientation: { fr: 'Orientation', en: 'Guidance',     ar: 'توجيه'       },
  reforme:     { fr: 'Réforme',     en: 'Reform',       ar: 'إصلاح'       },
  actualite:   { fr: 'Actualité',   en: 'News',         ar: 'خبر'         },
};

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  concours:    { bg: '#fff7ed', color: '#c2410c' },
  universite:  { bg: '#eff6ff', color: '#1d4ed8' },
  bourse:      { bg: '#f0fdf4', color: '#15803d' },
  orientation: { bg: '#fdf4ff', color: '#9333ea' },
  reforme:     { bg: '#fff1f2', color: '#be123c' },
  actualite:   { bg: '#f8f7ff', color: '#7c3aed' },
};

// ─── Multilingual static news ─────────────────────────────────────────────────
const STATIC_NEWS = [
  {
    id: 's1',
    cat: 'concours',
    emoji: '🏆',
    lien: 'https://cnc.ac.ma',
    date: '2025-12-01',
    titre: {
      fr: 'Concours CNC 2026 — Calendrier officiel',
      en: 'CNC 2026 Competition — Official Calendar',
      ar: 'مباراة CNC 2026 — التقويم الرسمي',
    },
    source: { fr: 'CPGE Maroc', en: 'CPGE Morocco', ar: 'التحضيري المغرب' },
    resume: {
      fr: "Le Concours National Commun (CNC) pour l'accès aux grandes écoles d'ingénieurs aura lieu du 15 au 20 juin 2026. Les inscriptions ouvrent le 1er mars 2026.",
      en: 'The National Common Competition (CNC) for access to top engineering schools will take place June 15–20, 2026. Registrations open March 1, 2026.',
      ar: 'تُنظَّم المباراة الوطنية المشتركة (CNC) للالتحاق بكبريات مدارس المهندسين في الفترة من 15 إلى 20 يونيو 2026. يفتح التسجيل في الأول من مارس 2026.',
    },
  },
  {
    id: 's2',
    cat: 'universite',
    emoji: '🤖',
    lien: 'https://ensa.ac.ma',
    date: '2025-09-10',
    titre: {
      fr: "ENSA — Nouvelles filières IA et Data Science 2026",
      en: 'ENSA — New AI and Data Science Tracks 2026',
      ar: 'ENSA — شعب جديدة في الذكاء الاصطناعي وعلوم البيانات 2026',
    },
    source: { fr: 'ENSA Maroc', en: 'ENSA Morocco', ar: 'ENSA المغرب' },
    resume: {
      fr: "Les ENSA lancent des formations en IA, Data Science et Cybersécurité. Niveau requis : 16/20 en maths au CNC.",
      en: 'ENSA schools are launching AI, Data Science and Cybersecurity programs. Required level: 16/20 in maths at CNC.',
      ar: 'تُطلق مدارس ENSA تكوينات في الذكاء الاصطناعي وعلوم البيانات والأمن المعلوماتي. المستوى المطلوب: 16/20 في الرياضيات بمباراة CNC.',
    },
  },
  {
    id: 's3',
    cat: 'bourse',
    emoji: '💰',
    lien: 'https://amci.ma',
    date: '2025-11-15',
    titre: {
      fr: "Bourses d'excellence AMCI 2026 — Candidatures ouvertes",
      en: 'AMCI Excellence Scholarships 2026 — Applications Open',
      ar: 'منح التميز AMCI 2026 — فتح باب الترشيح',
    },
    source: { fr: 'AMCI', en: 'AMCI', ar: 'الوكالة المغربية للتعاون الدولي' },
    resume: {
      fr: "Plus de 500 bourses d'études à l'étranger : France, Canada, Espagne, Allemagne. Dossier avant le 28 février 2026.",
      en: 'Over 500 scholarships abroad: France, Canada, Spain, Germany. Applications due February 28, 2026.',
      ar: 'أكثر من 500 منحة دراسية في الخارج: فرنسا، كندا، إسبانيا، ألمانيا. تسليم الملفات قبل 28 فبراير 2026.',
    },
  },
  {
    id: 's4',
    cat: 'reforme',
    emoji: '📋',
    lien: 'https://enssup.gov.ma',
    date: '2025-08-30',
    titre: {
      fr: "Réforme LMD 2026 — Ce qui change pour les étudiants",
      en: 'LMD Reform 2026 — What Changes for Students',
      ar: 'إصلاح نظام LMD 2026 — ما الذي يتغير للطلاب',
    },
    source: {
      fr: "Ministère de l'Enseignement Supérieur",
      en: 'Ministry of Higher Education',
      ar: 'وزارة التعليم العالي',
    },
    resume: {
      fr: "Crédits capitalisables, passerelles entre filières, et reconnaissance internationale facilitée des diplômes marocains.",
      en: 'Stackable credits, cross-track pathways, and easier international recognition of Moroccan degrees.',
      ar: 'رصيد تراكمي قابل للحفظ، جسور بين الشعب، واعتراف دولي ميسر بالشهادات المغربية.',
    },
  },
  {
    id: 's5',
    cat: 'orientation',
    emoji: '📚',
    lien: 'https://men.gov.ma/fr/orientation',
    date: '2025-10-20',
    titre: {
      fr: "Guide orientation Bac+1 — Toutes les filières 2026",
      en: 'Post-Bac Guidance Guide — All Tracks 2026',
      ar: 'دليل التوجيه بعد الباكالوريا — جميع الشعب 2026',
    },
    source: { fr: 'Mowajih AI', en: 'Mowajih AI', ar: 'موجه AI' },
    resume: {
      fr: "CPGE, BTS, Licence, ENSA, ENCG, Médecine — comparatif complet des débouchés, salaires et taux d'insertion par filière.",
      en: 'CPGE, BTS, Licence, ENSA, ENCG, Medicine — full comparison of career outcomes, salaries and employment rates by track.',
      ar: 'CPGE، BTS، الإجازة، ENSA، ENCG، الطب — مقارنة شاملة للآفاق والرواتب ونسب التوظيف حسب كل شعبة.',
    },
  },
  {
    id: 's6',
    cat: 'concours',
    emoji: '🏥',
    lien: 'https://men.gov.ma',
    date: '2025-10-05',
    titre: {
      fr: "Admission en Médecine 2026 — Nouvelles règles du concours",
      en: 'Medical School Admission 2026 — New Competition Rules',
      ar: 'الالتحاق بدراسة الطب 2026 — قواعد جديدة للمباراة',
    },
    source: {
      fr: 'Facultés de Médecine',
      en: 'Medical Faculties',
      ar: 'كليات الطب والصيدلة',
    },
    resume: {
      fr: "Le concours d'accès aux études médicales adopte un nouveau format en 2026 : QCM informatisé, coefficient sciences de la vie augmenté.",
      en: 'The medical school entrance exam adopts a new format in 2026: computerized MCQ, increased life sciences coefficient.',
      ar: 'تعتمد مباراة الولوج لدراسة الطب صيغة جديدة في 2026: اختبارات QCM إلكترونية ورفع معامل علوم الحياة والأرض.',
    },
  },
];

function ActualitesPage() {
  const { language } = useAuth();
  const t = useTranslation();
  const lang = (language === 'ar' || language === 'en') ? language : 'fr';

  const [activeCategorie, setActiveCategorie] = useState('');
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);

  const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', ar: 'ar-SA' };
  const locale = localeMap[language] || 'fr-FR';
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const RSS_URL = encodeURIComponent('https://men.gov.ma/fr/feed');
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}&count=4`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.items)) {
          setLiveNews(data.items.map((item: any, i: number) => ({
            id: `live_${i}`,
            cat: 'actualite',
            emoji: '📰',
            lien: item.link || '#',
            date: item.pubDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            titre:  { fr: item.title?.slice(0, 90) || 'Actualité', en: item.title?.slice(0, 90) || 'News', ar: item.title?.slice(0, 90) || 'خبر' },
            source: { fr: "MEN — Ministère de l'Éducation", en: 'MEN — Ministry of Education', ar: 'وزارة التربية الوطنية' },
            resume: { fr: item.description?.replace(/<[^>]*>/g, '').slice(0, 180) || '', en: item.description?.replace(/<[^>]*>/g, '').slice(0, 180) || '', ar: item.description?.replace(/<[^>]*>/g, '').slice(0, 180) || '' },
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLiveLoading(false));
  }, []);

  const allNews = [...(liveLoading ? [] : liveNews), ...STATIC_NEWS];
  const usedCats = [...new Set(allNews.map(a => a.cat))];
  const filtered = activeCategorie ? allNews.filter(a => a.cat === activeCategorie) : allNews;

  const catLabel = (cat: string) =>
    (CAT_LABELS[cat] || { fr: cat, en: cat, ar: cat })[lang];

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22, alignItems: 'center' }}>
        <button
          onClick={() => setActiveCategorie('')}
          style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: activeCategorie === '' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#f1f5f9', color: activeCategorie === '' ? '#fff' : '#64748b', transition: 'all .15s' }}
        >
          {t.dashboard.actualites.all} ({allNews.length})
        </button>
        {usedCats.map(cat => {
          const c = CAT_COLORS[cat] || { bg: '#f1f5f9', color: '#64748b' };
          const count = allNews.filter(a => a.cat === cat).length;
          return (
            <button key={cat} onClick={() => setActiveCategorie(activeCategorie === cat ? '' : cat)} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
              background: activeCategorie === cat ? c.color : c.bg,
              color: activeCategorie === cat ? '#fff' : c.color,
              transition: 'all .15s',
            }}>
              {catLabel(cat)} ({count})
            </button>
          );
        })}
        {liveLoading && (
          <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #e2e8f0', borderTopColor: '#7c3aed', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
            {t.dashboard.actualites.liveLoading}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {liveLoading && [1, 2, 3, 4].map(i => (
          <div key={`sk_${i}`} className="dash-card p-5">
            <div className="dash-skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 10, width: '30%' }} />
            <div className="dash-skeleton" style={{ height: 18, borderRadius: 6, marginBottom: 8, width: '90%' }} />
            <div className="dash-skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 6, width: '100%' }} />
            <div className="dash-skeleton" style={{ height: 14, borderRadius: 6, width: '70%' }} />
          </div>
        ))}

        {filtered.map(a => {
          const c = CAT_COLORS[a.cat] || { bg: '#f8f7ff', color: '#7c3aed' };
          return (
            <div key={a.id} className="dash-card p-5" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 26 }}>{a.emoji}</div>
                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, flexShrink: 0 }}>
                  {catLabel(a.cat)}
                </span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f0c29', lineHeight: 1.4, marginBottom: 8 }}>
                {a.titre[lang]}
              </h3>
              {a.resume[lang] && (
                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.6, flex: 1, marginBottom: 12 }}>
                  {a.resume[lang]}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                <div>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 600 }}>{a.source[lang]}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{formatDate(a.date)}</p>
                </div>
                {a.lien && a.lien !== '#' && (
                  <a href={a.lien} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textDecoration: 'none', padding: '5px 10px', borderRadius: 6, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
                    {t.dashboard.actualites.readMore}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActualitesPage;
