// Centralized error handling middleware (Express 5 forwards async errors here)
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Mongoose: document failed schema validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Données invalides',
      errors: Object.values(err.errors || {}).map(e => ({ field: e.path, message: e.message })),
    });
  }

  // Mongoose: malformed id or value of the wrong type (e.g. /notes/not-an-id)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identifiant ou valeur invalide' });
  }

  // MongoDB: unique index violation (e.g. email already used)
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Cette valeur existe déjà' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token invalide' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expiré' });
  }

  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON invalide' });
  }

  // Anything else: don't leak internal details for server errors
  const status = err.status || 500;
  res.status(status).json({ message: status < 500 ? err.message : 'Erreur interne du serveur' });
};

module.exports = { errorHandler };
