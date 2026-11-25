import { useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import MoroccoMapSvg, { MAP_ZOOM_MIN, MAP_ZOOM_MAX, MAP_ZOOM_STEP, clampMapPan } from '../components/MoroccoMapSvg';
import { MOROCCO_MAP_REGIONS } from '../data/moroccoMapData';
import type { MoroccoRegionData } from '../data/moroccoMapData';

// ══════════════════════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════════════════════

type Stream = 'sm' | 'pc' | 'svt' | 'eco' | 'lettres' | 'tech';
type Category = 'tech' | 'business' | 'health' | 'design' | 'hotel' | 'law' | 'sciences' | 'multi' | 'architecture';
type MoroccoRegion =
  | 'tanger-tetouan'
  | 'oriental'
  | 'fes-meknes'
  | 'rabat-sale'
  | 'beni-mellal'
  | 'casablanca-settat'
  | 'marrakech-safi'
  | 'draa-tafilalet'
  | 'souss-massa'
  | 'guelmim'
  | 'laayoune-sakia'
  | 'dakhla-oued';

interface PrivateSchool {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  region: MoroccoRegion;
  category: Category;
  tagFr: string;
  tagAr: string;
  tagEn: string;
  description: string;
  descriptionAr: string;
  tuition: string;
  tuitionAr: string;
  duration: string;
  durationAr: string;
  programs: string[];
  programsAr: string[];
  streams: Stream[];
  url: string;
  badge?: string;
  badgeColor: string;
  featured?: boolean;
}

const SCHOOLS: PrivateSchool[] = [
  {
    id: 'um6p',
    name: 'Université Mohammed VI Polytechnique',
    nameAr: 'جامعة محمد السادس متعددة التخصصات التقنية',
    city: 'Benguerir / Rabat',
    cityAr: 'بنجرير / الرباط',
    region: 'marrakech-safi',
    category: 'tech',
    tagFr: 'Ingénierie & Innovation',
    tagAr: 'الهندسة والابتكار',
    tagEn: 'Engineering & Innovation',
    description: "Université privée de référence nationale axée sur la R&D et l'innovation. Campus de pointe à Benguerir, partenariats mondiaux. Bonne couverture en bourses d'excellence.",
    descriptionAr: 'جامعة خاصة مرجعية وطنياً تركز على البحث والابتكار. حرم متطور ببنجرير وشراكات دولية. تغطية جيدة بمنح التميز.',
    tuition: 'Bourse / Sélection stricte',
    tuitionAr: 'منحة / انتقاء صارم',
    duration: '3 – 5 ans',
    durationAr: '3 – 5 سنوات',
    programs: ['Ingénierie IA & Data', 'Agriculture Durable', 'Mines & Géologie', 'Management Public', 'Water Sciences', 'Cybersécurité'],
    programsAr: ['هندسة الذكاء الاصطناعي', 'الفلاحة المستدامة', 'المناجم والجيولوجيا', 'التدبير العمومي', 'علوم الماء', 'الأمن السيبراني'],
    streams: ['sm', 'pc', 'svt', 'tech', 'eco'],
    url: 'https://www.um6p.ma',
    badge: '⭐ الأفضل بالمغرب',
    badgeColor: 'bg-rose-100 text-rose-700',
    featured: true,
  },
  {
    id: 'aui',
    name: 'Al Akhawayn University (AUI)',
    nameAr: 'جامعة الأخوين',
    city: 'Ifrane',
    cityAr: 'إفران',
    region: 'fes-meknes',
    category: 'multi',
    tagFr: 'Université américaine anglophone',
    tagAr: 'جامعة أمريكية إنجليزية',
    tagEn: 'American-style university',
    description: "La seule université de style américain au Maroc (1995). Cours 100% anglais, campus de montagne, très sélective. Partenariats avec +100 universités mondiales. Bourses disponibles.",
    descriptionAr: 'الجامعة الوحيدة بالأسلوب الأمريكي بالمغرب (1995). دراسة كاملة بالإنجليزية، حرم جبلي، انتقائية جداً. شراكات مع +100 جامعة عالمية. منح متاحة.',
    tuition: '80 000 – 120 000 MAD/an',
    tuitionAr: '80 000 – 120 000 درهم/سنة',
    duration: '3 – 4 ans',
    durationAr: '3 – 4 سنوات',
    programs: ['Computer Science', 'Business Administration', 'Engineering', 'International Studies', 'Media Studies', 'Law'],
    programsAr: ['علوم الحاسوب', 'إدارة الأعمال', 'الهندسة', 'الدراسات الدولية', 'الإعلام', 'القانون'],
    streams: ['sm', 'pc', 'eco', 'lettres'],
    url: 'https://www.aui.ma',
    badge: '🇺🇸 US-Style',
    badgeColor: 'bg-blue-100 text-blue-700',
    featured: true,
  },
  {
    id: 'supmti',
    name: 'SUPMTI',
    nameAr: 'المدرسة العليا لمديري وتقنيي الإعلاميات',
    city: 'Rabat',
    cityAr: 'الرباط',
    region: 'rabat-sale',
    category: 'tech',
    tagFr: 'Informatique & Réseaux',
    tagAr: 'الإعلاميات والشبكات',
    tagEn: 'IT & Networks',
    description: "École privée spécialisée en informatique, réseaux, cybersécurité et management des SI. Formation professionnalisante avec stages intensifs, bonne insertion dans le secteur tech marocain.",
    descriptionAr: 'مدرسة خاصة متخصصة في الإعلاميات والشبكات والأمن السيبراني. تكوين مهني مع تداريب مكثفة وإدماج جيد في قطاع التكنولوجيا المغربي.',
    tuition: '15 000 – 25 000 MAD/an',
    tuitionAr: '15 000 – 25 000 درهم/سنة',
    duration: '3 ans (Licence) / 5 ans (Ingénieur)',
    durationAr: '3 سنوات (إجازة) / 5 سنوات (مهندس)',
    programs: ['Génie Informatique', 'Cybersécurité', 'Réseaux & Systèmes', 'Data Science', 'Management des SI', 'Développement Mobile'],
    programsAr: ['هندسة الإعلاميات', 'الأمن السيبراني', 'الشبكات والأنظمة', 'علوم البيانات', 'تدبير نظم المعلومات', 'تطوير الجوال'],
    streams: ['sm', 'pc', 'svt', 'tech'],
    url: 'https://www.supmti.ac.ma',
    badge: 'Tech ',
    badgeColor: 'bg-sky-100 text-sky-700',
    featured: true,
  },
  {
    id: 'uir',
    name: 'Université Internationale de Rabat (UIR)',
    nameAr: 'الجامعة الدولية بالرباط',
    city: 'Rabat',
    cityAr: 'الرباط',
    region: 'rabat-sale',
    category: 'multi',
    tagFr: 'Université pluridisciplinaire',
    tagAr: 'جامعة متعددة التخصصات',
    tagEn: 'Multidisciplinary university',
    description: "Université privée reconnue par l'État avec partenariats France & Canada. Ingénierie, droit, architecture, management et sciences politiques sur un campus moderne.",
    descriptionAr: 'جامعة خاصة معترف بها من الدولة مع شراكات فرنسية وكندية. هندسة وقانون وعمارة وتدبير وعلوم سياسية في حرم حديث.',
    tuition: '35 000 – 65 000 MAD/an',
    tuitionAr: '35 000 – 65 000 درهم/سنة',
    duration: '3 – 5 ans',
    durationAr: '3 – 5 سنوات',
    programs: ['Ingénierie Informatique', 'Droit International', 'Architecture', 'Management', 'Sciences Politiques', 'Aéronautique'],
    programsAr: ['هندسة إعلاميات', 'قانون دولي', 'هندسة معمارية', 'تدبير', 'علوم سياسية', 'طيران'],
    streams: ['sm', 'pc', 'eco', 'lettres', 'tech'],
    url: 'https://www.uir.ac.ma',
    badge: '🇫🇷🇨🇦 Double diplôme',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'hem',
    name: 'HEM Business School',
    nameAr: 'مدرسة HEM للأعمال',
    city: 'Casablanca / Rabat / Fès / Marrakech',
    cityAr: 'الدار البيضاء / الرباط / فاس / مراكش',
    region: 'casablanca-settat',
    category: 'business',
    tagFr: 'Business & Management',
    tagAr: 'الأعمال والتدبير',
    tagEn: 'Business & Management',
    description: "Grande école de commerce privée reconnue fondée en 1988. Formation en management, marketing, finance et entrepreneuriat. Forte notoriété auprès des entreprises marocaines.",
    descriptionAr: 'مدرسة تجارة خاصة معترف بها تأسست عام 1988. تكوين في التدبير والتسويق والمالية والمقاولة. سمعة قوية لدى المؤسسات المغربية.',
    tuition: '40 000 – 70 000 MAD/an',
    tuitionAr: '40 000 – 70 000 درهم/سنة',
    duration: '3 – 5 ans',
    durationAr: '3 – 5 سنوات',
    programs: ['Bachelor Management', 'MBA', 'Marketing Digital', "Finance d'entreprise", 'Entrepreneuriat', 'RH & Leadership'],
    programsAr: ['باشلور تدبير', 'MBA', 'تسويق رقمي', 'مالية مقاولات', 'ريادة الأعمال', 'الموارد البشرية'],
    streams: ['eco', 'lettres', 'sm', 'pc'],
    url: 'https://www.hem.ac.ma',
    badge: 'Business ',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'esca',
    name: 'ESCA École de Management',
    nameAr: 'ESCA مدرسة التدبير',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    region: 'casablanca-settat',
    category: 'business',
    tagFr: 'Management & Affaires internationales',
    tagAr: 'التدبير والأعمال الدولية',
    tagEn: 'Management & International Business',
    description: "Fondée en 1992, ESCA est accréditée AACSB (1% des écoles mondiales). Bachelors, MBA et Masters en management des affaires. Partenariats internationaux très actifs.",
    descriptionAr: 'تأسست عام 1992، ESCA حاصلة على اعتماد AACSB (1% من مدارس العالم). باشلور وماجستير في إدارة الأعمال. شراكات دولية نشطة جداً.',
    tuition: '50 000 – 80 000 MAD/an',
    tuitionAr: '50 000 – 80 000 درهم/سنة',
    duration: '3 – 5 ans',
    durationAr: '3 – 5 سنوات',
    programs: ['Bachelor BBA', 'MBA', 'Master Management', "Droit des Affaires", 'Finance Internationale', 'Marketing & Ventes'],
    programsAr: ['باشلور BBA', 'MBA', 'ماستر تدبير', 'قانون الأعمال', 'مالية دولية', 'تسويق ومبيعات'],
    streams: ['eco', 'sm', 'lettres'],
    url: 'https://www.esca.ma',
    badge: 'AACSB ',
    badgeColor: 'bg-violet-100 text-violet-700',
    featured: true,
  },
  {
    id: 'mundiapolis',
    name: 'Mundiapolis',
    nameAr: 'موندياوبوليس',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    region: 'casablanca-settat',
    category: 'business',
    tagFr: 'Communication & Digital',
    tagAr: 'التواصل والرقمي',
    tagEn: 'Communication & Digital',
    description: "Université privée spécialisée en communication, business et design. Ambiance internationale, filières en anglais/français, forte orientation vers le digital et les médias.",
    descriptionAr: 'جامعة خاصة متخصصة في التواصل والأعمال والتصميم. بيئة دولية، مسالك بالإنجليزية والفرنسية، توجه قوي نحو الرقمي والإعلام.',
    tuition: '30 000 – 55 000 MAD/an',
    tuitionAr: '30 000 – 55 000 درهم/سنة',
    duration: '3 – 5 ans',
    durationAr: '3 – 5 سنوات',
    programs: ['Communication Digitale', 'Business Administration', 'Design Graphique', 'Journalisme', 'Marketing', 'E-Commerce'],
    programsAr: ['تواصل رقمي', 'إدارة أعمال', 'تصميم غرافيكي', 'صحافة', 'تسويق', 'تجارة إلكترونية'],
    streams: ['eco', 'lettres', 'tech'],
    url: 'https://www.mundiapolis.ma',
    badge: 'International ',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'ismonaco',
    name: 'IS Monaco Morocco',
    nameAr: 'معهد IS موناكو المغرب',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    region: 'casablanca-settat',
    category: 'hotel',
    tagFr: 'Hôtellerie & Tourisme',
    tagAr: 'الفندقة والسياحة',
    tagEn: 'Hospitality & Tourism',
    description: "Institut spécialisé en management hôtelier et touristique, filiale IS Monaco. Formations reconnues, stages en hôtels 5 étoiles, débouchés internationaux très forts.",
    descriptionAr: 'معهد متخصص في تدبير الفنادق والسياحة، فرع IS Monaco. تكوينات معترف بها، تداريب في فنادق 5 نجوم، فرص دولية قوية جداً.',
    tuition: '45 000 – 70 000 MAD/an',
    tuitionAr: '45 000 – 70 000 درهم/سنة',
    duration: '3 – 4 ans',
    durationAr: '3 – 4 سنوات',
    programs: ['Management Hôtelier', 'Tourisme International', 'Événementiel', 'F&B Management', 'Luxury Brand Management'],
    programsAr: ['تدبير فندقي', 'سياحة دولية', 'تنظيم الأحداث', 'تدبير الأغذية والمشروبات', 'تدبير العلامات الفاخرة'],
    streams: ['eco', 'lettres'],
    url: 'https://www.is-monaco.ma',
    badge: ' Monaco',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
  {
    id: 'emi-privee',
    name: 'ENSIAS / EMSI / ISMAGI',
    nameAr: 'ENSIAS / EMSI / ISMAGI',
    city: 'Casablanca / Rabat',
    cityAr: 'الدار البيضاء / الرباط',
    region: 'casablanca-settat',
    category: 'tech',
    tagFr: 'Ingénierie informatique & Réseaux',
    tagAr: 'هندسة الإعلاميات والشبكات',
    tagEn: 'CS Engineering & Networks',
    description: "Groupe d'écoles privées d'ingénierie informatique reconnues. Formation solide en développement, cybersécurité et réseaux avec forte insertion professionnelle.",
    descriptionAr: 'مجموعة مدارس خاصة لهندسة الإعلاميات معترف بها. تكوين متين في التطوير والأمن السيبراني والشبكات مع إدماج مهني قوي.',
    tuition: '20 000 – 40 000 MAD/an',
    tuitionAr: '20 000 – 40 000 درهم/سنة',
    duration: '5 ans (cycle ingénieur)',
    durationAr: '5 سنوات (دورة مهندس)',
    programs: ['Génie Logiciel', 'Cybersécurité', 'Intelligence Artificielle', 'Cloud Computing', 'Réseaux & Télécoms'],
    programsAr: ['هندسة البرمجيات', 'الأمن السيبراني', 'الذكاء الاصطناعي', 'الحوسبة السحابية', 'الشبكات والاتصالات'],
    streams: ['sm', 'pc', 'tech'],
    url: 'https://www.emsi.ma',
    badge: 'Ingénieur ',
    badgeColor: 'bg-gray-100 text-gray-700',
  },
  {
  id: 'uic',
  name: 'Université Internationale de Casablanca (UIC)',
  nameAr: 'الجامعة الدولية للدار البيضاء',
  city: 'Casablanca',
  cityAr: 'الدار البيضاء',
  region: 'casablanca-settat',
  category: 'multi',
  tagFr: 'Université pluridisciplinaire',
  tagAr: 'جامعة متعددة التخصصات',
  tagEn: 'Multidisciplinary University',
  description: "Université privée reconnue par l'État proposant des formations en ingénierie, santé, business, droit et architecture avec des partenariats internationaux.",
  descriptionAr: 'جامعة خاصة معترف بها من الدولة تقدم تكوينات في الهندسة والصحة والأعمال والقانون والهندسة المعمارية بشراكات دولية.',
  tuition: '40 000 – 80 000 MAD/an',
  tuitionAr: '40 000 – 80 000 درهم/سنة',
  duration: '3 – 5 ans',
  durationAr: '3 – 5 سنوات',
  programs: ['Ingénierie', 'Business', 'Droit', 'Architecture', 'Sciences de la Santé'],
  programsAr: ['الهندسة', 'الأعمال', 'القانون', 'الهندسة المعمارية', 'علوم الصحة'],
  streams: ['sm', 'pc', 'svt', 'eco', 'lettres'],
  url: 'https://www.uic.ac.ma',
  badge: ' Reconnue État',
  badgeColor: 'bg-blue-100 text-blue-700',
},
{
  id: 'upm',
  name: 'Université Privée de Marrakech (UPM)',
  nameAr: 'الجامعة الخاصة بمراكش',
  city: 'Marrakech',
  cityAr: 'مراكش',
  region: 'marrakech-safi',
  category: 'multi',
  tagFr: 'Ingénierie & Santé',
  tagAr: 'الهندسة والصحة',
  tagEn: 'Engineering & Health',
  description: "Université privée reconnue offrant des formations en ingénierie, management, santé et architecture.",
  descriptionAr: 'جامعة خاصة معترف بها توفر تكوينات في الهندسة والتدبير والصحة والهندسة المعمارية.',
  tuition: '35 000 – 75 000 MAD/an',
  tuitionAr: '35 000 – 75 000 درهم/سنة',
  duration: '3 – 6 ans',
  durationAr: '3 – 6 سنوات',
  programs: ['Ingénierie', 'Management', 'Médecine', 'Architecture', 'Dentaire'],
  programsAr: ['الهندسة', 'التدبير', 'الطب', 'الهندسة المعمارية', 'طب الأسنان'],
  streams: ['sm', 'pc', 'svt', 'eco'],
  url: 'https://www.upm.ac.ma',
  badge: ' Marrakech',
  badgeColor: 'bg-orange-100 text-orange-700',
},
{
  id: 'um6ss',
  name: 'Université Mohammed VI des Sciences et de la Santé',
  nameAr: 'جامعة محمد السادس لعلوم الصحة',
  city: 'Casablanca / Rabat',
  cityAr: 'الدار البيضاء / الرباط',
  region: 'casablanca-settat',
  category: 'health',
  tagFr: 'Médecine & Santé',
  tagAr: 'الطب وعلوم الصحة',
  tagEn: 'Medicine & Health Sciences',
  description: "Université privée reconnue spécialisée dans les sciences médicales et paramédicales.",
  descriptionAr: 'جامعة خاصة معترف بها متخصصة في العلوم الطبية وشبه الطبية.',
  tuition: '60 000 – 130 000 MAD/an',
  tuitionAr: '60 000 – 130 000 درهم/سنة',
  duration: '3 – 7 ans',
  durationAr: '3 – 7 سنوات',
  programs: ['Médecine', 'Pharmacie', 'Dentaire', 'Infirmier', 'Biologie Médicale'],
  programsAr: ['الطب', 'الصيدلة', 'طب الأسنان', 'التمريض', 'البيولوجيا الطبية'],
  streams: ['sm', 'pc', 'svt'],
  url: 'https://www.um6ss.ma',
  badge: ' Santé',
  badgeColor: 'bg-red-100 text-red-700',
},
{
  id: 'uiass',
  name: 'Université Internationale Abulcasis des Sciences de la Santé',
  nameAr: 'جامعة أبو القاسم الدولية لعلوم الصحة',
  city: 'Rabat',
  cityAr: 'الرباط',
  region: 'rabat-sale',
  category: 'health',
  tagFr: 'Sciences de la Santé',
  tagAr: 'علوم الصحة',
  tagEn: 'Health Sciences',
  description: "Université privée reconnue spécialisée dans les métiers de la santé et les sciences médicales.",
  descriptionAr: 'جامعة خاصة معترف بها متخصصة في مهن الصحة والعلوم الطبية.',
  tuition: '50 000 – 120 000 MAD/an',
  tuitionAr: '50 000 – 120 000 درهم/سنة',
  duration: '3 – 7 ans',
  durationAr: '3 – 7 سنوات',
  programs: ['Médecine', 'Pharmacie', 'Dentaire', 'Kinésithérapie'],
  programsAr: ['الطب', 'الصيدلة', 'طب الأسنان', 'العلاج الطبيعي'],
  streams: ['sm', 'pc', 'svt'],
  url: 'https://www.uiass.ma',
  badge: ' Santé',
  badgeColor: 'bg-pink-100 text-pink-700',
},
{
  id: 'universiapolis',
  name: 'Universiapolis Agadir',
  nameAr: 'يونيفيرسيابوليس أكادير',
  city: 'Agadir',
  cityAr: 'أكادير',
  region: 'souss-massa',
  category: 'multi',
  tagFr: 'Ingénierie & Management',
  tagAr: 'الهندسة والتدبير',
  tagEn: 'Engineering & Management',
  description: "Université privée reconnue proposant des cursus en ingénierie, management et architecture.",
  descriptionAr: 'جامعة خاصة معترف بها تقدم مسارات في الهندسة والتدبير والهندسة المعمارية.',
  tuition: '30 000 – 70 000 MAD/an',
  tuitionAr: '30 000 – 70 000 درهم/سنة',
  duration: '3 – 5 ans',
  durationAr: '3 – 5 سنوات',
  programs: ['Génie Informatique', 'Management', 'Architecture', 'Finance'],
  programsAr: ['هندسة الإعلاميات', 'التدبير', 'الهندسة المعمارية', 'المالية'],
  streams: ['sm', 'pc', 'eco', 'tech'],
  url: 'https://www.universiapolis.ma',
  badge: ' Agadir',
  badgeColor: 'bg-cyan-100 text-cyan-700',
},
{
  id: 'ecc',
  name: 'École Centrale Casablanca',
  nameAr: 'المدرسة المركزية للدار البيضاء',
  city: 'Casablanca',
  cityAr: 'الدار البيضاء',
  region: 'casablanca-settat',
  category: 'tech',
  tagFr: 'Grande École d’Ingénieurs',
  tagAr: 'مدرسة عليا للمهندسين',
  tagEn: 'Engineering School',
  description: "Grande école d'ingénieurs reconnue par l'État et partenaire du réseau Centrale en France.",
  descriptionAr: 'مدرسة عليا للمهندسين معترف بها من الدولة وشريكة لشبكة Centrale الفرنسية.',
  tuition: '80 000 – 100 000 MAD/an',
  tuitionAr: '80 000 – 100 000 درهم/سنة',
  duration: '5 ans',
  durationAr: '5 سنوات',
  programs: ['Génie Industriel', 'Data Science', 'IA', 'Énergie', 'Systèmes Embarqués'],
  programsAr: ['الهندسة الصناعية', 'علوم البيانات', 'الذكاء الاصطناعي', 'الطاقة', 'الأنظمة المدمجة'],
  streams: ['sm', 'pc'],
  url: 'https://www.centralecasablanca.ma',
  badge: ' Centrale',
  badgeColor: 'bg-slate-100 text-slate-700',
},
{
  id: 'eac',
  name: 'École d’Architecture de Casablanca',
  nameAr: 'مدرسة الهندسة المعمارية بالدار البيضاء',
  city: 'Casablanca',
  cityAr: 'الدار البيضاء',
  region: 'casablanca-settat',
  category: 'architecture',
  tagFr: 'Architecture',
  tagAr: 'الهندسة المعمارية',
  tagEn: 'Architecture',
  description: "École privée reconnue spécialisée en architecture et urbanisme.",
  descriptionAr: 'مدرسة خاصة معترف بها متخصصة في الهندسة المعمارية والتعمير.',
  tuition: '50 000 – 70 000 MAD/an',
  tuitionAr: '50 000 – 70 000 درهم/سنة',
  duration: '6 ans',
  durationAr: '6 سنوات',
  programs: ['Architecture', 'Urbanisme', 'Design Architectural'],
  programsAr: ['الهندسة المعمارية', 'التعمير', 'التصميم المعماري'],
  streams: ['sm', 'pc'],
  url: 'https://www.eac.ma',
  badge: ' Architecture',
  badgeColor: 'bg-yellow-100 text-yellow-700',
},
  

];

// ══════════════════════════════════════════════════════════════════════════════
// MOROCCO REGIONS MAP DATA
// ══════════════════════════════════════════════════════════════════════════════

interface RegionInfo {
  id: MoroccoRegion;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  // SVG path for each of Morocco's 12 regions (simplified polygons)
  path: string;
  // Label anchor point inside the region
  labelX: number;
  labelY: number;
}

// Simplified SVG paths for Morocco's 12 administrative regions
// ViewBox: 0 0 500 600
const REGIONS: RegionInfo[] = [
  {
    id: 'tanger-tetouan',
    nameFr: 'Tanger-Tétouan-Al Hoceïma',
    nameAr: 'طنجة-تطوان-الحسيمة',
    nameEn: 'Tanger-Tétouan',
    path: 'M 130 10 L 260 10 L 280 30 L 270 60 L 240 80 L 200 90 L 170 85 L 140 70 L 120 50 Z',
    labelX: 200,
    labelY: 50,
  },
  {
    id: 'oriental',
    nameFr: 'Oriental',
    nameAr: 'الشرق',
    nameEn: 'Oriental',
    path: 'M 260 10 L 380 10 L 400 20 L 410 50 L 390 90 L 360 110 L 320 120 L 290 110 L 270 90 L 270 60 L 280 30 Z',
    labelX: 335,
    labelY: 65,
  },
  {
    id: 'fes-meknes',
    nameFr: 'Fès-Meknès',
    nameAr: 'فاس-مكناس',
    nameEn: 'Fès-Meknès',
    path: 'M 140 70 L 170 85 L 200 90 L 240 80 L 270 90 L 290 110 L 270 140 L 240 155 L 200 160 L 165 150 L 145 130 L 130 105 Z',
    labelX: 210,
    labelY: 120,
  },
  {
    id: 'rabat-sale',
    nameFr: 'Rabat-Salé-Kénitra',
    nameAr: 'الرباط-سلا-القنيطرة',
    nameEn: 'Rabat-Salé',
    path: 'M 80 90 L 130 75 L 140 70 L 130 105 L 120 135 L 100 155 L 75 155 L 60 130 L 65 105 Z',
    labelX: 97,
    labelY: 118,
  },
  {
    id: 'beni-mellal',
    nameFr: 'Béni Mellal-Khénifra',
    nameAr: 'بني ملال-خنيفرة',
    nameEn: 'Béni Mellal',
    path: 'M 145 130 L 165 150 L 200 160 L 240 155 L 270 140 L 290 155 L 285 190 L 255 210 L 220 215 L 185 205 L 155 185 L 140 165 Z',
    labelX: 215,
    labelY: 175,
  },
  {
    id: 'casablanca-settat',
    nameFr: 'Casablanca-Settat',
    nameAr: 'الدار البيضاء-سطات',
    nameEn: 'Casablanca',
    path: 'M 60 130 L 75 155 L 100 155 L 120 135 L 140 165 L 155 185 L 140 205 L 110 215 L 75 210 L 50 190 L 45 165 L 50 140 Z',
    labelX: 97,
    labelY: 178,
  },
  {
    id: 'marrakech-safi',
    nameFr: 'Marrakech-Safi',
    nameAr: 'مراكش-آسفي',
    nameEn: 'Marrakech-Safi',
    path: 'M 50 190 L 75 210 L 110 215 L 140 205 L 155 185 L 185 205 L 220 215 L 240 230 L 225 260 L 195 275 L 155 280 L 110 265 L 70 250 L 45 225 Z',
    labelX: 145,
    labelY: 235,
  },
  {
    id: 'draa-tafilalet',
    nameFr: 'Drâa-Tafilalet',
    nameAr: 'درعة-تافيلالت',
    nameEn: 'Drâa-Tafilalet',
    path: 'M 220 215 L 255 210 L 285 190 L 320 195 L 360 215 L 375 250 L 365 295 L 330 320 L 285 330 L 250 315 L 225 280 L 225 260 L 240 230 Z',
    labelX: 295,
    labelY: 265,
  },
  {
    id: 'souss-massa',
    nameFr: 'Souss-Massa',
    nameAr: 'سوس-ماسة',
    nameEn: 'Souss-Massa',
    path: 'M 45 225 L 70 250 L 110 265 L 155 280 L 195 275 L 225 280 L 225 315 L 200 335 L 165 350 L 120 355 L 75 340 L 45 315 L 30 280 L 35 250 Z',
    labelX: 130,
    labelY: 305,
  },
  {
    id: 'guelmim',
    nameFr: 'Guelmim-Oued Noun',
    nameAr: 'كلميم-واد نون',
    nameEn: 'Guelmim',
    path: 'M 30 280 L 45 315 L 75 340 L 120 355 L 165 350 L 200 335 L 225 315 L 250 315 L 260 360 L 235 395 L 185 410 L 130 415 L 75 395 L 40 365 L 20 325 Z',
    labelX: 140,
    labelY: 370,
  },
  {
    id: 'laayoune-sakia',
    nameFr: 'Laâyoune-Sakia El Hamra',
    nameAr: 'العيون-الساقية الحمراء',
    nameEn: 'Laâyoune',
    path: 'M 20 325 L 40 365 L 75 395 L 130 415 L 185 410 L 235 395 L 260 360 L 285 365 L 295 420 L 270 470 L 210 490 L 145 490 L 85 475 L 35 445 L 10 400 L 10 355 Z',
    labelX: 153,
    labelY: 435,
  },
  {
    id: 'dakhla-oued',
    nameFr: 'Dakhla-Oued Ed-Dahab',
    nameAr: 'الداخلة-وادي الذهب',
    nameEn: 'Dakhla',
    path: 'M 10 400 L 35 445 L 85 475 L 145 490 L 210 490 L 270 470 L 295 420 L 310 460 L 305 530 L 260 560 L 185 570 L 105 555 L 45 525 L 10 490 Z',
    labelX: 160,
    labelY: 510,
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// MOROCCO MAP COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

// Maps MOROCCO_MAP_REGIONS short IDs → PrivateSchoolsPage MoroccoRegion IDs
const MAP_ID_TO_REGION: Record<string, MoroccoRegion> = {
  tanger: 'tanger-tetouan',
  oriental: 'oriental',
  fes: 'fes-meknes',
  rabat: 'rabat-sale',
  casablanca: 'casablanca-settat',
  marrakech: 'marrakech-safi',
  draa: 'draa-tafilalet',
  souss: 'souss-massa',
  beni: 'beni-mellal',
  gulmim: 'guelmim',
  laayoune: 'laayoune-sakia',
  dakhla: 'dakhla-oued',
};
const REGION_TO_MAP_ID = Object.fromEntries(
  Object.entries(MAP_ID_TO_REGION).map(([k, v]) => [v, k])
) as Record<MoroccoRegion, string>;

function MoroccoMap({
  schools,
  isRtl,
  language,
  onRegionClick,
  activeRegion,
}: {
  schools: PrivateSchool[];
  isRtl: boolean;
  language: string;
  onRegionClick: (regionId: MoroccoRegion | null) => void;
  activeRegion: MoroccoRegion | null;
}) {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const handleZoomIn = () => setZoom((z) => Math.min(+(z + MAP_ZOOM_STEP).toFixed(1), MAP_ZOOM_MAX));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(+(z - MAP_ZOOM_STEP).toFixed(1), MAP_ZOOM_MIN);
      if (next <= MAP_ZOOM_MIN) { setPanX(0); setPanY(0); }
      else { const c = clampMapPan(next, panX, panY); setPanX(c.x); setPanY(c.y); }
      return next;
    });
  };
  const handleReset = () => { setZoom(1); setPanX(0); setPanY(0); };

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= MAP_ZOOM_MIN) return;
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startPanX: panX, startPanY: panY };
    setIsDragging(true);
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.active || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const svgW = 1000 / zoom;
    const svgH = 1000 / zoom;
    const newPanX = dragRef.current.startPanX - (e.clientX - dragRef.current.startX) * (svgW / rect.width);
    const newPanY = dragRef.current.startPanY - (e.clientY - dragRef.current.startY) * (svgH / rect.height);
    const clamped = clampMapPan(zoom, newPanX, newPanY);
    setPanX(clamped.x);
    setPanY(clamped.y);
  };
  const onDragEnd = () => { dragRef.current.active = false; setIsDragging(false); };

  // Count schools per region
  const countByRegion = schools.reduce<Record<string, number>>((acc, s) => {
    acc[s.region] = (acc[s.region] ?? 0) + 1;
    return acc;
  }, {});

  // Map IDs (short form) for regions that have at least one school
  const activeMapIds = Object.keys(countByRegion)
    .map((rid) => REGION_TO_MAP_ID[rid as MoroccoRegion])
    .filter(Boolean) as string[];

  const getRegionLabel = (r: RegionInfo) =>
    isRtl ? r.nameAr : language === 'en' ? r.nameEn : r.nameFr;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {isRtl ? 'خريطة الجهات' : language === 'en' ? 'Region Map' : 'Carte des Régions'}
            </p>
            <p className="text-[10px] text-slate-400">
              {isRtl ? 'انقر على جهة لرؤية فرايضها' : language === 'en' ? 'Click a region to see fees' : 'Cliquez une région pour voir les frais'}
            </p>
          </div>
        </div>
        {activeRegion && (
          <button
            type="button"
            onClick={() => onRegionClick(null)}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-purple-600 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 px-2.5 py-1.5 rounded-lg transition"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {isRtl ? 'إلغاء' : language === 'en' ? 'Clear' : 'Effacer'}
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col md:flex-row gap-4">
        {/* SVG Map */}
        <div
          ref={containerRef}
          className="flex-shrink-0 mx-auto relative"
          style={{ maxWidth: 300, cursor: zoom > MAP_ZOOM_MIN ? (isDragging ? 'grabbing' : 'grab') : 'default', userSelect: 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
        >
          <MoroccoMapSvg
            regions={MOROCCO_MAP_REGIONS}
            selectedRegionId={activeRegion ? (REGION_TO_MAP_ID[activeRegion] ?? null) : null}
            activeRegionFilter={null}
            hoveredPin={null}
            lang={isRtl ? 'ar' : language === 'en' ? 'en' : 'fr'}
            zoom={zoom}
            panX={panX}
            panY={panY}
            bgColor="white"
            activeRegionIds={activeMapIds}
            regionLabel={(r: MoroccoRegionData) => isRtl ? r.nameAr : r.nameFr}
            onHover={() => {}}
            onSelect={(r: MoroccoRegionData) => {
              const regionId = MAP_ID_TO_REGION[r.id];
              if (regionId && countByRegion[regionId]) {
                onRegionClick(activeRegion === regionId ? null : regionId);
              }
            }}
          />
          {/* Zoom controls */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1">
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= MAP_ZOOM_MAX}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition text-base font-bold leading-none"
              title={isRtl ? 'تكبير' : language === 'en' ? 'Zoom in' : 'Agrandir'}
            >+</button>
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= MAP_ZOOM_MIN}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition text-base font-bold leading-none"
              title={isRtl ? 'تصغير' : language === 'en' ? 'Zoom out' : 'Réduire'}
            >−</button>
            {zoom > MAP_ZOOM_MIN && (
              <button
                type="button"
                onClick={handleReset}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition text-xs font-bold leading-none"
                title={isRtl ? 'إعادة ضبط' : language === 'en' ? 'Reset' : 'Réinitialiser'}
              >⊙</button>
            )}
          </div>
        </div>

        {/* Legend / Panel */}
        <div className="flex-1 min-w-0">
          {activeRegion ? (
            // Active region — show schools + fees
            (() => {
              const region = REGIONS.find((r) => r.id === activeRegion)!;
              const regionSchools = schools.filter((s) => s.region === activeRegion);
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    <p className="text-sm font-extrabold text-purple-700">{getRegionLabel(region)}</p>
                    <span className="ml-auto text-[11px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                      {regionSchools.length} {isRtl ? 'مؤسسة' : language === 'en' ? 'schools' : 'établissements'}
                    </span>
                  </div>
                  {regionSchools.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl px-3 py-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white border border-purple-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">
                          {isRtl ? s.nameAr : s.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mb-1.5">{isRtl ? s.cityAr : s.city}</p>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[11px] font-bold text-emerald-700">
                            {isRtl ? s.tuitionAr : s.tuition}
                          </span>
                        </div>
                      </div>
                      {s.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${s.badgeColor}`}>
                          {s.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()
          ) : (
            // No region selected — show legend
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                {isRtl ? 'الجهات المتوفرة' : language === 'en' ? 'Available Regions' : 'Régions disponibles'}
              </p>
              {REGIONS.filter((r) => (countByRegion[r.id] ?? 0) > 0).map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => onRegionClick(region.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 transition group text-left"
                >
                  <div className="w-6 h-6 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center flex-shrink-0 transition">
                    <span className="text-[10px] font-black text-purple-600">{countByRegion[region.id]}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-purple-700 transition truncate">
                    {getRegionLabel(region)}
                  </span>
                  <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-400 transition ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CATEGORIES: { key: Category | 'all'; labelFr: string; labelAr: string; labelEn: string; color: string }[] = [
  { key: 'all',      labelFr: 'Toutes',       labelAr: 'الكل',         labelEn: 'All',          color: 'bg-slate-700 text-white' },
  { key: 'tech',     labelFr: 'Informatique', labelAr: 'إعلاميات',     labelEn: 'Tech',         color: 'bg-sky-500 text-white' },
  { key: 'business', labelFr: 'Business',     labelAr: 'أعمال',        labelEn: 'Business',     color: 'bg-amber-500 text-white' },
  { key: 'multi',    labelFr: 'Multi',        labelAr: 'متعدد',        labelEn: 'Multi',        color: 'bg-emerald-500 text-white' },
  { key: 'hotel',    labelFr: 'Hôtellerie',   labelAr: 'فندقة',        labelEn: 'Hospitality',  color: 'bg-teal-500 text-white' },
  { key: 'health',   labelFr: 'Santé',        labelAr: 'صحة',          labelEn: 'Health',       color: 'bg-rose-500 text-white' },
  { key: 'design',   labelFr: 'Design',       labelAr: 'تصميم',        labelEn: 'Design',       color: 'bg-purple-500 text-white' },
  { key: 'architecture', labelFr: 'Architecture', labelAr: 'هندسة معمارية', labelEn: 'Architecture', color: 'bg-orange-500 text-white' },
];

const STREAMS: { key: Stream | 'all'; labelFr: string; labelAr: string; labelEn: string }[] = [
  { key: 'all',     labelFr: 'Toutes filières', labelAr: 'كل الشعب',         labelEn: 'All tracks' },
  { key: 'sm',      labelFr: 'Sciences Math',   labelAr: 'علوم رياضية',       labelEn: 'Math Sciences' },
  { key: 'pc',      labelFr: 'Sciences Phy.',   labelAr: 'علوم فيزيائية',     labelEn: 'Physical Sciences' },
  { key: 'svt',     labelFr: 'SVT',             labelAr: 'علوم الحياة',        labelEn: 'Life Sciences' },
  { key: 'eco',     labelFr: 'Sciences Éco',    labelAr: 'علوم اقتصادية',     labelEn: 'Economic Sciences' },
  { key: 'lettres', labelFr: 'Lettres',         labelAr: 'آداب',              labelEn: 'Literature' },
  { key: 'tech',    labelFr: 'Sciences & Tech', labelAr: 'علوم وتكنولوجيا',   labelEn: 'Sciences & Tech' },
];

// ══════════════════════════════════════════════════════════════════════════════
// SCHOOL CARD
// ══════════════════════════════════════════════════════════════════════════════
function SchoolCard({ school, isRtl, language }: { school: PrivateSchool; isRtl: boolean; language: string }) {
  const [open, setOpen] = useState(false);

  const name = isRtl ? school.nameAr : school.name;
  const city = isRtl ? school.cityAr : school.city;
  const tag = isRtl ? school.tagAr : language === 'en' ? school.tagEn : school.tagFr;
  const desc = isRtl ? school.descriptionAr : school.description;
  const tuition = isRtl ? school.tuitionAr : school.tuition;
  const duration = isRtl ? school.durationAr : school.duration;
  const programs = isRtl ? school.programsAr : school.programs;

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-200 bg-white border ${
      open ? 'border-purple-300 shadow-md' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200'
    }`}>

      {/* Left accent bar for featured */}
      <div className={`h-0.5 w-full ${school.featured ? 'bg-gradient-to-r from-purple-500 via-indigo-400 to-violet-500' : 'bg-slate-100'}`} />

      {/* Card header */}
      <button type="button" onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="flex items-center gap-4 px-5 py-4">

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" fill="none" stroke="#7c3aed" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">{name}</h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {school.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${school.badgeColor}`}>
                    {school.badge}
                  </span>
                )}
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {city}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="text-[11px] font-semibold text-purple-600">{tag}</span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed mt-1">{desc}</p>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">

          {/* Description full */}
          <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>

          {/* Duration + Tuition row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-purple-50/60 border border-purple-100 rounded-xl px-3 py-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  {isRtl ? 'المدة' : language === 'en' ? 'Duration' : 'Durée'}
                </p>
                <p className="text-xs font-semibold text-slate-800 leading-tight">{duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-indigo-50/60 border border-indigo-100 rounded-xl px-3 py-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  {isRtl ? 'التكاليف' : language === 'en' ? 'Tuition' : 'Frais'}
                </p>
                <p className="text-xs font-semibold text-slate-800 leading-tight">{tuition}</p>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              {isRtl ? 'التخصصات والمسالك' : language === 'en' ? 'Programs & Tracks' : 'Filières & Spécialisations'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {programs.map((prog) => (
                <span key={prog} className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 font-medium">
                  {prog}
                </span>
              ))}
            </div>
          </div>

          {/* Official website */}
          <a
            href={school.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-xl transition-all shadow-sm"
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
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function PrivateSchoolsPage() {
  const { language } = useAuth();
  const isRtl = language === 'ar';

  const [catFilter, setCatFilter] = useState<Category | 'all'>('all');
  const [streamFilter, setStreamFilter] = useState<Stream | 'all'>('all');
  const [query, setQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [regionFilter, setRegionFilter] = useState<MoroccoRegion | null>(null);

  const filtered = SCHOOLS.filter((s) => {
    if (catFilter !== 'all' && s.category !== catFilter) return false;
    if (streamFilter !== 'all' && !s.streams.includes(streamFilter as Stream)) return false;
    if (featuredOnly && !s.featured) return false;
    if (regionFilter && s.region !== regionFilter) return false;
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.nameAr.includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.cityAr.includes(q) ||
      s.programs.some((p) => p.toLowerCase().includes(q)) ||
      s.programsAr.some((p) => p.includes(q))
    );
  });

  const getCatLabel = (c: typeof CATEGORIES[0]) =>
    isRtl ? c.labelAr : language === 'en' ? c.labelEn : c.labelFr;

  const getStreamLabel = (s: typeof STREAMS[0]) =>
    isRtl ? s.labelAr : language === 'en' ? s.labelEn : s.labelFr;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto min-h-screen bg-slate-50" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <div className="mb-8 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600" />

        <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-2">
              {isRtl ? 'المؤسسات الخاصة' : language === 'en' ? 'Private Institutions' : 'Établissements Privés'}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight mb-1">
              {isRtl
                ? 'أفضل المدارس والجامعات الخاصة بعد البكالوريا المعترف بها من طرف الدولة في المغرب.'
                : language === 'en'
                  ? 'The best private schools and universities after the baccalaureate, recognized by the State in Morocco.'
                  : 'Les meilleures écoles et universités privées après le baccalauréat, reconnues par l’État au Maroc.'}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
              {isRtl
                ? 'اكتشف أفضل المؤسسات الخاصة المعترف بها بالمغرب — فلتر حسب تخصصك، شعبتك أو ميزانيتك.'
                : language === 'en'
                  ? 'Discover the best state-recognized private institutions in Morocco — filter by specialty, Bac track, or budget.'
                  : 'Découvrez les meilleures institutions privées reconnues au Maroc — filtrez par spécialité, filière ou budget.'}
            </p>
          </div>


        </div>
      </div>

      {/* ── Morocco Map ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <MoroccoMap
          schools={SCHOOLS}
          isRtl={isRtl}
          language={language}
          activeRegion={regionFilter}
          onRegionClick={(id) => setRegionFilter(id)}
        />
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <div className="mb-5 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-3">

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isRtl ? 'ابحث عن مدرسة، تخصص أو مدينة...'
              : language === 'en' ? 'Search a school, program or city...'
              : 'Rechercher une école, filière ou ville...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Category filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button key={c.key} type="button"
              onClick={() => setCatFilter(c.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                catFilter === c.key ? c.color + ' shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {getCatLabel(c)}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Stream + featured + count row */}
        <div className="flex gap-2 flex-wrap items-center">
          {/* Stream */}
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value as Stream | 'all')}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 transition text-slate-700 cursor-pointer hover:border-purple-300"
          >
            {STREAMS.map((s) => (
              <option key={s.key} value={s.key}>{getStreamLabel(s)}</option>
            ))}
          </select>

          {/* Featured toggle */}
          <button
            type="button"
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              featuredOnly
                ? 'bg-purple-600 text-white border-transparent shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={featuredOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {isRtl ? 'المميزة فقط' : language === 'en' ? 'Featured only' : 'Recommandées'}
          </button>

          {/* Active region filter pill */}
          {regionFilter && (() => {
            const region = REGIONS.find((r) => r.id === regionFilter);
            if (!region) return null;
            const label = isRtl ? region.nameAr : language === 'en' ? region.nameEn : region.nameFr;
            return (
              <button
                type="button"
                onClick={() => setRegionFilter(null)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border bg-purple-600 text-white border-transparent shadow-sm"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="max-w-[120px] truncate">{label.split('-')[0]}</span>
                <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            );
          })()}

          {/* Count badge */}
          <div className="ml-auto flex items-center gap-1.5 bg-purple-50 border border-purple-100 rounded-lg px-3 py-1.5">
            <span className="text-xs font-black text-purple-600">{filtered.length}</span>
            <span className="text-[11px] text-purple-400 font-medium">
              {isRtl ? 'نتيجة' : language === 'en' ? 'results' : 'résultats'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Info banner ──────────────────────────────────────────────────────── */}
      <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          {isRtl
            ? 'جميع هذه المؤسسات معترف بها من وزارة التعليم العالي المغربية. التكاليف تقديرية — تحقق من الموقع الرسمي لكل مدرسة للحصول على أرقام دقيقة.'
            : language === 'en'
              ? 'All these institutions are recognized by the Moroccan Ministry of Higher Education. Tuition fees are approximate — check each school\'s official website for exact figures.'
              : 'Tous ces établissements sont reconnus par le Ministère de l\'Enseignement Supérieur marocain. Les frais sont indicatifs — vérifiez le site officiel de chaque école pour des chiffres exacts.'}
        </p>
      </div>

      {/* ── Cards grid ───────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-slate-500 font-semibold text-sm mb-2">
            {isRtl ? 'لا توجد نتائج' : language === 'en' ? 'No results found' : 'Aucun résultat'}
          </p>
          <button type="button"
            onClick={() => { setCatFilter('all'); setStreamFilter('all'); setQuery(''); setFeaturedOnly(false); setRegionFilter(null); }}
            className="text-xs text-purple-600 font-bold bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-xl hover:bg-purple-100 transition"
          >
            {isRtl ? 'إعادة تعيين الفلاتر' : language === 'en' ? 'Reset filters' : 'Réinitialiser les filtres'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((school) => (
            <SchoolCard key={school.id} school={school} isRtl={isRtl} language={language} />
          ))}
        </div>
      )}


    </div>
  );
}
