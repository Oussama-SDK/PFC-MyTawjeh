// Who may see a given student's data (grades, results, roadmap, notifications).
const Parent = require('../models/Parent');

// Staff roles can see every student (professors follow all students, admins manage them)
const STAFF_ROLES = ['professeur', 'admin'];

const canAccessEleve = async (user, eleveId) => {
  if (!user || !eleveId) return false;
  const target = String(eleveId);

  if (user.role === 'eleve') return String(user.id) === target;
  if (STAFF_ROLES.includes(user.role)) return true;
  if (user.role === 'parent') {
    const parent = await Parent.findById(user.id).select('eleveIds').lean();
    return (parent?.eleveIds || []).some((id) => String(id) === target);
  }
  return false;
};

// Express guard for routes that carry the student id in a URL param
const requireEleveAccess = (param) => async (req, res, next) => {
  try {
    if (await canAccessEleve(req.user, req.params[param])) return next();
    return res.status(403).json({ message: 'Accès refusé' });
  } catch (e) {
    next(e);
  }
};

module.exports = { canAccessEleve, requireEleveAccess, STAFF_ROLES };
