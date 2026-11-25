const mongoose = require('mongoose');
require('dotenv').config();

const Eleve      = require('../models/Eleve');
const Professeur = require('../models/Professeur');
const Parent     = require('../models/Parent');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my_tawjihe');
  console.log('Connected to MongoDB');

  const PLAIN = 'password';
  const filter = { motDePasseClair: { $in: [null, undefined, ''] } };
  const update = { $set: { motDePasseClair: PLAIN } };
  const opts   = { strict: false };

  const [e, p, pa] = await Promise.all([
    Eleve.updateMany(filter, update, opts),
    Professeur.updateMany(filter, update, opts),
    Parent.updateMany(filter, update, opts),
  ]);

  console.log(`Eleves updated:     ${e.modifiedCount}`);
  console.log(`Professeurs updated: ${p.modifiedCount}`);
  console.log(`Parents updated:     ${pa.modifiedCount}`);

  await mongoose.disconnect();
  console.log('Done.');
}

migrate().catch(err => { console.error(err); process.exit(1); });
