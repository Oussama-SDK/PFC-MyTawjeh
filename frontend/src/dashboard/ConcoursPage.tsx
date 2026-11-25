import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { useTranslation } from '../i18n';
import { Concours, apiFetch } from './shared';

type ConcoursTab = 'concours' | 'annales';
type Countdown = {
  label: string;
  tone: 'muted' | 'green' | 'purple' | 'amber' | 'red';
  urgent: boolean;
  days: number | null;
};

// ---------------------------------------------------------------------------
// Multilingual helper
// ---------------------------------------------------------------------------
type MultiLang = { fr: string; en: string; ar: string };
function ml(v: string | MultiLang, lang: string): string {
  if (typeof v === 'string') return v;
  return (v as MultiLang)[lang as keyof MultiLang] ?? v.fr;
}

type ConcoursDetail = {
  icon: string;
  tagline: MultiLang;
  color: string;
  places: string;
  duree: string;
  conditions: Array<{ bac: string | MultiLang; note: string | MultiLang; color: string }>;
  schools: Array<{ name: string; city: string; region: string }>;
  examStructure: Array<{ matiere: string | MultiLang; duree: string; coeff?: string; format: string | MultiLang }>;
  phases: Array<{ step: string; desc: MultiLang }>;
  tips: MultiLang[];
};

// ---------------------------------------------------------------------------
// Static detail data — fully multilingual
// ---------------------------------------------------------------------------
const CONCOURS_DETAILS: Record<string, ConcoursDetail> = {
  bts: {
    icon: '📋',
    tagline: {
      fr: 'Formation professionnalisante 2 ans post-bac',
      en: 'Vocational training, 2 years post-bac',
      ar: 'تكوين مهني مدته سنتان بعد الباكالوريا',
    },
    color: '#0891b2',
    places: '20 000+ places',
    duree: '2 ans',
    conditions: [
      {
        bac: { fr: 'Toutes filières', en: 'All tracks', ar: 'جميع الشعب' },
        note: { fr: 'Sélection sur moyenne bac', en: 'Selection on bac average', ar: 'الانتقاء على أساس معدل الباكالوريا' },
        color: '#0891b2',
      },
    ],
    schools: [
      { name: 'Lycée Moulay Youssef', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'Lycée El Kindi', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'Lycée Hay El Hassani', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'Lycée Mohammed V', city: 'Settat', region: 'Casablanca-Settat' },
      { name: 'Lycée Ibn Khaldoun', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
      { name: 'Lycée Hassan II', city: 'Kénitra', region: 'Rabat-Salé-Kénitra' },
      { name: 'Lycée Ibn Tofail', city: 'Salé', region: 'Rabat-Salé-Kénitra' },
      { name: 'Lycée Mohammed Drissi', city: 'Fès', region: 'Fès-Meknès' },
      { name: 'Lycée Moulay Ismail', city: 'Meknès', region: 'Fès-Meknès' },
      { name: 'Lycée Ibn Khaldoun', city: 'Fès', region: 'Fès-Meknès' },
      { name: 'Lycée Moulay Rachid', city: 'Marrakech', region: 'Marrakech-Safi' },
      { name: 'Lycée Ibn Batouta', city: 'Tanger', region: 'Tanger-Tétouan' },
      { name: 'Lycée Tariq Ibn Ziad', city: 'Agadir', region: 'Souss-Massa' },
      { name: 'Lycée Ibn Khaldoun', city: 'Oujda', region: 'Oriental' },
      { name: 'Lycée El Massira', city: 'Laâyoune', region: 'Laâyoune-Sakia El Hamra' },
    ],
    examStructure: [
      {
        matiere: { fr: 'Dossier bac', en: 'Bac file', ar: 'ملف الباكالوريا' },
        duree: '—',
        format: {
          fr: 'Moyenne générale bac + notes matières — Spécialités : Informatique de Gestion, Développement Informatique, Réseau & Télécoms, Audiovisuel, Maintenance Industrielle, Gestion des Entreprises, Commerce International',
          en: 'General bac average + subject grades — Specializations: IT Management, IT Development, Networks & Telecom, Audiovisual, Industrial Maintenance, Business Management, International Trade',
          ar: 'المعدل العام للباكالوريا + درجات المواد — التخصصات: إعلاميات التسيير، تطوير المعلوماتية، الشبكات والاتصالات، السمعي البصري، الصيانة الصناعية، تسيير المقاولات، التجارة الدولية',
        },
      },
    ],
    phases: [
      { step: '1', desc: { fr: 'Inscription en ligne (massarservice.men.gov.ma)', en: 'Online registration (massarservice.men.gov.ma)', ar: 'التسجيل عبر الإنترنت (massarservice.men.gov.ma)' } },
      { step: '2', desc: { fr: 'Sélection sur dossier bac', en: 'Selection on bac file', ar: 'الانتقاء على أساس ملف الباكالوريا' } },
      { step: '3', desc: { fr: 'Affectation par spécialité et région', en: 'Assignment by specialization and region', ar: 'التوجيه حسب التخصص والجهة' } },
      { step: '4', desc: { fr: 'Rentrée septembre', en: 'September enrollment', ar: 'الدخول في شتنبر' } },
    ],
    tips: [
      { fr: 'Inscrivez-vous dès la publication des résultats du bac', en: 'Register as soon as bac results are published', ar: 'سجل فور نشر نتائج الباكالوريا' },
      { fr: 'Consultez e-bts.men.gov.ma pour les spécialités disponibles par région', en: 'Check e-bts.men.gov.ma for available specializations in your region', ar: 'راجع e-bts.men.gov.ma للتخصصات المتاحة في جهتك' },
      { fr: "Certaines spécialités sont très demandées — préparez un 2ème choix", en: 'Some specializations are in high demand — prepare a second choice', ar: 'بعض التخصصات مطلوبة جدًا — جهز خيارًا ثانيًا' },
    ],
  },

  ensa: {
    icon: '⚙️',
    tagline: {
      fr: "16 écoles d'ingénieurs intégrées 5 ans post-bac",
      en: '16 integrated engineering schools, 5 years post-bac',
      ar: '16 مدرسة هندسية متكاملة، 5 سنوات بعد الباكالوريا',
    },
    color: '#7c3aed',
    places: '4 390 places',
    duree: '5 ans (cycle intégré)',
    conditions: [
      { bac: '2BAC SM', note: '≥ 12/20', color: '#7c3aed' },
      { bac: '2BAC PC', note: '≥ 14/20', color: '#3b82f6' },
      { bac: '2BAC SVT', note: '≥ 15.25/20', color: '#10b981' },
    ],
    schools: [
      { name: 'ENSA Agadir', city: 'Agadir', region: 'Souss-Massa' },
      { name: 'ENSA Al Hoceima', city: 'Al Hoceima', region: 'Tanger-Tétouan-Al Hoceima' },
      { name: 'ENSA Beni Mellal', city: 'Beni Mellal', region: 'Béni Mellal-Khénifra' },
      { name: 'ENSA Berrechid', city: 'Berrechid', region: 'Casablanca-Settat' },
      { name: 'ENSA Benguerir', city: 'Benguerir', region: 'Marrakech-Safi' },
      { name: 'ENSA El Jadida', city: 'El Jadida', region: 'Casablanca-Settat' },
      { name: 'ENSA Fès', city: 'Fès', region: 'Fès-Meknès' },
      { name: 'ENSA Kénitra', city: 'Kénitra', region: 'Rabat-Salé-Kénitra' },
      { name: 'ENSA Khouribga', city: 'Khouribga', region: 'Béni Mellal-Khénifra' },
      { name: 'ENSA Marrakech', city: 'Marrakech', region: 'Marrakech-Safi' },
      { name: 'ENSA Oujda', city: 'Oujda', region: 'Oriental' },
      { name: 'ENSA Safi', city: 'Safi', region: 'Marrakech-Safi' },
      { name: 'ENSA Settat', city: 'Settat', region: 'Casablanca-Settat' },
      { name: 'ENSA Tanger', city: 'Tanger', region: 'Tanger-Tétouan-Al Hoceima' },
      { name: 'ENSA Tétouan', city: 'Tétouan', region: 'Tanger-Tétouan-Al Hoceima' },
      { name: 'ENSA Casablanca', city: 'Casablanca', region: 'Casablanca-Settat' },
    ],
    examStructure: [
      { matiere: { fr: 'Mathématiques', en: 'Mathematics', ar: 'الرياضيات' }, duree: '2h', coeff: '4', format: { fr: 'QCM (présélection nationale 75% + régionale 25%)', en: 'MCQ (national pre-selection 75% + regional 25%)', ar: 'اختبار QCM (الانتقاء الوطني 75% + الجهوي 25%)' } },
      { matiere: { fr: 'Physique-Chimie', en: 'Physics-Chemistry', ar: 'الفيزياء والكيمياء' }, duree: '1h30', coeff: '3', format: { fr: 'QCM', en: 'MCQ', ar: 'اختيار من متعدد' } },
      { matiere: { fr: 'Note du bac', en: 'Bac grade', ar: 'نتيجة الباكالوريا' }, duree: '—', coeff: '—', format: { fr: 'Coefficient de pondération national/régional', en: 'National/regional weighting coefficient', ar: 'معامل الترجيح الوطني/الجهوي' } },
    ],
    phases: [
      { step: '1', desc: { fr: 'Inscription cursussup.gov.ma (janv–mars)', en: 'Registration cursussup.gov.ma (Jan–Mar)', ar: 'التسجيل عبر cursussup.gov.ma (يناير-مارس)' } },
      { step: '2', desc: { fr: 'Présélection dossier bac', en: 'Bac file pre-selection', ar: 'الانتقاء المسبق على أساس ملف الباكالوريا' } },
      { step: '3', desc: { fr: 'QCM écrit national', en: 'National written MCQ', ar: 'الاختبار الكتابي QCM الوطني' } },
      { step: '4', desc: { fr: 'Affectation par école et filière', en: 'Assignment by school and track', ar: 'التوجيه حسب المدرسة والشعبة' } },
    ],
    tips: [
      { fr: 'La note du bac compte pour 75% (présélection nationale)', en: 'The bac grade counts for 75% (national pre-selection)', ar: 'نتيجة الباكالوريا تحتسب بـ 75% (الانتقاء الوطني المسبق)' },
      { fr: 'Réviser les annales des 3 dernières années', en: 'Revise past exams from the last 3 years', ar: 'راجع مواضيع السنوات الثلاث الأخيرة' },
      { fr: "Choisissez l'école selon la spécialité disponible dans votre région", en: 'Choose the school based on the specialization available in your region', ar: 'اختر المدرسة حسب التخصص المتاح في جهتك' },
      { fr: 'Les ENSA récentes (Berrechid, Benguerir) ont des seuils plus accessibles', en: 'Recent ENSA schools (Berrechid, Benguerir) have more accessible thresholds', ar: 'مدارس ENSA الحديثة (بركيشيد، بنكرير) لديها عتبات أكثر سهولة' },
    ],
  },

  ensam: {
    icon: '🔩',
    tagline: {
      fr: '3 écoles en Génie Industriel',
      en: '3 schools in Industrial Engineering',
      ar: '3 مدارس في الهندسة الصناعية',
    },
    color: '#dc2626',
    places: '1 060 places',
    duree: '5 ans',
    conditions: [
      { bac: '2BAC SM', note: '≥ 12.25/20', color: '#dc2626' },
      { bac: '2BAC PC', note: '≥ 16.17/20', color: '#f97316' },
      { bac: '2BAC SVT', note: '≥ 16.17/20', color: '#f97316' },
    ],
    schools: [
      { name: 'ENSAM Meknès', city: 'Meknès', region: 'Fès-Meknès' },
      { name: 'ENSAM Casablanca', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'ENSAM Rabat', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
    ],
    examStructure: [
      { matiere: { fr: 'Mathématiques', en: 'Mathematics', ar: 'الرياضيات' }, duree: '2h', coeff: '4', format: { fr: 'QCM national — 60 questions (3h30 total)', en: 'National MCQ — 60 questions (3h30 total)', ar: 'اختبار QCM وطني — 60 سؤالاً (3س30د إجمالاً)' } },
      { matiere: { fr: 'Physique', en: 'Physics', ar: 'الفيزياء' }, duree: '1h30', coeff: '3', format: { fr: 'QCM national', en: 'National MCQ', ar: 'اختيار من متعدد وطني' } },
    ],
    phases: [
      { step: '1', desc: { fr: 'Inscription ensam-concours.ma', en: 'Registration ensam-concours.ma', ar: 'التسجيل عبر ensam-concours.ma' } },
      { step: '2', desc: { fr: 'QCM écrit (60 questions)', en: 'Written MCQ (60 questions)', ar: 'الاختبار الكتابي QCM (60 سؤالاً)' } },
      { step: '3', desc: { fr: 'Classement national', en: 'National ranking', ar: 'الترتيب الوطني' } },
      { step: '4', desc: { fr: 'Choix école et spécialité — Spécialités : Génie Mécanique, Électromécanique, Biomédical, Génie Industriel, Génie des Procédés', en: 'Choose school and specialization — Specializations: Mechanical Engineering, Electromechanics, Biomedical, Industrial Engineering, Process Engineering', ar: 'اختيار المدرسة والتخصص — التخصصات: الهندسة الميكانيكية، الكهروميكانيك، الطب الحيوي، الهندسة الصناعية، هندسة العمليات' } },
    ],
    tips: [
      { fr: 'Seuil PC/SVT très élevé (16+/20)', en: 'PC/SVT threshold very high (16+/20)', ar: 'عتبة فيزياء كيمياء/علوم الحياة عالية جدًا (16+/20)' },
      { fr: 'En SM le seuil est plus accessible (12.25)', en: 'In SM the threshold is more accessible (12.25)', ar: 'في العلوم الرياضية العتبة أكثر سهولة (12.25)' },
      { fr: 'Révisez intensément les QCM de physique', en: 'Intensively revise physics MCQs', ar: 'راجع مواضيع الفيزياء QCM بشكل مكثف' },
    ],
  },

  encg: {
    icon: '📈',
    tagline: {
      fr: '5 ENCG publiques — Management & Commerce',
      en: '5 public ENCG schools — Management & Commerce',
      ar: '5 مدارس ENCG عمومية — الإدارة والتجارة',
    },
    color: '#059669',
    places: '4 850 places',
    duree: '5 ans',
    conditions: [
      { bac: '2BAC SE / SGC / SM', note: '≥ 12/20', color: '#059669' },
      { bac: '2BAC PC / SVT', note: '≥ 14/20', color: '#10b981' },
      { bac: { fr: 'Autres filières', en: 'Other tracks', ar: 'شعب أخرى' }, note: '≥ 15/20', color: '#6b7280' },
    ],
    schools: [
      { name: 'ENCG Casablanca', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'ENCG Settat', city: 'Settat', region: 'Casablanca-Settat' },
      { name: 'ENCG Tanger', city: 'Tanger', region: 'Tanger-Tétouan-Al Hoceima' },
      { name: 'ENCG Fès', city: 'Fès', region: 'Fès-Meknès' },
      { name: 'ENCG Agadir', city: 'Agadir', region: 'Souss-Massa' },
    ],
    examStructure: [
      { matiere: { fr: 'Logique & Raisonnement', en: 'Logic & Reasoning', ar: 'المنطق والاستدلال' }, duree: '45min', coeff: '2', format: { fr: 'QCM', en: 'MCQ', ar: 'اختيار من متعدد' } },
      { matiere: { fr: 'Mathématiques', en: 'Mathematics', ar: 'الرياضيات' }, duree: '1h', coeff: '3', format: { fr: 'QCM', en: 'MCQ', ar: 'اختيار من متعدد' } },
      { matiere: { fr: 'Culture générale', en: 'General knowledge', ar: 'الثقافة العامة' }, duree: '45min', coeff: '2', format: { fr: 'QCM', en: 'MCQ', ar: 'اختيار من متعدد' } },
      { matiere: { fr: 'Français & Anglais', en: 'French & English', ar: 'الفرنسية والإنجليزية' }, duree: '1h', coeff: '2', format: { fr: 'QCM compréhension', en: 'Comprehension MCQ', ar: 'اختيار من متعدد — الفهم' } },
    ],
    phases: [
      { step: '1', desc: { fr: 'Inscription cursussup.gov.ma', en: 'Registration cursussup.gov.ma', ar: 'التسجيل عبر cursussup.gov.ma' } },
      { step: '2', desc: { fr: 'Test TAFEM écrit', en: 'Written TAFEM test', ar: 'اختبار TAFEM الكتابي' } },
      { step: '3', desc: { fr: 'Classement et affectation ENCG', en: 'Ranking and ENCG assignment', ar: 'الترتيب والتوجيه إلى ENCG' } },
    ],
    tips: [
      { fr: 'Le TAFEM est transversal — travaillez la logique et la culture générale', en: 'TAFEM is cross-disciplinary — work on logic and general knowledge', ar: 'اختبار TAFEM شامل — اعمل على المنطق والثقافة العامة' },
      { fr: 'ENCG Casablanca est la plus sélective', en: 'ENCG Casablanca is the most selective', ar: 'ENCG الدار البيضاء هي الأكثر انتقاءً' },
      { fr: "Révisez l'actualité économique marocaine pour la culture générale", en: 'Review Moroccan economic news for general knowledge', ar: 'راجع الأحداث الاقتصادية المغربية للثقافة العامة' },
    ],
  },

  iscae: {
    icon: '🏛️',
    tagline: {
      fr: 'Grande école publique de management — très sélective',
      en: 'Public management school — very selective',
      ar: 'مدرسة عليا عمومية للإدارة — انتقائية جداً',
    },
    color: '#7c3aed',
    places: '~200 places/an',
    duree: '3 ans (Licence)',
    conditions: [
      { bac: '2BAC SE / SGC', note: { fr: 'Seuil pratique ~17/20', en: 'Practical threshold ~17/20', ar: 'العتبة الفعلية ~17/20' }, color: '#7c3aed' },
      { bac: '2BAC SM / PC', note: { fr: 'Acceptés avec seuil élevé', en: 'Accepted with high threshold', ar: 'مقبول مع عتبة عالية' }, color: '#8b5cf6' },
    ],
    schools: [
      { name: 'ISCAE Casablanca', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'ISCAE Rabat', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
    ],
    examStructure: [
      { matiere: { fr: 'Mathématiques', en: 'Mathematics', ar: 'الرياضيات' }, duree: '2h', coeff: '3', format: { fr: 'Questions ouvertes', en: 'Open questions', ar: 'أسئلة مفتوحة' } },
      { matiere: { fr: 'Anglais', en: 'English', ar: 'اللغة الإنجليزية' }, duree: '1h', coeff: '2', format: { fr: 'Compréhension + expression', en: 'Comprehension + expression', ar: 'الفهم + التعبير' } },
      { matiere: { fr: 'Culture générale & Français', en: 'General knowledge & French', ar: 'الثقافة العامة والفرنسية' }, duree: '1h30', coeff: '2', format: { fr: 'Questions ouvertes', en: 'Open questions', ar: 'أسئلة مفتوحة' } },
      { matiere: { fr: 'Entretien oral', en: 'Oral interview', ar: 'المقابلة الشفهية' }, duree: '20min', coeff: '3', format: { fr: 'Jury de 2 professeurs', en: 'Jury of 2 professors', ar: 'لجنة من أستاذين' } },
    ],
    phases: [
      { step: '1', desc: { fr: 'Présélection sur dossier', en: 'Pre-selection on file', ar: 'الانتقاء المسبق على أساس الملف' } },
      { step: '2', desc: { fr: 'Épreuves écrites', en: 'Written exams', ar: 'الاختبارات الكتابية' } },
      { step: '3', desc: { fr: 'Oraux (candidats présélectionnés)', en: 'Oral exams (pre-selected candidates)', ar: 'الشفويات (للمرشحين المنتقين)' } },
      { step: '4', desc: { fr: 'Liste définitive', en: 'Final list', ar: 'القائمة النهائية' } },
    ],
    tips: [
      { fr: "L'ISCAE est l'une des écoles les plus sélectives du Maroc", en: 'ISCAE is one of the most selective schools in Morocco', ar: 'ISCAE من أكثر المدارس انتقاءً في المغرب' },
      { fr: 'Un 17/20 en bac est souvent nécessaire en pratique', en: 'A 17/20 in bac is often necessary in practice', ar: 'معدل 17/20 في الباكالوريا ضروري عملياً في الغالب' },
      { fr: "Préparez l'oral : actualité économique, motivation, projet professionnel", en: 'Prepare for the oral: economic news, motivation, career project', ar: 'استعد للشفهي: الأحداث الاقتصادية، الدوافع، المشروع المهني' },
    ],
  },

  medecine: {
    icon: '🩺',
    tagline: {
      fr: '7 facultés publiques — Médecine, Pharmacie, Dentaire',
      en: '7 public faculties — Medicine, Pharmacy, Dentistry',
      ar: '7 كليات عمومية — الطب والصيدلة وطب الأسنان',
    },
    color: '#dc2626',
    places: '6 511 places (médecine 5140, pharmacie 916, dentaire 455)',
    duree: '6 ans (médecine) / 5 ans (pharmacie, dentaire)',
    conditions: [
      { bac: '2BAC SVT', note: { fr: '≥ 12/20 (seuil pratique ~16+)', en: '≥ 12/20 (practical threshold ~16+)', ar: '≥ 12/20 (العتبة الفعلية ~16+)' }, color: '#dc2626' },
      { bac: '2BAC SM', note: { fr: 'Accepté', en: 'Accepted', ar: 'مقبول' }, color: '#f97316' },
      { bac: '2BAC PC', note: { fr: 'Accepté', en: 'Accepted', ar: 'مقبول' }, color: '#f97316' },
    ],
    schools: [
      { name: 'FMPC Casablanca', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'FMPR Rabat', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
      { name: 'FMPF Fès', city: 'Fès', region: 'Fès-Meknès' },
      { name: 'FMPM Marrakech', city: 'Marrakech', region: 'Marrakech-Safi' },
      { name: 'FMPO Oujda', city: 'Oujda', region: 'Oriental' },
      { name: 'FMPT Tanger', city: 'Tanger', region: 'Tanger-Tétouan-Al Hoceima' },
      { name: 'FMPA Agadir', city: 'Agadir', region: 'Souss-Massa' },
    ],
    examStructure: [
      { matiere: { fr: 'Biologie & SVT', en: 'Biology & Life Sciences', ar: 'الأحياء وعلوم الحياة والأرض' }, duree: '2h', coeff: '4', format: { fr: 'QCM + questions ouvertes', en: 'MCQ + open questions', ar: 'اختيار من متعدد + أسئلة مفتوحة' } },
      { matiere: { fr: 'Physique-Chimie', en: 'Physics-Chemistry', ar: 'الفيزياء والكيمياء' }, duree: '2h', coeff: '3', format: { fr: 'QCM + questions ouvertes', en: 'MCQ + open questions', ar: 'اختيار من متعدد + أسئلة مفتوحة' } },
    ],
    phases: [
      { step: '1', desc: { fr: 'Inscription cursussup.gov.ma', en: 'Registration cursussup.gov.ma', ar: 'التسجيل عبر cursussup.gov.ma' } },
      { step: '2', desc: { fr: 'Concours national écrit', en: 'National written competition', ar: 'المباراة الوطنية الكتابية' } },
      { step: '3', desc: { fr: 'Classement national', en: 'National ranking', ar: 'الترتيب الوطني' } },
      { step: '4', desc: { fr: 'Affectation par faculté et option (médecine/pharmacie/dentaire)', en: 'Assignment by faculty and option (medicine/pharmacy/dentistry)', ar: 'التوجيه حسب الكلية والخيار (طب/صيدلة/أسنان)' } },
    ],
    tips: [
      { fr: 'Biologie et SVT = matière principale, travaillez-la en profondeur', en: 'Biology and Life Sciences = main subject, work on it in depth', ar: 'الأحياء وعلوم الحياة هي المادة الرئيسية، اعمل عليها بعمق' },
      { fr: 'Le numerus clausus rend la compétition très serrée (seuil réel ~16+)', en: 'The numerus clausus makes competition very tight (real threshold ~16+)', ar: 'حصة التأهل تجعل المنافسة محدودة جداً (العتبة الفعلية ~16+)' },
      { fr: 'Choisissez votre faculté en fonction de votre classement — Rabat et Casablanca ont les meilleurs classements', en: 'Choose your faculty based on your ranking — Rabat and Casablanca have the best rankings', ar: 'اختر كليتك حسب ترتيبك — الرباط والدار البيضاء الأفضل تصنيفاً' },
    ],
  },

  cpge: {
    icon: '📐',
    tagline: {
      fr: '29 centres publics — 2 ans pour viser les grandes écoles',
      en: '29 public centres — 2 years to target top schools',
      ar: '29 مركزاً عمومياً — سنتان للوصول إلى المدارس الكبرى',
    },
    color: '#1d4ed8',
    places: '~8 000 places',
    duree: '2 ans (menant au CNC)',
    conditions: [
      { bac: '2BAC SM', note: { fr: 'Seuil ~14/20 (MP/PSI)', en: 'Threshold ~14/20 (MP/PSI)', ar: 'العتبة ~14/20 (MP/PSI)' }, color: '#1d4ed8' },
      { bac: '2BAC PC', note: { fr: 'Seuil ~14/20 (PSI/TSI)', en: 'Threshold ~14/20 (PSI/TSI)', ar: 'العتبة ~14/20 (PSI/TSI)' }, color: '#3b82f6' },
      { bac: '2BAC SE/SGC', note: { fr: 'Filière ECS/ECT', en: 'ECS/ECT track', ar: 'شعبة ECS/ECT' }, color: '#10b981' },
    ],
    schools: [
      { name: 'CPGE Lycée Abou Al Abbas Al Qorchi', city: 'Marrakech', region: 'Marrakech-Safi' },
      { name: 'CPGE Lycée Mohammed V', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'CPGE Lycée Al Khawarizmi', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'CPGE Lycée El Khansaa', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'CPGE Lycée Abou Abdallah Al Azdi', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
      { name: 'CPGE Lycée Hassan II', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
      { name: 'CPGE Lycée Al Idrissi', city: 'Kénitra', region: 'Rabat-Salé-Kénitra' },
      { name: 'CPGE Lycée Moulay Idriss I', city: 'Fès', region: 'Fès-Meknès' },
      { name: 'CPGE Lycée Moulay Ismail', city: 'Meknès', region: 'Fès-Meknès' },
      { name: 'CPGE Lycée Ibn Tofail', city: 'Tanger', region: 'Tanger-Tétouan-Al Hoceima' },
      { name: 'CPGE Lycée Ibn Batouta', city: 'Tétouan', region: 'Tanger-Tétouan-Al Hoceima' },
      { name: 'CPGE Lycée Tariq Ibn Ziad', city: 'Agadir', region: 'Souss-Massa' },
      { name: 'CPGE Lycée Ibn Khaldoun', city: 'Oujda', region: 'Oriental' },
      { name: 'CPGE Lycée Moulay Rachid', city: 'Marrakech', region: 'Marrakech-Safi' },
      { name: 'CPGE Lycée Al Imam Malek', city: 'Casablanca', region: 'Casablanca-Settat' },
    ],
    examStructure: [
      {
        matiere: { fr: 'Dossier scolaire (notes lycée + bac)', en: 'School file (high school + bac grades)', ar: 'الملف الدراسي (درجات الثانوية + الباكالوريا)' },
        duree: '—',
        format: {
          fr: 'Sélection sur dossier uniquement (pas de concours écrit pour entrer en CPGE)',
          en: 'Selection on file only (no written exam to enter CPGE)',
          ar: 'الانتقاء على أساس الملف فقط (لا توجد مباراة كتابية للالتحاق بالتحضيري)',
        },
      },
    ],
    phases: [
      { step: '1', desc: { fr: 'Remplissage dossier cursussup.gov.ma (janv–mars)', en: 'Fill in file cursussup.gov.ma (Jan–Mar)', ar: 'تعبئة الملف عبر cursussup.gov.ma (يناير-مارس)' } },
      { step: '2', desc: { fr: 'Sélection sur dossier scolaire', en: 'Selection on school file', ar: 'الانتقاء على أساس الملف الدراسي' } },
      { step: '3', desc: { fr: 'Affectation CPGE (juin–juillet)', en: 'CPGE assignment (June–July)', ar: 'التوجيه إلى التحضيري (يونيو-يوليوز)' } },
      { step: '4', desc: { fr: '2 ans de prépa', en: '2 years of prep school', ar: 'سنتان من التحضير' } },
      { step: '5', desc: { fr: 'Concours CNC ou autres (mai année 2)', en: 'CNC or other competitions (May, year 2)', ar: 'مباراة CNC أو غيرها (ماي السنة الثانية)' } },
    ],
    tips: [
      { fr: 'Avoir ~14/20 de moyenne en terminale est essentiel', en: 'Having ~14/20 average in final year is essential', ar: 'معدل ~14/20 في السنة النهائية ضروري' },
      { fr: 'Les CPGE de Casablanca et Rabat sont les plus compétitives', en: 'CPGE schools in Casablanca and Rabat are the most competitive', ar: 'مراكز التحضيري في الدار البيضاء والرباط الأكثر تنافسية' },
      { fr: 'Choisissez MP si fort en maths, PSI si fort en physique', en: 'Choose MP if strong in maths, PSI if strong in physics', ar: 'اختر MP إذا كنت قوياً في الرياضيات، PSI إذا كنت قوياً في الفيزياء' },
    ],
  },

  cnc: {
    icon: '🏆',
    tagline: {
      fr: 'Concours national post-CPGE — 25+ grandes écoles',
      en: 'National post-CPGE competition — 25+ top schools',
      ar: 'مباراة وطنية بعد التحضيري — أكثر من 25 مدرسة كبرى',
    },
    color: '#7c3aed',
    places: '4 590 places',
    duree: 'Accès au cycle ingénieur (3 ans restants)',
    conditions: [
      { bac: 'CPGE MP', note: { fr: 'Filières MP, MP*', en: 'Tracks MP, MP*', ar: 'شعبتا MP و MP*' }, color: '#7c3aed' },
      { bac: 'CPGE PSI', note: { fr: 'Filières PSI, PSI*', en: 'Tracks PSI, PSI*', ar: 'شعبتا PSI و PSI*' }, color: '#3b82f6' },
      { bac: 'CPGE TSI', note: { fr: 'Filières TSI', en: 'TSI tracks', ar: 'شعبة TSI' }, color: '#f97316' },
    ],
    schools: [
      { name: 'EMI', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
      { name: 'EHTP', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'ENSIAS', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
      { name: 'ENSMR', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
      { name: 'ENSEM', city: 'Casablanca', region: 'Casablanca-Settat' },
      { name: 'INPT', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
      { name: 'INSEA', city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
      { name: 'ENSA Agadir', city: 'Agadir', region: 'Souss-Massa' },
      { name: 'ENSA Fès', city: 'Fès', region: 'Fès-Meknès' },
      { name: 'ENSA Marrakech', city: 'Marrakech', region: 'Marrakech-Safi' },
      { name: 'ENSA Tanger', city: 'Tanger', region: 'Tanger-Tétouan-Al Hoceima' },
      { name: 'ENSA Oujda', city: 'Oujda', region: 'Oriental' },
      { name: 'ENSA Kénitra', city: 'Kénitra', region: 'Rabat-Salé-Kénitra' },
      { name: 'ENSA Settat', city: 'Settat', region: 'Casablanca-Settat' },
      { name: 'FST Fès', city: 'Fès', region: 'Fès-Meknès' },
    ],
    examStructure: [
      { matiere: { fr: 'Mathématiques', en: 'Mathematics', ar: 'الرياضيات' }, duree: '4h', coeff: '5', format: { fr: 'Épreuves écrites classiques (Maths I + Maths II)', en: 'Classic written exams (Maths I + Maths II)', ar: 'اختبارات كتابية كلاسيكية (رياضيات 1 + رياضيات 2)' } },
      { matiere: { fr: 'Physique', en: 'Physics', ar: 'الفيزياء' }, duree: '4h', coeff: '4', format: { fr: 'Épreuves écrites (Physique I + Physique II)', en: 'Written exams (Physics I + Physics II)', ar: 'اختبارات كتابية (فيزياء 1 + فيزياء 2)' } },
      { matiere: { fr: 'Chimie', en: 'Chemistry', ar: 'الكيمياء' }, duree: '2h', coeff: '2', format: { fr: 'Selon filière', en: 'Depending on track', ar: 'حسب الشعبة' } },
      { matiere: { fr: 'Français & Anglais', en: 'French & English', ar: 'الفرنسية والإنجليزية' }, duree: '2h', coeff: '1', format: { fr: 'Rédaction + compréhension', en: 'Essay + comprehension', ar: 'مقال + فهم' } },
    ],
    phases: [
      { step: '1', desc: { fr: 'Inscription candidature.cnc.ma (fév-mars)', en: 'Registration candidature.cnc.ma (Feb-Mar)', ar: 'التسجيل عبر candidature.cnc.ma (فبراير-مارس)' } },
      { step: '2', desc: { fr: 'Épreuves écrites (mai)', en: 'Written exams (May)', ar: 'الاختبارات الكتابية (ماي)' } },
      { step: '3', desc: { fr: 'Oraux (EMI, EHTP — juillet)', en: 'Oral exams (EMI, EHTP — July)', ar: 'الشفويات (EMI، EHTP — يوليوز)' } },
      { step: '4', desc: { fr: 'Classement et vœux', en: 'Ranking and choices', ar: 'الترتيب والرغبات' } },
      { step: '5', desc: { fr: 'Affectation finale', en: 'Final assignment', ar: 'التوجيه النهائي' } },
    ],
    tips: [
      { fr: 'Le CNC est le concours le plus sélectif du Maroc', en: 'CNC is the most selective competition in Morocco', ar: 'CNC هي المباراة الأكثر انتقاءً في المغرب' },
      { fr: 'Préparez les annales des 5 dernières années', en: 'Prepare past exams from the last 5 years', ar: 'استعد بمواضيع السنوات الخمس الأخيرة' },
      { fr: "L'EMI et l'EHTP organisent des oraux supplémentaires", en: 'EMI and EHTP organize additional oral exams', ar: 'EMI و EHTP يجريان شفويات إضافية' },
      { fr: "Le choix des vœux est crucial — classez dans l'ordre de votre vraie préférence", en: 'The choice of preferences is crucial — rank in order of your true preference', ar: 'اختيار الرغبات حاسم — رتب حسب تفضيلاتك الحقيقية' },
    ],
  },

  emi: {
    icon: '⚡',
    tagline: {
      fr: 'Cycle ingénieur EMI pour titulaires bac+2/+3',
      en: 'EMI engineering cycle for bac+2/+3 holders',
      ar: 'سلك المهندس بـ EMI لحاملي بكالوريا+2/+3',
    },
    color: '#1d4ed8',
    places: '~100 places',
    duree: '3 ans (cycle ingénieur)',
    conditions: [
      { bac: 'DEUG / DEUST Sciences', note: { fr: 'Bac+2 scientifique', en: 'Bac+2 scientific', ar: 'بكالوريا + 2 علمية' }, color: '#1d4ed8' },
      { bac: 'Licence Sciences', note: { fr: 'Bac+3 scientifique', en: 'Bac+3 scientific', ar: 'بكالوريا + 3 علمية' }, color: '#3b82f6' },
      { bac: 'DUT Génie', note: { fr: 'Accepté', en: 'Accepted', ar: 'مقبول' }, color: '#6b7280' },
    ],
    schools: [
      { name: "École Mohammadia d'Ingénieurs (EMI)", city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
    ],
    examStructure: [
      { matiere: { fr: 'Mathématiques', en: 'Mathematics', ar: 'الرياضيات' }, duree: '3h', coeff: '4', format: { fr: 'Questions ouvertes niveau bac+2', en: 'Open questions, bac+2 level', ar: 'أسئلة مفتوحة مستوى بكالوريا+2' } },
      { matiere: { fr: 'Physique', en: 'Physics', ar: 'الفيزياء' }, duree: '3h', coeff: '3', format: { fr: 'Questions ouvertes niveau bac+2', en: 'Open questions, bac+2 level', ar: 'أسئلة مفتوحة مستوى بكالوريا+2' } },
      { matiere: { fr: 'Entretien oral', en: 'Oral interview', ar: 'المقابلة الشفهية' }, duree: '20min', coeff: '2', format: { fr: 'Jury EMI', en: 'EMI jury', ar: 'لجنة EMI' } },
    ],
    phases: [
      { step: '1', desc: { fr: 'Dépôt dossier EMI (www.emi.ac.ma)', en: 'Submit file EMI (www.emi.ac.ma)', ar: 'إيداع الملف بـ EMI (www.emi.ac.ma)' } },
      { step: '2', desc: { fr: 'Épreuves écrites', en: 'Written exams', ar: 'الاختبارات الكتابية' } },
      { step: '3', desc: { fr: 'Oraux', en: 'Oral exams', ar: 'الشفويات' } },
      { step: '4', desc: { fr: "Liste d'admission", en: 'Admission list', ar: 'قائمة القبول' } },
    ],
    tips: [
      { fr: 'La voie parallèle est moins connue mais très valorisée', en: 'The parallel pathway is less known but highly valued', ar: 'المسار الموازي أقل شهرة ولكنه مُقدَّر جداً' },
      { fr: "L'EMI est l'une des meilleures écoles d'ingénieurs du Maroc (fondée 1959)", en: 'EMI is one of the best engineering schools in Morocco (founded 1959)', ar: 'EMI إحدى أفضل مدارس المهندسين بالمغرب (تأسست 1959)' },
    ],
  },

  ehtp: {
    icon: '🏗️',
    tagline: {
      fr: 'Génie Civil, Hydraulique, Travaux Publics — bac+2/+3',
      en: 'Civil Engineering, Hydraulics, Public Works — bac+2/+3',
      ar: 'الهندسة المدنية، الهيدروليك، الأشغال العمومية — بكالوريا+2/+3',
    },
    color: '#0891b2',
    places: '~80 places',
    duree: '3 ans (cycle ingénieur)',
    conditions: [
      { bac: 'DEUG / DEUST Sciences', note: { fr: 'Bac+2 scientifique', en: 'Bac+2 scientific', ar: 'بكالوريا + 2 علمية' }, color: '#0891b2' },
      { bac: 'Licence Sciences', note: { fr: 'Bac+3 scientifique', en: 'Bac+3 scientific', ar: 'بكالوريا + 3 علمية' }, color: '#3b82f6' },
      { bac: 'DUT Génie', note: { fr: 'Accepté', en: 'Accepted', ar: 'مقبول' }, color: '#6b7280' },
    ],
    schools: [
      { name: 'École Hassania des Travaux Publics (EHTP)', city: 'Casablanca', region: 'Casablanca-Settat' },
    ],
    examStructure: [
      { matiere: { fr: 'Mathématiques', en: 'Mathematics', ar: 'الرياضيات' }, duree: '3h', coeff: '4', format: { fr: 'Questions ouvertes', en: 'Open questions', ar: 'أسئلة مفتوحة' } },
      { matiere: { fr: 'Physique', en: 'Physics', ar: 'الفيزياء' }, duree: '3h', coeff: '3', format: { fr: 'Questions ouvertes', en: 'Open questions', ar: 'أسئلة مفتوحة' } },
      { matiere: { fr: 'Entretien oral', en: 'Oral interview', ar: 'المقابلة الشفهية' }, duree: '20min', coeff: '2', format: { fr: 'Jury EHTP', en: 'EHTP jury', ar: 'لجنة EHTP' } },
    ],
    phases: [
      { step: '1', desc: { fr: 'Dépôt dossier EHTP (www.ehtp.ac.ma)', en: 'Submit file EHTP (www.ehtp.ac.ma)', ar: 'إيداع الملف بـ EHTP (www.ehtp.ac.ma)' } },
      { step: '2', desc: { fr: 'Épreuves écrites', en: 'Written exams', ar: 'الاختبارات الكتابية' } },
      { step: '3', desc: { fr: 'Oraux', en: 'Oral exams', ar: 'الشفويات' } },
      { step: '4', desc: { fr: 'Résultats', en: 'Results', ar: 'النتائج' } },
    ],
    tips: [
      { fr: "L'EHTP dépend du Ministère de l'Équipement — débouchés dans les travaux publics", en: 'EHTP is under the Ministry of Public Works — career opportunities in public works', ar: 'EHTP تابعة لوزارة التجهيز — توظيف في الأشغال العمومية' },
      { fr: 'Spécialités : Génie Civil, Hydraulique, Environnement, Infrastructure', en: 'Specializations: Civil Engineering, Hydraulics, Environment, Infrastructure', ar: 'التخصصات: الهندسة المدنية، الهيدروليك، البيئة، البنية التحتية' },
    ],
  },
};

function getConcoursDetail(nom: string): ConcoursDetail | null {
  const n = nom.toLowerCase();
  if (n.includes('bnc') || n.includes('cnc')) return CONCOURS_DETAILS.cnc;
  if (n.includes('bts')) return CONCOURS_DETAILS.bts;
  if (n.includes('ensam')) return CONCOURS_DETAILS.ensam;
  if (n.includes('ensa') && !n.includes('ensam')) return CONCOURS_DETAILS.ensa;
  if (n.includes('encg') || n.includes('tafem')) return CONCOURS_DETAILS.encg;
  if (n.includes('iscae')) return CONCOURS_DETAILS.iscae;
  if (n.includes('médecine') || n.includes('medecine') || n.includes('pharmacie')) return CONCOURS_DETAILS.medecine;
  if (n.includes('cpge')) return CONCOURS_DETAILS.cpge;
  if (n.includes('emi')) return CONCOURS_DETAILS.emi;
  if (n.includes('ehtp')) return CONCOURS_DETAILS.ehtp;
  return null;
}

// ---------------------------------------------------------------------------
// Popup i18n labels
// ---------------------------------------------------------------------------
const POPUP_LABELS = {
  fr: {
    tabs: { schools: 'Écoles', exam: 'Épreuves', conditions: 'Conditions', tips: 'Conseils' },
    accessConditions: "Conditions d'accès",
    phases: 'Phases du concours',
    noDetails: 'Détails non disponibles pour ce concours.',
    noLink: 'Aucun lien officiel disponible',
  },
  en: {
    tabs: { schools: 'Schools', exam: 'Exams', conditions: 'Requirements', tips: 'Tips' },
    accessConditions: 'Access Requirements',
    phases: 'Competition Phases',
    noDetails: 'Details not available for this competition.',
    noLink: 'No official link available',
  },
  ar: {
    tabs: { schools: 'المدارس', exam: 'الاختبارات', conditions: 'الشروط', tips: 'نصائح' },
    accessConditions: 'شروط الالتحاق',
    phases: 'مراحل المباراة',
    noDetails: 'التفاصيل غير متوفرة لهذه المباراة.',
    noLink: 'لا يوجد رابط رسمي',
  },
};

// ---------------------------------------------------------------------------
// ConcoursDetailPopup
// ---------------------------------------------------------------------------
type PopupTab = 'schools' | 'exam' | 'conditions' | 'tips';

function ConcoursDetailPopup({ concours, onClose }: { concours: Concours; onClose: () => void }) {
  const { language } = useAuth();
  const lang = (language === 'ar' || language === 'en') ? language : 'fr';
  const lbl = POPUP_LABELS[lang];

  const [activeTab, setActiveTab] = useState<PopupTab>('schools');
  const detail = getConcoursDetail(concours.nom);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const accentColor = detail?.color || '#7c3aed';

  const schoolsByRegion = detail
    ? Array.from(new Set(detail.schools.map((s) => s.region))).map((region) => ({
        region,
        schools: detail.schools.filter((s) => s.region === region),
      }))
    : [];

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
  };
  const modalStyle: React.CSSProperties = {
    background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '680px',
    maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(15,12,41,0.18)', border: '1px solid rgba(139,92,246,0.12)',
  };
  const headerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${accentColor}dd, ${accentColor}88)`,
    padding: '24px', position: 'relative',
  };
  const closeBtnStyle: React.CSSProperties = {
    position: 'absolute', top: '14px', right: lang === 'ar' ? 'auto' : '16px',
    left: lang === 'ar' ? '16px' : 'auto',
    background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
    width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
  };
  const pillStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    background: 'rgba(255,255,255,0.18)', borderRadius: '20px',
    padding: '4px 10px', fontSize: '12px', color: '#fff', fontWeight: 500,
  };
  const tabBarStyle: React.CSSProperties = {
    display: 'flex', borderBottom: '1px solid rgba(139,92,246,0.1)',
    background: '#f8fafc', flexShrink: 0,
  };
  const getTabStyle = (tab: PopupTab): React.CSSProperties => ({
    flex: 1, padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: activeTab === tab ? 700 : 500,
    color: activeTab === tab ? accentColor : '#64748b',
    borderBottom: activeTab === tab ? `2px solid ${accentColor}` : '2px solid transparent',
    transition: 'all 0.15s',
  });
  const contentStyle: React.CSSProperties = { overflowY: 'auto', flex: 1, padding: '20px' };
  const regionHeaderStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '8px', marginTop: '16px',
  };
  const schoolChipStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    background: '#f8fafc', border: '1px solid rgba(139,92,246,0.12)',
    borderRadius: '8px', padding: '5px 10px', fontSize: '13px', color: '#1e293b', margin: '3px',
  };
  const examCardStyle: React.CSSProperties = {
    background: '#f8fafc', border: '1px solid rgba(139,92,246,0.1)',
    borderRadius: '10px', padding: '14px 16px', marginBottom: '10px',
  };
  const conditionChipBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: '10px', padding: '10px 14px', marginBottom: '8px', fontSize: '14px',
  };
  const phaseStyle: React.CSSProperties = { display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' };
  const phaseStepStyle: React.CSSProperties = {
    flexShrink: 0, width: '26px', height: '26px', borderRadius: '50%',
    background: accentColor, color: '#fff', fontSize: '12px', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const tipRowStyle: React.CSSProperties = {
    display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px',
    background: '#f5f3ff', borderRadius: '8px', padding: '10px 14px',
    border: '1px solid rgba(139,92,246,0.1)',
  };
  const footerStyle: React.CSSProperties = {
    padding: '14px 20px', borderTop: '1px solid rgba(139,92,246,0.1)',
    background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', flexShrink: 0,
  };
  const linkBtnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: accentColor, color: '#fff', border: 'none', borderRadius: '8px',
    padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
  };

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <button style={closeBtnStyle} onClick={onClose} aria-label="Fermer">✕</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '36px', lineHeight: 1 }}>{detail?.icon || '🏆'}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#fff' }}>{concours.nom}</h2>
              {detail && (
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                  {ml(detail.tagline, lang)}
                </p>
              )}
            </div>
          </div>
          {detail && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              <span style={pillStyle}>🎓 {detail.places}</span>
              <span style={pillStyle}>📅 {detail.duree}</span>
              {concours.seuil && <span style={pillStyle}>📊 {concours.seuil}/20</span>}
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div style={tabBarStyle}>
          {(Object.keys(lbl.tabs) as PopupTab[]).map((tab) => (
            <button key={tab} style={getTabStyle(tab)} onClick={() => setActiveTab(tab)}>
              {lbl.tabs[tab]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {!detail ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>{lbl.noDetails}</p>
          ) : (
            <>
              {/* Schools tab */}
              {activeTab === 'schools' && (
                <div>
                  {schoolsByRegion.map(({ region, schools }) => (
                    <div key={region}>
                      <p style={regionHeaderStyle}>{region}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '4px' }}>
                        {schools.map((s) => (
                          <span key={s.name + s.city} style={schoolChipStyle}>
                            📍 {s.name}
                            {s.city !== region && (
                              <span style={{ color: '#94a3b8', fontSize: '11px' }}> — {s.city}</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Exams tab */}
              {activeTab === 'exam' && (
                <div>
                  {detail.examStructure.map((e, i) => (
                    <div key={i} style={examCardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ color: '#0f0c29', fontSize: '14px' }}>{ml(e.matiere, lang)}</strong>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {e.duree !== '—' && (
                            <span style={{ background: '#e2e8f0', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', color: '#475569' }}>
                              ⏱ {e.duree}
                            </span>
                          )}
                          {e.coeff && e.coeff !== '—' && (
                            <span style={{ background: `${accentColor}33`, borderRadius: '6px', padding: '2px 8px', fontSize: '12px', color: accentColor, fontWeight: 600 }}>
                              ×{e.coeff}
                            </span>
                          )}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>{ml(e.format, lang)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Conditions tab */}
              {activeTab === 'conditions' && (
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8', marginBottom: '10px' }}>
                    {lbl.accessConditions}
                  </p>
                  {detail.conditions.map((cond, i) => (
                    <div key={i} style={{ ...conditionChipBase, background: `${cond.color}15`, border: `1px solid ${cond.color}40` }}>
                      <span style={{ color: '#1e293b', fontWeight: 500 }}>{ml(cond.bac, lang)}</span>
                      <span style={{ color: cond.color, fontWeight: 700, fontSize: '13px', background: `${cond.color}22`, borderRadius: '6px', padding: '3px 8px' }}>
                        {ml(cond.note, lang)}
                      </span>
                    </div>
                  ))}

                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8', marginTop: '20px', marginBottom: '10px' }}>
                    {lbl.phases}
                  </p>
                  {detail.phases.map((phase, i) => (
                    <div key={i} style={phaseStyle}>
                      <div style={phaseStepStyle}>{phase.step}</div>
                      <p style={{ margin: 0, color: '#334155', fontSize: '13px', paddingTop: '4px', lineHeight: 1.4 }}>
                        {ml(phase.desc, lang)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips tab */}
              {activeTab === 'tips' && (
                <div>
                  {detail.tips.map((tip, i) => (
                    <div key={i} style={tipRowStyle}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
                      <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: 1.5 }}>
                        {ml(tip, lang)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          {concours.lien ? (
            <a href={concours.lien} target="_blank" rel="noopener noreferrer" style={linkBtnStyle}>
              🔗 {lang === 'ar' ? 'الرابط الرسمي' : lang === 'en' ? 'Official link' : 'Lien officiel'}
            </a>
          ) : (
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>{lbl.noLink}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ConcoursPage
// ---------------------------------------------------------------------------
function ConcoursPage({ initialTab = 'concours', userNiveau }: { initialTab?: ConcoursTab; userNiveau?: string }) {
  const { language } = useAuth();
  const t = useTranslation();
  const [concours, setConcours] = useState<Concours[]>([]);
  const [annales, setAnnales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ConcoursTab>(initialTab);
  const [now, setNow] = useState(new Date());
  const [filterNiveau, setFilterNiveau] = useState(userNiveau || '2bac');
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'urgent' | 'month'>('all');
  const [selectedConcours, setSelectedConcours] = useState<Concours | null>(null);

  const copy = {
    fr: {
      heroTitle: 'Concours à suivre',
      heroText: 'Dates, seuils et liens utiles pour garder les priorités claires.',
      search: 'Rechercher un concours...',
      searchLabel: 'Rechercher',
      all: 'Tous', urgent: 'Urgents', month: 'Ce mois', next: 'Prochain',
      total: 'Concours', avgThreshold: 'Seuil moyen',
      noMatch: 'Aucun concours ne correspond à vos filtres',
      deadline: 'Délai', officialLink: 'Lien officiel', details: 'Voir détails',
      annalesTitle: 'Banque des annales', annalesText: 'Filtres rapides pour trouver les sujets utiles.',
      level: 'Niveau', type: 'Type',
      noAnnalesMatch: 'Aucune annale ne correspond à vos critères',
      allLevels: 'Tous les niveaux', level1bac: '1ère Bac', level2bac: '2ème Bac',
      levelTronc: 'Tronc Commun', levelLicence: 'Licence', levelMaster: 'Master',
      allTypes: 'Tous les types', typeNational: 'Examen National', typeWhite: 'White Test',
      typeBlank: 'Examen Blanc', typeExercice: 'Exercice Corrigé',
    },
    en: {
      heroTitle: 'Competitions to track',
      heroText: 'Dates, thresholds and useful links in one clean view.',
      search: 'Search a competition...', searchLabel: 'Search',
      all: 'All', urgent: 'Urgent', month: 'This month', next: 'Next',
      total: 'Competitions', avgThreshold: 'Avg threshold',
      noMatch: 'No competition matches your filters',
      deadline: 'Deadline', officialLink: 'Official link', details: 'View details',
      annalesTitle: 'Past exam bank', annalesText: 'Quick filters to find the right papers.',
      level: 'Level', type: 'Type',
      noAnnalesMatch: 'No past exam matches your filters',
      allLevels: 'All levels', level1bac: '1st Bac', level2bac: '2nd Bac',
      levelTronc: 'Common Core', levelLicence: 'Bachelor', levelMaster: 'Master',
      allTypes: 'All types', typeNational: 'National Exam', typeWhite: 'White Test',
      typeBlank: 'Mock Exam', typeExercice: 'Corrected Exercise',
    },
    ar: {
      heroTitle: 'المباريات المتتبعة',
      heroText: 'التواريخ والعتبات والروابط في مكان واحد.',
      search: 'ابحث عن مباراة...', searchLabel: 'بحث',
      all: 'الكل', urgent: 'عاجل', month: 'هذا الشهر', next: 'القادم',
      total: 'مباراة', avgThreshold: 'متوسط العتبة',
      noMatch: 'لا توجد مباريات تطابق بحثك',
      deadline: 'الموعد', officialLink: 'الرابط الرسمي', details: 'عرض التفاصيل',
      annalesTitle: 'بنك الامتحانات السابقة', annalesText: 'فلاتر سريعة للعثور على المواضيع المناسبة.',
      level: 'المستوى', type: 'النوع',
      noAnnalesMatch: 'لا توجد امتحانات تطابق معاييرك',
      allLevels: 'جميع المستويات', level1bac: 'الأولى باك', level2bac: 'الثانية باك',
      levelTronc: 'الجذع المشترك', levelLicence: 'الإجازة', levelMaster: 'الماستر',
      allTypes: 'جميع الأنواع', typeNational: 'امتحان وطني', typeWhite: 'اختبار أبيض',
      typeBlank: 'امتحان تجريبي', typeExercice: 'تمرين مصحح',
    },
  }[language] || {
    heroTitle: 'Concours à suivre',
    heroText: 'Dates, seuils et liens utiles pour garder les priorités claires.',
    search: 'Rechercher un concours...', searchLabel: 'Rechercher',
    all: 'Tous', urgent: 'Urgents', month: 'Ce mois', next: 'Prochain',
    total: 'Concours', avgThreshold: 'Seuil moyen',
    noMatch: 'Aucun concours ne correspond à vos filtres',
    deadline: 'Délai', officialLink: 'Lien officiel', details: 'Voir détails',
    annalesTitle: 'Banque des annales', annalesText: 'Filtres rapides pour trouver les sujets utiles.',
    level: 'Niveau', type: 'Type',
    noAnnalesMatch: 'Aucune annale ne correspond à vos critères',
    allLevels: 'Tous les niveaux', level1bac: '1ère Bac', level2bac: '2ème Bac',
    levelTronc: 'Tronc Commun', levelLicence: 'Licence', levelMaster: 'Master',
    allTypes: 'Tous les types', typeNational: 'Examen National', typeWhite: 'White Test',
    typeBlank: 'Examen Blanc', typeExercice: 'Exercice Corrigé',
  };

  const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', ar: 'ar-SA' };
  const locale = localeMap[language] || 'fr-FR';

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return t.dashboard.concours.dateNotSpecified;
    return parsed.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  useEffect(() => { setTab(initialTab); }, [initialTab]);

  useEffect(() => {
    Promise.all([apiFetch('/concours'), apiFetch('/annales')])
      .then(([c, a]) => {
        setConcours(Array.isArray(c) ? c : []);
        setAnnales(Array.isArray(a) ? a : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const getCountdown = (dateStr?: string): Countdown => {
    if (!dateStr) return { label: t.dashboard.concours.dateNotSpecified, tone: 'muted', urgent: false, days: null };
    const target = new Date(dateStr);
    if (Number.isNaN(target.getTime())) return { label: t.dashboard.concours.dateNotSpecified, tone: 'muted', urgent: false, days: null };
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return { label: t.dashboard.concours.passed, tone: 'muted', urgent: false, days: 0 };
    const days = Math.ceil(diff / 86400000);
    if (days <= 7) return { label: t.dashboard.concours.daysRemaining.replace('{days}', String(days)), tone: 'red', urgent: true, days };
    if (days <= 30) return { label: t.dashboard.concours.days.replace('{days}', String(days)), tone: 'amber', urgent: false, days };
    if (days <= 90) return { label: t.dashboard.concours.days.replace('{days}', String(days)), tone: 'purple', urgent: false, days };
    return { label: t.dashboard.concours.months.replace('{months}', String(Math.floor(days / 30))), tone: 'green', urgent: false, days };
  };

  const concoursWithCountdown = useMemo(() => (
    concours.map(item => ({ item, countdown: getCountdown(item.dateConcours) }))
  ), [concours, now, language]);

  const filteredConcours = useMemo(() => {
    const term = search.trim().toLowerCase();
    return concoursWithCountdown.filter(({ item, countdown }) => {
      const school = ((item as any).school || '').toLowerCase();
      const matchesSearch = !term || item.nom.toLowerCase().includes(term) || school.includes(term);
      const matchesDeadline =
        deadlineFilter === 'all' ||
        (deadlineFilter === 'urgent' && countdown.days !== null && countdown.days > 0 && countdown.days <= 7) ||
        (deadlineFilter === 'month' && countdown.days !== null && countdown.days > 0 && countdown.days <= 30);
      return matchesSearch && matchesDeadline;
    });
  }, [concoursWithCountdown, deadlineFilter, search]);

  const concoursStats = useMemo(() => {
    const upcoming = concoursWithCountdown
      .filter(({ countdown }) => countdown.days !== null && countdown.days > 0)
      .sort((a, b) => (a.countdown.days || 9999) - (b.countdown.days || 9999));
    const avg = concours.length
      ? (concours.reduce((sum, item) => sum + (Number(item.seuil) || 0), 0) / concours.length).toFixed(1)
      : '0';
    return {
      total: concours.length,
      urgent: concoursWithCountdown.filter(({ countdown }) => countdown.days !== null && countdown.days > 0 && countdown.days <= 7).length,
      next: upcoming[0]?.countdown.label || '-',
      avg,
    };
  }, [concoursWithCountdown, concours]);

  const filteredAnnales = useMemo(() => (
    annales.filter((a: any) => {
      const niveauMatch = !filterNiveau || a.niveau === filterNiveau;
      const typeMatch = !filterType || a.type === filterType;
      return niveauMatch && typeMatch;
    })
  ), [annales, filterNiveau, filterType]);

  if (loading) {
    return (
      <div className="concours-page">
        <div className="concours-hero dash-skeleton" />
        <div className="concours-grid">
          {[1, 2, 3, 4].map(i => <div key={i} className="dash-skeleton concours-card-skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="concours-page">
      {tab === 'concours' ? (
        <>
          <section className="concours-hero">
            <div>
              <span className="concours-kicker">{t.dashboard.menu.concours}</span>
              <h2>{copy.heroTitle}</h2>
              <p>{copy.heroText}</p>
            </div>
            <div className="concours-hero-stats" aria-label="Concours statistics">
              <div><strong>{concoursStats.total}</strong><span>{copy.total}</span></div>
              <div><strong>{concoursStats.urgent}</strong><span>{copy.urgent}</span></div>
              <div><strong>{concoursStats.avg}/20</strong><span>{copy.avgThreshold}</span></div>
            </div>
          </section>

          <div className="concours-toolbar">
            <label className="concours-search">
              <span>{copy.searchLabel}</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={copy.search} />
            </label>
            <div className="concours-filter-group" aria-label="Deadline filters">
              {(['all', 'urgent', 'month'] as const).map(value => (
                <button key={value} type="button" className={deadlineFilter === value ? 'active' : ''} onClick={() => setDeadlineFilter(value)}>
                  {value === 'all' ? copy.all : value === 'urgent' ? copy.urgent : copy.month}
                </button>
              ))}
            </div>
            <div className="concours-next-pill">
              <span>{copy.next}</span>
              <strong>{concoursStats.next}</strong>
            </div>
          </div>

          {concours.length === 0 ? (
            <div className="dash-empty"><div className="dash-empty-icon">🏆</div><p className="dash-empty-title">{t.dashboard.concours.competitionsUnavailable}</p></div>
          ) : filteredConcours.length === 0 ? (
            <div className="dash-empty"><div className="dash-empty-icon">⌕</div><p className="dash-empty-title">{copy.noMatch}</p></div>
          ) : (
            <div className="concours-grid">
              {filteredConcours.map(({ item: c, countdown }) => (
                <article key={c.id} className={`concours-card ${countdown.urgent ? 'is-urgent' : ''}`} onClick={() => setSelectedConcours(c)} style={{ cursor: 'pointer' }}>
                  <div className="concours-card-top">
                    <div className="concours-icon">{getConcoursDetail(c.nom)?.icon || '🏆'}</div>
                    <span className={`concours-countdown ${countdown.tone}`}>{countdown.label}</span>
                  </div>
                  <h3>{c.nom}</h3>
                  {(c as any).school && <p className="concours-school">{(c as any).school}</p>}
                  <div className="concours-meta">
                    <div>
                      <span>{copy.deadline}</span>
                      <strong>{c.dateConcours ? formatDate(c.dateConcours) : t.dashboard.concours.dateNotSpecified}</strong>
                    </div>
                    <div>
                      <span>{t.dashboard.concours.threshold}</span>
                      <strong>{c.seuil}/20</strong>
                    </div>
                  </div>
                  {c.description && <p className="concours-description">{c.description}</p>}
                  <div className="concours-card-footer">
                    {c.lien ? (
                      <a href={c.lien} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        {copy.officialLink}
                      </a>
                    ) : null}
                    <button type="button" className="dash-btn dash-btn-ghost" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={(e) => { e.stopPropagation(); setSelectedConcours(c); }}>
                      {copy.details}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {selectedConcours && (
            <ConcoursDetailPopup concours={selectedConcours} onClose={() => setSelectedConcours(null)} />
          )}
        </>
      ) : (
        <>
          <section className="annales-panel">
            <div>
              <span className="concours-kicker">{t.dashboard.menu.annales}</span>
              <h2>{copy.annalesTitle}</h2>
              <p>{copy.annalesText}</p>
            </div>
            <div className="annales-filters">
              <label>
                <span>{copy.level}</span>
                <select value={filterNiveau} onChange={(e) => setFilterNiveau(e.target.value)}>
                  <option value="">{copy.allLevels}</option>
                  <option value="1bac">{copy.level1bac}</option>
                  <option value="2bac">{copy.level2bac}</option>
                  <option value="tronc commun">{copy.levelTronc}</option>
                  <option value="licence">{copy.levelLicence}</option>
                  <option value="master">{copy.levelMaster}</option>
                </select>
              </label>
              <label>
                <span>{copy.type}</span>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="">{copy.allTypes}</option>
                  <option value="examen national">{copy.typeNational}</option>
                  <option value="white test">{copy.typeWhite}</option>
                  <option value="examen blanc">{copy.typeBlank}</option>
                  <option value="exercice corrigé">{copy.typeExercice}</option>
                </select>
              </label>
            </div>
          </section>

          {annales.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">📚</div>
              <p className="dash-empty-title">{t.dashboard.concours.examsUnavailable}</p>
              <p className="dash-empty-desc">{t.dashboard.concours.examsSoon}</p>
            </div>
          ) : (
            <>
              <div className="annales-grid">
                {filteredAnnales.map((a: any) => (
                  <article key={a.id} className="annale-card">
                    <div className="annale-icon">PDF</div>
                    <div className="annale-content">
                      <h3>{a.matiere ? `${a.matiere} - ${a.annee || t.dashboard.concours.unknownYear}` : a.nom || t.dashboard.concours.exam}</h3>
                      <div className="annale-tags">
                        <span>{a.niveau || '2bac'}</span>
                        <span>{a.type || 'examen national'}</span>
                      </div>
                    </div>
                    {a.lien ? (
                      <div className="annale-actions">
                        <a href={a.lien} target="_blank" rel="noopener noreferrer" className="annale-btn annale-btn-open">
                          {t.dashboard.concours.openPdf || 'Ouvrir'}
                        </a>
                        <a href={a.lien} download rel="noopener noreferrer" className="annale-btn annale-btn-download">
                          {t.dashboard.concours.downloadPdf || 'Télécharger'}
                        </a>
                      </div>
                    ) : (
                      <span className="annale-unavailable">{t.dashboard.concours.fileUnavailable}</span>
                    )}
                  </article>
                ))}
              </div>
              {filteredAnnales.length === 0 && (
                <div className="dash-empty"><p className="dash-empty-title">{copy.noAnnalesMatch}</p></div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ConcoursPage;
