const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const Eleve           = require('./models/Eleve');
const Parent          = require('./models/Parent');
const Professeur      = require('./models/Professeur');
const Admine          = require('./models/Admine');
const Metier          = require('./models/Metier');
const Concours        = require('./models/Concours');
const Annale          = require('./models/Annale');
const Exercice        = require('./models/Exercice');
const Note            = require('./models/Note');
const ResultatExercice= require('./models/ResultatExercice');
const Roadmap         = require('./models/Roadmap');
const Notification    = require('./models/Notification');
const ProfilOnet      = require('./models/ProfilOnet');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my_tawjihe');
    console.log('✅ Connected to MongoDB');

    // ── Clear all collections ──────────────────────────────────────────────
    await Promise.all([
      Eleve.deleteMany({}),
      Parent.deleteMany({}),
      Professeur.deleteMany({}),
      Admine.deleteMany({}),
      Metier.deleteMany({}),
      Concours.deleteMany({}),
      Annale.deleteMany({}),
      Exercice.deleteMany({}),
      Note.deleteMany({}),
      ResultatExercice.deleteMany({}),
      Roadmap.deleteMany({}),
      Notification.deleteMany({}),
      ProfilOnet.deleteMany({}),
    ]);
    console.log('✅ Collections cleared');

    const hash = await bcrypt.hash('password', 10);

    // ── Admins ─────────────────────────────────────────────────────────────
    const admin = await Admine.create({
      nom: 'Admin Principal',
      email: 'admin@mowajih.ma',
      motDePasse: hash,
    });
    console.log('✅ Admin:', admin.email);

    // ── Professeurs ────────────────────────────────────────────────────────
    const [profMath, profPhysique, profSVT, profFrancais, profAnglais, profEco] = await Professeur.insertMany([
      { nom: 'Hassan Benkirane',  email: 'hassan@mowajih.ma',   motDePasse: hash, specialite: 'Mathématiques' },
      { nom: 'Nadia Cherkaoui',   email: 'nadia@mowajih.ma',    motDePasse: hash, specialite: 'Physique-Chimie' },
      { nom: 'Karim El Fassi',    email: 'karim@mowajih.ma',    motDePasse: hash, specialite: 'Sciences de la Vie et de la Terre' },
      { nom: 'Samira Lahlou',     email: 'samira@mowajih.ma',   motDePasse: hash, specialite: 'Français & Littérature' },
      { nom: 'Omar Tazi',         email: 'omar@mowajih.ma',     motDePasse: hash, specialite: 'Anglais' },
      { nom: 'Leila Mansouri',    email: 'leila@mowajih.ma',    motDePasse: hash, specialite: 'Sciences Économiques' },
    ]);
    console.log('✅ 6 professeurs créés');

    // ── Metiers ────────────────────────────────────────────────────────────
    const [metierIngInfo, metierMedecin, metierArchi, metierAvocat, metierEnseignant, metierEcoGest] = await Metier.insertMany([
      { nom: 'Ingénieur Informatique',    description: 'Conception et développement de systèmes et logiciels informatiques.' },
      { nom: 'Médecin Généraliste',       description: 'Diagnostiquer et traiter les maladies courantes, orienter vers des spécialistes.' },
      { nom: 'Architecte',               description: 'Concevoir et superviser la construction de bâtiments et espaces urbains.' },
      { nom: 'Avocat',                   description: 'Représenter et conseiller des clients dans des affaires juridiques.' },
      { nom: 'Enseignant / Professeur',  description: 'Transmettre des connaissances et accompagner les élèves dans leur apprentissage.' },
      { nom: 'Gestionnaire d\'Entreprise', description: 'Piloter les activités et ressources d\'une organisation ou entreprise.' },
    ]);
    console.log('✅ 6 métiers créés');

    // ── Concours ───────────────────────────────────────────────────────────
    const [concoursEMI, concoursINSA, concoursMedecine, concoursENCG, concoursENP] = await Concours.insertMany([
      {
        nom: 'Concours EMI (École Mohammadia d\'Ingénieurs)',
        school: 'EMI Rabat',
        dateConcours: new Date('2026-06-15'),
        seuil: 14,
        description: 'Concours national d\'accès aux classes préparatoires intégrées de l\'EMI.',
        lien: 'https://www.emi.ac.ma',
        isPublished: true,
      },
      {
        nom: 'Concours INSA Maroc',
        school: 'INSA Fès',
        dateConcours: new Date('2026-06-20'),
        seuil: 13,
        description: 'Concours d\'entrée à l\'Institut National des Sciences Appliquées du Maroc.',
        lien: 'https://www.insaf.ac.ma',
        isPublished: true,
      },
      {
        nom: 'Concours Médecine & Pharmacie',
        school: 'Facultés de Médecine',
        dateConcours: new Date('2026-07-05'),
        seuil: 15,
        description: 'Concours national d\'entrée aux facultés de médecine et de pharmacie du Maroc.',
        lien: 'https://www.mesrsfc.gov.ma',
        isPublished: true,
      },
      {
        nom: 'Concours ENCG',
        school: 'ENCG Casablanca',
        dateConcours: new Date('2026-06-28'),
        seuil: 12,
        description: 'Concours national d\'accès aux Écoles Nationales de Commerce et de Gestion.',
        lien: 'https://www.encg-casa.ma',
        isPublished: true,
      },
      {
        nom: 'Concours ENP (École Nationale Polytechnique)',
        school: 'ENP Rabat',
        dateConcours: new Date('2026-07-10'),
        seuil: 14.5,
        description: 'Concours d\'accès à l\'École Nationale Polytechnique de Rabat.',
        lien: 'https://www.enp.ac.ma',
        isPublished: true,
      },
    ]);
    console.log('✅ 5 concours créés');

    // ── Annales ────────────────────────────────────────────────────────────
    const annalesData = [
      {
        annee: 2024, matiere: 'Mathématiques', niveau: '2bac',
        type: 'examen national',
        contenu: 'Exercice 1 : Étude de fonctions. Soit f(x) = x³ - 3x + 2. 1) Calculer f\'(x). 2) Dresser le tableau de variations. 3) Tracer la courbe.',
        correction: 'f\'(x) = 3x² - 3 = 3(x²-1) = 3(x-1)(x+1). f\'(x) > 0 pour x < -1 ou x > 1. Maximum en x=-1 : f(-1)=4. Minimum en x=1 : f(1)=0.',
        concoursId: concoursEMI._id,
      },
      {
        annee: 2024, matiere: 'Physique-Chimie', niveau: '2bac',
        type: 'examen national',
        contenu: 'Partie I – Mécanique : Un solide de masse m=2kg est lancé sur un plan incliné à 30°. Calculer son accélération si le coefficient de frottement est μ=0.2.',
        correction: 'Forces : poids P=mg=20N, composante Px=Psin30°=10N, N=Pcos30°=17.3N, f=μN=3.46N. a=(Px-f)/m=(10-3.46)/2=3.27 m/s².',
        concoursId: concoursEMI._id,
      },
      {
        annee: 2023, matiere: 'Mathématiques', niveau: '2bac',
        type: 'examen national',
        contenu: 'Calcul intégral : Calculer ∫₀¹ (2x+1)dx. Puis résoudre l\'équation différentielle y\' + y = e^x avec y(0)=0.',
        correction: '∫₀¹(2x+1)dx = [x²+x]₀¹ = 2. Pour l\'ED : solution homogène y_h=Ce^(-x), solution particulière y_p=e^x/2, donc y=Ce^(-x)+e^x/2. y(0)=0 ⟹ C=-1/2.',
        concoursId: concoursINSA._id,
      },
      {
        annee: 2024, matiere: 'SVT', niveau: '2bac',
        type: 'examen national',
        contenu: 'Génétique : Chez la drosophile, le gène A (couleur des yeux) et le gène B (longueur des ailes) sont liés. Analyser les résultats d\'un croisement et déterminer le taux de recombinaison.',
        correction: 'Les gènes sont liés en cis. Le taux de recombinaison = (recombinants/total) × 100. Résultats : 40% AaBb, 40% aabb, 10% Aabb, 10% aaBb → taux = 20%.',
        concoursId: concoursMedecine._id,
      },
      {
        annee: 2023, matiere: 'Économie', niveau: '2bac',
        type: 'examen national',
        contenu: 'Analyse économique : Expliquez les mécanismes de formation des prix sur un marché en concurrence pure et parfaite. Illustrez avec un exemple concret.',
        correction: 'Sur un marché CPP, le prix d\'équilibre est déterminé par l\'intersection de l\'offre et de la demande. Les entreprises sont price-takers. Exemple : marché agricole des tomates.',
        concoursId: concoursENCG._id,
      },
      {
        annee: 2024, matiere: 'Mathématiques', niveau: '1bac',
        type: 'examen blanc',
        contenu: 'Trigonométrie et suites : 1) Simplifier cos(π/3 + x) + cos(π/3 - x). 2) Soit (Uₙ) définie par U₀=1 et Uₙ₊₁=2Uₙ+3. Trouver la formule explicite.',
        correction: '1) 2cos(π/3)cos(x) = 2×(1/2)×cos(x) = cos(x). 2) Vₙ=Uₙ+3 est géométrique de raison 2 : Vₙ=4×2ⁿ, donc Uₙ=4×2ⁿ-3.',
      },
      {
        annee: 2023, matiere: 'Physique-Chimie', niveau: '1bac',
        type: 'white test',
        contenu: 'Électricité : Un circuit RC série est alimenté par une tension E=12V. R=1kΩ, C=100μF. Calculer la constante de temps τ et la tension aux bornes du condensateur à t=τ.',
        correction: 'τ = RC = 1000 × 100×10⁻⁶ = 0.1s. À t=τ : Uc(τ) = E(1-e⁻¹) = 12×0.632 = 7.58V.',
      },
    ];

    const annales = await Annale.insertMany(annalesData);

    // Update Concours with their annales
    await Concours.findByIdAndUpdate(concoursEMI._id,   { $push: { annales: { $each: [annales[0]._id, annales[1]._id] } } });
    await Concours.findByIdAndUpdate(concoursINSA._id,  { $push: { annales: annales[2]._id } });
    await Concours.findByIdAndUpdate(concoursMedecine._id, { $push: { annales: annales[3]._id } });
    await Concours.findByIdAndUpdate(concoursENCG._id,  { $push: { annales: annales[4]._id } });
    console.log('✅ 7 annales créées');

    // ── Exercices ──────────────────────────────────────────────────────────
    const [exo1, exo2, exo3, exo4, exo5, exo6] = await Exercice.insertMany([
      {
        matiere: 'Mathématiques', niveau: '2bac', difficulte: 'moyen',
        contenu: 'Soit f(x) = ln(x² + 1). 1) Déterminer Df. 2) Calculer f\'(x). 3) Étudier les variations de f sur ℝ.',
        correction: '1) Df = ℝ car x²+1 > 0 pour tout x. 2) f\'(x) = 2x/(x²+1). 3) f\'(x) > 0 ⟺ x > 0 : f décroissante sur ]-∞,0[ et croissante sur ]0,+∞[. Minimum en x=0 : f(0)=0.',
        professeurId: profMath._id,
        isApproved: true,
        stats: { totalAttempts: 24, averageScore: 13.5, lastModified: new Date() },
      },
      {
        matiere: 'Mathématiques', niveau: '2bac', difficulte: 'difficile',
        contenu: 'Calculer ∫₁ᵉ x·ln(x) dx en utilisant l\'intégration par parties.',
        correction: 'Posons u=ln(x), v\'=x → u\'=1/x, v=x²/2. ∫x·ln(x)dx = (x²/2)ln(x) - ∫(x²/2)(1/x)dx = (x²/2)ln(x) - x²/4 + C. De 1 à e : (e²/2)·1 - e²/4 - (0 - 1/4) = e²/4 + 1/4.',
        professeurId: profMath._id,
        isApproved: true,
        stats: { totalAttempts: 18, averageScore: 11.2, lastModified: new Date() },
      },
      {
        matiere: 'Physique-Chimie', niveau: '2bac', difficulte: 'moyen',
        contenu: 'Un ressort de raideur k=200 N/m est comprimé de x=5cm. 1) Calculer l\'énergie potentielle élastique stockée. 2) Si un bloc de 0.5kg est attaché au ressort, quelle sera sa vitesse maximale ?',
        correction: '1) Ep = ½kx² = ½×200×(0.05)² = 0.25 J. 2) Conservation de l\'énergie : Ep = Ec_max → ½mv²_max = 0.25 → v_max = √(2×0.25/0.5) = 1 m/s.',
        professeurId: profPhysique._id,
        isApproved: true,
        stats: { totalAttempts: 31, averageScore: 14.1, lastModified: new Date() },
      },
      {
        matiere: 'SVT', niveau: '2bac', difficulte: 'facile',
        contenu: 'Décrire les étapes de la mitose en précisant le comportement des chromosomes à chaque phase (prophase, métaphase, anaphase, télophase).',
        correction: 'Prophase : condensation des chromosomes. Métaphase : alignement à l\'équateur. Anaphase : séparation des chromatides vers les pôles. Télophase : formation de deux noyaux fils identiques à la cellule mère.',
        professeurId: profSVT._id,
        isApproved: true,
        stats: { totalAttempts: 45, averageScore: 15.8, lastModified: new Date() },
      },
      {
        matiere: 'Mathématiques', niveau: '1bac', difficulte: 'facile',
        contenu: 'Résoudre dans ℝ l\'inéquation : 2x² - 5x + 2 < 0.',
        correction: 'Δ = 25 - 16 = 9. Racines : x₁ = (5-3)/4 = 1/2, x₂ = (5+3)/4 = 2. Comme le coefficient de x² > 0 : solution est ]1/2, 2[.',
        professeurId: profMath._id,
        isApproved: true,
        stats: { totalAttempts: 52, averageScore: 16.3, lastModified: new Date() },
      },
      {
        matiere: 'Économie', niveau: '2bac', difficulte: 'moyen',
        contenu: 'Expliquez la différence entre la croissance extensive et la croissance intensive. Donnez des exemples pour chacune et précisez leurs impacts sur la productivité.',
        correction: 'Croissance extensive : augmentation des facteurs de production (plus de travailleurs, plus de capital). Croissance intensive : amélioration de l\'efficacité des facteurs (progrès technologique, formation). La croissance intensive est durable car elle augmente la productivité globale des facteurs.',
        professeurId: profEco._id,
        isApproved: false,
        stats: { totalAttempts: 0, lastModified: new Date() },
      },
    ]);

    // Link exercices to professeurs
    await Professeur.findByIdAndUpdate(profMath._id,     { $push: { exercices: { $each: [exo1._id, exo2._id, exo5._id] } } });
    await Professeur.findByIdAndUpdate(profPhysique._id, { $push: { exercices: exo3._id } });
    await Professeur.findByIdAndUpdate(profSVT._id,      { $push: { exercices: exo4._id } });
    await Professeur.findByIdAndUpdate(profEco._id,      { $push: { exercices: exo6._id } });
    console.log('✅ 6 exercices créés');

    // ── Élèves ─────────────────────────────────────────────────────────────
    const elevesData = [
      {
        nom: 'Yassine Benali',
        email: 'yassine@test.ma',
        motDePasse: hash,
        niveau: '2bac',
        filiere: 'Sciences Maths',
        ville: 'Casablanca',
        typeFormation: 'public',
        notes: [
          { matiere: 'Mathématiques',  valeur: 17.5 },
          { matiere: 'Physique-Chimie', valeur: 16 },
          { matiere: 'SVT',            valeur: 14 },
          { matiere: 'Français',       valeur: 13 },
          { matiere: 'Anglais',        valeur: 15 },
        ],
      },
      {
        nom: 'Fatima Zahra Elhaddad',
        email: 'fatima@test.ma',
        motDePasse: hash,
        niveau: '2bac',
        filiere: 'Sciences Physiques',
        ville: 'Rabat',
        typeFormation: 'public',
        notes: [
          { matiere: 'Mathématiques',  valeur: 14 },
          { matiere: 'Physique-Chimie', valeur: 18 },
          { matiere: 'SVT',            valeur: 12 },
          { matiere: 'Français',       valeur: 15 },
          { matiere: 'Anglais',        valeur: 16 },
        ],
      },
      {
        nom: 'Amine Kettani',
        email: 'amine@test.ma',
        motDePasse: hash,
        niveau: '1bac',
        filiere: 'Sciences Expérimentales',
        ville: 'Fès',
        typeFormation: 'public',
        notes: [
          { matiere: 'Mathématiques',  valeur: 12 },
          { matiere: 'Physique-Chimie', valeur: 13.5 },
          { matiere: 'SVT',            valeur: 16 },
          { matiere: 'Français',       valeur: 11 },
          { matiere: 'Anglais',        valeur: 12 },
        ],
      },
      {
        nom: 'Sara Moussaoui',
        email: 'sara@test.ma',
        motDePasse: hash,
        niveau: '2bac',
        filiere: 'Sciences Économiques',
        ville: 'Marrakech',
        typeFormation: 'privé',
        notes: [
          { matiere: 'Économie',       valeur: 17 },
          { matiere: 'Mathématiques',  valeur: 13 },
          { matiere: 'Français',       valeur: 16 },
          { matiere: 'Anglais',        valoor: 15 },
          { matiere: 'Histoire-Géo',   valeur: 14.5 },
        ],
      },
      {
        nom: 'Khalid Oumzil',
        email: 'khalid@test.ma',
        motDePasse: hash,
        niveau: 'tronc commun',
        filiere: 'Sciences',
        ville: 'Agadir',
        typeFormation: 'public',
        notes: [
          { matiere: 'Mathématiques',  valeur: 15 },
          { matiere: 'Physique-Chimie', valeur: 14 },
          { matiere: 'SVT',            valeur: 13 },
          { matiere: 'Français',       valeur: 12 },
        ],
      },
      {
        nom: 'Nour El Houda Ait Brahim',
        email: 'nour@test.ma',
        motDePasse: hash,
        niveau: '2bac',
        filiere: 'Lettres et Sciences Humaines',
        ville: 'Tanger',
        typeFormation: 'public',
        notes: [
          { matiere: 'Arabe',          valeur: 18 },
          { matiere: 'Français',       valeur: 17 },
          { matiere: 'Anglais',        valeur: 15 },
          { matiere: 'Histoire-Géo',   valeur: 16.5 },
          { matiere: 'Philosophie',    valeur: 14 },
        ],
      },
      {
        nom: 'Hamza Bouchikhi',
        email: 'hamza@test.ma',
        motDePasse: hash,
        niveau: '1bac',
        filiere: 'Sciences Maths A',
        ville: 'Meknès',
        typeFormation: 'public',
        notes: [
          { matiere: 'Mathématiques',  valeur: 19 },
          { matiere: 'Physique-Chimie', valeur: 17 },
          { matiere: 'Français',       valeur: 12 },
          { matiere: 'Anglais',        valeur: 13 },
        ],
      },
      {
        nom: 'Imane Berrada',
        email: 'imane@test.ma',
        motDePasse: hash,
        niveau: '2bac',
        filiere: 'Sciences de la Vie et de la Terre',
        ville: 'Oujda',
        typeFormation: 'public',
        niveauPostBac: 'Licence',
        notes: [
          { matiere: 'SVT',            valeur: 18.5 },
          { matiere: 'Mathématiques',  valeur: 13 },
          { matiere: 'Physique-Chimie', valeur: 15 },
          { matiere: 'Français',       valeur: 14 },
          { matiere: 'Anglais',        valeur: 13.5 },
        ],
      },
    ];

    // Fix typo in sara's notes
    elevesData[3].notes[3] = { matiere: 'Anglais', valeur: 15 };

    const eleves = await Eleve.insertMany(elevesData);
    console.log('✅ 8 élèves créés');

    // ── Notes (standalone collection) ─────────────────────────────────────
    const notesStandalone = [];
    for (const eleve of eleves) {
      for (const n of eleve.notes) {
        notesStandalone.push({
          matiere: n.matiere,
          valeur: n.valeur,
          coefficient: n.matiere === 'Mathématiques' ? 7 : n.matiere === 'Physique-Chimie' ? 5 : n.matiere === 'SVT' ? 5 : 2,
          periode: 'Semestre 1',
          type: 'devoir surveillé',
          eleveId: eleve._id,
        });
      }
    }
    await Note.insertMany(notesStandalone);
    console.log('✅ Notes standalone créées');

    // ── ProfilOnet ─────────────────────────────────────────────────────────
    await ProfilOnet.insertMany([
      {
        eleveId: eleves[0]._id,
        testLevel: 3,
        scoresR: 4, scoresI: 8, scoresA: 3, scoresS: 5, scoresE: 6, scoresC: 7,
        primaryInterest: 'I', secondaryInterest: 'C', tertiaryInterest: 'E',
        jobZone: 4,
        dreamUni: 'EMI Rabat',
        dreamJob: 'Ingénieur en Intelligence Artificielle',
        language: 'fr',
      },
      {
        eleveId: eleves[1]._id,
        testLevel: 3,
        scoresR: 7, scoresI: 8, scoresA: 2, scoresS: 4, scoresE: 3, scoresC: 5,
        primaryInterest: 'I', secondaryInterest: 'R', tertiaryInterest: 'C',
        jobZone: 5,
        dreamUni: 'Faculté de Médecine Rabat',
        dreamJob: 'Médecin spécialiste',
        language: 'fr',
      },
      {
        eleveId: eleves[3]._id,
        testLevel: 2,
        scoresR: 2, scoresI: 5, scoresA: 6, scoresS: 7, scoresE: 9, scoresC: 8,
        primaryInterest: 'E', secondaryInterest: 'C', tertiaryInterest: 'S',
        jobZone: 4,
        dreamUni: 'ENCG Casablanca',
        dreamJob: 'Directrice Marketing',
        language: 'fr',
      },
      {
        eleveId: eleves[6]._id,
        testLevel: 3,
        scoresR: 3, scoresI: 9, scoresA: 5, scoresS: 3, scoresE: 4, scoresC: 6,
        primaryInterest: 'I', secondaryInterest: 'A', tertiaryInterest: 'C',
        jobZone: 5,
        dreamUni: 'EMI Rabat',
        dreamJob: 'Ingénieur en Cybersécurité',
        language: 'fr',
      },
    ]);
    console.log('✅ 4 profils ONET créés');

    // ── Roadmaps ───────────────────────────────────────────────────────────
    const roadmaps = await Roadmap.insertMany([
      {
        matiereCible: 'Mathématiques & Informatique',
        niveau: '2bac',
        parcours: '1. Renforcer les bases en algèbre linéaire\n2. Apprendre la programmation (Python, C++)\n3. Préparer le concours EMI\n4. Faire les annales des 5 dernières années',
        eleveId: eleves[0]._id,
        metierId: metierIngInfo._id,
      },
      {
        matiereCible: 'Physique-Chimie & SVT',
        niveau: '2bac',
        parcours: '1. Maîtriser la biochimie et la physiologie\n2. Renforcer Physique-Chimie (thermodynamique)\n3. Préparer le concours Médecine\n4. Réviser l\'anatomie',
        eleveId: eleves[1]._id,
        metierId: metierMedecin._id,
      },
      {
        matiereCible: 'Économie & Gestion',
        niveau: '2bac',
        parcours: '1. Approfondir la microéconomie et la macroéconomie\n2. Travailler la comptabilité générale\n3. Améliorer la rédaction en français\n4. Préparer le concours ENCG',
        eleveId: eleves[3]._id,
        metierId: metierEcoGest._id,
      },
    ]);

    // Link roadmaps to Eleves and Metiers
    await Eleve.findByIdAndUpdate(eleves[0]._id, { $push: { roadmaps: roadmaps[0]._id } });
    await Eleve.findByIdAndUpdate(eleves[1]._id, { $push: { roadmaps: roadmaps[1]._id } });
    await Eleve.findByIdAndUpdate(eleves[3]._id, { $push: { roadmaps: roadmaps[2]._id } });
    await Metier.findByIdAndUpdate(metierIngInfo._id, { $push: { roadmaps: roadmaps[0]._id } });
    await Metier.findByIdAndUpdate(metierMedecin._id, { $push: { roadmaps: roadmaps[1]._id } });
    await Metier.findByIdAndUpdate(metierEcoGest._id, { $push: { roadmaps: roadmaps[2]._id } });
    console.log('✅ 3 roadmaps créées');

    // ── Résultats exercices ────────────────────────────────────────────────
    await ResultatExercice.insertMany([
      { eleveId: eleves[0]._id, exerciceId: exo1._id, score: 16, reponse: 'Df=ℝ, f\'(x)=2x/(x²+1), min en x=0', feedback: 'Très bien ! Tableau de variations complet.' },
      { eleveId: eleves[0]._id, exerciceId: exo2._id, score: 14, reponse: 'e²/4 + 1/4', feedback: 'Bonne intégration par parties, calcul final correct.' },
      { eleveId: eleves[0]._id, exerciceId: exo3._id, score: 18, reponse: 'Ep=0.25J, v_max=1m/s', feedback: 'Excellent raisonnement énergétique !' },
      { eleveId: eleves[1]._id, exerciceId: exo3._id, score: 17, reponse: 'Ep=½kx², conservation énergie', feedback: 'Très bonne application du principe de conservation.' },
      { eleveId: eleves[1]._id, exerciceId: exo4._id, score: 19, reponse: 'Description complète des 4 phases', feedback: 'Parfait ! Toutes les phases bien décrites.' },
      { eleveId: eleves[2]._id, exerciceId: exo5._id, score: 15, reponse: 'Solution: ]1/2, 2[', feedback: 'Correct, pensez à justifier le signe du discriminant.' },
      { eleveId: eleves[4]._id, exerciceId: exo5._id, score: 12, reponse: 'Solution: x entre 0.5 et 2', feedback: 'Bonne réponse mais notation à améliorer.' },
      { eleveId: eleves[6]._id, exerciceId: exo1._id, score: 20, reponse: 'Solution complète avec justifications', feedback: 'Parfait ! Travail rigoureux et complet.' },
      { eleveId: eleves[6]._id, exerciceId: exo2._id, score: 18, reponse: 'e²/4 + 1/4 calculé par IPP', feedback: 'Excellent ! Maîtrise parfaite de l\'IPP.' },
    ]);
    console.log('✅ 9 résultats d\'exercices créés');

    // ── Notifications ──────────────────────────────────────────────────────
    const notifications = await Notification.insertMany([
      { contenu: 'Bienvenue sur My-Tawjihe ! Commencez par compléter votre profil.', type: 'info', lu: false, eleveId: eleves[0]._id },
      { contenu: 'Nouveau concours disponible : Concours EMI 2026. Date limite : 15 juin.', type: 'concours', lu: false, eleveId: eleves[0]._id },
      { contenu: 'Votre résultat pour l\'exercice de Mathématiques est disponible : 16/20.', type: 'resultat', lu: true, eleveId: eleves[0]._id },
      { contenu: 'Bienvenue sur My-Tawjihe ! Votre profil a bien été créé.', type: 'info', lu: false, eleveId: eleves[1]._id },
      { contenu: 'Concours Médecine 2026 : inscriptions ouvertes jusqu\'au 5 juillet.', type: 'concours', lu: false, eleveId: eleves[1]._id },
      { contenu: 'Nouveau exercice de SVT disponible. Testez vos connaissances !', type: 'exercice', lu: false, eleveId: eleves[2]._id },
      { contenu: 'Rappel : Le concours ENCG approche. Révisez bien !', type: 'concours', lu: false, eleveId: eleves[3]._id },
      { contenu: 'Votre roadmap vers le métier d\'Ingénieur a été générée avec succès.', type: 'roadmap', lu: true, eleveId: eleves[0]._id },
      { contenu: 'Un nouvel annale de Mathématiques 2024 est disponible.', type: 'annale', lu: false, eleveId: eleves[6]._id },
      { contenu: 'Nouveau message de l\'administration.', type: 'admin', lu: false, admineId: admin._id, eleveId: eleves[0]._id },
    ]);

    // Link notifications to Eleves
    const notifByEleve = {};
    for (const notif of notifications) {
      if (notif.eleveId) {
        const key = notif.eleveId.toString();
        if (!notifByEleve[key]) notifByEleve[key] = [];
        notifByEleve[key].push(notif._id);
      }
    }
    for (const [eleveId, notifIds] of Object.entries(notifByEleve)) {
      await Eleve.findByIdAndUpdate(eleveId, { $push: { notifications: { $each: notifIds } } });
    }
    await Admine.findByIdAndUpdate(admin._id, { $push: { notifications: notifications[9]._id } });
    console.log('✅ 10 notifications créées');

    // ── Parents ────────────────────────────────────────────────────────────
    await Parent.insertMany([
      { nom: 'Mohamed Benali',       email: 'parent.yassine@test.ma', motDePasse: hash, eleveIds: [eleves[0]._id] },
      { nom: 'Khadija Elhaddad',     email: 'parent.fatima@test.ma',  motDePasse: hash, eleveIds: [eleves[1]._id] },
      { nom: 'Abdelaziz Kettani',    email: 'parent.amine@test.ma',   motDePasse: hash, eleveIds: [eleves[2]._id] },
      { nom: 'Rachid Oumzil',        email: 'parent.khalid@test.ma',  motDePasse: hash, eleveIds: [eleves[4]._id] },
    ]);
    console.log('✅ 4 parents créés');

    // ── Summary ────────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════════');
    console.log('  ✅  Base de données my_tawjihe peuplée avec succès !');
    console.log('════════════════════════════════════════════════════════');
    console.log('\n  Mot de passe pour tous les comptes : password\n');
    console.log('  ADMINS');
    console.log('    admin@mowajih.ma');
    console.log('\n  ÉLÈVES');
    eleves.forEach(e => console.log(`    ${e.email}  (${e.niveau} – ${e.filiere || ''} – ${e.ville})`));
    console.log('\n  PROFESSEURS');
    console.log('    hassan@mowajih.ma   (Mathématiques)');
    console.log('    nadia@mowajih.ma    (Physique-Chimie)');
    console.log('    karim@mowajih.ma    (SVT)');
    console.log('    samira@mowajih.ma   (Français)');
    console.log('    omar@mowajih.ma     (Anglais)');
    console.log('    leila@mowajih.ma    (Économie)');
    console.log('\n  PARENTS');
    console.log('    parent.yassine@test.ma  (parent de Yassine)');
    console.log('    parent.fatima@test.ma   (parent de Fatima)');
    console.log('    parent.amine@test.ma    (parent de Amine)');
    console.log('    parent.khalid@test.ma   (parent de Khalid)');
    console.log('════════════════════════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

seed();
