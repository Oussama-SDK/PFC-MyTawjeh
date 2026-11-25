import { useState } from 'react';
import { useTranslation } from '../i18n';
import { useAuth } from '../AuthContext';
import type { AvantBacCareerStage, Lang } from '../types';

// ══════════════════════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════════════════════

type PostBacStream = 'sm' | 'pc' | 'svt' | 'eco' | 'lettres' | 'tech';

interface PostBacSchool {
  id: string;
  name: string;
  category: string;
  duration: string;
  admission: string;
  details: string;
  careers: string[];
  streams: PostBacStream[];
  url?: string;
}

const SCHOOL_URLS: Record<string, string> = {
  // Confirmed working
  encg:        'https://www.encgs.ac.ma',
  iscae:       'https://www.groupeiscae.ma',
  enset:       'https://www.enset-mohammedia.ac.ma',
  ensa:        'https://ensat.ac.ma',
  ensam:       'https://ensam.ac.ma',
  cpge:        'https://www.cpge.ac.ma',
  medecine:    'https://www.fmpr.ac.ma',
  med:         'https://www.fmpr.ac.ma',
  'fst-fs':    'https://www.fst.ac.ma',
  fsfst:       'https://www.fst.ac.ma',
  fsjes:       'https://www.fsjes-umi.ac.ma',
  flsh:        'https://fr.wikipedia.org/wiki/Facult%C3%A9_des_lettres_et_des_sciences_humaines_de_Rabat',
  est:         'https://fr.wikipedia.org/wiki/%C3%89coles_sup%C3%A9rieures_de_technologie_au_Maroc',
  ensaad:      'https://fr.wikipedia.org/wiki/Art_et_design_au_Maroc',
  artdesign:   'https://fr.wikipedia.org/wiki/Art_et_design_au_Maroc',
  architecture:'https://fr.wikipedia.org/wiki/%C3%89cole_nationale_d%27architecture_(Maroc)',
  archi:       'https://fr.wikipedia.org/wiki/%C3%89cole_nationale_d%27architecture_(Maroc)',
  aviation:    'https://fr.wikipedia.org/wiki/Royal_Air_Maroc_Academy',
  paramedical: 'https://www.sante.gov.ma',
  paramed:     'https://www.sante.gov.ma',
  ifcs:        'https://www.sante.gov.ma',
  tourisme:    'https://www.ofppt.ma',
  tour:        'https://www.ofppt.ma',
  journalisme: 'https://www.isic.ac.ma',
  media:       'https://www.isic.ac.ma',
  ofppt:       'https://www.ofppt.ma',
  isitt:       'https://fr.wikipedia.org/wiki/Institut_sup%C3%A9rieur_international_du_tourisme_de_Tanger',
};

// ── POST_BAC_SCHOOLS (extracted from App.tsx) ─────────────────────────────────
const POST_BAC_SCHOOLS: Record<string, PostBacSchool[]> = {
  fr: [
    { id: 'encg', name: 'ENCG (Écoles Nationales de Commerce et Gestion)', category: 'Commerce & Gestion', duration: '5 ans', admission: 'Concours via TAFEM après Bac', details: 'Formation en management, finance, marketing et audit.', careers: ['Cadre marketing', 'Contrôleur de gestion', 'Business analyst'], streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },
    { id: 'iscae', name: 'ISCAE', category: 'Commerce Premium', duration: '5 ans', admission: 'Concours national très compétitif', details: 'Grande école de référence en commerce et management.', careers: ['Consultant', 'Manager', 'Auditeur'], streams: ['eco', 'sm', 'pc', 'svt'] },
    { id: 'enset', name: 'ENSET', category: 'Technologie & Enseignement technique', duration: '3 à 5 ans', admission: 'Concours/sélection selon filière', details: 'Formations en ingénierie pédagogique et techniques industrielles.', careers: ['Enseignant technique', 'Cadre industriel', 'Formateur'], streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'ensa', name: 'ENSA (Écoles Nationales des Sciences Appliquées)', category: 'Ingénierie', duration: '5 ans', admission: 'Concours national après Bac scientifique', details: 'Cycle préparatoire intégré puis spécialisation.', careers: ['Ingénieur logiciel', 'Ingénieur industriel', 'Chef de projet'], streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'ensam', name: 'ENSAM (Arts et Métiers)', category: 'Ingénierie industrielle', duration: '5 ans', admission: 'Concours après Bac scientifique/technique', details: 'Spécialisée en génie mécanique, industriel et productique.', careers: ['Ingénieur mécanique', 'Ingénieur production', 'Responsable maintenance'], streams: ['sm', 'pc', 'tech'] },
    { id: 'cpge', name: 'CPGE (Classes Préparatoires)', category: 'Prépa Grandes Écoles', duration: '2 ans', admission: 'Sélection sur dossier', details: "Voie d'excellence vers grandes écoles ingénieurs/commerce.", careers: ['Accès grandes écoles', 'Ingénierie', 'Management'], streams: ['sm', 'pc', 'svt', 'eco'] },
    { id: 'medecine', name: 'Faculté de Médecine, Pharmacie, Dentaire', category: 'Santé', duration: '6 à 7 ans+', admission: 'Concours très sélectif', details: 'Parcours long pour étudiants très forts en sciences.', careers: ['Médecin', 'Pharmacien', 'Chirurgien-dentiste'], streams: ['svt', 'pc', 'sm'] },
    { id: 'fst-fs', name: 'Facultés des Sciences / FST', category: 'Université scientifique', duration: '3 ans (Licence)', admission: 'Inscription post-bac', details: 'Licence en maths, physique, chimie, biologie, informatique.', careers: ['Recherche', 'Ingénierie', 'Data'], streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'fsjes', name: 'FSJES (Droit, Éco, Gestion)', category: 'Université droit & économie', duration: '3 ans (Licence)', admission: 'Inscription post-bac', details: 'Formations en droit privé/public, économie et gestion.', careers: ['Juriste', 'Comptable', 'Cadre administratif'], streams: ['eco', 'lettres', 'sm', 'pc'] },
    { id: 'flsh', name: 'FLSH (Lettres et Sciences Humaines)', category: 'Université lettres', duration: '3 ans (Licence)', admission: 'Inscription post-bac', details: 'Langues, histoire, géographie, sociologie, philosophie.', careers: ['Enseignement', 'Communication', 'Fonction publique'], streams: ['lettres'] },
    { id: 'est', name: 'EST (Écoles Supérieures de Technologie)', category: 'Technologie', duration: '2 à 3 ans', admission: 'Sélection sur dossier', details: 'Formations professionnalisantes en IT, réseaux, génie élec., gestion.', careers: ['Développeur junior', 'Technicien réseau', 'Assistant manager'], streams: ['sm', 'pc', 'svt', 'eco', 'tech'] },
    { id: 'ensaad', name: "Écoles d'Art & Design", category: 'Art, Design, Création', duration: '3 à 5 ans', admission: 'Dossier + concours/entretien', details: 'Design graphique, animation, arts visuels, UX/UI.', careers: ['Designer', 'Directeur artistique', 'Illustrateur'], streams: ['lettres', 'tech', 'eco'] },
    { id: 'architecture', name: "Écoles d'Architecture", category: 'Architecture & Urbanisme', duration: '6 ans', admission: 'Concours + parfois dessin', details: 'Conception architecturale et techniques du bâtiment.', careers: ['Architecte', 'Urbaniste', "Designer d'espace"], streams: ['sm', 'pc', 'tech'] },
    { id: 'aviation', name: "Écoles d'Aviation / Pilotage", category: 'Aéronautique', duration: '2 à 5 ans', admission: 'Tests + niveau scientifique + anglais', details: 'Formation de pilotes et techniciens aéronautiques.', careers: ['Pilote', 'Technicien avionique', 'Opérations aériennes'], streams: ['sm', 'pc'] },
    { id: 'paramedical', name: 'Instituts Paramédicaux / Kiné', category: 'Paramédical', duration: '3 à 5 ans', admission: 'Concours ou sélection', details: 'Soins infirmiers, kiné, labo, imagerie médicale.', careers: ['Infirmier(ère)', 'Kinésithérapeute', 'Technicien imagerie'], streams: ['svt', 'pc', 'sm'] },
    { id: 'ifcs', name: 'IFCS (Infirmiers et Cadres de Santé)', category: 'Santé publique', duration: '3 ans', admission: 'Concours après Bac', details: 'Instituts publics de formation en soins infirmiers.', careers: ['Infirmier polyvalent', 'Sage-femme', 'Urgences'], streams: ['svt', 'pc', 'sm'] },
    { id: 'tourisme', name: "Écoles de Tourisme & Hôtellerie", category: 'Tourisme', duration: '2 à 4 ans', admission: 'Dossier/concours', details: 'Formations hôtellerie, restauration, événementiel.', careers: ['Manager hôtelier', 'Agent de voyage', 'Responsable événementiel'], streams: ['eco', 'lettres', 'tech'] },
    { id: 'journalisme', name: 'Écoles de Journalisme & Média', category: 'Média & Communication', duration: '3 à 5 ans', admission: 'Dossier, concours ou entretien', details: 'Rédaction, audiovisuel, communication digitale.', careers: ['Journaliste', 'Chargé de communication', 'Content creator'], streams: ['lettres', 'eco'] },
    { id: 'ofppt', name: 'OFPPT / Instituts techniques', category: 'Formation Professionnelle', duration: '2 à 3 ans', admission: 'Dossier + conditions selon spécialité', details: 'Voie pratique avec insertion rapide dans plusieurs métiers.', careers: ['Technicien spécialisé', 'Support IT', 'Technicien maintenance'], streams: ['sm', 'pc', 'svt', 'eco', 'lettres', 'tech'] },
    { id: 'isitt', name: 'ISITT (Tourisme International Tanger)', category: 'Tourisme international', duration: '3 à 5 ans', admission: 'Concours + langues', details: 'Spécialisation haut niveau en management touristique.', careers: ['Manager tourisme', 'Chef produit touristique', 'Consultant travel'], streams: ['eco', 'lettres'] },
  ],
  ar: [
    { id: 'encg', name: 'المدرسة الوطنية للتجارة والتسيير ENCG', category: 'التجارة والتسيير', duration: '5 سنوات', admission: 'ولوج عبر مباراة TAFEM بعد الباك', details: 'تكوين قوي في التسويق والمالية والتدبير.', careers: ['التسويق', 'المالية', 'تحليل الأعمال'], streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },
    { id: 'iscae', name: 'ISCAE', category: 'تجارة وتسيير عالي', duration: '5 سنوات', admission: 'مباراة وطنية تنافسية', details: 'مؤسسة مرجعية في التسيير والمالية.', careers: ['استشاري', 'مدير', 'مدقق مالي'], streams: ['eco', 'sm', 'pc', 'svt'] },
    { id: 'enset', name: 'ENSET', category: 'التكنولوجيا والتعليم التقني', duration: '3 إلى 5 سنوات', admission: 'مباراة/انتقاء حسب المسلك', details: 'تكوينات في الهندسة التقنية والتعليم المهني.', careers: ['أستاذ تقني', 'إطار صناعي', 'مكوّن'], streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'ensa', name: 'المدارس الوطنية للعلوم التطبيقية ENSA', category: 'الهندسة', duration: '5 سنوات', admission: 'مباراة وطنية بعد الباك العلمي', details: 'مسار مدمج مع تخصصات هندسية متعددة.', careers: ['مهندس معلوميات', 'مهندس صناعي', 'تدبير المشاريع'], streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'ensam', name: 'ENSAM (الفنون والمهن)', category: 'الهندسة الصناعية', duration: '5 سنوات', admission: 'مباراة بعد الباك العلمي/التقني', details: 'تخصص قوي في الهندسة الميكانيكية والصناعية.', careers: ['مهندس ميكانيك', 'مهندس إنتاج', 'مسؤول صيانة'], streams: ['sm', 'pc', 'tech'] },
    { id: 'cpge', name: 'الأقسام التحضيرية CPGE', category: 'التحضير للمدارس الكبرى', duration: 'سنتان', admission: 'انتقاء حسب المعدل والملف', details: 'تكوين مكثف للتحضير لمباريات المدارس العليا.', careers: ['ولوج المدارس العليا', 'الهندسة', 'التسيير'], streams: ['sm', 'pc', 'svt', 'eco'] },
    { id: 'medecine', name: 'كليات الطب والصيدلة وطب الأسنان', category: 'الصحة', duration: '6 إلى 7 سنوات+', admission: 'مباراة انتقائية جداً', details: 'مسار طويل يتطلب مستوى قوي في العلوم.', careers: ['طبيب', 'صيدلي', 'طبيب أسنان'], streams: ['svt', 'pc', 'sm'] },
    { id: 'fsfst', name: 'كلية العلوم / كلية العلوم والتقنيات', category: 'جامعة علمية', duration: '3 سنوات (إجازة)', admission: 'تسجيل بعد الباك', details: 'تخصصات علمية متعددة في الرياضيات والفيزياء والمعلوميات.', careers: ['بحث علمي', 'هندسة', 'تحليل بيانات'], streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'fsjes', name: 'FSJES (القانون والاقتصاد والتدبير)', category: 'جامعة قانون واقتصاد', duration: '3 سنوات (إجازة)', admission: 'تسجيل بعد الباك', details: 'مسالك القانون والاقتصاد والتدبير.', careers: ['قانوني', 'محاسب', 'إدارة'], streams: ['eco', 'lettres', 'sm', 'pc'] },
    { id: 'flsh', name: 'FLSH (الآداب والعلوم الإنسانية)', category: 'جامعة الآداب', duration: '3 سنوات (إجازة)', admission: 'تسجيل بعد الباك', details: 'مسالك اللغات والتاريخ والجغرافيا والفلسفة.', careers: ['التدريس', 'التواصل', 'الإدارة'], streams: ['lettres'] },
    { id: 'est', name: 'المدارس العليا للتكنولوجيا EST', category: 'التكنولوجيا', duration: '2 إلى 3 سنوات', admission: 'انتقاء بالملف', details: 'تكوين تطبيقي في المعلوميات والشبكات والتدبير.', careers: ['مطور مبتدئ', 'تقني شبكات', 'مساعد إداري'], streams: ['sm', 'pc', 'svt', 'eco', 'tech'] },
    { id: 'artdesign', name: 'مدارس الفن والتصميم', category: 'فن وتصميم', duration: '3 إلى 5 سنوات', admission: 'ملف + مباراة/مقابلة', details: 'تكوين في التصميم الغرافيكي والفنون البصرية.', careers: ['مصمم', 'مخرج فني', 'رسام'], streams: ['lettres', 'tech', 'eco'] },
    { id: 'archi', name: 'مدارس الهندسة المعمارية', category: 'الهندسة المعمارية', duration: '6 سنوات', admission: 'مباراة وقد تشمل اختبار الرسم', details: 'تكوين في التصميم المعماري والتعمير.', careers: ['مهندس معماري', 'مخطط عمراني', 'مصمم فضاءات'], streams: ['sm', 'pc', 'tech'] },
    { id: 'aviation', name: 'مدارس الطيران', category: 'الطيران', duration: '2 إلى 5 سنوات', admission: 'اختبارات + مستوى علمي + إنجليزية', details: 'تكوين الطيارين والتقنيين في مجال الطيران.', careers: ['طيار', 'تقني طيران', 'عمليات جوية'], streams: ['sm', 'pc'] },
    { id: 'paramed', name: 'المعاهد شبه الطبية والعلاج الطبيعي', category: 'شبه طبي', duration: '3 إلى 5 سنوات', admission: 'مباراة أو انتقاء', details: 'تكوينات في التمريض والعلاج الطبيعي والمختبر.', careers: ['ممرض(ة)', 'أخصائي علاج طبيعي', 'تقني تصوير'], streams: ['svt', 'pc', 'sm'] },
    { id: 'ifcs', name: 'IFCS (معاهد التمريض وتقنيات الصحة)', category: 'الصحة العمومية', duration: '3 سنوات', admission: 'مباراة بعد الباك', details: 'تكوينات عمومية في مهن التمريض.', careers: ['ممرض متعدد الاختصاصات', 'قبالة', 'مستعجلات'], streams: ['svt', 'pc', 'sm'] },
    { id: 'tour', name: 'مدارس السياحة والفندقة', category: 'السياحة', duration: '2 إلى 4 سنوات', admission: 'ملف أو مباراة', details: 'تكوين في الفندقة والمطعمة وتنظيم التظاهرات.', careers: ['تدبير الفنادق', 'وكالات الأسفار', 'تنظيم الأحداث'], streams: ['eco', 'lettres', 'tech'] },
    { id: 'media', name: 'مدارس الصحافة والإعلام', category: 'الإعلام والتواصل', duration: '3 إلى 5 سنوات', admission: 'ملف أو مباراة أو مقابلة', details: 'تنمية مهارات الكتابة والإعلام الرقمي.', careers: ['صحفي', 'مسؤول تواصل', 'صانع محتوى'], streams: ['lettres', 'eco'] },
    { id: 'ofppt', name: 'OFPPT والمعاهد التقنية', category: 'التكوين المهني', duration: '2 إلى 3 سنوات', admission: 'ملف وشروط حسب التخصص', details: 'مسار عملي للاندماج السريع في سوق الشغل.', careers: ['تقني متخصص', 'الدعم المعلوماتي', 'الصيانة'], streams: ['sm', 'pc', 'svt', 'eco', 'lettres', 'tech'] },
    { id: 'isitt', name: 'ISITT (المعهد العالي الدولي للسياحة طنجة)', category: 'السياحة الدولية', duration: '3 إلى 5 سنوات', admission: 'مباراة + لغات', details: 'تكوين عالي في تدبير السياحة والفندقة الدولية.', careers: ['مدير سياحي', 'تسويق سياحي', 'استشارة سفر'], streams: ['eco', 'lettres'] },
  ],
};
// use fr as fallback for 'en'
POST_BAC_SCHOOLS['en'] = POST_BAC_SCHOOLS['fr'];

// ══════════════════════════════════════════════════════════════════════════════
// UNIVERSITÉS PRIVÉES DU MAROC
// ══════════════════════════════════════════════════════════════════════════════

interface PrivateUni {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  tuition: string;
  tuitionAr: string;
  programs: string[];
  programsAr: string[];
  streams: PostBacStream[];
  url: string;
  badge?: string;
  badgeAr?: string;
  badgeColor?: string;
}

const PRIVATE_UNIS: PrivateUni[] = [
  {
    id: 'supmti',
    name: 'SUPMTI',
    nameAr: 'المدرسة العليا للمديرين وتقنيي الإعلاميات',
    city: 'Rabat',
    cityAr: 'الرباط',
    category: 'Informatique & Management',
    categoryAr: 'الإعلاميات والتدبير',
    description: "École privée spécialisée en informatique, réseaux, cybersécurité et management. Formation professionnalisante avec stages intensifs et bonne insertion dans le secteur tech marocain.",
    descriptionAr: 'مدرسة خاصة متخصصة في الإعلاميات والشبكات والأمن السيبراني والتدبير. تكوين مهني مع تداريب مكثفة وإدماج جيد في قطاع التكنولوجيا.',
    tuition: '15 000 – 25 000 MAD/an',
    tuitionAr: '15 000 – 25 000 درهم/سنة',
    programs: ['Génie Informatique', 'Cybersécurité', 'Réseaux & Systèmes', 'Management des SI', 'Data Science'],
    programsAr: ['هندسة الإعلاميات', 'الأمن السيبراني', 'الشبكات والأنظمة', 'تدبير نظم المعلومات', 'علوم البيانات'],
    streams: ['sm', 'pc', 'svt', 'tech'],
    url: 'https://www.supmti.ac.ma',
    badge: 'Tech',
    badgeAr: 'تكنولوجيا',
    badgeColor: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'hem',
    name: 'HEM Business School',
    nameAr: 'مدرسة HEM للأعمال',
    city: 'Casablanca / Rabat / Fès / Marrakech',
    cityAr: 'الدار البيضاء / الرباط / فاس / مراكش',
    category: 'Business & Management',
    categoryAr: 'الأعمال والتدبير',
    description: "Grande école de commerce privée reconnue, fondée en 1988. Formation en management, marketing, finance et entrepreneuriat. Forte notoriété auprès des entreprises.",
    descriptionAr: 'مدرسة تجارة خاصة معترف بها، تأسست عام 1988. تكوين في التدبير والتسويق والمالية والمقاولة. سمعة قوية لدى المؤسسات.',
    tuition: '40 000 – 70 000 MAD/an',
    tuitionAr: '40 000 – 70 000 درهم/سنة',
    programs: ['Bachelor Management', 'MBA', 'Marketing Digital', 'Finance d\'entreprise', 'Entrepreneuriat'],
    programsAr: ['باشلور تدبير', 'MBA', 'تسويق رقمي', 'مالية مقاولات', 'ريادة الأعمال'],
    streams: ['eco', 'lettres', 'sm', 'pc'],
    url: 'https://www.hem.ac.ma',
    badge: 'Business',
    badgeAr: 'أعمال',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'esca',
    name: 'ESCA École de Management',
    nameAr: 'ESCA مدرسة التدبير',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    category: 'Management & Affaires',
    categoryAr: 'التدبير والأعمال',
    description: "Fondée en 1992, ESCA est reconnue par l'État et accréditée AACSB. Offre Bachelors, MBA et Masters en management des affaires, avec partenariats internationaux.",
    descriptionAr: 'تأسست عام 1992، ESCA معترف بها من الدولة وحاصلة على اعتماد AACSB. تقدم باشلور وماجستير في إدارة الأعمال مع شراكات دولية.',
    tuition: '50 000 – 80 000 MAD/an',
    tuitionAr: '50 000 – 80 000 درهم/سنة',
    programs: ['Bachelor of Business Administration', 'MBA', 'Master Management', 'Droit des Affaires', 'Finance Internationale'],
    programsAr: ['باشلور إدارة أعمال', 'MBA', 'ماستر تدبير', 'قانون الأعمال', 'مالية دولية'],
    streams: ['eco', 'sm', 'lettres'],
    url: 'https://www.esca.ma',
    badge: 'AACSB',
    badgeAr: 'معتمدة AACSB',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'uir',
    name: 'Université Internationale de Rabat (UIR)',
    nameAr: 'الجامعة الدولية بالرباط',
    city: 'Rabat',
    cityAr: 'الرباط',
    category: 'Université pluridisciplinaire',
    categoryAr: 'جامعة متعددة التخصصات',
    description: "Université privée reconnue par l'État, reconnue pour ses partenariats avec des universités françaises et canadiennes. Ingénierie, droit, architecture, management et sciences.",
    descriptionAr: 'جامعة خاصة معترف بها من الدولة، مميزة بشراكاتها مع جامعات فرنسية وكندية. هندسة وقانون وعمارة وتدبير وعلوم.',
    tuition: '35 000 – 65 000 MAD/an',
    tuitionAr: '35 000 – 65 000 درهم/سنة',
    programs: ['Ingénierie Informatique', 'Droit International', 'Architecture', 'Management', 'Sciences Po'],
    programsAr: ['هندسة إعلاميات', 'قانون دولي', 'هندسة معمارية', 'تدبير', 'علوم سياسية'],
    streams: ['sm', 'pc', 'eco', 'lettres', 'tech'],
    url: 'https://www.uir.ac.ma',
    badge: 'Partenariats France/Canada',
    badgeAr: 'شراكات فرنسية/كندية',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'um6p',
    name: 'Université Mohammed VI Polytechnique (UM6P)',
    nameAr: 'جامعة محمد السادس متعددة التخصصات التقنية',
    city: 'Benguerir / Rabat / Laâyoune',
    cityAr: 'بنجرير / الرباط / العيون',
    category: 'Ingénierie & Innovation',
    categoryAr: 'الهندسة والابتكار',
    description: "Université privée de référence nationale, axée sur la R&D et l'innovation. Campus de pointe à Benguerir, partenariats mondiaux. Spécialisée en ingénierie, IA, agronomie et politiques publiques.",
    descriptionAr: 'جامعة خاصة مرجعية على المستوى الوطني، تركز على البحث والتطوير والابتكار. حرم متطور ببنجرير وشراكات دولية. متخصصة في الهندسة والذكاء الاصطناعي والفلاحة.',
    tuition: 'Bourse / Sélection stricte',
    tuitionAr: 'منحة / انتقاء صارم',
    programs: ['Ingénierie IA & Data', 'Agriculture Durable', 'Mines & Géologie', 'Management Public', 'Water Sciences'],
    programsAr: ['هندسة الذكاء الاصطناعي', 'الفلاحة المستدامة', 'المناجم والجيولوجيا', 'التدبير العمومي', 'علوم الماء'],
    streams: ['sm', 'pc', 'svt', 'tech', 'eco'],
    url: 'https://www.um6p.ma',
    badge: '🏆 Top Maroc',
    badgeAr: '🏆 الأفضل بالمغرب',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'mundiapolis',
    name: 'Mundiapolis',
    nameAr: 'موندياوبوليس',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    category: 'Communication & Business',
    categoryAr: 'التواصل والأعمال',
    description: "Université privée spécialisée en communication, business et design. Ambiance internationale, filières en anglais/français, forte orientation vers le digital et les médias.",
    descriptionAr: 'جامعة خاصة متخصصة في التواصل والأعمال والتصميم. بيئة دولية، مسالك بالإنجليزية والفرنسية، توجه قوي نحو الرقمي والإعلام.',
    tuition: '30 000 – 55 000 MAD/an',
    tuitionAr: '30 000 – 55 000 درهم/سنة',
    programs: ['Communication Digitale', 'Business Administration', 'Design Graphique', 'Journalisme', 'Marketing'],
    programsAr: ['تواصل رقمي', 'إدارة أعمال', 'تصميم غرافيكي', 'صحافة', 'تسويق'],
    streams: ['eco', 'lettres', 'tech'],
    url: 'https://www.mundiapolis.ma',
    badge: 'International',
    badgeAr: 'دولية',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'aui',
    name: 'Al Akhawayn University (AUI)',
    nameAr: 'جامعة الأخوين',
    city: 'Ifrane',
    cityAr: 'إفران',
    category: 'Université anglophone — modèle américain',
    categoryAr: 'جامعة إنجليزية — نموذج أمريكي',
    description: "La seule université de style américain au Maroc, fondée en 1995. Cours entièrement en anglais, campus de montagne, très sélective. Partenariats avec +100 universités mondiales.",
    descriptionAr: 'الجامعة الوحيدة بالأسلوب الأمريكي في المغرب، تأسست عام 1995. دراسة كاملة بالإنجليزية، حرم جبلي، انتقائية جداً. شراكات مع +100 جامعة عالمية.',
    tuition: '80 000 – 120 000 MAD/an',
    tuitionAr: '80 000 – 120 000 درهم/سنة',
    programs: ['Computer Science', 'Business Administration', 'Engineering', 'International Studies', 'Media Studies'],
    programsAr: ['علوم الحاسوب', 'إدارة الأعمال', 'الهندسة', 'الدراسات الدولية', 'الإعلام'],
    streams: ['sm', 'pc', 'eco', 'lettres'],
    url: 'https://www.aui.ma',
    badge: '🇺🇸 US-Style',
    badgeAr: '🇺🇸 النموذج الأمريكي',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'ismonaco',
    name: 'IS Monaco Morocco',
    nameAr: 'معهد IS موناكو المغرب',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    category: 'Hôtellerie & Tourisme',
    categoryAr: 'الفندقة والسياحة',
    description: "Institut spécialisé en management hôtelier et touristique, filiale de l'école monégasque IS Monaco. Formations reconnues, stages en hôtels 5 étoiles, débouchés internationaux.",
    descriptionAr: 'معهد متخصص في تدبير الفنادق والسياحة، فرع مدرسة موناكو IS Monaco. تكوينات معترف بها، تداريب في فنادق 5 نجوم، فرص دولية.',
    tuition: '45 000 – 70 000 MAD/an',
    tuitionAr: '45 000 – 70 000 درهم/سنة',
    programs: ['Management Hôtelier', 'Tourisme International', 'Événementiel', 'F&B Management'],
    programsAr: ['تدبير فندقي', 'سياحة دولية', 'تنظيم الأحداث', 'تدبير الأغذية والمشروبات'],
    streams: ['eco', 'lettres'],
    url: 'https://www.is-monaco.ma',
    badge: 'Monaco 🎰',
    badgeAr: 'موناكو 🎰',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
];

// ── Stream options ─────────────────────────────────────────────────────────────
const STREAM_OPTIONS = {
  fr: [
    { key: 'sm', label: 'Sciences Math', color: 'bg-violet-100 text-violet-700 border-violet-200' },
    { key: 'pc', label: 'Sciences Physiques', color: 'bg-sky-100 text-sky-700 border-sky-200' },
    { key: 'svt', label: 'SVT', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'eco', label: 'Sciences Éco', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { key: 'lettres', label: 'Lettres & SH', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    { key: 'tech', label: 'Sciences & Tech', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  ],
  en: [
    { key: 'sm', label: 'Math Sciences', color: 'bg-violet-100 text-violet-700 border-violet-200' },
    { key: 'pc', label: 'Physical Sciences', color: 'bg-sky-100 text-sky-700 border-sky-200' },
    { key: 'svt', label: 'Life Sciences', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'eco', label: 'Economic Sciences', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { key: 'lettres', label: 'Literature & SH', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    { key: 'tech', label: 'Science & Tech', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  ],
  ar: [
    { key: 'sm', label: 'علوم رياضية', color: 'bg-violet-100 text-violet-700 border-violet-200' },
    { key: 'pc', label: 'علوم فيزيائية', color: 'bg-sky-100 text-sky-700 border-sky-200' },
    { key: 'svt', label: 'علوم الحياة والأرض', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'eco', label: 'علوم اقتصادية', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { key: 'lettres', label: 'آداب وعلوم إنسانية', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    { key: 'tech', label: 'علوم وتكنولوجيات', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  ],
};

// ── Stage config ───────────────────────────────────────────────────────────────
const STAGE_CFG: Record<string, { gradient: string; bg: string; border: string; text: string }> = {
  college:  { gradient: 'from-teal-500 to-emerald-500',  bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700'   },
  tronc:    { gradient: 'from-sky-500 to-cyan-500',      bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700'    },
  '1bac':   { gradient: 'from-indigo-500 to-blue-500',   bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
  '2bac':   { gradient: 'from-violet-500 to-indigo-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
};

// ── Stage SVG icons ────────────────────────────────────────────────────────────
function StageIcon({ id, size = 20, className = '' }: { id: string; size?: number; className?: string }) {
  const cls = `flex-shrink-0 ${className}`;
  if (id === 'college') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
  if (id === 'tronc') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
  if (id === '1bac') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
  // 2bac
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

const STEP_ORDER = ['college', 'tronc', '1bac', '2bac'];

// ── Post-Bac school SVG icons ─────────────────────────────────────────────────
function PostBacIcon({ id, size = 22 }: { id: string; size?: number }) {
  const base = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, style: { display: 'block', flexShrink: 0 } };

  // Commerce / Gestion
  if (id === 'encg' || id === 'iscae') return (
    <svg {...base}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  );
  // Ingénierie / Sciences appliqueés
  if (id === 'ensa' || id === 'ensam' || id === 'enset') return (
    <svg {...base}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  );
  // CPGE — Prépa
  if (id === 'cpge') return (
    <svg {...base}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  );
  // Médecine / Santé
  if (id === 'medecine' || id === 'paramedical' || id === 'paramed' || id === 'ifcs') return (
    <svg {...base}><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  );
  // Facultés sciences / FST
  if (id === 'fst-fs' || id === 'fsfst') return (
    <svg {...base}><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
  );
  // FSJES — Droit
  if (id === 'fsjes') return (
    <svg {...base}><path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
  );
  // FLSH — Lettres
  if (id === 'flsh') return (
    <svg {...base}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
  );
  // EST — Technologie / Informatique
  if (id === 'est') return (
    <svg {...base}><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  );
  // Art & Design
  if (id === 'ensaad' || id === 'artdesign') return (
    <svg {...base}><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
  );
  // Architecture
  if (id === 'architecture' || id === 'archi') return (
    <svg {...base}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  );
  // Aviation
  if (id === 'aviation') return (
    <svg {...base}><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  );
  // Tourisme / Hôtellerie
  if (id === 'tourisme' || id === 'isitt' || id === 'tour') return (
    <svg {...base}><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );
  // Journalisme / Médias
  if (id === 'journalisme' || id === 'media') return (
    <svg {...base}><path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
  );
  // OFPPT — Formation pro
  if (id === 'ofppt') return (
    <svg {...base}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  );
  // Default — diplôme
  return (
    <svg {...base}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
  );
}

function careerEmoji(id: string): string {
  if (id.startsWith('militaire') || id === 'gendarme' || id === 'pompier') return '🪖';
  if (id === 'sportif') return '⚽';
  if (id === 'mecanicien') return '🔧';
  if (id === 'coiffeur') return '✂️';
  if (id === 'agriculteur') return '🌾';
  if (id === 'artiste') return '🎨';
  if (id === 'cuisinier') return '🍳';
  if (id === 'electricien') return '⚡';
  if (id.startsWith('infirmier')) return '🩺';
  if (id === 'commercant') return '🛒';
  if (id === 'medecin') return '👨‍⚕️';
  if (id === 'ingenieur') return '⚙️';
  if (id.startsWith('technicien')) return '💻';
  if (id === 'pilote') return '✈️';
  if (id === 'enseignant') return '📖';
  if (id === 'entrepreneur') return '🚀';
  if (id === 'informaticien') return '🖥️';
  if (id === 'juriste') return '⚖️';
  if (id === 'architecte') return '🏛️';
  if (id === 'journaliste') return '🎙️';
  if (id === 'psychologue') return '🧠';
  return '🎯';
}

// ── Liens par métier — URLs vérifiées ────────────────────────────────────────
const CAREER_LINKS: Record<string, { url: string; label: string }> = {
  'militaire-college': { url: 'https://farmaroc.net', label: 'farmaroc.net' },
  'militaire-1bac':    { url: 'https://farmaroc.net', label: 'farmaroc.net' },
  'sportif':           { url: 'https://fr.wikipedia.org/wiki/Sport_professionnel', label: 'Wikipedia' },
  'mecanicien':        { url: 'https://www.ofppt.ma', label: 'ofppt.ma' },
  'coiffeur':          { url: 'https://www.ofppt.ma', label: 'ofppt.ma' },
  'agriculteur':       { url: 'https://iav.ac.ma', label: 'iav.ac.ma' },
  'artiste':           { url: 'https://fr.wikipedia.org/wiki/Arts_et_culture_au_Maroc', label: 'Wikipedia' },
  'gendarme':          { url: 'https://fr.wikipedia.org/wiki/Gendarmerie_royale_marocaine', label: 'Wikipedia' },
  'pompier':           { url: 'https://fr.wikipedia.org/wiki/Direction_g%C3%A9n%C3%A9rale_de_la_protection_civile_(Maroc)', label: 'Wikipedia' },
  'cuisinier':         { url: 'https://www.ofppt.ma', label: 'ofppt.ma' },
  'electricien':       { url: 'https://www.ofppt.ma', label: 'ofppt.ma' },
  'infirmier-tronc':   { url: 'https://www.sante.gov.ma', label: 'sante.gov.ma' },
  'commercant':        { url: 'https://fr.wikipedia.org/wiki/Commerce', label: 'Wikipedia' },
  'medecin':           { url: 'https://www.fmpr.ac.ma', label: 'fmpr.ac.ma' },
  'ingenieur':         { url: 'https://ensat.ac.ma', label: 'ensat.ac.ma' },
  'technicien-1bac':   { url: 'https://www.ofppt.ma', label: 'ofppt.ma' },
  'pilote':            { url: 'https://fr.wikipedia.org/wiki/Pilote_de_ligne', label: 'Wikipedia' },
  'enseignant':        { url: 'https://www.men.gov.ma', label: 'men.gov.ma' },
  'entrepreneur':      { url: 'https://fr.wikipedia.org/wiki/Entrepreneuriat', label: 'Wikipedia' },
  'informaticien':     { url: 'https://fr.wikipedia.org/wiki/D%C3%A9veloppeur_informatique', label: 'Wikipedia' },
  'juriste':           { url: 'https://fr.wikipedia.org/wiki/Droit_au_Maroc', label: 'Wikipedia' },
  'architecte':        { url: 'https://fr.wikipedia.org/wiki/%C3%89cole_nationale_d%27architecture_(Maroc)', label: 'Wikipedia' },
  'journaliste':       { url: 'https://www.isic.ac.ma', label: 'isic.ac.ma' },
  'psychologue':       { url: 'https://fr.wikipedia.org/wiki/Psychologie', label: 'Wikipedia' },
};

// ══════════════════════════════════════════════════════════════════════════════
// AVANT BAC SCHOOLS DATA
// ══════════════════════════════════════════════════════════════════════════════

interface AvantBacSchool {
  name: string;
  nameFr: string;
  nameAr: string;
  city: string;
  cityAr: string;
  type: 'college' | 'lycee';
  network: 'public' | 'private';
  stageLabelFr: string;
  stageLabelAr: string;
  filières?: string[];
}

// Google Maps search URL helper
function mapsUrl(name: string, city: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + city + ' Maroc')}`;
}

const AVANT_BAC_SCHOOLS: AvantBacSchool[] = [
  // ── COLLÈGES PUBLICS ────────────────────────────────────────────────
  { nameFr: 'Collège Ibn Khaldoun', nameAr: 'إعدادية ابن خلدون', name: 'Collège Ibn Khaldoun', city: 'Rabat', cityAr: 'الرباط', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres', 'Technique'] },
  { nameFr: 'Collège Al Qods', nameAr: 'إعدادية القدس', name: 'Collège Al Qods', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Arrazi', nameAr: 'إعدادية الرازي', name: 'Collège Arrazi', city: 'Rabat', cityAr: 'الرباط', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Ibn Toufayl', nameAr: 'إعدادية ابن طفيل', name: 'Collège Ibn Toufayl', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Moulay Idriss', nameAr: 'إعدادية مولاي إدريس', name: 'Collège Moulay Idriss', city: 'Fès', cityAr: 'فاس', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Al Massira', nameAr: 'إعدادية المسيرة', name: 'Collège Al Massira', city: 'Marrakech', cityAr: 'مراكش', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Ibn Battouta', nameAr: 'إعدادية ابن بطوطة', name: 'Collège Ibn Battouta', city: 'Tanger', cityAr: 'طنجة', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Al Farabi', nameAr: 'إعدادية الفارابي', name: 'Collège Al Farabi', city: 'Meknès', cityAr: 'مكناس', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Bir Anzarane', nameAr: 'إعدادية بئر أنزاران', name: 'Collège Bir Anzarane', city: 'Agadir', cityAr: 'أكادير', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Al Wahda', nameAr: 'إعدادية الوحدة', name: 'Collège Al Wahda', city: 'Oujda', cityAr: 'وجدة', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Hassan II', nameAr: 'إعدادية الحسن الثاني', name: 'Collège Hassan II', city: 'Kénitra', cityAr: 'القنيطرة', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  { nameFr: 'Collège Ibn Rochd', nameAr: 'إعدادية ابن رشد', name: 'Collège Ibn Rochd', city: 'Salé', cityAr: 'سلا', type: 'college', network: 'public', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  // ── COLLÈGES PRIVÉS ────────────────────────────────────────────────
  { nameFr: 'Collège Les Orangers', nameAr: 'إعدادية البرتقال', name: 'Collège Les Orangers', city: 'Rabat', cityAr: 'الرباط', type: 'college', network: 'private', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres', 'Bilingue'] },
  { nameFr: 'Collège International de Casablanca', nameAr: 'المدرسة الدولية بالدار البيضاء', name: 'Collège International de Casablanca', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'college', network: 'private', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['International', 'Bilingue'] },
  { nameFr: 'Collège Notre Dame de Sion', nameAr: 'إعدادية نوتردام دو سيون', name: 'Collège Notre Dame de Sion', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'college', network: 'private', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Français', 'Bilingue'] },
  { nameFr: 'Collège Al Amal', nameAr: 'إعدادية الأمل', name: 'Collège Al Amal', city: 'Rabat', cityAr: 'الرباط', type: 'college', network: 'private', stageLabelFr: 'Collège', stageLabelAr: 'إعدادي', filières: ['Sciences', 'Lettres'] },
  // ── LYCÉES PUBLICS ─────────────────────────────────────────────────
  { nameFr: 'Lycée Mohamed V', nameAr: 'ثانوية محمد الخامس', name: 'Lycée Mohamed V', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Moulay Youssef', nameAr: 'ثانوية مولاي يوسف', name: 'Lycée Moulay Youssef', city: 'Rabat', cityAr: 'الرباط', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: "Lycée d'Excellence Benguerir", nameAr: 'ثانوية التميز بنجرير', name: "Lycée d'Excellence Benguerir", city: 'Benguerir', cityAr: 'بنجرير', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM A', 'SM B', 'PC', 'SVT'] },
  { nameFr: 'Lycée Descartes', nameAr: 'ثانوية ديكارت', name: 'Lycée Descartes', city: 'Rabat', cityAr: 'الرباط', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Ibn Sina', nameAr: 'ثانوية ابن سينا', name: 'Lycée Ibn Sina', city: 'Meknès', cityAr: 'مكناس', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco'] },
  { nameFr: 'Lycée Majoma', nameAr: 'ثانوية ماجومة', name: 'Lycée Majoma', city: 'Tanger', cityAr: 'طنجة', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Omar Ibn Al Khattab', nameAr: 'ثانوية عمر بن الخطاب', name: 'Lycée Omar Ibn Al Khattab', city: 'Oujda', cityAr: 'وجدة', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Qualifiant Hassan II', nameAr: 'ثانوية الحسن الثاني', name: 'Lycée Qualifiant Hassan II', city: 'Fès', cityAr: 'فاس', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Youssef Ibn Tachfine', nameAr: 'ثانوية يوسف بن تاشفين', name: 'Lycée Youssef Ibn Tachfine', city: 'Agadir', cityAr: 'أكادير', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco'] },
  { nameFr: 'Lycée Mohamed Kholti', nameAr: 'ثانوية محمد الخلطي', name: 'Lycée Mohamed Kholti', city: 'Marrakech', cityAr: 'مراكش', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Abdelmoumen', nameAr: 'ثانوية عبد المؤمن', name: 'Lycée Abdelmoumen', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco'] },
  { nameFr: 'Lycée Al Idrissi', nameAr: 'ثانوية الإدريسي', name: 'Lycée Al Idrissi', city: 'Kénitra', cityAr: 'القنيطرة', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Al Mansour Eddahbi', nameAr: 'ثانوية المنصور الذهبي', name: 'Lycée Al Mansour Eddahbi', city: 'Salé', cityAr: 'سلا', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Ibn Zaidoun', nameAr: 'ثانوية ابن زيدون', name: 'Lycée Ibn Zaidoun', city: 'Tétouan', cityAr: 'تطوان', type: 'lycee', network: 'public', stageLabelFr: 'Tronc Commun — 1ère/2ème Bac', stageLabelAr: 'جذع مشترك — أولى/ثانية باك', filières: ['SM', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Technique Mohammadia', nameAr: 'ثانوية تقنية المحمدية', name: 'Lycée Technique Mohammadia', city: 'Mohammedia', cityAr: 'المحمدية', type: 'lycee', network: 'public', stageLabelFr: 'Filière technique', stageLabelAr: 'شعبة تقنية', filières: ['Sciences & Tech', 'Technique'] },
  { nameFr: 'Lycée Technique Ibn Al Yassamine', nameAr: 'ثانوية تقنية ابن الياسمين', name: 'Lycée Technique Ibn Al Yassamine', city: 'Laâyoune', cityAr: 'العيون', type: 'lycee', network: 'public', stageLabelFr: 'Filière technique', stageLabelAr: 'شعبة تقنية', filières: ['Sciences & Tech', 'Technique'] },
  // ── LYCÉES PRIVÉS ─────────────────────────────────────────────────
  { nameFr: 'Groupe Scolaire La Résidence', nameAr: 'مجموعة المدرسة La Résidence', name: 'Groupe Scolaire La Résidence', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'lycee', network: 'private', stageLabelFr: 'Collège — Lycée', stageLabelAr: 'إعدادي — ثانوي', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres', 'International'] },
  { nameFr: 'Lycée Victor Hugo', nameAr: 'ثانوية فيكتور هوغو', name: 'Lycée Victor Hugo', city: 'Marrakech', cityAr: 'مراكش', type: 'lycee', network: 'private', stageLabelFr: 'Collège — Lycée', stageLabelAr: 'إعدادي — ثانوي', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Lycée Français Louis-Massignon', nameAr: 'ثانوية لويس ماسينيون', name: 'Lycée Français Louis-Massignon', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'lycee', network: 'private', stageLabelFr: 'Bac français + Bac marocain', stageLabelAr: 'باكالوريا فرنسية ومغربية', filières: ['Filières françaises', 'Bilingue'] },
  { nameFr: 'École Al Jabr', nameAr: 'مدرسة الجبر', name: 'École Al Jabr', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'lycee', network: 'private', stageLabelFr: 'Collège — Lycée', stageLabelAr: 'إعدادي — ثانوي', filières: ['SM', 'PC', 'SVT', 'Éco'] },
  { nameFr: 'Lycée Averroès', nameAr: 'ثانوية ابن رشد', name: 'Lycée Averroès', city: 'Casablanca', cityAr: 'الدار البيضاء', type: 'lycee', network: 'private', stageLabelFr: 'Tronc Commun — Bac', stageLabelAr: 'جذع مشترك — باك', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
  { nameFr: 'Groupe Scolaire Ennahda', nameAr: 'المجموعة المدرسية النهضة', name: 'Groupe Scolaire Ennahda', city: 'Rabat', cityAr: 'الرباط', type: 'lycee', network: 'private', stageLabelFr: 'Collège — Lycée', stageLabelAr: 'إعدادي — ثانوي', filières: ['SM', 'PC', 'SVT', 'Éco', 'Lettres'] },
];

// City list for filter
const AVANT_BAC_CITIES = ['All', 'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Tanger', 'Meknès', 'Agadir', 'Oujda', 'Kénitra', 'Salé', 'Tétouan', 'Benguerir', 'Mohammedia', 'Laâyoune'];
const AVANT_BAC_CITIES_FR = ['Toutes', 'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Tanger', 'Meknès', 'Agadir', 'Oujda', 'Kénitra', 'Salé', 'Tétouan', 'Benguerir', 'Mohammedia', 'Laâyoune'];
const AVANT_BAC_CITIES_AR = ['الكل', 'الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'طنجة', 'مكناس', 'أكادير', 'وجدة', 'القنيطرة', 'سلا', 'تطوان', 'بنجرير', 'المحمدية', 'العيون'];

// ══════════════════════════════════════════════════════════════════════════════
// AVANT BAC PANEL
// ══════════════════════════════════════════════════════════════════════════════
function AvantBacPanel({ isRtl }: { isRtl: boolean }) {
  const t = useTranslation();
  const { language } = useAuth();
  const e = t.bacPath?.avantBacExplore;
  const stages: any[] = e?.stages ?? [];
  const careers: any[] = e?.careers ?? [];

  // Extra careers not in translations
  const EXTRA_CAREERS_FR = [
    { id: 'informaticien', title: 'Informaticien / Développeur', stage: '1bac', filiere: 'Sciences Math A ou PC — informatique', description: 'Concevoir des applications, sites web et systèmes. Secteur en forte croissance au Maroc.', qualities: ['Logique', 'Curiosité', 'Persévérance', 'Créativité'], pathway: 'ENSIAS, ENSA, EST informatique ou écoles privées après Bac scientifique. Commencer à coder dès la 1ère bac (Python, HTML).' },
    { id: 'juriste', title: 'Juriste / Avocat', stage: '1bac', filiere: 'Lettres & Sciences Humaines ou Sciences Éco', description: 'Défendre des clients, rédiger des contrats, conseiller des entreprises. Métier polyvalent et respecté.', qualities: ['Éloquence', 'Rigueur', 'Mémoire', 'Persuasion'], pathway: 'FSJES après Bac. Concours d\'accès au barreau après Licence de droit. Bons résultats en lettres et français.' },
    { id: 'architecte', title: 'Architecte', stage: '1bac', filiere: 'Sciences Math, PC ou Technique — dessin', description: 'Concevoir des bâtiments, espaces urbains et intérieurs. Mêle sciences et créativité.', qualities: ['Créativité', 'Précision', 'Sens spatial', 'Patience'], pathway: 'Concours École Nationale d\'Architecture (ENA) après Bac. Viser SM ou PC et pratiquer le dessin dès maintenant.' },
    { id: 'journaliste', title: 'Journaliste / Médias', stage: 'tronc', filiere: 'Lettres & Sciences Humaines — français/arabe', description: 'Enquêter, rédiger et diffuser l\'information. Presse, TV, radio, digital — de nombreux débouchés.', qualities: ['Curiosité', 'Écriture', 'Réactivité', 'Résistance au stress'], pathway: 'ISIC (Institut Supérieur de l\'Information et de la Communication) après Bac. Excellents résultats en langues.' },
    { id: 'psychologue', title: 'Psychologue / Thérapeute', stage: '1bac', filiere: 'SVT ou Lettres — sciences humaines', description: 'Accompagner les personnes en difficulté, travailler dans les hôpitaux, écoles ou cabinets.', qualities: ['Empathie', 'Écoute', 'Discrétion', 'Analyse'], pathway: 'Licence + Master psychologie à l\'université (FSHS). Bonnes notes en SVT et sciences humaines au lycée.' },
  ];
  const allCareers = [...careers, ...EXTRA_CAREERS_FR];

  const [innerTab, setInnerTab] = useState<'stages' | 'careers' | 'etablissements'>('stages');
  const [activeStage, setActiveStage] = useState<string>(stages[0]?.id ?? 'college');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [careerFilter, setCareerFilter] = useState<AvantBacCareerStage | 'all'>('all');
  const [careerQuery, setCareerQuery] = useState('');
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  // Etablissements state
  const [schoolTypeFilter, setSchoolTypeFilter] = useState<'all' | 'college' | 'lycee'>('all');
  const [schoolNetworkFilter, setSchoolNetworkFilter] = useState<'all' | 'public' | 'private'>('all');
  const [schoolCityFilter, setSchoolCityFilter] = useState<string>('All');
  const [schoolQuery, setSchoolQuery] = useState('');

  const currentStage = stages.find((s: any) => s.id === activeStage);
  const cfg = STAGE_CFG[activeStage] ?? STAGE_CFG['college'];
  const stepIdx = STEP_ORDER.indexOf(activeStage);

  const filteredCareers = allCareers.filter((c: any) => {
    const matchStage = careerFilter === 'all' || c.stage === careerFilter;
    const q = careerQuery.toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.filiere?.toLowerCase().includes(q);
    return matchStage && matchQ;
  });

  const filteredSchools = AVANT_BAC_SCHOOLS.filter((s) => {
    if (schoolTypeFilter !== 'all' && s.type !== schoolTypeFilter) return false;
    if (schoolNetworkFilter !== 'all' && s.network !== schoolNetworkFilter) return false;
    if (schoolCityFilter !== 'All' && s.city !== schoolCityFilter) return false;
    const q = schoolQuery.toLowerCase();
    if (!q) return true;
    return (
      s.nameFr.toLowerCase().includes(q) ||
      s.nameAr.includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.cityAr.includes(q) ||
      (s.filières ?? []).some((f) => f.toLowerCase().includes(q))
    );
  });

  // SVG icons for inner tabs
  const innerTabIcons = {
    stages: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    careers: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    etablissements: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  };

  const innerTabsConfig = [
    { key: 'stages' as const, label: isRtl ? 'المراحل الدراسية' : language === 'en' ? 'Journey Stages' : 'Étapes du parcours' },
    { key: 'careers' as const, label: isRtl ? 'المهن' : language === 'en' ? 'Careers' : 'Métiers' },
    { key: 'etablissements' as const, label: isRtl ? 'المؤسسات' : language === 'en' ? 'Institutions' : 'Établissements' },
  ];

  return (
    <div>
      {/* Overview */}
      {e?.overview && (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-slate-700 leading-7">{e.overview}</p>
          </div>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-2 bg-slate-100 rounded-full p-1.5 mb-6 shadow-sm">
        {innerTabsConfig.map(({ key, label }) => (
          <button key={key} type="button"
            onClick={() => setInnerTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
              innerTab === key
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {innerTabIcons[key]}
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>

      {/* ── STAGES ── */}
      {innerTab === 'stages' && (
        <div>
          {/* Stepper */}
          <div className="flex items-center mb-5 overflow-x-auto pb-1">
            {STEP_ORDER.map((sid, i) => {
              const s = stages.find((x: any) => x.id === sid);
              const label = s?.title ?? sid;
              const c2 = STAGE_CFG[sid] ?? STAGE_CFG['college'];
              const isActive = sid === activeStage;
              const isDone = STEP_ORDER.indexOf(sid) < stepIdx;
              return (
                <div key={sid} className="flex items-center flex-1 min-w-0">
                  <button type="button"
                    onClick={() => { setActiveStage(sid); setExpandedTopic(null); }}
                    className="group flex flex-col items-center flex-1 min-w-0 px-1 py-1"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                      isActive ? `bg-gradient-to-br ${c2.gradient} text-white shadow-lg scale-110`
                      : isDone ? 'bg-gray-100 text-gray-400'
                      : 'bg-white border-2 border-gray-200 text-gray-400 group-hover:border-gray-400'
                    }`}>
                      <StageIcon id={sid} size={18} />
                    </div>
                    <span className={`text-[11px] font-bold truncate max-w-[72px] text-center ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                  </button>
                  {i < STEP_ORDER.length - 1 && (
                    <div className={`h-0.5 w-3 flex-shrink-0 ${isDone || isActive ? 'bg-gray-300' : 'bg-gray-100'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Stage card */}
          {currentStage && (
            <div className="rounded-[2rem] border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className={`bg-gradient-to-r ${cfg.gradient} px-6 py-5 text-white`}> 
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-11 h-11 rounded-3xl bg-white/15 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <StageIcon id={activeStage} size={18} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black">{currentStage.title}</h3>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed max-w-xl">{currentStage.intro}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(currentStage.highlightTags ?? []).map((tag: string) => (
                      <span key={tag} className="bg-white/15 text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/25">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="divide-y divide-slate-100 bg-slate-50">
                {(currentStage.topics ?? []).map((topic: any, idx: number) => {
                  const key = `${activeStage}-${idx}`;
                  const isOpen = expandedTopic === key;
                  return (
                    <div key={key}>
                      <button type="button"
                        onClick={() => setExpandedTopic(isOpen ? null : key)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${cfg.gradient} text-white text-[10px] font-black flex items-center justify-center flex-shrink-0`}>{idx + 1}</span>
                          <span className="font-semibold text-slate-800 text-sm md:text-base">{topic.title}</span>
                        </div>
                        <svg className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className={`px-6 pb-5 pt-2 ${cfg.bg}`}>
                          <p className="text-sm text-slate-700 leading-relaxed pl-10">{topic.description}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prev / Next */}
          <div className="mt-4 flex justify-between gap-3 flex-wrap">
            {stepIdx > 0 && (
              <button type="button"
                onClick={() => { setActiveStage(STEP_ORDER[stepIdx - 1]); setExpandedTopic(null); }}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                {isRtl ? 'السابق' : language === 'en' ? 'Previous' : 'Précédent'}
              </button>
            )}
            {stepIdx < STEP_ORDER.length - 1 && (
              <button type="button"
                onClick={() => { setActiveStage(STEP_ORDER[stepIdx + 1]); setExpandedTopic(null); }}
                className="ml-auto flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl px-4 py-2 hover:opacity-90 transition-opacity shadow-sm"
              >
                {isRtl ? 'التالي' : 'Suivant'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── CAREERS ── */}
      {innerTab === 'careers' && (
        <div>
          {e?.careersNote && (
            <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-4 leading-relaxed">{e.careersNote}</p>
          )}
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[160px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder={e?.searchCareers ?? 'Rechercher...'} value={careerQuery}
                onChange={(ev) => setCareerQuery(ev.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {(['all', 'college', 'tronc', '1bac'] as const).map((f) => {
                const labels: Record<string, string> = {
                  all: isRtl ? 'الكل' : language === 'en' ? 'All' : 'Toutes',
                  college: isRtl ? 'إعدادي' : language === 'en' ? 'Middle School' : 'Collège',
                  tronc: isRtl ? 'جذع مشترك' : language === 'en' ? 'Common Core' : 'Tronc',
                  '1bac': isRtl ? 'أولى باك' : language === 'en' ? '1st Bac' : '1ère Bac',
                };
                const c2 = f === 'all' ? null : STAGE_CFG[f];
                return (
                  <button key={f} type="button" onClick={() => setCareerFilter(f)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      careerFilter === f
                        ? c2 ? `bg-gradient-to-r ${c2.gradient} text-white border-transparent shadow-sm` : 'bg-slate-800 text-white border-transparent shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >{labels[f]}</button>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-3 font-medium">{filteredCareers.length} {isRtl ? 'مهنة' : language === 'en' ? 'careers' : 'métiers'}</p>

          {filteredCareers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">{isRtl ? 'لا توجد نتائج' : language === 'en' ? 'No results' : 'Aucun résultat'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCareers.map((career: any) => {
                const isOpen = expandedCareer === career.id;
                const cfgC = STAGE_CFG[career.stage] ?? STAGE_CFG['college'];
                const stageLabel = career.stage === 'college' ? (isRtl ? 'إعدادي' : language === 'en' ? 'Middle School' : 'Collège')
                  : career.stage === 'tronc' ? (isRtl ? 'جذع مشترك' : language === 'en' ? 'Common Core' : 'Tronc')
                  : (isRtl ? 'أولى باك' : language === 'en' ? '1st Bac' : '1ère Bac');
                return (
                  <div key={career.id} className={`rounded-2xl border ${cfgC.border} overflow-hidden transition-all ${isOpen ? 'shadow-md' : 'hover:shadow-sm'}`}>
                    <button type="button" onClick={() => setExpandedCareer(isOpen ? null : career.id)} className="w-full text-left">
                      <div className={`flex items-start gap-3 p-4 ${cfgC.bg}`}>
                        <span className="text-xl flex-shrink-0">{careerEmoji(career.id)}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1 flex-wrap mb-0.5">
                            <h4 className="font-bold text-gray-900 text-sm">{career.title}</h4>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {CAREER_LINKS[career.id] && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${cfgC.bg} ${cfgC.border} ${cfgC.text} flex items-center gap-0.5`}>
                                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                  lien
                                </span>
                              )}
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfgC.bg} ${cfgC.border} ${cfgC.text}`}>{stageLabel}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{career.description}</p>
                        </div>
                        <svg className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100 space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${cfgC.bg} ${cfgC.text} flex-shrink-0`}>{e?.careerFiliereLabel ?? 'Filière'}</span>
                          <p className="text-xs text-gray-600 leading-relaxed">{career.filiere}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{e?.careerAccessLabel ?? 'Comment y accéder'}</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{career.pathway}</p>
                        </div>
                        {career.qualities?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {career.qualities.map((q: string) => (
                              <span key={q} className="text-[10px] bg-gray-100 text-gray-600 rounded-lg px-2 py-0.5 font-medium">{q}</span>
                            ))}
                          </div>
                        )}
                        {/* Link */}
                        {CAREER_LINKS[career.id] && (
                          <a
                            href={CAREER_LINKS[career.id].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all hover:shadow-sm ${cfgC.bg} ${cfgC.border} ${cfgC.text}`}
                          >
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {isRtl ? 'زيارة الموقع' : `Visiter — ${CAREER_LINKS[career.id].label}`}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── ÉTABLISSEMENTS ── */}
      {innerTab === 'etablissements' && (
        <div>
          {/* Note */}
          <div className="mb-5 bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3.5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm text-teal-900 leading-relaxed">
              {isRtl
                ? 'لائحة إرشادية للمؤسسات العمومية والخصوصية قبل الباكالوريا. اضغط على "خرائط" لتحديد موقع أي مؤسسة مباشرة.'
                : 'Liste indicative des établissements publics et privés. Cliquez sur "Maps" pour localiser directement chaque établissement.'}
            </p>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[160px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text"
                placeholder={isRtl ? 'بحث عن مؤسسة أو مدينة...' : language === 'en' ? 'Search for an institution or city...' : 'Rechercher un établissement ou une ville...'}
                value={schoolQuery} onChange={(ev) => setSchoolQuery(ev.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition"
              />
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Type */}
            <div className="flex gap-1">
              {([['all', isRtl ? 'الكل' : language === 'en' ? 'All' : 'Tous'], ['college', isRtl ? 'إعدادي' : language === 'en' ? 'Middle School' : 'Collège'], ['lycee', isRtl ? 'ثانوي' : language === 'en' ? 'High School' : 'Lycée']] as const).map(([v, label]) => (
                <button key={v} type="button" onClick={() => setSchoolTypeFilter(v as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    schoolTypeFilter === v ? 'bg-teal-600 text-white border-transparent shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}>{label}</button>
              ))}
            </div>
            {/* Network */}
            <div className="flex gap-1">
              {([['all', isRtl ? 'الكل' : language === 'en' ? 'All' : 'Tous'], ['public', isRtl ? 'عمومي' : language === 'en' ? 'Public' : 'Public'], ['private', isRtl ? 'خصوصي' : language === 'en' ? 'Private' : 'Privé']] as const).map(([v, label]) => (
                <button key={v} type="button" onClick={() => setSchoolNetworkFilter(v as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    schoolNetworkFilter === v
                      ? v === 'public' ? 'bg-sky-500 text-white border-transparent shadow-sm'
                        : v === 'private' ? 'bg-indigo-500 text-white border-transparent shadow-sm'
                        : 'bg-slate-700 text-white border-transparent shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}>{label}</button>
              ))}
            </div>
          </div>

          {/* City scroll filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {(isRtl ? AVANT_BAC_CITIES_AR : language === 'en' ? AVANT_BAC_CITIES : AVANT_BAC_CITIES_FR).map((city, i) => {
              const cityEn = AVANT_BAC_CITIES[i];
              const isActive = schoolCityFilter === cityEn;
              return (
                <button key={city} type="button"
                  onClick={() => setSchoolCityFilter(cityEn)}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    isActive ? 'bg-teal-600 text-white border-transparent shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                  }`}
                >{city}</button>
              );
            })}
          </div>

          {/* Count */}
          <p className="text-xs text-slate-400 mb-3 font-medium">
            {filteredSchools.length} {isRtl ? 'مؤسسة' : language === 'en' ? 'institutions' : 'établissements'}
          </p>

          {/* Schools grid */}
          {filteredSchools.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">{isRtl ? 'لا توجد نتائج' : language === 'en' ? 'No results' : 'Aucun résultat'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredSchools.map((school) => {
                const isCollege = school.type === 'college';
                const isPublic = school.network === 'public';
                const displayName = isRtl ? school.nameAr : school.nameFr;
                const displayCity = isRtl ? school.cityAr : school.city;
                const stageLabel = isRtl ? school.stageLabelAr : school.stageLabelFr;
                const mapLink = mapsUrl(school.nameFr, school.city);

                return (
                  <div key={`${school.nameFr}-${school.city}`}
                    className={`flex items-start gap-3 p-4 rounded-2xl border bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                      isCollege ? 'border-amber-200' : 'border-sky-200'
                    }`}
                  >
                    {/* Type icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCollege ? 'bg-amber-100' : 'bg-sky-100'
                    }`}>
                      {isCollege ? (
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{displayName}</h4>
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {/* City */}
                        <span className="text-[10px] font-semibold text-gray-500 flex items-center gap-0.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {displayCity}
                        </span>
                        {/* Type badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCollege ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                        }`}>
                          {isCollege ? (isRtl ? 'إعدادي' : language === 'en' ? 'Middle School' : 'Collège') : (isRtl ? 'ثانوي' : language === 'en' ? 'High School' : 'Lycée')}
                        </span>
                        {/* Network badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'
                        }`}>
                          {isPublic ? (isRtl ? 'عمومي' : language === 'en' ? 'Public' : 'Public') : (isRtl ? 'خصوصي' : language === 'en' ? 'Private' : 'Privé')}
                        </span>
                      </div>
                      {/* Stage label */}
                      <p className="text-[11px] text-gray-500 mb-2">{stageLabel}</p>
                      {/* Filières chips */}
                      {school.filières && school.filières.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {school.filières.map((f) => (
                            <span key={f} className="text-[10px] bg-gray-100 text-gray-600 rounded-md px-1.5 py-0.5 font-medium">{f}</span>
                          ))}
                        </div>
                      )}
                      {/* Maps link */}
                      <a href={mapLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-800 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {isRtl ? 'الموقع على الخريطة' : language === 'en' ? 'View on Maps' : 'Voir sur Maps'}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Ministry link */}
          <div className="mt-5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-4 text-white flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-bold text-sm mb-0.5">
                {isRtl ? 'وزارة التربية الوطنية' : language === 'en' ? 'Ministry of National Education' : 'Ministère de l\'Éducation Nationale'}
              </p>
              <p className="text-xs text-white/80">
                {isRtl ? 'البحث عن مؤسسات التعليم الثانوي الإعدادي والتأهيلي في المغرب' : language === 'en' ? 'Search for any school in Morocco' : 'Recherchez n\'importe quel établissement scolaire au Maroc'}
              </p>
            </div>
            <a href="https://www.men.gov.ma" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white text-teal-700 font-bold text-xs px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors"
            >
              {isRtl ? 'الموقع الرسمي' : language === 'en' ? 'Official website' : 'Site officiel'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PRIVATE UNIVERSITIES SECTION
// ══════════════════════════════════════════════════════════════════════════════
function PrivateUnisSection({ isRtl, lang, selectedStream }: { isRtl: boolean; lang: Lang; selectedStream: PostBacStream | '' }) {
  const { language } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = PRIVATE_UNIS.filter((u) =>
    !selectedStream || u.streams.includes(selectedStream as PostBacStream)
  );

  if (filtered.length === 0) return null;

  const visible = showAll ? filtered : filtered.slice(0, 4);

  return (
    <div className="mt-6">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-pink-200" />
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full px-4 py-1.5 flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-xs font-bold text-purple-700">
            {isRtl ? 'الجامعات والمدارس الخاصة' : language === 'en' ? 'Private Universities & Schools' : 'Universités & Écoles Privées'}
          </span>
          <span className="text-[10px] font-bold bg-purple-600 text-white rounded-full px-1.5 py-0.5">{filtered.length}</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-purple-200 to-pink-200" />
      </div>

      {/* Info note */}
      <div className="mb-4 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xs text-purple-900 leading-relaxed">
          {isRtl
            ? 'هذه المؤسسات الخاصة معترف بها من الدولة وتقدم برامج عالية الجودة. تكاليف الدراسة أعلى لكن كثيراً منها يوفر منحاً جزئية أو كاملة.'
            : language === 'en'
              ? 'These state-recognized private institutions offer high-quality programs. Tuition is higher but many offer partial or full scholarships.'
              : 'Ces établissements privés reconnus par l\'État offrent des formations de qualité. Les frais sont plus élevés, mais beaucoup proposent des bourses partielles ou complètes.'}
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-2.5">
        {visible.map((uni) => {
          const isOpen = expanded === uni.id;
          const displayName = isRtl ? uni.nameAr : uni.name;
          const displayCity = isRtl ? uni.cityAr : uni.city;
          const displayCategory = isRtl ? uni.categoryAr : uni.category;
          const displayDesc = isRtl ? uni.descriptionAr : uni.description;
          const displayTuition = isRtl ? uni.tuitionAr : uni.tuition;
          const displayBadge = isRtl ? uni.badgeAr : uni.badge;
          const displayPrograms = isRtl ? uni.programsAr : uni.programs;

          return (
            <div key={uni.id}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isOpen ? 'shadow-md border-purple-200' : 'border-slate-200 hover:shadow-sm hover:border-purple-100'
              }`}
            >
              <button type="button"
                onClick={() => setExpanded(isOpen ? null : uni.id)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3 px-4 py-3.5 bg-white">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-600">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-0.5">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{displayName}</h4>
                      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                        {displayBadge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${uni.badgeColor ?? 'bg-purple-100 text-purple-700'}`}>
                            {displayBadge}
                          </span>
                        )}
                        <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">
                          {isRtl ? 'خاصة' : language === 'en' ? 'Private' : 'Privée'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {displayCity}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] text-slate-500">{displayCategory}</span>
                    </div>
                  </div>
                  {/* Chevron */}
                  <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-4 pb-4 pt-3 bg-purple-50 border-t border-purple-100 space-y-3">
                  {/* Description */}
                  <p className="text-xs text-slate-700 leading-relaxed">{displayDesc}</p>

                  {/* Tuition */}
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wide mb-0.5">
                        {isRtl ? 'التكاليف السنوية' : language === 'en' ? 'Annual tuition' : 'Frais annuels'}
                      </p>
                      <p className="text-xs text-slate-700 font-semibold">{displayTuition}</p>
                    </div>
                  </div>

                  {/* Programs */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                      {isRtl ? 'المسالك والتخصصات' : language === 'en' ? 'Programs & specializations' : 'Filières & spécialisations'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {displayPrograms.map((prog) => (
                        <span key={prog}
                          className="text-[10px] bg-white text-slate-700 border border-purple-100 rounded-lg px-2 py-0.5 font-medium"
                        >
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Official link */}
                  <a href={uni.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-white border border-purple-200 hover:bg-purple-50 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {isRtl ? 'الموقع الرسمي' : language === 'en' ? 'Official website' : 'Site officiel'}
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show more / less */}
      {filtered.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-colors"
        >
          {showAll
            ? (isRtl ? 'عرض أقل' : language === 'en' ? 'Show less' : 'Voir moins')
            : (isRtl ? `عرض الكل (${filtered.length})` : language === 'en' ? `Show all (${filtered.length})` : `Voir tout (${filtered.length})`)}
          <svg className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APRÈS BAC PANEL
// ══════════════════════════════════════════════════════════════════════════════
function ApresBacPanel({ isRtl, lang }: { isRtl: boolean; lang: Lang }) {
  const { language } = useAuth();
  const langKey: Lang = isRtl ? 'ar' : language === 'en' ? 'en' : 'fr';
  const schools: PostBacSchool[] = POST_BAC_SCHOOLS[langKey] ?? POST_BAC_SCHOOLS['fr'];
  const streamOptions = isRtl ? STREAM_OPTIONS.ar : language === 'en' ? STREAM_OPTIONS.en : STREAM_OPTIONS.fr;

  const [selectedStream, setSelectedStream] = useState<PostBacStream | ''>('');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = schools.filter((s) => {
    if (!selectedStream) return false;
    if (!s.streams.includes(selectedStream)) return false;
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.details.toLowerCase().includes(q) ||
      s.careers.some((c) => c.toLowerCase().includes(q))
    );
  });

  const selectedStreamOption = streamOptions.find((s) => s.key === selectedStream);

  return (
    <div>
      {/* Intro */}
      <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <p className="text-sm text-indigo-900 leading-relaxed">
          {isRtl
            ? 'اختر شعبتك الباكالوريا لتكتشف المؤسسات والمسالك المتاحة لك بعد الحصول على الشهادة.'
            : language === 'en'
              ? 'Select your Bac track to discover the institutions and programs available to you after graduation.'
              : 'Sélectionnez votre filière Bac pour découvrir les établissements et formations qui vous sont accessibles.'}
        </p>
      </div>

      {/* Stream selector */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          {isRtl ? '① اختر شعبتك' : language === 'en' ? '① Choose your Bac track' : '① Choisissez votre filière Bac'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {streamOptions.map((opt) => (
            <button key={opt.key} type="button"
              onClick={() => { setSelectedStream(selectedStream === opt.key as PostBacStream ? '' : opt.key as PostBacStream); setExpanded(null); }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                selectedStream === opt.key
                  ? `${opt.color} border shadow-sm scale-[1.02]`
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedStream === opt.key ? 'bg-current opacity-60' : 'bg-gray-300'}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* No stream selected */}
      {!selectedStream && (
        <div className="text-center py-16 text-gray-400">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-500">
            {isRtl ? 'اختر شعبتك أولاً لعرض المؤسسات المناسبة' : language === 'en' ? 'Select your track first to display suitable institutions' : 'Sélectionnez une filière pour afficher les établissements'}
          </p>
        </div>
      )}

      {/* Schools list */}
      {selectedStream && (
        <div>
          {/* Search + count */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[160px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text"
                placeholder={isRtl ? 'بحث سريع...' : language === 'en' ? 'Quick search...' : 'Recherche rapide...'}
                value={query} onChange={(ev) => setQuery(ev.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
              />
            </div>
            {selectedStreamOption && (
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${selectedStreamOption.color}`}>
                {filtered.length} {isRtl ? 'مؤسسة' : language === 'en' ? 'institutions' : 'établissements'}
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">{isRtl ? 'لا توجد نتائج' : language === 'en' ? 'No results' : 'Aucun résultat'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((school) => {
                const isOpen = expanded === school.id;
                const url = SCHOOL_URLS[school.id];
                return (
                  <div key={school.id} className={`rounded-2xl border border-slate-200 overflow-hidden transition-all ${isOpen ? 'shadow-md border-indigo-200' : 'hover:shadow-sm'}`}>
                    <button type="button" onClick={() => setExpanded(isOpen ? null : school.id)} className="w-full text-left">
                      <div className="flex items-center gap-3 px-4 py-3.5 bg-white">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
                          <PostBacIcon id={school.id} size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{school.name}</h4>
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full flex-shrink-0">{school.duration}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{school.category}</p>
                        </div>
                        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 bg-indigo-50 border-t border-indigo-100 space-y-3">
                        {/* Admission */}
                        <div className="flex items-start gap-2">
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg flex-shrink-0">
                            {isRtl ? 'الولوج' : language === 'en' ? 'Admission' : 'Admission'}
                          </span>
                          <p className="text-xs text-gray-700 leading-relaxed">{school.admission}</p>
                        </div>
                        {/* Details */}
                        <p className="text-xs text-gray-600 leading-relaxed">{school.details}</p>
                        {/* Careers */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                            {isRtl ? 'المهن المحتملة' : language === 'en' ? 'Career paths' : 'Débouchés'}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {school.careers.map((c) => (
                              <span key={c} className="text-[10px] bg-white text-gray-600 border border-gray-200 rounded-lg px-2 py-0.5 font-medium">{c}</span>
                            ))}
                          </div>
                        </div>
                        {/* Link */}
                        {url && (
                          <a href={url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {isRtl ? 'زيارة الموقع الرسمي' : language === 'en' ? 'Official website' : 'Site officiel'}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── UNIVERSITÉS PRIVÉES ── removed: see dedicated page ── */}


        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function BacPathDashPage() {
  const t = useTranslation();
  const { language } = useAuth();
  const isRtl = t.direction === 'rtl';
  const lang: Lang = isRtl ? 'ar' : language === 'en' ? 'en' : 'fr';

  const [tab, setTab] = useState<'avant' | 'apres'>('avant');

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto bg-slate-50 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-700 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          {isRtl ? 'دليل المسار الدراسي' : language === 'en' ? 'Academic Path Guide' : 'Guide du parcours scolaire'}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.6fr_0.9fr] items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 leading-tight">
              {t.bacPath?.headingLarge ?? (isRtl ? 'أين أنت في مسارك الدراسي؟' : language === 'en' ? 'Where are you in your journey?' : 'Où en êtes-vous dans votre parcours ?')}
            </h2>
            <p className="text-slate-500 text-base leading-7 max-w-2xl">
              {t.bacPath?.intro ?? (isRtl
                ? 'اختر قسمك: قبل الباكالوريا أو بعدها — محتوى مفصّل، مؤسسات، مهن وروابط.'
                : language === 'en'
                  ? 'Choose your section: before or after the Bac — detailed content, institutions, careers and links.'
                  : 'Choisissez votre section : avant ou après le Bac — contenu détaillé, établissements, métiers et liens.')}
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              {isRtl ? 'خطوة بخطوة نحو قرار مهني واضح' : language === 'en' ? 'Step-by-step guidance for a clear career decision' : 'Accompagnement étape par étape vers un choix d’orientation clair'}
            </p>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-teal-500" />{isRtl ? 'تعرف على المراحل الأساسية قبل وبعد الباك' : language === 'en' ? 'Understand the key stages before and after the Bac' : 'Comprendre les étapes clés avant et après le Bac'}</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-teal-500" />{isRtl ? 'إستكشف المؤسسات والمهن المناسبة' : language === 'en' ? 'Explore institutions and career options' : 'Explorez établissements et métiers adaptés'}</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-teal-500" />{isRtl ? 'صفحة مصممة بأسلوب حديث ومحترف' : language === 'en' ? 'Page designed with a clean, professional layout' : 'Page conçue avec un style propre et professionnel'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Tab switcher ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {/* ── Avant le Bac ── */}
        <button
          type="button"
          onClick={() => setTab('avant')}
          className={`flex items-center gap-3 p-4 rounded-3xl border transition-all duration-200 text-left ${
            tab === 'avant'
              ? 'bg-white border-slate-200 shadow-sm'
              : 'bg-slate-100 border-transparent hover:border-slate-300 hover:bg-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            tab === 'avant' ? 'bg-teal-500 text-white shadow-sm' : 'bg-slate-200 text-teal-700'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className={`font-semibold text-sm leading-tight ${tab === 'avant' ? 'text-slate-900' : 'text-slate-700'}`}>
              {isRtl ? 'قبل الباكالوريا' : language === 'en' ? 'Before Bac' : 'Avant le Bac'}
            </p>
            <p className={`text-xs mt-0.5 truncate ${tab === 'avant' ? 'text-slate-500' : 'text-slate-400'}`}>
              {isRtl ? 'إعدادي · جذع مشترك · أولى وثانية باك' : language === 'en' ? 'Middle School · Common Core · 1st & 2nd Bac' : 'Collège · Tronc Commun · 1ère & 2ème Bac'}
            </p>
          </div>
          {tab === 'avant' && (
            <svg className="w-4 h-4 text-teal-500 shrink-0 ml-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* ── Après le Bac ── */}
        <button
          type="button"
          onClick={() => setTab('apres')}
          className={`flex items-center gap-3 p-4 rounded-3xl border transition-all duration-200 text-left ${
            tab === 'apres'
              ? 'bg-white border-slate-200 shadow-sm'
              : 'bg-slate-100 border-transparent hover:border-slate-300 hover:bg-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            tab === 'apres' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-indigo-600'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className={`font-semibold text-sm leading-tight ${tab === 'apres' ? 'text-slate-900' : 'text-slate-700'}`}>
              {isRtl ? 'بعد الباكالوريا' : language === 'en' ? 'After Bac' : 'Après le Bac'}
            </p>
            <p className={`text-xs mt-0.5 truncate ${tab === 'apres' ? 'text-slate-500' : 'text-slate-400'}`}>
              {isRtl ? 'المدارس · المسالك · المباريات' : language === 'en' ? 'Schools · Programs · Competitions' : 'Écoles · Filières · Concours'}
            </p>
          </div>
          {tab === 'apres' && (
            <svg className="w-4 h-4 text-indigo-600 shrink-0 ml-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Panel content ────────────────────────────────────────────────── */}
      {tab === 'avant' && <AvantBacPanel isRtl={isRtl} />}
      {tab === 'apres' && <ApresBacPanel isRtl={isRtl} lang={lang} />}
    </div>
  );
}

