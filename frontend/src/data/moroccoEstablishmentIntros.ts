/** Textes d'introduction par nom d'établissement (clé = name dans moroccoMapData) */
export const ESTABLISHMENT_INTROS: Record<string, { fr: string; ar: string; en: string }> = {
  'Université Abdelmalek Essaâdi — Tanger': {
    fr: 'Pôle universitaire majeur du nord, l’UAE à Tanger accueille des milliers d’étudiants en sciences, droit et lettres. Idéal pour une formation publique accessible avec un campus dynamique proche de l’Europe.',
    ar: 'قطب جامعي رئيسي في الشمال، تستقبل جامعة عبد المالك السعدي بطنجة آلاف الطلبة في العلوم والقانون والآداب. مثالية لتكوين عمومي في متناول الجميع قرب أوروبا.',
    en: 'A major northern hub, UAE Tanger hosts thousands of students in sciences, law, and humanities — strong public education near Europe.',
  },
  'École Nationale de Commerce et de Gestion — Tanger': {
    fr: 'L’ENCG de Tanger forme les futurs managers et entrepreneurs du nord. Formation exigeante par concours, forte employabilité dans le commerce, la finance et le marketing.',
    ar: 'المدرسة الوطنية للتجارة والتسيير بطنجة تكوّن مديري ومقاولي المستقبل في الشمال. تكوين انتقائي عبر مباراة وفرص شغل قوية في التجارة والمالية.',
    en: 'ENCG Tanger trains future managers via competitive entry, with strong paths in business, finance, and marketing.',
  },
  'Université Abdelmalek Essaâdi — Tétouan': {
    fr: 'Campus historique de l’UAE, reconnu pour la médecine et les sciences à Tétouan. Atmosphère estudiantine riche et offre de filières variées pour le bachelier ambitieux.',
    ar: 'الحرم التاريخي لجامعة عبد المالك السعدي بتطوان، معروف بالطب والعلوم. بيئة طلابية حية وتخصصات متنوعة للباكالوريا الطموحة.',
    en: 'Historic UAE campus in Tetouan, known for medicine and sciences with a vibrant student community.',
  },
  'ENSATE Tétouan': {
    fr: 'École d’architecture et d’urbanisme de référence au nord. Pour les créatifs passionnés par le design, la ville et le bâti durable au Maroc.',
    ar: 'مرجع في العمارة والتعمير بالشمال. للمبدعين الشغوفين بالتصميم والمدينة والبناء المستدام في المغرب.',
    en: 'Leading architecture school in the north for students passionate about design and sustainable cities.',
  },
  'FPN Al Hoceïma (UAE)': {
    fr: 'Faculté polydisciplinaire qui rapproche l’enseignement supérieur des étudiants du Rif. Sciences et économie dans un cadre humain et accessible.',
    ar: 'كلية متعددة التخصصات تقرّب التعليم العالي من طلبة الريف. علوم واقتصاد في إطار إنساني وفي المتناول.',
    en: 'Multidisciplinary faculty bringing higher education closer to Rif students in sciences and economics.',
  },
  'Université Mohammed Premier — Oujda': {
    fr: 'Université phare de l’Oriental, classée parmi les meilleures d’Afrique. Médecine, sciences et droit sur un vaste campus à Oujda.',
    ar: 'جامعة راية في الشرق، ضمن الأفضل في أفريقيا. طب وعلوم وقانون في حرم واسع بوجدة.',
    en: 'Flagship eastern university ranked among Africa’s best, with medicine, sciences, and law in Oujda.',
  },
  'ENCG Oujda': {
    fr: 'Grande école de commerce de l’est marocain. Prépare aux métiers de la gestion, de la banque et de l’entreprise avec un réseau d’anciens élèves actif.',
    ar: 'مدرسة عليا للتجارة في الشرق المغربي. تؤهل لمهن التدبير والبنك والمقاولة مع شبكة خريجين نشطة.',
    en: 'Top business school in eastern Morocco preparing graduates for management and finance careers.',
  },
  'FPN Nador (UMP)': {
    fr: 'Antenne universitaire qui offre sciences et lettres aux étudiants de la province de Nador, sans quitter leur région.',
    ar: 'فرع جامعي يوفر العلوم والآداب لطلبة إقليم الناظور دون مغادرة منطقتهم.',
    en: 'Regional campus offering sciences and humanities for Nador students close to home.',
  },
  'EST Berkane (UMP)': {
    fr: 'École supérieure de technologie orientée vers l’insertion professionnelle rapide en techniques et gestion à Berkane.',
    ar: 'مدرسة عليا للتكنولوجيا نحو الإدماج المهني السريع في التقنيات والتدبير ببركان.',
    en: 'Technology school focused on quick professional integration in tech and management.',
  },
  'Université Sidi Mohamed Ben Abdellah': {
    fr: 'Une des plus anciennes universités du Maroc à Fès, berceau du savoir. Médecine, sciences et droit dans une ville universitaire mythique.',
    ar: 'من أقدم الجامعات في المغرب بفاس، مهد المعرفة. طب وعلوم وقانون في مدينة جامعية أسطورية.',
    en: 'One of Morocco’s oldest universities in historic Fes, strong in medicine, sciences, and law.',
  },
  'École Nationale Supérieure d’Informatique — Fès': {
    fr: 'Référence nationale en informatique, IA et réseaux. Parcours sélectif (CPGE/concours) pour intégrer l’élite tech marocaine.',
    ar: 'مرجع وطني في الإعلاميات والذكاء الاصطناعي والشبكات. مسار انتقائي للاندماج في نخبة التكنولوجيا المغربية.',
    en: 'National reference in CS, AI, and networks via selective CPGE/concours pathways.',
  },
  'Université Moulay Ismaïl': {
    fr: 'Université complète de Meknès, reconnue en agronomie, sciences et droit. Campus moderne et vie estudiantine animée au cœur du Maroc central.',
    ar: 'جامعة شاملة بمكناس، معروفة في الفلاحة والعلوم والقانون. حرم حديث وحياة طلابية حية في قلب المغرب.',
    en: 'Full university in Meknes known for agronomy, sciences, and law with a lively campus life.',
  },
  'ENA Meknès': {
    fr: 'École nationale d’administration : la voie royale vers la haute fonction publique. Formation d’excellence, gratuite, pour servir l’État.',
    ar: 'المدرسة الوطنية للإدارة: الطريق نحو الوظيفة العمومية العليا. تكوين متميز مجاني لخدمة الدولة.',
    en: 'National administration school — the path to senior public service with state-funded training.',
  },
  'Université Al Akhawayn': {
    fr: 'Université privée bilingue à Ifrane, modèle américain au Maroc. Campus international, anglais, idéal pour études de business et ingénierie de niveau mondial.',
    ar: 'جامعة خاصة ثنائية اللغة بإفران، نموذج أمريكي في المغرب. حرم دولي بالإنجليزية، مثالية للأعمال والهندسة على المستوى العالمي.',
    en: 'Private bilingual American-style university in Ifrane for world-class business and engineering.',
  },
  'Université Mohammed V — Rabat': {
    fr: 'Institution emblématique de la capitale, top 5 en Afrique. Médecine, droit et sciences sur le campus historique de Rabat-Agdal.',
    ar: 'مؤسسة رمزية في العاصمة، ضمن الخمسة الأوائل في أفريقيا. طب وقانون وعلوم في الحرم التاريخي بالرباط.',
    en: 'Iconic capital university, top 5 in Africa, with medicine, law, and sciences in Rabat.',
  },
  "École Mohammadia d'Ingénieurs (EMI)": {
    fr: 'La « X » marocaine : elite des ingénieurs formés en 2 ans de CPGE + concours. EMI ouvre les portes des grands groupes et projets nationaux.',
    ar: '« X » المغربية: نخبة المهندسين بعد سنتين أعدادية ومباراة. المدرسة المحمدية للمهندسين تفتح أبواب كبرى المشاريع الوطنية.',
    en: 'Morocco’s elite engineering school after CPGE — gateway to major industry and national projects.',
  },
  'INPT Rabat': {
    fr: 'Référence en télécoms, réseaux et informatique. INPT forme les experts des opérateurs, banques et startups tech du royaume.',
    ar: 'مرجع في الاتصالات والشبكات والإعلاميات. المعهد الوطني للبريد والمواصلات يكوّن خبراء المشغلين والبنوك والشركات الناشئة.',
    en: 'Telecom and networks powerhouse training experts for operators, banks, and tech startups.',
  },
  'ENSAM Rabat-Salé': {
    fr: 'Arts et Métiers : formation d’ingénieurs généralistes de haut niveau en mécanique, industrie et énergie, très recherchés sur le marché.',
    ar: 'الفنون والمهن: تكوين مهندسين عامين في الميكانيك والصناعة والطاقة، مطلبون بشدة في سوق الشغل.',
    en: 'Arts et Métiers school producing highly sought generalist engineers in mechanics and energy.',
  },
  'Université Ibn Tofaïl': {
    fr: 'Grande université de Kénitra, forte en sciences, informatique et droit. Proximité de Rabat-Casablanca pour stages et opportunités.',
    ar: 'جامعة كبيرة بالقنيطرة، قوية في العلوم والإعلاميات والقانون. قرب الرباط والدار البيضاء للتداريب والفرص.',
    en: 'Major Kénitra university strong in sciences, IT, and law near Rabat and Casablanca.',
  },
  'Université Hassan II — Casablanca': {
    fr: 'Pilier de l’enseignement supérieur à Casa, top 10 Afrique. Médecine et sciences au cœur de la métropole économique du Maroc.',
    ar: 'ركيزة التعليم العالي بالدار البيضاء، ضمن العشرة الأوائل في أفريقيا. طب وعلوم في قلب المدينة الاقتصادية.',
    en: 'Casablanca pillar, top 10 in Africa, with medicine and sciences in Morocco’s economic capital.',
  },
  'ENCG Casablanca': {
    fr: 'Meilleure business school du pays à Casablanca. Management, finance et marketing pour viser carrières en multinationales et banques.',
    ar: 'أفضل مدرسة أعمال في البلاد بالدار البيضاء. تدبير ومالية وتسويق للعمل في الشركات متعددة الجنسيات والبنوك.',
    en: 'Morocco’s leading business school in Casablanca for careers in multinationals and banking.',
  },
  'INSEA Casablanca': {
    fr: 'École d’excellence en statistique, économie et data. Parcours CPGE ECG pour analystes, actuaires et décideurs de demain.',
    ar: 'مدرسة تميز في الإحصاء والاقتصاد والبيانات. مسار أعدادية لمحللي ومختصي الاكتواريا وصناع القرار.',
    en: 'Excellence in statistics, economics, and data science via selective ECG pathways.',
  },
  'ENSIAS Mohammedia': {
    fr: 'ENSIAS forme l’élite des ingénieurs systèmes d’information et cybersécurité. Campus moderne entre Rabat et Casa, forte insertion tech.',
    ar: 'المدرسة الوطنية للعلوم المعلوماتية تكوّن نخبة مهندسي نظم المعلومات والأمن السيبراني. إدماج قوي في التكنولوجيا.',
    en: 'Elite IT and cybersecurity engineers with strong tech industry placement.',
  },
  'Université Hassan 1er — Settat': {
    fr: 'Université dynamique de Settat, sciences, économie et droit. Pont entre Casablanca et l’intérieur pour une formation équilibrée.',
    ar: 'جامعة ديناميكية بسطات في العلوم والاقتصاد والقانون. جسر بين الدار البيضاء والداخل لتكوين متوازن.',
    en: 'Dynamic Settat university bridging Casablanca and inland regions in sciences and economics.',
  },
  'Université Cadi Ayyad': {
    fr: 'Université majeure du sud à Marrakech, top 20 Afrique. Médecine, sciences et ingénierie dans la ville ocre et son écosystème touristique.',
    ar: 'جامعة كبرى بالجنوب بمراكش، ضمن العشرين الأوائل في أفريقيا. طب وعلوم وهندسة في المدينة الحمراء.',
    en: 'Major southern university in Marrakech, top 20 in Africa, with medicine and engineering.',
  },
  'ENSA Marrakech': {
    fr: 'École nationale d’architecture à Marrakech. Créativité, urbanisme et design au service du patrimoine et des villes marocaines.',
    ar: 'المدرسة الوطنية للهندسة المعمارية بمراكش. إبداع وتعمير وتصميم لخدمة التراث والمدن المغربية.',
    en: 'National architecture school blending creativity with Moroccan heritage and urban design.',
  },
  'FP Safi (UCA)': {
    fr: 'Faculté à Safi rattachée à l’UCA, sciences appliquées et chimie pour les profils scientifiques de la côte atlantique.',
    ar: 'كلية بآسفي تابعة لجامعة القاضي عياض، علوم تطبيقية وكيمياء لملفات الساحل الأطلسي.',
    en: 'UCA faculty in Safi offering applied sciences and chemistry on the Atlantic coast.',
  },
  'EST Essaouira (UCA)': {
    fr: 'Formation en tourisme et informatique à Essaouira, alliant filière porteuse et cadre de vie exceptionnel.',
    ar: 'تكوين في السياحة والإعلاميات بالصويرة، يجمع بين شعب واعدة وإطار عيش مميز.',
    en: 'Tourism and IT training in Essaouira combining growth sectors with quality of life.',
  },
  'Université Moulay Ismaïl — Errachidia': {
    fr: 'Antenne UMI au sud-est : agronomie et sciences pour valoriser le potentiel agricole et minier de la région.',
    ar: 'فرع جامعة مولاي إسماعيل بالجنوب الشرقي: فلاحة وعلوم لتثمين الإمكانيات الزراعية والتعدينية.',
    en: 'UMI branch developing agriculture and sciences in the southeast.',
  },
  'FP Midelt (UMI)': {
    fr: 'Point d’accès à l’enseignement supérieur pour les jeunes du Moyen Atlas, orienté techniques.',
    ar: 'بوابة للتعليم العالي لشباب الأطلس المتوسط، موجهة نحو التقنيات.',
    en: 'Higher education access point in Midelt focused on technical training.',
  },
  'FP Zagora': {
    fr: 'Faculté de Zagora offrant lettres et sciences aux étudiants du Drâa, proche des oasis et du développement local.',
    ar: 'كلية زاكورة تقدم الآداب والعلوم لطلبة درعة، قرب الواحات والتنمية المحلية.',
    en: 'Zagora faculty serving Draa students in letters and sciences.',
  },
  'Université Ibn Zohr — Agadir': {
    fr: 'Université leader du grand sud à Agadir. Médecine, sciences et droit sur un campus en plein essor face à l’Atlantique.',
    ar: 'جامعة رائدة في الجنوب الكبير بأكادير. طب وعلوم وقانون في حرم نامٍ على الأطلسي.',
    en: 'Leading southern university in Agadir with medicine, sciences, and law.',
  },
  'ENCG Agadir': {
    fr: 'Commerce et management à Agadir pour les talents du Souss. Formation par concours, réseau national ENCG.',
    ar: 'تجارة وتدبير بأكادير لمواهب سوس. تكوين عبر مباراة ضمن شبكة المدارس الوطنية.',
    en: 'ENCG Agadir for business talent in the Souss region via national competitive entry.',
  },
  'FP Taroudant (UIZ)': {
    fr: 'Faculté agronomique à Taroudant, au cœur du pays berbère agricole du Souss.',
    ar: 'كلية فلاحية بترودانت في قلب سوس الفلاحي الأمازيغي.',
    en: 'Agronomy faculty in Taroudant at the heart of agricultural Souss.',
  },
  'EST Tiznit (UIZ)': {
    fr: 'École de techniques à Tiznit pour une insertion professionnelle rapide dans l’industrie et les services du sud.',
    ar: 'مدرسة تقنيات بتيزنيت لإدماج مهني سريع في صناعة وخدمات الجنوب.',
    en: 'Technical school in Tiznit for fast professional integration in the south.',
  },
  'Université Sultan Moulay Slimane': {
    fr: 'Université de Béni Mellal, sciences, économie et gestion. Relie le centre du Maroc à une offre de formation diversifiée.',
    ar: 'جامعة بني ملال في العلوم والاقتصاد والتدبير. تربط وسط المغرب بتكوين متنوع.',
    en: 'Béni Mellal university offering sciences, economics, and management in central Morocco.',
  },
  'FP Khénifra (USMS)': {
    fr: 'Faculté des sciences à Khénifra pour démocratiser l’accès au supérieur dans le Moyen Atlas.',
    ar: 'كلية العلوم بخنيفرة لإتاحة التعليم العالي في الأطلس المتوسط.',
    en: 'Sciences faculty broadening higher education access in Khénifra.',
  },
  'EST Azilal (USMS)': {
    fr: 'Formation technique à Azilal, au pied de l’Atlas, pour métiers industriels et de service.',
    ar: 'تكوين تقني بأزيلال عند الأطلس لمهن صناعية وخدماتية.',
    en: 'Technical training in Azilal for industrial and service careers.',
  },
  'Université Ibn Zohr — Guelmim': {
    fr: 'Campus UIZ à Guelmim, porte du Sahara. Sciences et lettres pour ancrer le supérieur dans le grand sud.',
    ar: 'حرم ابن زهر بكلميم، بوابة الصحراء. علوم وآداب لترسيخ التعليم العالي في الجنوب الكبير.',
    en: 'UIZ campus in Guelmim bringing sciences and humanities to the deep south.',
  },
  'FP Tan-Tan (UIZ)': {
    fr: 'Faculté de Tan-Tan pour les étudiants de la province, sciences accessibles sur la côte saharienne.',
    ar: 'كلية طانطان لطلبة الإقليم، علوم في متناولهم على الساحل الصحراوي.',
    en: 'Tan-Tan faculty making sciences accessible on the Saharan coast.',
  },
  'Université Ibn Zohr — Laâyoune': {
    fr: 'Antenne universitaire du sud profond à Laâyoune : droit, sciences et économie au service des provinces du Sahara.',
    ar: 'فرع جامعي في العمق الجنوبي بالعيون: قانون وعلوم واقتصاد لأقاليم الصحراء.',
    en: 'Deep south campus in Laâyoune offering law, sciences, and economics.',
  },
  'FP Boujdour (UIZ)': {
    fr: 'Point d’enseignement à Boujdour pour rapprocher le supérieur des jeunes de la région côtière saharienne.',
    ar: 'نقطة تعليم ببوجدور لتقريب التعليم العالي من شباب الإقليم الساحلي الصحراوي.',
    en: 'Boujdour teaching point for Saharan coastal youth.',
  },
  'Université Ibn Zohr — Dakhla': {
    fr: 'Campus saharien à Dakhla : sciences et gestion dans une ville en plein développement économique et maritime.',
    ar: 'حرم صحراوي بالداخلة: علوم وتدبير في مدينة تنمو اقتصادياً وبحرية.',
    en: 'Saharan campus in Dakhla with sciences and management in a growing port city.',
  },
  'FP Oued Ed-Dahab (UIZ)': {
    fr: 'Faculté d’Aousserd / Oued Ed-Dahab pour étendre l’accès au supérieur dans les provinces les plus au sud.',
    ar: 'كلية وادي الذهب لتوسيع ولوج التعليم العالي في أقصى الجنوب.',
    en: 'Southernmost faculty extending higher education in Oued Ed-Dahab.',
  },
};

export function getEstablishmentIntro(
  name: string,
  lang: 'fr' | 'ar' | 'en'
): string {
  const entry = ESTABLISHMENT_INTROS[name];
  if (entry) return lang === 'ar' ? entry.ar : lang === 'en' ? entry.en : entry.fr;
  return lang === 'ar'
    ? 'مؤسسة تعليمية معترف بها تقدم تكويناً جيداً في هذه المنطقة.'
    : lang === 'en'
      ? 'A recognized institution offering quality training in this region.'
      : 'Établissement reconnu offrant une formation de qualité dans cette région.';
}
