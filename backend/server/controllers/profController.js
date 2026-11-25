const Note = require('../models/Note');
const Eleve = require('../models/Eleve');
const ResultatExercice = require('../models/ResultatExercice');
const Exercice = require('../models/Exercice');

const getElevesFaibles = async (req, res) => {
  try {
    const Professeur = require('../models/Professeur');
    const prof = await Professeur.findById(req.user.id).select('specialite').lean();
    const profSpecialite = prof?.specialite || null;

    const queryEx = { professeurId: req.user.id };
    if (profSpecialite) {
      queryEx.matiere = profSpecialite;
    }
    
    const exercices = await Exercice.find(queryEx).lean();
    const exerciceIds = exercices.map(e => e._id.toString());
    
    if (!exerciceIds.length) return res.json([]);

    const resultats = await ResultatExercice.find({ exerciceId: { $in: exerciceIds } }).lean();

    const byEleve = {};
    resultats.forEach(r => {
      const score = parseFloat(r.score || 0);
      const eleveIdStr = r.eleveId.toString();
      
      if (!byEleve[eleveIdStr]) {
        byEleve[eleveIdStr] = { total: 0, count: 0, worst: null };
      }
      
      byEleve[eleveIdStr].total += score;
      byEleve[eleveIdStr].count += 1;
      
      const ex = exercices.find(e => e._id.toString() === r.exerciceId.toString());
      if (!byEleve[eleveIdStr].worst || score < byEleve[eleveIdStr].worst.score) {
        byEleve[eleveIdStr].worst = {
          score,
          matiere: ex?.matiere || 'Inconnue',
          contenu: String(ex?.contenu || 'Aucun détail').slice(0, 80),
        };
      }
    });

    const faibleIds = Object.entries(byEleve)
      .filter(([, d]) => d.count > 0 && (d.total / d.count) < 12)
      .map(([id]) => id);

    if (!faibleIds.length) return res.json([]);

    const eleves = await Eleve.find({ _id: { $in: faibleIds } })
      .select('nom email niveau filiere')
      .lean();

    const result = eleves.map(e => {
      const stats = byEleve[e._id.toString()];
      const avg = stats ? stats.total / stats.count : null;
      return {
        ...e,
        id: e._id,
        moyenne: avg !== null ? avg.toFixed(1) : null,
        weakestSubject: stats?.worst?.matiere || '—',
        weakestExercise: stats?.worst?.contenu || '—',
        weakestScore: stats?.worst?.score != null ? stats.worst.score.toFixed(1) : null,
      };
    });

    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getProfStats = async (req, res) => {
  try {
    const exercices = await Exercice.find({ professeurId: req.user.id }).lean();
    const ids = exercices.map(e => e._id.toString());
    
    if (!ids.length) return res.json({ resultats: [] });

    const resultats = await ResultatExercice.find({ exerciceId: { $in: ids } }).lean();

    const enriched = await Promise.all(resultats.map(async r => {
      const eleve = await Eleve.findById(r.eleveId).select('nom email').lean();
      const ex = exercices.find(e => e._id.toString() === r.exerciceId.toString());
      return {
        ...r,
        id: r._id,
        eleveName: eleve?.nom,
        eleveEmail: eleve?.email,
        exMatiere: ex?.matiere,
        exContenu: ex?.contenu?.slice(0, 60),
      };
    }));

    res.json({ resultats: enriched });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const postService = async (req, res) => {
  try {
    // TODO: implement prof service creation
    res.status(501).json({ message: 'Fonctionnalité non encore implémentée' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getElevesFaibles, getProfStats, postService };
