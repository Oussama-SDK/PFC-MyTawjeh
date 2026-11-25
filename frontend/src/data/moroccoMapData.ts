// Données carte Maroc : régions (jihat) → provinces (aqlim) → établissements

import { getEstablishmentIntro } from './moroccoEstablishmentIntros';

export interface Establishment {
  name: string;
  type: 'université' | 'grande école' | 'école';
  rank: string;
  city: string;
  website: string;
  programs: string[];
  admissionRequirements: string[];
  tuitionFees: string;
  scholarships: string;
  /** Introduction FR (texte principal) */
  introduction: string;
  introductionAr: string;
  introductionEn: string;
}

export interface MoroccoProvince {
  id: string;
  nameFr: string;
  nameAr: string;
  establishments: Establishment[];
}

export interface MoroccoRegionData {
  id: string;
  nameFr: string;
  nameAr: string;
  code: string;
  color: string;
  population: string;
  pin: { cx: number; cy: number };
  provinces: MoroccoProvince[];
}

const uni = (
  name: string,
  type: Establishment['type'],
  rank: string,
  city: string,
  website: string,
  programs: string[],
  admission: string[],
  fees: string,
  scholarships: string
): Establishment => ({
  name,
  type,
  rank,
  city,
  website,
  programs,
  admissionRequirements: admission,
  tuitionFees: fees,
  scholarships,
  introduction: getEstablishmentIntro(name, 'fr'),
  introductionAr: getEstablishmentIntro(name, 'ar'),
  introductionEn: getEstablishmentIntro(name, 'en'),
});

const emptyProv = (id: string, nameFr: string, nameAr: string): MoroccoProvince => ({
  id,
  nameFr,
  nameAr,
  establishments: [],
});

export const MOROCCO_MAP_REGIONS: MoroccoRegionData[] = [
  {
    id: 'tanger',
    nameFr: 'Tanger-Tétouan-Al Hoceïma',
    nameAr: 'طنجة تطوان الحسيمة',
    code: 'TTA',
    color: '#ef4444',
    population: '3.9M',
    pin: { cx: 692, cy: 98 },
    provinces: [
      {
        id: 'tanger-ville',
        nameFr: 'Tanger-Assilah',
        nameAr: 'طنجة أصيلة',
        establishments: [
          uni('Université Abdelmalek Essaâdi — Tanger', 'université', 'Top régional', 'Tanger', 'uae.ma', ['Sciences', 'Droit', 'Lettres'], ['Bac marocain', 'Dossier académique'], '400–600 MAD/an', 'Bourses académiques'),
          uni('École Nationale de Commerce et de Gestion — Tanger', 'grande école', 'Top commerce', 'Tanger', 'encgt.uae.ac.ma', ['Management', 'Finance', 'Marketing'], ['Bac avec mention', 'Concours ENCG'], '2 000–4 000 MAD/an', 'Bourse nationale'),
        ],
      },
      {
        id: 'tetouan',
        nameFr: 'Tétouan',
        nameAr: 'تطوان',
        establishments: [
          uni('Université Abdelmalek Essaâdi — Tétouan', 'université', 'Campus historique', 'Tétouan', 'uae.ma', ['Médecine', 'Sciences', 'Technologie'], ['Bac marocain', 'Sélection par filière'], '400–600 MAD/an', 'Aide sociale'),
          uni('ENSATE Tétouan', 'grande école', 'Architecture & design', 'Tétouan', 'ensa-tetouan.ac.ma', ['Architecture', 'Urbanisme'], ['Bac ST/S', 'Concours'], '1 500–3 000 MAD/an', "Bourse d'excellence"),
        ],
      },
      {
        id: 'hoceima',
        nameFr: 'Al Hoceïma',
        nameAr: 'الحسيمة',
        establishments: [
          uni('FPN Al Hoceïma (UAE)', 'université', 'Sciences appliquées', 'Al Hoceïma', 'uae.ma', ['Sciences', 'Économie'], ['Bac marocain', 'Dossier'], '400–600 MAD/an', 'Bourses'),
        ],
      },
      emptyProv('mdiq-fnideq', "M'diq-Fnideq", 'المضيق الفنيدق'),
      emptyProv('fahs-anjra', 'Fahs-Anjra', 'فحص أنجرة'),
      emptyProv('larache', 'Larache', 'العرائش'),
      emptyProv('chefchaouen', 'Chefchaouen', 'شفشاون'),
      emptyProv('ouazzane', 'Ouazzane', 'وزان'),
    ],
  },
  {
    id: 'oriental',
    nameFr: "L'Oriental",
    nameAr: 'الشرق',
    code: 'OR',
    color: '#f97316',
    population: '2.2M',
    pin: { cx: 851, cy: 191 },
    provinces: [
      {
        id: 'oujda',
        nameFr: 'Oujda-Angad',
        nameAr: 'وجدة أنجاد',
        establishments: [
          uni('Université Mohammed Premier — Oujda', 'université', 'Top 15 Afrique', 'Oujda', 'ump.ac.ma', ['Médecine', 'Sciences', 'Droit', 'Lettres'], ['Bac marocain', 'Tawjihni'], '400–600 MAD/an', 'Bourse nationale'),
          uni('ENCG Oujda', 'grande école', 'Commerce & gestion', 'Oujda', 'encgo.ump.ma', ['Management', 'Finance'], ['Concours ENCG', 'Bac mention'], '2 000–4 000 MAD/an', 'Bourse nationale'),
        ],
      },
      {
        id: 'nador',
        nameFr: 'Nador',
        nameAr: 'الناظور',
        establishments: [
          uni('FPN Nador (UMP)', 'université', 'Sciences régionales', 'Nador', 'ump.ac.ma', ['Sciences', 'Lettres'], ['Bac marocain'], '400–600 MAD/an', 'Aide financière'),
        ],
      },
      {
        id: 'berkane',
        nameFr: 'Berkane',
        nameAr: 'بركان',
        establishments: [
          uni('EST Berkane (UMP)', 'école', 'Techniques & gestion', 'Berkane', 'ump.ac.ma', ['Technologie', 'Gestion'], ['Bac marocain'], '400–800 MAD/an', 'Bourses'),
        ],
      },
      emptyProv('driouch', 'Driouch', 'الدريوش'),
      emptyProv('jerada', 'Jerada', 'جرادة'),
      emptyProv('taourirt', 'Taourirt', 'تاوريرت'),
      emptyProv('guercif', 'Guercif', 'جرسيف'),
      emptyProv('figuig', 'Figuig', 'فكيك'),
    ],
  },
  {
    id: 'fes',
    nameFr: 'Fès-Meknès',
    nameAr: 'فاس مكناس',
    code: 'FM',
    color: '#eab308',
    population: '4.0M',
    pin: { cx: 725, cy: 173 },
    provinces: [
      {
        id: 'fes',
        nameFr: 'Fès',
        nameAr: 'فاس',
        establishments: [
          uni('Université Sidi Mohamed Ben Abdellah', 'université', 'Université historique', 'Fès', 'usmba.ac.ma', ['Sciences', 'Médecine', 'Droit', 'Lettres'], ['Bac marocain', 'Admission sélective'], '400–600 MAD/an', 'Aide sociale'),
          uni('École Nationale Supérieure d’Informatique — Fès', 'grande école', 'Informatique', 'Fès', 'ensias.ma', ['Informatique', 'IA', 'Réseaux'], ['CPGE ou concours', 'Bac S excellence'], '1 500–2 500 MAD/an', "Bourse d'excellence"),
        ],
      },
      {
        id: 'meknes',
        nameFr: 'Meknès',
        nameAr: 'مكناس',
        establishments: [
          uni('Université Moulay Ismaïl', 'université', 'Top régional', 'Meknès', 'umi.ac.ma', ['Agronomie', 'Sciences', 'Droit'], ['Bac marocain', 'Dossier'], '400–600 MAD/an', 'Bourses'),
          uni('ENA Meknès', 'grande école', 'Administration', 'Meknès', 'enameknes.ac.ma', ['Administration publique'], ['Concours ENA', 'Bac+3'], 'Gratuit (fonction publique)', 'Prise en charge État'),
        ],
      },
      {
        id: 'ifrane',
        nameFr: 'Ifrane',
        nameAr: 'إفران',
        establishments: [
          uni('Université Al Akhawayn', 'université', 'Université anglophone', 'Ifrane', 'aui.ma', ['Business', 'Ingénierie', 'Sciences Humaines'], ['Bac 14+/20', 'Anglais B2', 'Entretien'], '80 000–120 000 MAD/an', 'Bourses partielles/complètes'),
        ],
      },
      emptyProv('el-hajeb', 'El Hajeb', 'الحاجب'),
      emptyProv('moulay-yacoub', 'Moulay Yacoub', 'مولاي يعقوب'),
      emptyProv('sefrou', 'Sefrou', 'صفرو'),
      emptyProv('boulemane', 'Boulemane', 'بولمان'),
      emptyProv('taounate', 'Taounate', 'تاونات'),
      emptyProv('taza', 'Taza', 'تازة'),
    ],
  },
  {
    id: 'rabat',
    nameFr: 'Rabat-Salé-Kénitra',
    nameAr: 'الرباط سلا القنيطرة',
    code: 'RSK',
    color: '#22c55e',
    population: '4.2M',
    pin: { cx: 645, cy: 171 },
    provinces: [
      {
        id: 'rabat',
        nameFr: 'Rabat',
        nameAr: 'الرباط',
        establishments: [
          uni('Université Mohammed V — Rabat', 'université', 'Top 5 Afrique', 'Rabat', 'um5.ac.ma', ['Droit', 'Médecine', 'Sciences', 'Lettres'], ['Bac marocain', 'Tawjihni'], '400–600 MAD/an', 'Bourse nationale'),
          uni("École Mohammadia d'Ingénieurs (EMI)", 'grande école', 'Top ingénieurs Maroc', 'Rabat', 'emi.ac.ma', ['Génie Civil', 'Informatique', 'Électronique'], ['CPGE 2 ans', 'Concours national'], '1 000–2 000 MAD/an', "Bourse d'excellence"),
          uni('INPT Rabat', 'grande école', 'Télécom & réseaux', 'Rabat', 'inpt.ac.ma', ['Télécom', 'Informatique', 'Réseaux'], ['CPGE', 'Concours INPT'], '1 500–2 500 MAD/an', "Bourse d'excellence"),
        ],
      },
      {
        id: 'sale',
        nameFr: 'Salé',
        nameAr: 'سلا',
        establishments: [
          uni('ENSAM Rabat-Salé', 'grande école', 'Arts & métiers', 'Salé', 'ensam.um5.ac.ma', ['Mécanique', 'Industriel', 'Énergétique'], ['CPGE', 'Concours'], '1 000–2 000 MAD/an', 'Aide sociale'),
        ],
      },
      {
        id: 'kenitra',
        nameFr: 'Kénitra',
        nameAr: 'القنيطرة',
        establishments: [
          uni('Université Ibn Tofaïl', 'université', 'Sciences & lettres', 'Kénitra', 'uit.ac.ma', ['Sciences', 'Informatique', 'Droit'], ['Bac marocain', 'Sélection filière'], '400–600 MAD/an', 'Bourses étudiants'),
        ],
      },
      emptyProv('skhirate-temara', 'Skhirate-Témara', 'الصخيرات تمارة'),
      emptyProv('khemisset', 'Khémisset', 'الخميسات'),
      emptyProv('sidi-kacem', 'Sidi Kacem', 'سيدي قاسم'),
      emptyProv('sidi-slimane', 'Sidi Slimane', 'سيدي سليمان'),
    ],
  },
  {
    id: 'casablanca',
    nameFr: 'Casablanca-Settat',
    nameAr: 'الدار البيضاء سطات',
    code: 'CS',
    color: '#06b6d4',
    population: '8.4M',
    pin: { cx: 581, cy: 229 },
    provinces: [
      {
        id: 'casa',
        nameFr: 'Casablanca',
        nameAr: 'الدار البيضاء',
        establishments: [
          uni('Université Hassan II — Casablanca', 'université', 'Top 10 Afrique', 'Casablanca', 'univh2c.ma', ['Médecine', 'Droit', 'Sciences'], ['Bac marocain', 'Test sélection'], '400–600 MAD/an', 'Aide financière'),
          uni('ENCG Casablanca', 'grande école', 'Top business Maroc', 'Casablanca', 'encgcasa.ma', ['Management', 'Finance', 'Marketing'], ['Concours ENCG', 'Bac mention'], '2 000–4 000 MAD/an', 'Bourse nationale'),
          uni('INSEA Casablanca', 'grande école', 'Statistique & économie', 'Casablanca', 'insea.ac.ma', ['Actuariat', 'Économie', 'Data'], ['CPGE ECG', 'Concours'], '1 500–2 500 MAD/an', "Bourse d'excellence"),
        ],
      },
      {
        id: 'mohammedia',
        nameFr: 'Mohammedia',
        nameAr: 'المحمدية',
        establishments: [
          uni('ENSIAS Mohammedia', 'grande école', 'Systèmes d’information', 'Mohammedia', 'ensias.ma', ['Informatique', 'Cybersécurité'], ['CPGE', 'Concours'], '1 500–2 500 MAD/an', 'Bourse nationale'),
        ],
      },
      {
        id: 'settat',
        nameFr: 'Settat',
        nameAr: 'سطات',
        establishments: [
          uni('Université Hassan 1er — Settat', 'université', 'Sciences & gestion', 'Settat', 'uh1.ac.ma', ['Sciences', 'Économie', 'Droit'], ['Bac marocain'], '400–600 MAD/an', 'Bourses'),
        ],
      },
      emptyProv('el-jadida', 'El Jadida', 'الجديدة'),
      emptyProv('nouaceur', 'Nouaceur', 'النواصر'),
      emptyProv('mediouna', 'Médiouna', 'مديونة'),
      emptyProv('benslimane', 'Benslimane', '\u0628\u0646\u0633\u0644\u064A\u0645\u0627\u0646'),
      emptyProv('berrechid', 'Berrechid', 'برشيد'),
      emptyProv('sidi-bennour', 'Sidi Bennour', 'سيدي بنور'),
    ],
  },
  {
    id: 'marrakech',
    nameFr: 'Marrakech-Safi',
    nameAr: 'مراكش آسفي',
    code: 'MS',
    color: '#8b5cf6',
    population: '4.6M',
    pin: { cx: 531, cy: 319 },
    provinces: [
      {
        id: 'marrakech',
        nameFr: 'Marrakech',
        nameAr: 'مراكش',
        establishments: [
          uni('Université Cadi Ayyad', 'université', 'Top 20 Afrique', 'Marrakech', 'uca.ma', ['Médecine', 'Sciences', 'Ingénierie'], ['Bac avec note', 'Dossier'], '400–600 MAD/an', 'Bourses académiques'),
          uni('ENSA Marrakech', 'grande école', 'Architecture', 'Marrakech', 'ensa.ac.ma', ['Architecture', 'Urbanisme', 'Design'], ['CPGE ou équivalent', 'Concours'], '1 500–3 000 MAD/an', "Bourse d'excellence"),
        ],
      },
      {
        id: 'safi',
        nameFr: 'Safi',
        nameAr: 'آسفي',
        establishments: [
          uni('FP Safi (UCA)', 'université', 'Sciences appliquées', 'Safi', 'uca.ma', ['Chimie', 'Sciences'], ['Bac marocain'], '400–600 MAD/an', 'Aide sociale'),
        ],
      },
      {
        id: 'essaouira',
        nameFr: 'Essaouira',
        nameAr: 'الصويرة',
        establishments: [
          uni('EST Essaouira (UCA)', 'école', 'Tourisme & tech', 'Essaouira', 'uca.ma', ['Tourisme', 'Informatique'], ['Bac marocain'], '400–800 MAD/an', 'Bourses'),
        ],
      },
      emptyProv('chichaoua', 'Chichaoua', 'شيشاوة'),
      emptyProv('al-haouz', 'Al Haouz', 'الحوز'),
      emptyProv('kelaa-sraghna', 'Kelâa des Sraghna', 'قلعة السراغنة'),
      emptyProv('rehamna', 'Rehamna', '\u0627\u0644\u0631\u062D\u0627\u0645\u0646\u0629'),
      emptyProv('youssoufia', 'Youssoufia', '\u0627\u0644\u064A\u0648\u0633\u0641\u064A\u0629'),
    ],
  },
  {
    id: 'draa',
    nameFr: 'Drâa-Tafilalet',
    nameAr: 'درعة تافيلالت',
    code: 'DT',
    color: '#ec4899',
    population: '1.6M',
    pin: { cx: 706, cy: 347 },
    provinces: [
      {
        id: 'errachidia',
        nameFr: 'Errachidia',
        nameAr: 'الرشيدية',
        establishments: [
          uni('Université Moulay Ismaïl — Errachidia', 'université', 'Sciences régionales', 'Errachidia', 'umi.ac.ma', ['Sciences', 'Agronomie'], ['Bac marocain'], '400–600 MAD/an', 'Bourses'),
        ],
      },
      {
        id: 'midelt',
        nameFr: 'Midelt',
        nameAr: 'ميدلت',
        establishments: [
          uni('FP Midelt (UMI)', 'école', 'Techniques', 'Midelt', 'umi.ac.ma', ['Technologie'], ['Bac marocain'], '400–600 MAD/an', 'Aide sociale'),
        ],
      },
      {
        id: 'zagora',
        nameFr: 'Zagora',
        nameAr: 'زاكورة',
        establishments: [
          uni('FP Zagora', 'école', 'Sciences & lettres', 'Zagora', 'umi.ac.ma', ['Lettres', 'Sciences'], ['Bac marocain'], '400–600 MAD/an', 'Bourses'),
        ],
      },
      emptyProv('ouarzazate', 'Ouarzazate', '\u0648\u0631\u0632\u0627\u0632\u0627\u062A'),
      emptyProv('tinghir', 'Tinghir', '\u062A\u0646\u063A\u064A\u0631'),
    ],
  },
  {
    id: 'souss',
    nameFr: 'Souss-Massa',
    nameAr: 'سوس ماسة',
    code: 'SM',
    color: '#14b8a6',
    population: '2.8M',
    pin: { cx: 531, cy: 422 },
    provinces: [
      {
        id: 'agadir',
        nameFr: 'Agadir-Ida Ou Tanane',
        nameAr: 'أكادير إدا وتنان',
        establishments: [
          uni('Université Ibn Zohr — Agadir', 'université', 'Top Sud Maroc', 'Agadir', 'uiz.ac.ma', ['Médecine', 'Sciences', 'Droit'], ['Bac marocain', 'Tawjihni'], '400–600 MAD/an', 'Bourse nationale'),
          uni('ENCG Agadir', 'grande école', 'Commerce', 'Agadir', 'encga.uiz.ac.ma', ['Management', 'Finance'], ['Concours ENCG'], '2 000–4 000 MAD/an', 'Bourse nationale'),
        ],
      },
      {
        id: 'taroudant',
        nameFr: 'Taroudant',
        nameAr: 'تارودانت',
        establishments: [
          uni('FP Taroudant (UIZ)', 'université', 'Sciences agricoles', 'Taroudant', 'uiz.ac.ma', ['Agronomie'], ['Bac marocain'], '400–600 MAD/an', 'Aide sociale'),
        ],
      },
      {
        id: 'tiznit',
        nameFr: 'Tiznit',
        nameAr: 'تيزنيت',
        establishments: [
          uni('EST Tiznit (UIZ)', 'école', 'Techniques', 'Tiznit', 'uiz.ac.ma', ['Technologie'], ['Bac marocain'], '400–600 MAD/an', 'Bourses'),
        ],
      },
      emptyProv('inezgane-ait-melloul', 'Inezgane-Aït Melloul', '\u0625\u0646\u0632\u0643\u0627\u0646 \u0622\u064A\u062A \u0645\u0644\u0648\u0644'),
      emptyProv('chtouka-ait-baha', 'Chtouka-Aït Baha', '\u0634\u062A\u0648\u0643\u0629 \u0622\u064A\u062A \u0628\u0627\u0647\u0627'),
      emptyProv('tata', 'Tata', '\u0637\u0627\u0637\u0627'),
    ],
  },
  {
    id: 'beni',
    nameFr: 'Béni Mellal-Khénifra',
    nameAr: 'بني ملال خنيفرة',
    code: 'BK',
    color: '#f59e0b',
    population: '1.9M',
    pin: { cx: 644, cy: 260 },
    provinces: [
      {
        id: 'beni-mellal',
        nameFr: 'Béni Mellal',
        nameAr: 'بني ملال',
        establishments: [
          uni('Université Sultan Moulay Slimane', 'université', 'Sciences & lettres', 'Béni Mellal', 'usms.ma', ['Sciences', 'Économie', 'Gestion'], ['Bac marocain'], '400–600 MAD/an', 'Aide financière'),
        ],
      },
      {
        id: 'khenifra',
        nameFr: 'Khénifra',
        nameAr: 'خنيفرة',
        establishments: [
          uni('FP Khénifra (USMS)', 'école', 'Sciences appliquées', 'Khénifra', 'usms.ma', ['Sciences'], ['Bac marocain'], '400–600 MAD/an', 'Bourses'),
        ],
      },
      {
        id: 'azilal',
        nameFr: 'Azilal',
        nameAr: 'أزيلال',
        establishments: [
          uni('EST Azilal (USMS)', 'école', 'Techniques', 'Azilal', 'usms.ma', ['Technologie'], ['Bac marocain'], '400–600 MAD/an', 'Aide sociale'),
        ],
      },
      emptyProv('fquih-ben-salah', 'Fquih Ben Salah', '\u0627\u0644\u0641\u0642\u064A\u0647 \u0628\u0646 \u0635\u0644\u0627\u062D'),
      emptyProv('khouribga', 'Khouribga', '\u062E\u0631\u064A\u0628\u063A\u0629'),
    ],
  },
  {
    id: 'gulmim',
    nameFr: 'Guelmim-Oued Noun',
    nameAr: 'كلميم واد نون',
    code: 'GON',
    color: '#64748b',
    population: '0.5M',
    pin: { cx: 457, cy: 509 },
    provinces: [
      {
        id: 'guelmim',
        nameFr: 'Guelmim',
        nameAr: 'كلميم',
        establishments: [
          uni('Université Ibn Zohr — Guelmim', 'université', 'Campus Sud', 'Guelmim', 'uiz.ac.ma', ['Sciences', 'Lettres'], ['Bac marocain'], '400–600 MAD/an', 'Bourses'),
        ],
      },
      {
        id: 'tan-tan',
        nameFr: 'Tan-Tan',
        nameAr: 'طانطان',
        establishments: [
          uni('FP Tan-Tan (UIZ)', 'école', 'Sciences', 'Tan-Tan', 'uiz.ac.ma', ['Sciences'], ['Bac marocain'], '400–600 MAD/an', 'Aide sociale'),
        ],
      },
      emptyProv('assa-zag', 'Assa-Zag', '\u0623\u0633\u0627 \u0627\u0644\u0632\u0627\u0643'),
      emptyProv('sidi-ifni', 'Sidi Ifni', '\u0633\u064A\u062F\u064A \u0625\u0641\u0646\u064A'),
    ],
  },
  {
    id: 'laayoune',
    nameFr: 'Laâyoune-Sakia El Hamra',
    nameAr: 'العيون الساقية الحمراء',
    code: 'LSH',
    color: '#d946ef',
    population: '0.6M',
    pin: { cx: 317, cy: 610 },
    provinces: [
      {
        id: 'laayoune-ville',
        nameFr: 'Laâyoune',
        nameAr: 'العيون',
        establishments: [
          uni('Université Ibn Zohr — Laâyoune', 'université', 'Sciences du Sud', 'Laâyoune', 'uiz.ac.ma', ['Droit', 'Sciences', 'Économie'], ['Bac marocain'], '400–600 MAD/an', 'Bourse nationale'),
          uni('École Supérieure de Technologie — EST Laâyoune', 'grande école', 'Tابعة لجامعة Ibn Zohr', 'Laâyoune', 'est-laayoune.uiz.ac.ma', ['Génie Informatique', 'Réseaux & Télécoms', 'Électronique'], ['Bac scientifique ou technique', 'Concours ou dossier'], '400–600 MAD/an', 'Bourse nationale'),
          uni('Universiapolis — Université Internationale de Laâyoune', 'université', 'Université privée internationale', 'Laâyoune', 'universiapolis.ma', ['Management', 'Génie Informatique', 'Génie Industriel', 'Génie Électrique'], ['Baccalauréat toutes filières', 'Entretien de sélection'], '20 000–35 000 MAD/an', 'Bourses partielles disponibles'),
          uni('Cité des Métiers et Compétences — CMC / OFPPT Laâyoune', 'école', 'مدينة المهن والكفاءات', 'Laâyoune', 'ofppt.ma', ['Technicien', 'Technicien Spécialisé', 'Plusieurs filières'], ['Bac ou niveau Bac', 'Concours OFPPT'], 'Gratuit / faibles frais', 'Aide sociale OFPPT'),
          uni('ISGI Laâyoune — Institut Spécialisé de Gestion et d\'Informatique', 'école', 'OFPPT — Gestion & Informatique', 'Laâyoune', 'ofppt.ma/inscription', ['Développement Informatique', 'Réseaux Informatiques', 'Gestion des Entreprises'], ['Bac ou niveau Bac', 'Concours OFPPT'], 'Gratuit / faibles frais', 'Aide sociale OFPPT'),
        ],
      },
      {
        id: 'boujdour',
        nameFr: 'Boujdour',
        nameAr: 'بوجدور',
        establishments: [
          uni('FP Boujdour (UIZ)', 'école', 'Lettres & sciences', 'Boujdour', 'uiz.ac.ma', ['Lettres'], ['Bac marocain'], '400–600 MAD/an', 'Aide financière'),
        ],
      },
      emptyProv('tarfaya', 'Tarfaya', '\u0637\u0631\u0641\u0627\u064A\u0629'),
      emptyProv('es-semara', 'Es-Semara', '\u0627\u0644\u0633\u0645\u0627\u0631\u0629'),
    ],
  },
  {
    id: 'dakhla',
    nameFr: 'Dakhla-Oued Ed-Dahab',
    nameAr: 'الداخلة وادي الذهب',
    code: 'DOD',
    color: '#0d9488',
    population: '0.2M',
    pin: { cx: 213, cy: 835 },
    provinces: [
      {
        id: 'oued-ed-dahab',
        nameFr: 'Oued Ed-Dahab',
        nameAr: 'وادي الذهب',
        establishments: [
          uni('Université Ibn Zohr — Dakhla', 'université', 'Campus Saharien', 'Dakhla', 'uiz.ac.ma', ['Sciences', 'Gestion'], ['Bac marocain'], '400–600 MAD/an', 'Bourses'),
        ],
      },
      {
        id: 'aousserd',
        nameFr: 'Aousserd',
        nameAr: 'أوسرد',
        establishments: [
          uni('FP Oued Ed-Dahab (UIZ)', 'école', 'Sciences appliquées', 'Aousserd', 'uiz.ac.ma', ['Sciences'], ['Bac marocain'], '400–600 MAD/an', 'Aide sociale'),
        ],
      },
    ],
  },
];

export const MOROCCO_STATS = {
  regions: MOROCCO_MAP_REGIONS.length,
  provinces: MOROCCO_MAP_REGIONS.reduce((n, r) => n + r.provinces.length, 0),
  establishments: MOROCCO_MAP_REGIONS.reduce(
    (n, r) => n + r.provinces.reduce((p, pr) => p + pr.establishments.length, 0),
    0
  ),
  provincesWithUniversities: MOROCCO_MAP_REGIONS.reduce(
    (n, r) => n + r.provinces.filter((p) => p.establishments.some((e) => e.type === 'université')).length,
    0
  ),
};

export function provinceUniversityCount(p: MoroccoProvince): number {
  return p.establishments.filter((e) => e.type === 'université').length;
}

export function provinceHasUniversity(p: MoroccoProvince): boolean {
  return provinceUniversityCount(p) > 0;
}

export function provinceEstablishmentCount(p: MoroccoProvince): number {
  return p.establishments.length;
}

export const PROVINCES_WITH_UNIVERSITIES = MOROCCO_MAP_REGIONS.flatMap((r) =>
  r.provinces
    .filter(provinceHasUniversity)
    .map((p) => ({ region: r, province: p }))
);
