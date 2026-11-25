import { useState } from 'react';
import { useAuth } from '../AuthContext';
import type { Lang } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────
type ML = Record<Lang, string>;

interface Bourse {
  id: string;
  emoji: string;
  nom: ML;
  organisme: ML;
  type: ML;
  typeKey: string;
  pays: ML[];
  description: ML;
  conditions: ML[];
  deadline: ML;
  lien: string;
  color: string;
  bg: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const BOURSES: Bourse[] = [
  {
    id: 'amci',
    emoji: '🌍',
    nom:        { fr: "Bourse d'excellence AMCI", ar: 'منحة التميز AMCI', en: 'AMCI Excellence Scholarship' },
    organisme:  { fr: 'AMCI – Agence Marocaine de Coopération Internationale', ar: 'الوكالة المغربية للتعاون الدولي', en: 'AMCI – Moroccan Agency for International Cooperation' },
    type:       { fr: "Études à l'étranger", ar: 'دراسة بالخارج', en: 'Studies Abroad' },
    typeKey:    'abroad',
    pays:       [
      { fr: 'France', ar: 'فرنسا', en: 'France' },
      { fr: 'Canada', ar: 'كندا', en: 'Canada' },
      { fr: 'Espagne', ar: 'إسبانيا', en: 'Spain' },
      { fr: 'Allemagne', ar: 'ألمانيا', en: 'Germany' },
      { fr: 'Chine', ar: 'الصين', en: 'China' },
    ],
    description: {
      fr: "Plus de 500 bourses d'études octroyées chaque année aux lauréats des classes préparatoires et bacheliers excellents pour poursuivre leurs études supérieures à l'étranger.",
      ar: 'أكثر من 500 منحة دراسية تُمنح كل سنة للمتفوقين من خريجي التحضيري وحاملي الباكالوريا بتميز لمتابعة الدراسات العليا في الخارج.',
      en: 'Over 500 scholarships awarded annually to top CPGE graduates and excellent baccalaureate holders to pursue higher education abroad.',
    },
    conditions: [
      { fr: 'Nationalité marocaine', ar: 'الجنسية المغربية', en: 'Moroccan nationality' },
      { fr: 'Mention Très Bien ou Bien au Baccalauréat', ar: 'ميزة مشرف جداً أو مشرف في الباكالوريا', en: 'Very Good or Good distinction in Baccalaureate' },
      { fr: 'Âge inférieur à 25 ans', ar: 'السن أقل من 25 سنة', en: 'Age under 25' },
      { fr: 'Dossier académique solide', ar: 'ملف أكاديمي قوي', en: 'Strong academic file' },
    ],
    deadline: { fr: 'Juin – Juillet (chaque année)', ar: 'يونيو – يوليوز (كل سنة)', en: 'June – July (every year)' },
    lien: 'https://www.amci.ma',
    color: '#1d4ed8',
    bg: '#eff6ff',
  },
  {
    id: 'men',
    emoji: '🎓',
    nom:        { fr: "Bourse du Ministère de l'Enseignement Supérieur", ar: 'منحة وزارة التعليم العالي', en: 'Ministry of Higher Education Scholarship' },
    organisme:  { fr: "Ministère de l'Enseignement Supérieur – Maroc", ar: 'وزارة التعليم العالي – المغرب', en: 'Ministry of Higher Education – Morocco' },
    type:       { fr: 'Études au Maroc', ar: 'دراسة بالمغرب', en: 'Studies in Morocco' },
    typeKey:    'morocco',
    pays:       [{ fr: 'Maroc', ar: 'المغرب', en: 'Morocco' }],
    description: {
      fr: "Bourse nationale accordée aux étudiants inscrits dans les établissements publics d'enseignement supérieur selon des critères sociaux et académiques.",
      ar: 'منحة وطنية تُمنح للطلاب المسجلين في المؤسسات العمومية للتعليم العالي وفق معايير اجتماعية وأكاديمية.',
      en: 'National scholarship granted to students enrolled in public higher education institutions based on social and academic criteria.',
    },
    conditions: [
      { fr: "Inscription dans un établissement public", ar: 'التسجيل في مؤسسة عمومية', en: 'Enrolled in a public institution' },
      { fr: 'Revenu familial inférieur au seuil défini', ar: 'الدخل العائلي أقل من الحد المحدد', en: 'Family income below defined threshold' },
      { fr: 'Assiduité et résultats satisfaisants', ar: 'الانتظام ونتائج مُرضية', en: 'Good attendance and satisfactory results' },
    ],
    deadline: { fr: 'Octobre – Novembre (début d\'année universitaire)', ar: 'أكتوبر – نونبر (بداية السنة الجامعية)', en: 'October – November (start of academic year)' },
    lien: 'https://www.enssup.gov.ma',
    color: '#15803d',
    bg: '#f0fdf4',
  },
  {
    id: 'ocp',
    emoji: '🏭',
    nom:        { fr: 'Bourse OCP Foundation', ar: 'منحة مؤسسة OCP', en: 'OCP Foundation Scholarship' },
    organisme:  { fr: 'OCP Foundation', ar: 'مؤسسة OCP', en: 'OCP Foundation' },
    type:       { fr: 'Soutien scolaire & universitaire', ar: 'دعم مدرسي وجامعي', en: 'School & University Support' },
    typeKey:    'support',
    pays:       [{ fr: 'Maroc', ar: 'المغرب', en: 'Morocco' }],
    description: {
      fr: "Programme de bourses destiné aux jeunes talents issus de milieux défavorisés, couvrant les frais de scolarité, le logement et un accompagnement pédagogique personnalisé.",
      ar: 'برنامج منح موجه للمواهب الشابة من الأوساط المحرومة، يشمل مصاريف الدراسة والإقامة ومرافقة بيداغوجية شخصية.',
      en: 'Scholarship program for talented youth from underprivileged backgrounds, covering tuition, housing, and personalized academic support.',
    },
    conditions: [
      { fr: 'Excellents résultats scolaires', ar: 'نتائج دراسية متميزة', en: 'Excellent academic results' },
      { fr: 'Situation socio-économique difficile', ar: 'وضع اجتماعي اقتصادي صعب', en: 'Difficult socio-economic situation' },
      { fr: 'Motivation et projet professionnel défini', ar: 'دافعية ومشروع مهني محدد', en: 'Motivation and defined career project' },
    ],
    deadline: { fr: 'Variable selon les programmes', ar: 'متغير حسب البرامج', en: 'Variable by program' },
    lien: 'https://www.ocpfoundation.ma',
    color: '#b45309',
    bg: '#fffbeb',
  },
  {
    id: 'campusfrance',
    emoji: '🇫🇷',
    nom:        { fr: 'Bourse Campus France Maroc (BGF)', ar: 'منحة Campus France المغرب (BGF)', en: 'Campus France Morocco Scholarship (BGF)' },
    organisme:  { fr: 'Ambassade de France au Maroc', ar: 'السفارة الفرنسية بالمغرب', en: 'French Embassy in Morocco' },
    type:       { fr: "Études à l'étranger", ar: 'دراسة بالخارج', en: 'Studies Abroad' },
    typeKey:    'abroad',
    pays:       [{ fr: 'France', ar: 'فرنسا', en: 'France' }],
    description: {
      fr: "Bourses du gouvernement français destinées aux étudiants marocains souhaitant poursuivre un Master ou un Doctorat en France, via le programme BGF (Bourse du Gouvernement Français).",
      ar: 'منح حكومة فرنسا للطلاب المغاربة الراغبين في متابعة الماستر أو الدكتوراه في فرنسا، عبر برنامج BGF.',
      en: 'French government scholarships for Moroccan students wishing to pursue a Master\'s or PhD in France, via the BGF program.',
    },
    conditions: [
      { fr: 'Licence validée avec mention', ar: 'إجازة بميزة', en: 'Licence with distinction' },
      { fr: 'Niveau B2 en français minimum', ar: 'مستوى B2 بالفرنسية على الأقل', en: 'Minimum B2 level in French' },
      { fr: "Lettre de motivation et projet d'études", ar: 'رسالة تحفيز ومشروع دراسي', en: 'Motivation letter and study project' },
      { fr: "Acceptation préalable d'un établissement français", ar: 'قبول مسبق من مؤسسة فرنسية', en: 'Prior acceptance from a French institution' },
    ],
    deadline: { fr: 'Janvier – Mars', ar: 'يناير – مارس', en: 'January – March' },
    lien: 'https://maroc.campusfrance.org',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    id: 'erasmus',
    emoji: '🇪🇺',
    nom:        { fr: 'Bourse Erasmus+ Maroc', ar: 'منحة إيراسموس+ المغرب', en: 'Erasmus+ Morocco Scholarship' },
    organisme:  { fr: 'Union Européenne – Programme Erasmus+', ar: 'الاتحاد الأوروبي – برنامج إيراسموس+', en: 'European Union – Erasmus+ Programme' },
    type:       { fr: 'Mobilité internationale', ar: 'التنقل الدولي', en: 'International Mobility' },
    typeKey:    'mobility',
    pays:       [{ fr: 'Union Européenne', ar: 'الاتحاد الأوروبي', en: 'European Union' }],
    description: {
      fr: "Financement de mobilité pour étudiants marocains inscrits dans des universités partenaires, permettant de passer un ou deux semestres dans une université européenne.",
      ar: 'تمويل التنقل للطلاب المغاربة المسجلين في جامعات شريكة، يُمكّنهم من قضاء فصل أو فصلين في جامعة أوروبية.',
      en: 'Mobility funding for Moroccan students enrolled in partner universities, enabling one or two semesters at a European university.',
    },
    conditions: [
      { fr: "Inscription dans une université marocaine partenaire Erasmus+", ar: 'التسجيل في جامعة مغربية شريكة في إيراسموس+', en: 'Enrolled in a Moroccan Erasmus+ partner university' },
      { fr: 'Niveau linguistique requis (français/anglais/espagnol)', ar: 'المستوى اللغوي المطلوب (فرنسية/إنجليزية/إسبانية)', en: 'Required language level (French/English/Spanish)' },
      { fr: 'Validation de la mobilité par les deux universités', ar: 'التحقق من التنقل من قِبل الجامعتين', en: 'Mobility validated by both universities' },
    ],
    deadline: { fr: 'Février – Avril (selon les universités)', ar: 'فبراير – أبريل (حسب الجامعات)', en: 'February – April (depending on universities)' },
    lien: 'https://erasmus-plus.ec.europa.eu',
    color: '#0891b2',
    bg: '#ecfeff',
  },
  {
    id: 'aljisr',
    emoji: '🤝',
    nom:        { fr: 'Bourse Al Jisr', ar: 'منحة الجسر', en: 'Al Jisr Scholarship' },
    organisme:  { fr: 'Fondation Al Jisr – Secteur Privé', ar: 'مؤسسة الجسر – القطاع الخاص', en: 'Al Jisr Foundation – Private Sector' },
    type:       { fr: 'Soutien scolaire', ar: 'دعم مدرسي', en: 'School Support' },
    typeKey:    'support',
    pays:       [{ fr: 'Maroc', ar: 'المغرب', en: 'Morocco' }],
    description: {
      fr: "Programme de parrainage entre élèves méritants du secondaire et entreprises marocaines, offrant une aide financière mensuelle et un accompagnement tout au long du parcours scolaire.",
      ar: 'برنامج رعاية بين التلاميذ المتفوقين في الثانوي ومقاولات مغربية، يوفر مساعدة مالية شهرية ومرافقة طوال المسار الدراسي.',
      en: 'Mentorship program between deserving high school students and Moroccan companies, offering monthly financial aid and ongoing academic support.',
    },
    conditions: [
      { fr: "Élève en 2ème Bac ou Terminale", ar: 'تلميذ في الثانية باك أو النهائية', en: 'Student in 2nd Bac or final year' },
      { fr: 'Moyenne générale ≥ 14/20', ar: 'المعدل العام ≥ 14/20', en: 'General average ≥ 14/20' },
      { fr: 'Situation familiale modeste', ar: 'وضع عائلي متواضع', en: 'Modest family situation' },
      { fr: "Recommandation du directeur d'établissement", ar: 'توصية من مدير المؤسسة', en: "Principal's recommendation" },
    ],
    deadline: { fr: 'Septembre – Octobre', ar: 'شتنبر – أكتوبر', en: 'September – October' },
    lien: 'https://www.fondation-aljisr.ma',
    color: '#be185d',
    bg: '#fdf2f8',
  },
];

type FilterKey = 'all' | 'abroad' | 'morocco' | 'support' | 'mobility';

const FILTER_LABELS: Record<FilterKey, Record<Lang, string>> = {
  all:      { fr: 'Toutes', ar: 'الكل', en: 'All' },
  abroad:   { fr: "Études à l'étranger", ar: 'دراسة بالخارج', en: 'Studies Abroad' },
  morocco:  { fr: 'Études au Maroc', ar: 'دراسة بالمغرب', en: 'Studies in Morocco' },
  support:  { fr: 'Soutien scolaire', ar: 'دعم مدرسي', en: 'School Support' },
  mobility: { fr: 'Mobilité internationale', ar: 'التنقل الدولي', en: 'International Mobility' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function BoursePage() {
  const { language } = useAuth();
  const lang = language as Lang;

  const [filtre, setFiltre] = useState<FilterKey>('all');
  const [selected, setSelected] = useState<Bourse | null>(null);

  const ml = (v: ML) => v[lang] ?? v.fr;

  const affichees = filtre === 'all' ? BOURSES : BOURSES.filter(b => b.typeKey === filtre);

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as FilterKey[]).map(key => (
          <button
            key={key}
            onClick={() => setFiltre(key)}
            style={{
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              border: filtre === key ? '2px solid #7c3aed' : '2px solid #e5e7eb',
              background: filtre === key ? '#7c3aed' : '#fff',
              color: filtre === key ? '#fff' : '#6b7280',
              transition: 'all 0.2s',
            }}
          >
            {FILTER_LABELS[key][lang] ?? FILTER_LABELS[key].fr}
          </button>
        ))}
      </div>

      {/* Grille */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {affichees.map(b => (
          <div
            key={b.id}
            onClick={() => setSelected(b)}
            className="dash-card"
            style={{
              padding: 20,
              cursor: 'pointer',
              borderTop: `4px solid ${b.color}`,
              transition: 'all 0.2s',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28 }}>{b.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#1e1b4b', lineHeight: 1.3 }}>{ml(b.nom)}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{ml(b.organisme)}</div>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginBottom: 12,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {ml(b.description)}
            </p>

            {/* Pays */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
              {b.pays.map((p, i) => (
                <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999,
                  background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                  {ml(p)}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 999, fontWeight: 700,
                background: b.bg, color: b.color }}>
                {ml(b.type)}
              </span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>📅 {ml(b.deadline)}</span>
            </div>
          </div>
        ))}

        {affichees.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
            {lang === 'ar' ? 'لا توجد منح في هذه الفئة' : lang === 'en' ? 'No scholarships in this category' : 'Aucune bourse dans cette catégorie'}
          </div>
        )}
      </div>

      {/* Modal détail */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,12,41,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 16, backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 20, maxWidth: 520, width: '100%',
              padding: 32, boxShadow: '0 24px 64px rgba(15,12,41,0.25)',
              maxHeight: '90vh', overflowY: 'auto',
            }}
          >
            {/* Header modal */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 40 }}>{selected.emoji}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16, color: '#1e1b4b', lineHeight: 1.3 }}>{ml(selected.nom)}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{ml(selected.organisme)}</div>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 700,
                  background: selected.bg, color: selected.color, display: 'inline-block', marginTop: 6 }}>
                  {ml(selected.type)}
                </span>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>
              {ml(selected.description)}
            </p>

            {/* Conditions */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#1e1b4b', marginBottom: 10 }}>
                {lang === 'ar' ? '✅ شروط التأهل' : lang === 'en' ? '✅ Eligibility Conditions' : '✅ Conditions d\'éligibilité'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selected.conditions.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#475569' }}>
                    <span style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }}>•</span>
                    {ml(c)}
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#64748b', marginBottom: 24,
              padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}>
              <span>📅</span>
              <span>
                <strong>{lang === 'ar' ? 'آخر أجل : ' : lang === 'en' ? 'Deadline: ' : 'Deadline : '}</strong>
                {ml(selected.deadline)}
              </span>
            </div>

            {/* Pays */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
              {selected.pays.map((p, i) => (
                <span key={i} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 999,
                  background: selected.bg, color: selected.color, fontWeight: 700 }}>
                  {ml(p)}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <a
                href={selected.lien}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 12,
                  color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                  background: selected.color, display: 'block',
                }}
              >
                🌐 {lang === 'ar' ? 'زيارة الموقع الرسمي' : lang === 'en' ? 'Visit official website' : 'Visiter le site officiel'}
              </a>
              <button
                onClick={() => setSelected(null)}
                style={{
                  padding: '12px 20px', borderRadius: 12, border: '1px solid #e2e8f0',
                  background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer', fontWeight: 600,
                }}
              >
                {lang === 'ar' ? 'إغلاق' : lang === 'en' ? 'Close' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
