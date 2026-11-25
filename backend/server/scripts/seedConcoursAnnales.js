const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const Concours = require('../models/Concours');
const Annale   = require('../models/Annale');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my_tawjihe');
  console.log('✅ Connected to MongoDB');

  await Concours.deleteMany({});
  await Annale.deleteMany({});
  console.log('✅ Cleared concours & annales');

  // ── CONCOURS ──────────────────────────────────────────────────────────────
  const concoursData = [
    {
      nom: 'Concours National Commun (CNC)',
      school: 'EMI, EHTP, ENSIAS, ENSMR, ENSEM, INPT, INSEA…',
      dateConcours: new Date('2026-05-14'),
      seuil: null,
      description: 'Concours national unifié pour les grandes écoles d\'ingénieurs après 2 ans de CPGE (MP, PSI, TSI). 4 590 places réparties sur 25+ écoles publiques. Inscription sur candidature.cnc.ma (fév–mars).',
      lien: 'https://candidature.cnc.ma',
      isPublished: true,
    },
    {
      nom: 'Concours ENSA (Écoles Nationales des Sciences Appliquées)',
      school: 'ENSA Tanger, Agadir, Fès, Oujda, Marrakech, Kénitra…',
      dateConcours: new Date('2026-07-22'),
      seuil: 12,
      description: 'Concours post-bac direct pour intégrer le cycle préparatoire intégré (5 ans) des 16 ENSA au Maroc. Seuils : SM≥12, PC≥14, SVT≥15.25. Présélection dossier (75% nationale + 25% régionale) puis QCM Maths + Physique. 4 390 places.',
      lien: 'https://cursussup.gov.ma',
      isPublished: true,
    },
    {
      nom: 'Concours ENSAM (Écoles Nationales Supérieures des Arts et Métiers)',
      school: 'ENSAM Meknès, Casablanca, Rabat',
      dateConcours: new Date('2026-07-23'),
      seuil: 12,
      description: 'Concours post-bac pour les ENSAM (génie mécanique, électromécanique, biomédical). Seuils : SM≥12.25, PC/SVT≥16.17. QCM national 60 questions (Maths + Physique, 3h30). 1 060 places. Nouveau portail : ensam-concours.ma.',
      lien: 'https://ensam-concours.ma',
      isPublished: true,
    },
    {
      nom: 'TAFEM — Concours ENCG (Écoles Nationales de Commerce et de Gestion)',
      school: 'ENCG Casablanca, Settat, Tanger, Fès, Agadir',
      dateConcours: new Date('2026-07-21'),
      seuil: 12,
      description: 'Test d\'Aptitude à la Formation en Management (TAFEM). Accès aux 5 ENCG publiques. Seuils : SE/SGC/SM≥12, PC/SVT≥14. QCM : logique, maths, culture générale, langue. 4 850 places. Inscription via cursussup.gov.ma.',
      lien: 'https://cursussup.gov.ma',
      isPublished: true,
    },
    {
      nom: 'Concours ISCAE — Licence Fondamentale en Gestion',
      school: 'ISCAE Casablanca, ISCAE Rabat',
      dateConcours: new Date('2026-07-10'),
      seuil: 15,
      description: 'Concours très sélectif d\'accès à l\'ISCAE (grande école publique de management). Épreuves : Mathématiques (2h), Anglais (1h), Culture générale (1h30) + oraux. Très compétitif (~17/20 en pratique). Inscription : groupeiscae.ma.',
      lien: 'https://www.groupeiscae.ma',
      isPublished: true,
    },
    {
      nom: 'Concours Médecine, Pharmacie et Médecine Dentaire',
      school: 'Facultés de Médecine de Casablanca, Rabat, Fès, Marrakech, Oujda, Tanger, Agadir',
      dateConcours: new Date('2026-07-19'),
      seuil: 12,
      description: 'Concours national d\'accès aux facultés publiques de médecine, pharmacie et médecine dentaire. Seuil : 12/20. 6 511 places (médecine : 5 140, pharmacie : 916, médecine dentaire : 455). Épreuves : biologie, physique, chimie.',
      lien: 'https://cursussup.gov.ma',
      isPublished: true,
    },
    {
      nom: 'Admission en CPGE (Classes Préparatoires aux Grandes Écoles)',
      school: '29 centres CPGE publics au Maroc',
      dateConcours: new Date('2026-07-01'),
      seuil: 14,
      description: 'Admission sur dossier scolaire (notes lycée + bac) pour intégrer 2 ans de CPGE menant au CNC. Filières : MP (Maths-Physique), PSI (Physique-SI), TSI (Techno-SI), ECS/ECT (Commerce). Inscription via cursussup.gov.ma. Très sélectif.',
      lien: 'https://cursussup.gov.ma',
      isPublished: true,
    },
    {
      nom: 'Concours BTS (Brevet de Technicien Supérieur)',
      school: 'Lycées qualifiants publics (national)',
      dateConcours: new Date('2026-07-15'),
      seuil: null,
      description: 'Formation professionnalisante de 2 ans post-bac dans les lycées qualifiants. Spécialités : informatique, industrie, tertiaire, audiovisuel. Sélection sur moyenne bac. Inscription via e-bts.men.gov.ma ou massarservice.men.gov.ma.',
      lien: 'https://e-bts.men.gov.ma',
      isPublished: true,
    },
    {
      nom: 'Concours EMI — Voie Parallèle (cycle ingénieur)',
      school: 'École Mohammadia d\'Ingénieurs (EMI) — Rabat',
      dateConcours: new Date('2026-07-06'),
      seuil: null,
      description: 'Voie d\'accès au cycle ingénieur de l\'EMI pour titulaires d\'un DEUG, DEUST ou Licence scientifique (bac+2/+3). L\'EMI, fondée en 1959, est la doyenne des grandes écoles d\'ingénieurs marocaines.',
      lien: 'https://www.emi.ac.ma',
      isPublished: true,
    },
    {
      nom: 'Concours EHTP — Voie Parallèle (cycle ingénieur)',
      school: 'École Hassania des Travaux Publics (EHTP) — Casablanca',
      dateConcours: new Date('2026-07-14'),
      seuil: null,
      description: 'Accès au cycle ingénieur de l\'EHTP pour titulaires DEUG/DEUST/DUT/Licence scientifique. Spécialisations : génie civil, hydraulique, travaux publics, environnement. Rattachée au Ministère de l\'Équipement.',
      lien: 'https://www.ehtp.ac.ma',
      isPublished: true,
    },
  ];

  const insertedConcours = await Concours.insertMany(concoursData);
  console.log(`✅ ${insertedConcours.length} concours créés`);

  // Build id map for easy reference
  const C = {};
  insertedConcours.forEach(c => {
    if (c.nom.includes('CNC'))       C.cnc       = c._id;
    if (c.nom.includes('ENSA') && !c.nom.includes('ENSAM')) C.ensa = c._id;
    if (c.nom.includes('ENSAM'))     C.ensam     = c._id;
    if (c.nom.includes('ENCG'))      C.encg      = c._id;
    if (c.nom.includes('ISCAE'))     C.iscae     = c._id;
    if (c.nom.includes('Médecine'))  C.medecine  = c._id;
    if (c.nom.includes('CPGE'))      C.cpge      = c._id;
    if (c.nom.includes('BTS'))       C.bts       = c._id;
    if (c.nom.includes('EMI'))       C.emi       = c._id;
    if (c.nom.includes('EHTP'))      C.ehtp      = c._id;
  });

  // ── ANNALES ───────────────────────────────────────────────────────────────
  // Real annales from men.gov.ma. Content/correction fields are empty —
  // link to official PDF source instead (lien).
  const annalesData = [

    // ── MATHÉMATIQUES 2BAC ──────────────────────────────────────────────────
    { annee: 2024, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Mathématiques — 2ème Bac Sciences Mathématiques A. Session normale 2024.', concoursId: C.ensa },
    { annee: 2024, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Mathématiques — 2ème Bac Sciences Physiques. Session normale 2024.', concoursId: C.ensa },
    { annee: 2024, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Mathématiques — 2ème Bac SVT. Session normale 2024.', concoursId: C.medecine },
    { annee: 2023, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Mathématiques — 2ème Bac Sciences Mathématiques A. Session normale 2023.', concoursId: C.ensa },
    { annee: 2023, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Mathématiques — 2ème Bac Sciences Physiques. Session normale 2023.', concoursId: C.ensa },
    { annee: 2023, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Mathématiques — 2ème Bac SVT. Session normale 2023.', concoursId: C.medecine },
    { annee: 2022, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Mathématiques — 2ème Bac Sciences Mathématiques A. Session normale 2022.', concoursId: C.ensa },
    { annee: 2022, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Mathématiques — 2ème Bac Sciences Physiques. Session normale 2022.', concoursId: C.ensa },

    // ── PHYSIQUE-CHIMIE 2BAC ────────────────────────────────────────────────
    { annee: 2024, matiere: 'Physique-Chimie', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Physique-Chimie — 2ème Bac Sciences Mathématiques. Session normale 2024.', concoursId: C.ensa },
    { annee: 2024, matiere: 'Physique-Chimie', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Physique-Chimie — 2ème Bac SVT. Session normale 2024.', concoursId: C.medecine },
    { annee: 2023, matiere: 'Physique-Chimie', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Physique-Chimie — 2ème Bac Sciences Mathématiques. Session normale 2023.', concoursId: C.ensa },
    { annee: 2023, matiere: 'Physique-Chimie', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Physique-Chimie — 2ème Bac SVT. Session normale 2023.', concoursId: C.medecine },
    { annee: 2022, matiere: 'Physique-Chimie', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Physique-Chimie — 2ème Bac Sciences Mathématiques. Session normale 2022.', concoursId: C.ensa },
    { annee: 2022, matiere: 'Physique-Chimie', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Physique-Chimie — 2ème Bac SVT. Session normale 2022.', concoursId: C.medecine },

    // ── SVT 2BAC ────────────────────────────────────────────────────────────
    { annee: 2024, matiere: 'SVT', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de SVT — 2ème Bac Sciences de la Vie et de la Terre. Session normale 2024.', concoursId: C.medecine },
    { annee: 2024, matiere: 'SVT', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de SVT — 2ème Bac Sciences Mathématiques. Session normale 2024.', concoursId: C.medecine },
    { annee: 2023, matiere: 'SVT', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de SVT — 2ème Bac Sciences de la Vie et de la Terre. Session normale 2023.', concoursId: C.medecine },
    { annee: 2023, matiere: 'SVT', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de SVT — 2ème Bac Sciences Mathématiques. Session normale 2023.', concoursId: C.medecine },
    { annee: 2022, matiere: 'SVT', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de SVT — 2ème Bac Sciences de la Vie et de la Terre. Session normale 2022.', concoursId: C.medecine },
    { annee: 2022, matiere: 'SVT', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de SVT — 2ème Bac Sciences Mathématiques. Session normale 2022.', concoursId: C.medecine },

    // ── FRANÇAIS 2BAC ───────────────────────────────────────────────────────
    { annee: 2024, matiere: 'Français', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Français — 2ème Bac toutes filières. Session normale 2024.', concoursId: C.ensa },
    { annee: 2023, matiere: 'Français', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Français — 2ème Bac toutes filières. Session normale 2023.', concoursId: C.ensa },
    { annee: 2022, matiere: 'Français', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national de Français — 2ème Bac toutes filières. Session normale 2022.', concoursId: C.ensa },

    // ── ARABE 2BAC ──────────────────────────────────────────────────────────
    { annee: 2024, matiere: 'Arabe', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national d\'Arabe — 2ème Bac toutes filières. Session normale 2024.', concoursId: C.ensa },
    { annee: 2023, matiere: 'Arabe', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national d\'Arabe — 2ème Bac toutes filières. Session normale 2023.', concoursId: C.ensa },
    { annee: 2022, matiere: 'Arabe', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national d\'Arabe — 2ème Bac toutes filières. Session normale 2022.', concoursId: C.ensa },

    // ── ANGLAIS 2BAC ────────────────────────────────────────────────────────
    { annee: 2024, matiere: 'Anglais', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national d\'Anglais — 2ème Bac toutes filières. Session normale 2024.', concoursId: C.iscae },
    { annee: 2023, matiere: 'Anglais', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national d\'Anglais — 2ème Bac toutes filières. Session normale 2023.', concoursId: C.iscae },
    { annee: 2022, matiere: 'Anglais', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national d\'Anglais — 2ème Bac toutes filières. Session normale 2022.', concoursId: C.iscae },

    // ── ÉCONOMIE 2BAC ───────────────────────────────────────────────────────
    { annee: 2024, matiere: 'Économie', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national d\'Économie — 2ème Bac Sciences Économiques et Gestion Comptable. Session normale 2024.', concoursId: C.encg },
    { annee: 2023, matiere: 'Économie', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national d\'Économie — 2ème Bac Sciences Économiques et Gestion Comptable. Session normale 2023.', concoursId: C.encg },
    { annee: 2022, matiere: 'Économie', niveau: '2bac', type: 'examen national', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen national d\'Économie — 2ème Bac Sciences Économiques et Gestion Comptable. Session normale 2022.', concoursId: C.encg },

    // ── MATHÉMATIQUES 1BAC (examen régional) ───────────────────────────────
    { annee: 2024, matiere: 'Mathématiques', niveau: '1bac', type: 'examen blanc', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen régional de Mathématiques — 1ère Bac Sciences Mathématiques. Session normale 2024.' },
    { annee: 2023, matiere: 'Mathématiques', niveau: '1bac', type: 'examen blanc', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen régional de Mathématiques — 1ère Bac Sciences Mathématiques. Session normale 2023.' },
    { annee: 2022, matiere: 'Mathématiques', niveau: '1bac', type: 'examen blanc', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen régional de Mathématiques — 1ère Bac Sciences Mathématiques. Session normale 2022.' },

    // ── PHYSIQUE-CHIMIE 1BAC ────────────────────────────────────────────────
    { annee: 2024, matiere: 'Physique-Chimie', niveau: '1bac', type: 'examen blanc', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen régional de Physique-Chimie — 1ère Bac Sciences Mathématiques. Session normale 2024.' },
    { annee: 2023, matiere: 'Physique-Chimie', niveau: '1bac', type: 'examen blanc', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen régional de Physique-Chimie — 1ère Bac Sciences Mathématiques. Session normale 2023.' },
    { annee: 2022, matiere: 'Physique-Chimie', niveau: '1bac', type: 'examen blanc', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen régional de Physique-Chimie — 1ère Bac Sciences Mathématiques. Session normale 2022.' },

    // ── SVT 1BAC ────────────────────────────────────────────────────────────
    { annee: 2024, matiere: 'SVT', niveau: '1bac', type: 'examen blanc', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen régional de SVT — 1ère Bac Sciences de la Vie et de la Terre. Session normale 2024.' },
    { annee: 2023, matiere: 'SVT', niveau: '1bac', type: 'examen blanc', lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx', contenu: 'Examen régional de SVT — 1ère Bac Sciences de la Vie et de la Terre. Session normale 2023.' },
  ];

  const insertedAnnales = await Annale.insertMany(annalesData);
  console.log(`✅ ${insertedAnnales.length} annales créées`);

  // Link annales back to their concours
  const annalesByConcours = {};
  insertedAnnales.forEach(a => {
    if (!a.concoursId) return;
    const key = a.concoursId.toString();
    if (!annalesByConcours[key]) annalesByConcours[key] = [];
    annalesByConcours[key].push(a._id);
  });
  for (const [concoursId, annaleIds] of Object.entries(annalesByConcours)) {
    await Concours.findByIdAndUpdate(concoursId, { $push: { annales: { $each: annaleIds } } });
  }
  console.log('✅ Annales liées aux concours');

  console.log('\n════════════════════════════════════════════════');
  console.log('  ✅  Concours & Annales seedés avec succès !');
  console.log('════════════════════════════════════════════════\n');
  console.log('  CONCOURS:');
  insertedConcours.forEach(c => console.log(`    • ${c.nom}`));
  console.log(`\n  ANNALES: ${insertedAnnales.length} entrées (2022–2024)\n`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err.message);
  process.exit(1);
});
