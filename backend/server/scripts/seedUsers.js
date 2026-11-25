// Run: node backend/server/scripts/seedUsers.js
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Eleve = require('../models/Eleve');
const Professeur = require('../models/Professeur');
const Admine = require('../models/Admine');
const Parent = require('../models/Parent');
const Note = require('../models/Note');

const HASH_ROUNDS = 10;
const PWD = 'password';
const hash = () => bcrypt.hash(PWD, HASH_ROUNDS);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my_tawjihe');
    console.log('✅ Connected to MongoDB\n');

    // ── Clean existing test data ──────────────────────────────────────────────
    const testEmails = [
      'admin@test.com',
      'prof@test.com',
      'eleve1@test.com', 'eleve2@test.com', 'eleve3@test.com',
      'parent@test.com',
    ];
    await Admine.deleteMany({ email: { $in: testEmails } });
    await Professeur.deleteMany({ email: { $in: testEmails } });
    const deletedEleves = await Eleve.find({ email: { $in: testEmails } });
    await Note.deleteMany({ eleveId: { $in: deletedEleves.map(e => e._id) } });
    await Eleve.deleteMany({ email: { $in: testEmails } });
    await Parent.deleteMany({ email: { $in: testEmails } });
    console.log('🗑️  Cleared previous test accounts\n');

    // ── Admin ─────────────────────────────────────────────────────────────────
    await Admine.create({
      nom: 'Admin Test',
      email: 'admin@test.com',
      motDePasse: await hash(),
    });
    console.log(`👑 Admin:       admin@test.com       / ${PWD}`);

    // ── Professeur ────────────────────────────────────────────────────────────
    await Professeur.create({
      nom: 'Prof. Karim Benali',
      email: 'prof@test.com',
      motDePasse: await hash(),
      specialite: 'Mathématiques',
    });
    console.log(`🎓 Professeur:  prof@test.com        / ${PWD}`);

    // ── Élèves ────────────────────────────────────────────────────────────────
    const eleve1 = await Eleve.create({
      nom: 'Yasmine Alaoui',
      email: 'eleve1@test.com',
      motDePasse: await hash(),
      niveau: 'Terminale',
      filiere: 'Sciences Mathématiques A',
      ville: 'Casablanca',
      typeFormation: 'Public',
    });

    const eleve2 = await Eleve.create({
      nom: 'Omar Tazi',
      email: 'eleve2@test.com',
      motDePasse: await hash(),
      niveau: '2ème Bac',
      filiere: 'Sciences Physiques',
      ville: 'Rabat',
      typeFormation: 'Public',
    });

    const eleve3 = await Eleve.create({
      nom: 'Nour Chraibi',
      email: 'eleve3@test.com',
      motDePasse: await hash(),
      niveau: '1ère Bac',
      filiere: 'Sciences de la Vie et de la Terre',
      ville: 'Marrakech',
      typeFormation: 'Privé',
    });

    console.log(`📚 Élève 1:     eleve1@test.com      / ${PWD}  (${eleve1.filiere})`);
    console.log(`📚 Élève 2:     eleve2@test.com      / ${PWD}  (${eleve2.filiere})`);
    console.log(`📚 Élève 3:     eleve3@test.com      / ${PWD}  (${eleve3.filiere})`);

    // ── Notes for eleve1 (Yasmine) ────────────────────────────────────────────
    const notes1 = [
      { matiere: 'Mathématiques',  valeur: 17.5, coefficient: 7, periode: 'S1', type: 'Contrôle' },
      { matiere: 'Physique-Chimie',valeur: 15,   coefficient: 5, periode: 'S1', type: 'Examen'   },
      { matiere: 'SVT',            valeur: 14,   coefficient: 3, periode: 'S1', type: 'Contrôle' },
      { matiere: 'Français',       valeur: 13,   coefficient: 2, periode: 'S1', type: 'Devoir'   },
      { matiere: 'Anglais',        valeur: 16,   coefficient: 2, periode: 'S1', type: 'Contrôle' },
      { matiere: 'Philosophie',    valeur: 12,   coefficient: 2, periode: 'S1', type: 'Devoir'   },
      { matiere: 'Mathématiques',  valeur: 18,   coefficient: 7, periode: 'S2', type: 'Examen'   },
      { matiere: 'Physique-Chimie',valeur: 16.5, coefficient: 5, periode: 'S2', type: 'Contrôle' },
    ];

    // Notes for eleve2 (Omar)
    const notes2 = [
      { matiere: 'Mathématiques',  valeur: 11,   coefficient: 5, periode: 'S1', type: 'Contrôle' },
      { matiere: 'Physique-Chimie',valeur: 13,   coefficient: 6, periode: 'S1', type: 'Examen'   },
      { matiere: 'Français',       valeur: 9,    coefficient: 2, periode: 'S1', type: 'Devoir'   },
      { matiere: 'Mathématiques',  valeur: 10,   coefficient: 5, periode: 'S2', type: 'Contrôle' },
      { matiere: 'Physique-Chimie',valeur: 12.5, coefficient: 6, periode: 'S2', type: 'Examen'   },
    ];

    await Note.insertMany(notes1.map(n => ({ ...n, eleveId: eleve1._id })));
    await Note.insertMany(notes2.map(n => ({ ...n, eleveId: eleve2._id })));
    console.log(`\n📝 Notes inserted: ${notes1.length} for Yasmine, ${notes2.length} for Omar`);

    // ── Parent (linked to eleve1 + eleve2) ───────────────────────────────────
    await Parent.create({
      nom: 'Fatima Alaoui',
      email: 'parent@test.com',
      motDePasse: await hash(),
      eleveIds: [eleve1._id, eleve2._id],
    });
    console.log(`👪 Parent:       parent@test.com      / ${PWD} (linked to Yasmine & Omar)\n`);

    console.log('─'.repeat(60));
    console.log('✅ All test users seeded successfully!');
    console.log('\nQuick login summary:');
    console.log('  Role        | Email              | Password');
    console.log('  ------------|--------------------|-----------');
    console.log(`  Admin       | admin@test.com      | ${PWD}`);
    console.log(`  Professeur  | prof@test.com       | ${PWD}`);
    console.log(`  Élève       | eleve1@test.com     | ${PWD}`);
    console.log(`  Élève       | eleve2@test.com     | ${PWD}`);
    console.log(`  Élève       | eleve3@test.com     | ${PWD}`);
    console.log(`  Parent      | parent@test.com     | ${PWD}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.code === 11000) {
      console.error('   → Duplicate key — run the script again to reset, or change the email.');
    }
  } finally {
    await mongoose.disconnect();
  }
}

seed();
