// Run: node backend/server/scripts/seedConcours2026.js
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Concours = require('../models/Concours');

const CONCOURS_2026 = [
  {
    nom: 'CNC 2026 — Concours National Commun',
    school: 'ENSA / EMI / ENSIAS / ENIM / EHTP / INPT',
    dateConcours: new Date('2026-06-15'),
    seuil: 14,
    description: 'Le Concours National Commun donne accès aux grandes écoles d\'ingénieurs publiques marocaines après 2 ans de CPGE (MP, PC, TSI). Épreuves : Maths, Physique, Chimie, Informatique.',
    lien: 'https://cnc.ac.ma',
    isPublished: true,
  },
  {
    nom: 'Concours ENSA 2026',
    school: 'Écoles Nationales des Sciences Appliquées',
    dateConcours: new Date('2026-06-20'),
    seuil: 13,
    description: 'Concours d\'accès aux ENSA pour les bacheliers scientifiques (voie directe Bac+1). 12 ENSA à travers le Maroc. Filières : Informatique, Génie Civil, Génie Électrique, Industriel.',
    lien: 'https://ensa.ac.ma',
    isPublished: true,
  },
  {
    nom: 'Concours ENCG 2026',
    school: 'Écoles Nationales de Commerce et de Gestion',
    dateConcours: new Date('2026-05-10'),
    seuil: 13,
    description: 'Concours national d\'accès aux ENCG. Formation en 5 ans en management, commerce et gestion. 9 écoles à Casablanca, Fès, Agadir, Tanger, Oujda, Settat, Marrakech, El Jadida, Kénitra.',
    lien: 'https://encg.ac.ma',
    isPublished: true,
  },
  {
    nom: 'Concours EHTP 2026',
    school: 'École Hassania des Travaux Publics',
    dateConcours: new Date('2026-05-20'),
    seuil: 15,
    description: 'Accès via CNC ou concours propre. Formation d\'ingénieurs en génie civil, infrastructure et travaux publics. Une des meilleures écoles d\'ingénieurs au Maroc.',
    lien: 'https://ehtp.ac.ma',
    isPublished: true,
  },
  {
    nom: 'Concours Médecine 2026',
    school: 'Facultés de Médecine et de Pharmacie',
    dateConcours: new Date('2026-09-10'),
    seuil: 16,
    description: 'Concours d\'accès aux études médicales. Nouveau format 2026 : QCM informatisé. Facultés à Casablanca, Rabat, Fès, Marrakech, Oujda. Durée des études : 7 ans.',
    lien: 'https://men.gov.ma',
    isPublished: true,
  },
  {
    nom: 'Concours INSEA 2026',
    school: 'Institut National de Statistique et d\'Économie Appliquée',
    dateConcours: new Date('2026-05-25'),
    seuil: 14,
    description: 'Formation en statistique, économie et actuariat. Accès après Bac ou CPGE. Très bon débouchés en finance, assurance et analyse de données.',
    lien: 'https://insea.ac.ma',
    isPublished: true,
  },
  {
    nom: 'Concours ISCAE 2026',
    school: 'Institut Supérieur de Commerce et d\'Administration des Entreprises',
    dateConcours: new Date('2026-04-15'),
    seuil: 13,
    description: 'Concours d\'entrée en cycle Grande École pour les bacheliers et candidats Bac+2. Formation en management, finance et entrepreneuriat à Casablanca et Rabat.',
    lien: 'https://iscae.ac.ma',
    isPublished: true,
  },
  {
    nom: 'Concours EMI 2026',
    school: 'École Mohammadia d\'Ingénieurs',
    dateConcours: new Date('2026-06-15'),
    seuil: 15,
    description: 'Via CNC. L\'EMI est la plus ancienne et une des plus prestigieuses écoles d\'ingénieurs au Maroc. Spécialités : Informatique, Génie industriel, Génie électrique, Génie civil.',
    lien: 'https://emi.ac.ma',
    isPublished: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my_tawjihe');
    console.log('✅ Connecté à MongoDB');

    // Remove existing 2026 concours to avoid duplicates
    await Concours.deleteMany({ nom: { $in: CONCOURS_2026.map(c => c.nom) } });
    const inserted = await Concours.insertMany(CONCOURS_2026);
    console.log(`✅ ${inserted.length} concours 2026 insérés avec succès`);
    inserted.forEach(c => console.log(`  - ${c.nom} (${c.dateConcours?.toLocaleDateString('fr-FR')})`));
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
