import { useState, useEffect } from 'react';
import type { Lang } from './types';
import './Inscription.css';
import { register } from './api';

// ── Role SVG Icons ─────────────────────────────────────────────────────────────
const IconStudent = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3.33 2 8.67 2 12 0v-5"/>
  </svg>
);

const IconParent = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3"/>
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    <circle cx="19" cy="9" r="2"/>
    <path d="M23 21v-1a3 3 0 0 0-3-3h-1"/>
  </svg>
);

const IconTeacher = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="14" height="10" rx="2"/>
    <path d="M8 13v4m-3 0h6"/>
    <path d="M16 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H16"/>
    <path d="M18 12h2"/>
  </svg>
);

// ── UI labels ─────────────────────────────────────────────────────────────────
const UI = {
  fr: {
    dir: 'ltr',
    badge: 'Création de compte',
    leftTitle: 'Rejoignez MyTawjeh',
    leftDesc: 'Orientation intelligente, suivi scolaire et conseils personnalisés.',
    title: 'Inscription',
    subtitle: 'Choisissez votre profil',
    alreadyAccount: 'Déjà inscrit ?',
    login: 'Se connecter',
    back: '← Retour',
    optional: 'optionnel',
    submit: 'Créer mon compte',
    submitting: 'Création en cours…',
    passwordMismatch: 'Les mots de passe ne correspondent pas.',
    successTitle: 'Compte créé avec succès !',
    successDesc: 'Vous pouvez maintenant vous connecter à votre espace.',
    copyright: '© 2026 MyTawjeh',
    close: '×',
    onetNote: '🎯 Après inscription, passez le test O*NET pour découvrir votre profil de carrière.',
    step1: 'Profil',
    step2: 'Informations',
    typeFormationLabel: 'Type de formation visée',
    typeFormationPlaceholder: '— Sélectionner une formation —',
    formationCategories: {
      avantBac: 'Avant le Baccalauréat',
      apresLicence: 'Après Licence (Bac+5)',
      licence: 'Licence / Bac+3',
      courtTerme: 'Formation courte (Bac+2)',
      doctorat: 'Doctorat / Recherche',
      executive: 'Formation Executive / MBA',
      medical: 'Médecine & Santé',
      prepClasses: 'Classes Préparatoires',
    },
    formations: {
      avantBac: 'Avant Bac (Collège / Lycée)',
      bac: 'Baccalauréat (Tawjihi)',
      cpge: 'CPGE – Classes Préparatoires',
      ingenieur: "Ingénieur d'État (CNC / EMI / ENSA…)",
      encg: 'ENCG – École Nationale de Commerce et de Gestion',
      licence: 'Licence Professionnelle (Bac+3)',
      lst: 'Licence Sciences et Techniques (LST)',
      deug: 'DEUG – Diplôme Universitaire Général (Bac+2)',
      dut: 'DUT – Diplôme Universitaire de Technologie',
      bts: 'BTS – Brevet de Technicien Supérieur',
      ts: 'Technicien Spécialisé (OFPPT)',
      bachelor: 'Bachelor (école privée / international)',
      bachelorMaster: 'Bachelor / Master combiné (5 ans)',
      master: 'Master Universitaire (Bac+5)',
      masterSpe: 'Master Spécialisé (Bac+5)',
      masterInt: 'International Master (anglais)',
      mba: 'MBA – Master of Business Administration',
      doctorat: 'Doctorat (Bac+8)',
      docMedecine: 'Doctorat en Médecine (Bac+7)',
      maitrise: 'Maîtrise Sciences Fondamentales (Bac+4)',
      autre: 'Autre',
    },
  },
  ar: {
    dir: 'rtl',
    badge: 'إنشاء حساب',
    leftTitle: 'انضم إلى MyTawjeh',
    leftDesc: 'توجيه ذكي، متابعة دراسية ونصائح مخصصة.',
    title: 'التسجيل',
    subtitle: 'اختر ملفك الشخصي',
    alreadyAccount: 'لديك حساب؟',
    login: 'تسجيل الدخول',
    back: 'رجوع →',
    optional: 'اختياري',
    submit: 'إنشاء حسابي',
    submitting: 'جاري الإنشاء…',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    successTitle: 'تم إنشاء الحساب بنجاح!',
    successDesc: 'يمكنك الآن تسجيل الدخول إلى مساحتك.',
    copyright: '© 2026 MyTawjeh',
    close: '×',
    onetNote: '🎯 بعد التسجيل، أجرِ اختبار O*NET لاكتشاف ملفك المهني.',
    step1: 'الملف',
    step2: 'المعلومات',
    typeFormationLabel: 'نوع التكوين المستهدف',
    typeFormationPlaceholder: '— اختر نوع التكوين —',
    formationCategories: {
      avantBac: 'قبل البكالوريا',
      apresLicence: 'بعد الإجازة (ماجستير)',
      licence: 'الإجازة / باك+3',
      courtTerme: 'تكوين قصير (باك+2)',
      doctorat: 'دكتوراه / بحث علمي',
      executive: 'تكوين تنفيذي / MBA',
      medical: 'الطب والصحة',
      prepClasses: 'الأقسام التحضيرية',
    },
    formations: {
      avantBac: 'قبل الباك (إعدادي / ثانوي)',
      bac: 'البكالوريا (التوجيهي)',
      cpge: 'الأقسام التحضيرية للمدارس الكبرى',
      ingenieur: 'مهندس الدولة (CNC / EMI / ENSA…)',
      encg: 'ENCG – المدرسة الوطنية للتجارة والتسيير',
      licence: 'الإجازة المهنية (باك+3)',
      lst: 'إجازة العلوم والتقنيات (LST)',
      deug: 'DEUG – دبلوم الدراسات الجامعية (باك+2)',
      dut: 'DUT – دبلوم تقني جامعي',
      bts: 'BTS – شهادة التقني العالي',
      ts: 'تقني متخصص (OFPPT)',
      bachelor: 'باشيلور (مدرسة خاصة / دولي)',
      bachelorMaster: 'باشيلور / ماستر مدمج (5 سنوات)',
      master: 'ماستر جامعي (باك+5)',
      masterSpe: 'ماستر متخصص (باك+5)',
      masterInt: 'ماستر دولي (إنجليزي)',
      mba: 'MBA – ماستر إدارة الأعمال',
      doctorat: 'دكتوراه (باك+8)',
      docMedecine: 'دكتوراه الطب (باك+7)',
      maitrise: 'شهادة العلوم الأساسية (باك+4)',
      autre: 'أخرى',
    },
  },
  en: {
    dir: 'ltr',
    badge: 'Create Account',
    leftTitle: 'Join MyTawjeh',
    leftDesc: 'Smart guidance, academic tracking and personalized advice.',
    title: 'Sign Up',
    subtitle: 'Choose your profile',
    alreadyAccount: 'Already have an account?',
    login: 'Log in',
    back: '← Back',
    optional: 'optional',
    submit: 'Create my account',
    submitting: 'Creating account…',
    passwordMismatch: 'Passwords do not match.',
    successTitle: 'Account created!',
    successDesc: 'You can now log in to your space.',
    copyright: '© 2026 MyTawjeh',
    close: '×',
    onetNote: '🎯 After signing up, take the O*NET test to discover your career profile.',
    step1: 'Profile',
    step2: 'Information',
    typeFormationLabel: 'Target training type',
    typeFormationPlaceholder: '— Select a training type —',
    formationCategories: {
      avantBac: 'Before Baccalauréat',
      apresLicence: 'After Licence (Bac+5)',
      licence: 'Licence / Bac+3',
      courtTerme: 'Short training (Bac+2)',
      doctorat: 'Doctorate / Research',
      executive: 'Executive / MBA',
      medical: 'Medicine & Health',
      prepClasses: 'Preparatory Classes',
    },
    formations: {
      avantBac: 'Before Bac (Middle / High School)',
      bac: 'Baccalauréat (Tawjihi)',
      cpge: 'CPGE – Preparatory Classes',
      ingenieur: "State Engineer (CNC / EMI / ENSA…)",
      encg: 'ENCG – National School of Commerce',
      licence: 'Professional Licence (Bac+3)',
      lst: 'Science & Tech Licence (LST)',
      deug: 'DEUG – General University Diploma (Bac+2)',
      dut: 'DUT – University Technology Diploma',
      bts: 'BTS – Higher Technician Certificate',
      ts: 'Specialized Technician (OFPPT)',
      bachelor: 'Bachelor (private school / international)',
      bachelorMaster: 'Bachelor / Master combined (5 years)',
      master: 'University Master (Bac+5)',
      masterSpe: 'Specialized Master (Bac+5)',
      masterInt: 'International Master (English)',
      mba: 'MBA – Master of Business Administration',
      doctorat: 'Doctorate (Bac+8)',
      docMedecine: 'Medical Doctorate (Bac+7)',
      maitrise: 'Fundamental Sciences Degree (Bac+4)',
      autre: 'Other',
    },
  },
};

// ── Grouped formation options for the select ──────────────────────────────────
function getGroupedFormations(t: typeof UI['fr']) {
  const { formations: f, formationCategories: cat } = t;
  return [
    {
      label: cat.avantBac,
      icon: '🏫',
      options: [f.avantBac, f.bac],
    },
    {
      label: cat.prepClasses,
      icon: '📐',
      options: [f.cpge],
    },
    {
      label: cat.courtTerme,
      icon: '🔧',
      options: [f.deug, f.dut, f.bts, f.ts],
    },
    {
      label: cat.licence,
      icon: '📚',
      options: [f.licence, f.lst, f.bachelor],
    },
    {
      label: 'Bac+5 – Grandes Écoles',
      icon: '🏛️',
      options: [f.ingenieur, f.encg, f.bachelorMaster, f.master, f.masterSpe, f.masterInt],
    },
    {
      label: cat.executive,
      icon: '💼',
      options: [f.mba],
    },
    {
      label: cat.medical,
      icon: '🏥',
      options: [f.docMedecine],
    },
    {
      label: cat.doctorat,
      icon: '🔬',
      options: [f.maitrise, f.doctorat],
    },
    {
      label: '—',
      icon: '',
      options: [f.autre],
    },
  ];
}

// ── Role fields definition ────────────────────────────────────────────────────
const ROLE_FIELDS = {
  eleve: [
    { name: 'nom',        fr: 'Nom complet',      en: 'Full name',        ar: 'الاسم الكامل',        type: 'text',     required: true,  placeholder: 'Yassine Benali', half: false },
    { name: 'email',      fr: 'Email',             en: 'Email',            ar: 'البريد الإلكتروني',   type: 'email',    required: true,  placeholder: 'email@exemple.ma', half: false },
    { name: 'cin',        fr: 'CIN',               en: 'CIN',              ar: 'رقم البطاقة الوطنية', type: 'text',     required: true,  placeholder: 'AB123456', half: true },
    { name: 'cne',        fr: 'CNE',               en: 'CNE',              ar: 'الرقم الوطني للطالب', type: 'text',     required: true,  placeholder: 'R123456789', half: true },
    { name: 'motDePasse', fr: 'Mot de passe',      en: 'Password',         ar: 'كلمة المرور',         type: 'password', required: true,  placeholder: '••••••••', half: true },
    { name: 'confirm',    fr: 'Confirmer',         en: 'Confirm',          ar: 'تأكيد',               type: 'password', required: true,  placeholder: '••••••••', half: true },
    { name: 'niveau',     fr: 'Niveau actuel',     en: 'Current level',    ar: 'المستوى الحالي',      type: 'select',   required: true,  half: true,
      options: { fr: ['Tronc commun', '1ère Bac', 'Terminale (2ème Bac)'], en: ['Common Core', '1st Bac', 'Final Year (2nd Bac)'], ar: ['الجذع المشترك', 'الأولى باك', 'الثانية باك'] } },
    { name: 'filiere',    fr: 'Filière',           en: 'Track',            ar: 'الشعبة',              type: 'select',   required: false, half: true,
      options: { fr: ['Sciences Maths', 'Sciences Physiques', 'Sciences de la Vie', 'Sciences Éco', 'Lettres', 'Autre'],
                 en: ['Math Sciences', 'Physical Sciences', 'Life Sciences', 'Economic Sciences', 'Literature', 'Other'],
                 ar: ['علوم رياضية', 'علوم فيزيائية', 'علوم الحياة والأرض', 'علوم اقتصادية', 'آداب', 'أخرى'] } },
    { name: 'typeFormation', fr: '__CUSTOM_FORMATION__', en: '__CUSTOM_FORMATION__', ar: '__CUSTOM_FORMATION__', type: 'formation_select', required: false, half: false },
    { name: 'ville',      fr: 'Ville',             en: 'City',             ar: 'المدينة',             type: 'text',     required: false, placeholder: 'Casablanca', half: false },
  ],
  parent: [
    { name: 'nom',        fr: 'Nom complet',       en: 'Full name',        ar: 'الاسم الكامل',        type: 'text',     required: true,  placeholder: 'Mohamed Benali', half: false },
    { name: 'email',      fr: 'Email',             en: 'Email',            ar: 'البريد الإلكتروني',   type: 'email',    required: true,  placeholder: 'email@exemple.ma', half: false },
    { name: 'cin',        fr: 'CIN',               en: 'CIN',              ar: 'رقم البطاقة الوطنية', type: 'text',     required: true,  placeholder: 'AB123456', half: false },
    { name: 'motDePasse', fr: 'Mot de passe',      en: 'Password',         ar: 'كلمة المرور',         type: 'password', required: true,  placeholder: '••••••••', half: true },
    { name: 'confirm',    fr: 'Confirmer',         en: 'Confirm',          ar: 'تأكيد',               type: 'password', required: true,  placeholder: '••••••••', half: true },
  ],
  professeur: [
    { name: 'nom',        fr: 'Nom complet',       en: 'Full name',        ar: 'الاسم الكامل',        type: 'text',     required: true,  placeholder: 'Prof. Hassan', half: false },
    { name: 'email',      fr: 'Email',             en: 'Email',            ar: 'البريد الإلكتروني',   type: 'email',    required: true,  placeholder: 'email@exemple.ma', half: false },
    { name: 'cin',        fr: 'CIN',               en: 'CIN',              ar: 'رقم البطاقة الوطنية',  type: 'text',     required: true,  placeholder: 'AB123456',   half: true },
    { name: 'matricule',  fr: 'Matricule',         en: 'Matricule',        ar: 'رقم التسجيل المهني',  type: 'text',     required: true,  placeholder: 'P-12345',    half: true },
    { name: 'motDePasse', fr: 'Mot de passe',      en: 'Password',         ar: 'كلمة المرور',         type: 'password', required: true,  placeholder: '••••••••',   half: true },
    { name: 'confirm',    fr: 'Confirmer',         en: 'Confirm',          ar: 'تأكيد',               type: 'password', required: true,  placeholder: '••••••••',   half: true },
    { name: 'specialite', fr: 'Matière enseignée', en: 'Subject taught',   ar: 'المادة المدرّسة',     type: 'select',   required: true,  half: false,
      options: { fr: ['Mathématiques', 'Physique-Chimie', 'Sciences de la Vie et de la Terre', 'Français', 'Anglais', 'Philosophie', 'Histoire-Géographie', 'Informatique', 'Arabe', 'Éducation Islamique', 'Autre'],
                 en: ['Mathematics', 'Physics-Chemistry', 'Life & Earth Sciences', 'French', 'English', 'Philosophy', 'History-Geography', 'Computer Science', 'Arabic', 'Islamic Education', 'Other'],
                 ar: ['الرياضيات', 'الفيزياء والكيمياء', 'علوم الحياة والأرض', 'اللغة الفرنسية', 'اللغة الإنجليزية', 'الفلسفة', 'التاريخ والجغرافيا', 'المعلوميات', 'اللغة العربية', 'التربية الإسلامية', 'أخرى'] } },
  ],
};

const ROLES_CONFIG = {
  eleve:      { fr: { label: 'Étudiant',   desc: 'Suivi scolaire et orientation IA' },   en: { label: 'Student',   desc: 'Academic tracking & AI guidance' },   ar: { label: 'طالب',      desc: 'متابعة دراسية وتوجيه بالذكاء الاصطناعي' }, icon: <IconStudent />, apiRole: 'eleve' },
  parent:     { fr: { label: 'Parent',     desc: 'Suivez le parcours de votre enfant' }, en: { label: 'Parent',    desc: "Follow your child's journey" },        ar: { label: 'ولي الأمر', desc: 'تابع المسار الدراسي لطفلك' },              icon: <IconParent />,  apiRole: 'parent' },
  professeur: { fr: { label: 'Professeur', desc: 'Espace enseignement et suivi' },       en: { label: 'Teacher',   desc: 'Teaching & student tracking' },        ar: { label: 'أستاذ',     desc: 'فضاء التدريس والمتابعة' },                 icon: <IconTeacher />, apiRole: 'professeur' },
};

// ── Formation grouped select component ───────────────────────────────────────
function FormationSelect({ t, value, onChange }: { t: typeof UI['fr']; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const groups = getGroupedFormations(t);

  const selectedLabel = value || t.typeFormationPlaceholder;
  const hasValue = !!value;

  return (
    <div className="ins-formation-wrap">
      <button
        type="button"
        className={`ins-formation-btn ${hasValue ? 'ins-formation-btn--selected' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className={`ins-formation-btn-text ${!hasValue ? 'ins-formation-btn-placeholder' : ''}`}>
          {hasValue ? (
            <>
              <span className="ins-formation-selected-dot" />
              {selectedLabel}
            </>
          ) : selectedLabel}
        </span>
        <svg
          className={`ins-formation-chevron ${open ? 'ins-formation-chevron--open' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="ins-formation-dropdown" role="listbox">
          <button
            type="button"
            className="ins-formation-option ins-formation-option--reset"
            onClick={() => { onChange(''); setOpen(false); }}
          >
            {t.typeFormationPlaceholder}
          </button>
          {groups.map((group) => (
            <div key={group.label} className="ins-formation-group">
              {group.label !== '—' && (
                <div className="ins-formation-group-label">
                  {group.icon && <span>{group.icon}</span>}
                  {group.label}
                </div>
              )}
              {group.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={value === opt}
                  className={`ins-formation-option ${value === opt ? 'ins-formation-option--active' : ''}`}
                  onClick={() => { onChange(opt); setOpen(false); }}
                >
                  {value === opt && (
                    <svg className="ins-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {opt}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Inscription({
  onClose,
  onSwitchToLogin,
  lang = 'fr',
  defaultRole,
}: {
  onClose: () => void;
  onSwitchToLogin: () => void;
  lang: Lang;
  defaultRole?: 'eleve' | 'parent' | 'professeur';
}) {
  const [role, setRole] = useState<string | null>(defaultRole || null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const t = UI[lang as keyof typeof UI] || UI.fr;
  const fields = role ? ROLE_FIELDS[role as keyof typeof ROLE_FIELDS] : [];
  const roleLabel = role ? ROLES_CONFIG[role as keyof typeof ROLES_CONFIG][lang as keyof typeof UI]?.label : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.motDePasse !== form.confirm) {
      setError(t.passwordMismatch);
      return;
    }
    setLoading(true);
    try {
      const { confirm, ...payload } = form;
      await register({ role: ROLES_CONFIG[role as keyof typeof ROLES_CONFIG].apiRole, ...payload });
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="ins-overlay"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      <div className="ins-modal" dir={t.dir}>

        {/* ── Left panel ── */}
        <div className="ins-left">
          <div className="ins-blob ins-blob-top" />
          <div className="ins-blob ins-blob-bottom" />
          <div className="ins-blob ins-blob-mid" />

          <div className="ins-left-content">
            {/* Logo */}
            <div className="ins-logo">
              <div className="ins-logo-icon">M</div>
              <span className="ins-logo-text">MyTawjeh</span>
            </div>

            {/* Badge */}
            <div className="ins-badge">{t.badge}</div>

            {/* Headline */}
            <h2 className="ins-left-title">{t.leftTitle}</h2>
            <p className="ins-left-desc">{t.leftDesc}</p>

            {/* Step indicators */}
            <div className="ins-steps">
              <div className={`ins-step ${!role ? 'ins-step--active' : 'ins-step--done'}`}>
                <div className="ins-step-dot">
                  {role ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="10" height="10">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : '1'}
                </div>
                <span>{t.step1}</span>
              </div>
              <div className="ins-step-line" />
              <div className={`ins-step ${role ? 'ins-step--active' : ''}`}>
                <div className="ins-step-dot">2</div>
                <span>{t.step2}</span>
              </div>
            </div>

            {/* Active role pill */}
            {role && (
              <div className="ins-role-tag">
                <span>{ROLES_CONFIG[role as keyof typeof ROLES_CONFIG].icon}</span>
                <span>{roleLabel}</span>
              </div>
            )}
          </div>

          <div className="ins-left-footer">{t.copyright}</div>
        </div>

        {/* ── Right panel ── */}
        <div className="ins-right">
          {onClose && (
            <button className="ins-close" onClick={onClose} aria-label={t.close}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* ── Success state ── */}
          {success ? (
            <div className="ins-success">
              <div className="ins-success-ring">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="ins-success-title">{t.successTitle}</h3>
              <p className="ins-success-desc">{t.successDesc}</p>
              <button className="ins-btn" onClick={() => { if (onClose) onClose(); if (onSwitchToLogin) onSwitchToLogin(); }}>
                {t.login}
              </button>
            </div>

          /* ── Step 1 — role selection ── */
          ) : !role ? (
            <div className="ins-step1">
              <div className="ins-right-header">
                <h3 className="ins-title">{t.title}</h3>
                <p className="ins-subtitle">{t.subtitle}</p>
              </div>

              <div className="ins-roles">
                {Object.entries(ROLES_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    className="ins-role-card"
                    onClick={() => { setRole(key); setForm({}); setError(''); }}
                  >
                    <span className="ins-role-icon">{cfg.icon}</span>
                    <div className="ins-role-info">
                      <span className="ins-role-label">{cfg[lang as keyof typeof UI]?.label}</span>
                      <span className="ins-role-desc">{cfg[lang as keyof typeof UI]?.desc}</span>
                    </div>
                    <svg className="ins-role-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>

              <p className="ins-switch">
                {t.alreadyAccount}{' '}
                <button className="ins-switch-link" onClick={() => { if (onClose) onClose(); if (onSwitchToLogin) onSwitchToLogin(); }}>
                  {t.login}
                </button>
              </p>
            </div>

          /* ── Step 2 — form ── */
          ) : (
            <div className="ins-step2">
              <div className="ins-form-header">
                <button className="ins-back" onClick={() => { setRole(null); setForm({}); setError(''); }}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t.back}
                </button>
                <div>
                  <h3 className="ins-title">{t.title}</h3>
                  <p className="ins-subtitle">{roleLabel}</p>
                </div>
              </div>

              {error && (
                <div className="ins-error">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="ins-form" noValidate>
                <div className="ins-grid">
                  {fields.map((f) => {
                    const label = (f as { [k: string]: string })[lang as string] || f.fr;

                    // Custom formation grouped select
                    if (f.type === 'formation_select') {
                      return (
                        <div key={f.name} className="ins-field ins-field--full">
                          <label className="ins-label">
                            {t.typeFormationLabel}
                            <span className="ins-optional"> ({t.optional})</span>
                          </label>
                          <FormationSelect
                            t={t}
                            value={form.typeFormation || ''}
                            onChange={(v) => setForm(prev => ({ ...prev, typeFormation: v }))}
                          />
                        </div>
                      );
                    }

                    const isHalf = (f as { half?: boolean }).half;

                    return (
                      <div
                        key={f.name}
                        className={`ins-field ${!isHalf ? 'ins-field--full' : ''}`}
                      >
                        <label className="ins-label">
                          {label === '__CUSTOM_FORMATION__' ? t.typeFormationLabel : label}
                          {!f.required && <span className="ins-optional"> ({t.optional})</span>}
                          {f.required && <span className="ins-required"> *</span>}
                        </label>

                        {f.type === 'select' ? (
                          <select
                            name={f.name}
                            required={f.required}
                            value={form[f.name] || ''}
                            onChange={handleChange}
                            className="ins-input"
                          >
                            <option value="">—</option>
                            {((f as { options: Record<string, string[]> }).options[lang as string]
                              || (f as { options: Record<string, string[]> }).options.fr
                            ).map((o: string) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={f.type}
                            name={f.name}
                            required={f.required}
                            value={form[f.name] || ''}
                            onChange={handleChange}
                            placeholder={(f as { placeholder?: string }).placeholder || ''}
                            className="ins-input"
                          />
                        )}

                        {/* "Autre" custom text inputs */}
                        {f.name === 'filiere' && (form.filiere === 'Autre' || form.filiere === 'أخرى' || form.filiere === 'Other') && (
                          <input
                            type="text"
                            name="filiere_autre"
                            value={form.filiere_autre || ''}
                            onChange={handleChange}
                            placeholder={lang === 'ar' ? 'اكتب اسم الشعبة…' : 'Saisir la filière…'}
                            className="ins-input ins-input--sub"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <button type="submit" disabled={loading} className="ins-btn">
                  {loading ? (
                    <>
                      <span className="ins-spinner" />
                      {t.submitting}
                    </>
                  ) : t.submit}
                </button>

                {role === 'eleve' && (
                  <p className="ins-onet-note">{t.onetNote}</p>
                )}

                <p className="ins-switch">
                  {t.alreadyAccount}{' '}
                  <button
                    type="button"
                    className="ins-switch-link"
                    onClick={() => { if (onClose) onClose(); if (onSwitchToLogin) onSwitchToLogin(); }}
                  >
                    {t.login}
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
