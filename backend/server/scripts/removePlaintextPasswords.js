// One-time cleanup: delete the old plain-text password copies (motDePasseClair).
// Only the bcrypt hash (motDePasse) is kept. Run: node scripts/removePlaintextPasswords.js
const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my_tawjihe');
  const db = mongoose.connection.db;
  for (const name of ['eleves', 'parents', 'professeurs', 'admines']) {
    const exists = await db.listCollections({ name }).hasNext();
    if (!exists) continue;
    const { modifiedCount } = await db.collection(name).updateMany(
      { motDePasseClair: { $exists: true } },
      { $unset: { motDePasseClair: '' } }
    );
    console.log(`${name}: ${modifiedCount} plain-text password(s) removed`);
  }
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e.message); process.exit(1); });
