import { useState } from 'react';
import Layout from '../../components/Layout';

/* ─── DATA ─── */

const etablissementsPublics = [
  {
    id: 1,
    nom: 'Université Mohammed V – Rabat',
    ville: 'Rabat',
    type: 'Université publique',
    domaines: ['Droit', 'Sciences', 'Médecine', 'Lettres', 'Informatique'],
    description:
      "L'une des plus anciennes universités du Maroc, offrant une large gamme de filières dans les sciences, les lettres, le droit et la médecine.",
    lien: 'https://www.um5.ac.ma',
    emoji: '🏛️',
    badge: 'Grande université',
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8',
  },
  {
    id: 2,
    nom: 'Université Hassan II – Casablanca',
    ville: 'Casablanca',
    type: 'Université publique',
    domaines: ['Sciences Économiques', 'Ingénierie', 'Médecine', 'Sciences sociales'],
    description:
      'Université dynamique basée à Casablanca, réputée pour ses facultés de sciences économiques et d\'ingénierie.',
    lien: 'https://www.uh2c.ac.ma',
    emoji: '🏫',
    badge: 'Grande université',
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8',
  },
  {
    id: 3,
    nom: 'Université Cadi Ayyad – Marrakech',
    ville: 'Marrakech',
    type: 'Université publique',
    domaines: ['Sciences', 'Technologie', 'Droit', 'Lettres', 'Médecine'],
    description:
      'Classée parmi les meilleures universités africaines, connue pour la qualité de ses formations scientifiques et technologiques.',
    lien: 'https://www.uca.ac.ma',
    emoji: '🏫',
    badge: 'Top Afrique',
    badgeBg: '#f0fdf4',
    badgeColor: '#15803d',
  },
];

const grandEcoles = [
  {
    id: 4,
    nom: 'École Nationale Supérieure d\'Informatique (ENSIAS)',
    ville: 'Rabat',
    type: 'Grande école publique',
    domaines: ['Génie Logiciel', 'Réseaux', 'IA', 'Cybersécurité'],
    description:
      'École d\'ingénieurs en informatique parmi les plus réputées au Maroc, accessible via concours national.',
    lien: 'https://ensias.um5.ac.ma',
    emoji: '💻',
    badge: 'Concours',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
  },
  {
    id: 5,
    nom: 'École Mohammadia d\'Ingénieurs (EMI)',
    ville: 'Rabat',
    type: 'Grande école publique',
    domaines: ['Génie Civil', 'Électronique', 'Informatique', 'Mécanique'],
    description:
      'La plus ancienne école d\'ingénieurs au Maroc, formant des ingénieurs d\'État dans plusieurs spécialités.',
    lien: 'https://www.emi.ac.ma',
    emoji: '⚙️',
    badge: 'Concours',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
  },
  {
    id: 6,
    nom: 'École Nationale de Commerce et de Gestion (ENCG)',
    ville: 'Multiple villes',
    type: 'Grande école publique',
    domaines: ['Finance', 'Marketing', 'Management', 'Commerce international'],
    description:
      'Réseau d\'écoles de commerce publiques accessibles via concours, formant des cadres en gestion et commerce.',
    lien: 'https://www.encg.ac.ma',
    emoji: '📈',
    badge: 'Concours',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
  },
];

const universitesPrivees = [
  {
    id: 7,
    nom: 'HEM Business School',
    ville: 'Casablanca / Rabat / Fès / Marrakech',
    type: 'Privée',
    domaines: ['Business & Management'],
    description:
      'École de commerce privée de référence au Maroc, proposant des formations en management, finance et marketing reconnues par l\'État.',
    lien: 'https://www.hem.ac.ma',
    emoji: '🏢',
    badge: 'Business',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
    tags: ['Privée'],
  },
  {
    id: 8,
    nom: 'ESCA École de Management',
    ville: 'Casablanca',
    type: 'Privée',
    domaines: ['Management & Affaires'],
    description:
      'L\'une des rares écoles africaines accréditées AACSB, offrant des programmes MBA et Bachelor en management des affaires.',
    lien: 'https://www.esca.ma',
    emoji: '🎓',
    badge: 'AACSB',
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8',
    tags: ['Privée'],
  },
  {
    id: 9,
    nom: 'Université Internationale de Rabat (UIR)',
    ville: 'Rabat',
    type: 'Privée',
    domaines: ['Ingénierie', 'Architecture', 'Droit', 'Économie', 'Sciences sociales'],
    description:
      'Université pluridisciplinaire privée avec des partenariats solides avec des universités françaises et canadiennes.',
    lien: 'https://www.uir.ac.ma',
    emoji: '🌐',
    badge: 'Partenariats France/Canada',
    badgeBg: '#f5f3ff',
    badgeColor: '#7c3aed',
    tags: ['Privée'],
  },
  {
    id: 10,
    nom: 'Mundiapolis',
    ville: 'Casablanca',
    type: 'Privée',
    domaines: ['Communication & Business', 'Design', 'Ingénierie'],
    description:
      'Université privée axée sur l\'international, proposant des programmes en partenariat avec des universités américaines et espagnoles.',
    lien: 'https://www.mundiapolis.ma',
    emoji: '🌍',
    badge: 'International',
    badgeBg: '#ecfeff',
    badgeColor: '#0891b2',
    tags: ['Privée'],
  },
  {
    id: 11,
    nom: 'Université Privée de Marrakech (UPM)',
    ville: 'Marrakech',
    type: 'Privée',
    domaines: ['Médecine', 'Pharmacie', 'Droit', 'Sciences économiques'],
    description:
      'Université privée offrant des formations dans des domaines variés avec des corps enseignants de haut niveau.',
    lien: 'https://www.upm.ac.ma',
    emoji: '🏥',
    badge: 'Médecine & Droit',
    badgeBg: '#fdf2f8',
    badgeColor: '#be185d',
    tags: ['Privée'],
  },
  {
    id: 12,
    nom: 'Université Internationale de Casablanca (UIC)',
    ville: 'Casablanca',
    type: 'Privée',
    domaines: ['Informatique', 'Finance', 'Architecture', 'Commerce'],
    description:
      'Fondée en partenariat avec des institutions belges et françaises, l\'UIC propose des diplômes reconnus à l\'international.',
    lien: 'https://www.uic.ac.ma',
    emoji: '🏙️',
    badge: 'Partenariat Belgique/France',
    badgeBg: '#f0fdf4',
    badgeColor: '#15803d',
    tags: ['Privée'],
  },
];

/* ─── Avant Bac Content ─── */
const filieresBac = [
  { icon: '🔬', label: 'Sciences Physiques', debouches: ['CPGE', 'ENSA', 'Médecine', 'Pharmacie'] },
  { icon: '💻', label: 'Sciences Mathématiques', debouches: ['ENSIAS', 'EMI', 'CPGE', 'FST'] },
  { icon: '🌱', label: 'Sciences de la Vie et de la Terre', debouches: ['Médecine', 'Vétérinaire', 'Agronomie'] },
  { icon: '💼', label: 'Sciences Économiques & Gestion', debouches: ['ENCG', 'HEM', 'ESCA', 'Faculté des Sciences Éco'] },
  { icon: '📜', label: 'Lettres & Sciences Humaines', debouches: ['Faculté des Lettres', 'FLSH', 'Master Communication'] },
  { icon: '🔧', label: 'Technique', debouches: ['OFPPT', 'BTS', 'IUT', 'Licence pro Technologie'] },
];

const conseilsAvantBac = [
  { icon: '📚', titre: 'Consolidez vos bases', texte: 'Les matières fondamentales (maths, physique, SVT) sont la clé pour intégrer les grandes écoles.' },
  { icon: '🎯', titre: 'Choisissez votre filière tôt', texte: 'Définir votre orientation dès la 2ème année secondaire vous permet de vous préparer stratégiquement.' },
  { icon: '📝', titre: 'Préparez-vous aux concours', texte: 'Les grandes écoles publiques (ENSIAS, EMI, ENCG) sont accessibles via concours national après le bac.' },
  { icon: '🏆', titre: 'Visez la mention au bac', texte: 'Une mention Bien ou Très Bien ouvre les portes des CPGE et des filières d\'excellence.' },
];

/* ─── COMPONENTS ─── */

function EtablissementCard({ e, onClick }) {
  return (
    <div
      onClick={() => onClick(e)}
      className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-lg transition-all hover:border-yellow-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{e.emoji}</span>
          <div>
            <h3 className="font-bold text-gray-800 text-sm leading-tight">{e.nom}</h3>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <span>📍</span> {e.ville}
            </p>
          </div>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0"
          style={{ background: e.badgeBg, color: e.badgeColor }}
        >
          {e.badge}
        </span>
      </div>
      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{e.description}</p>
      <div className="flex flex-wrap gap-1">
        {e.domaines.slice(0, 3).map(d => (
          <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{d}</span>
        ))}
        {e.domaines.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">+{e.domaines.length - 3}</span>
        )}
      </div>
      {e.tags && (
        <div className="flex gap-1 mt-2">
          {e.tags.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function Modal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{item.emoji}</span>
          <div>
            <h3 className="text-xl font-black text-gray-800">{item.nom}</h3>
            <p className="text-sm text-gray-400 flex items-center gap-1"><span>📍</span>{item.ville}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-5">{item.description}</p>
        <div className="mb-5">
          <h4 className="font-bold text-gray-700 mb-2 text-sm">📚 Domaines de formation</h4>
          <div className="flex flex-wrap gap-2">
            {item.domaines.map(d => (
              <span key={d} className="text-sm px-3 py-1 rounded-full" style={{ background: item.badgeBg, color: item.badgeColor }}>{d}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <a
            href={item.lien}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: item.badgeColor }}
          >
            🌐 Visiter le site officiel
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */

export default function UniversitesPage() {
  const [activeTab, setActiveTab] = useState('apres'); // 'avant' | 'apres'
  const [selected, setSelected] = useState(null);
  const [showAllPrivees, setShowAllPrivees] = useState(false);

  const priveesAffichees = showAllPrivees ? universitesPrivees : universitesPrivees.slice(0, 4);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-800">🎓 Orientation & Établissements</h2>
        <p className="text-gray-500 mt-1 text-sm">Découvrez les parcours et établissements selon votre étape scolaire</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('avant')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'avant'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📘 Avant Bac
        </button>
        <button
          onClick={() => setActiveTab('apres')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'apres'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🎓 Après Bac
        </button>
      </div>

      {/* ══════════ AVANT BAC ══════════ */}
      {activeTab === 'avant' && (
        <div className="space-y-8">
          {/* Conseils */}
          <div className="grid md:grid-cols-2 gap-4">
            {conseilsAvantBac.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{c.titre}</h4>
                  <p className="text-gray-500 text-xs">{c.texte}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filières et débouchés */}
          <div>
            <h3 className="text-lg font-black text-gray-800 mb-4">📋 Filières du Bac & Débouchés</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filieresBac.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{f.icon}</span>
                    <h4 className="font-bold text-gray-800 text-sm">{f.label}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {f.debouches.map(d => (
                      <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-medium">{d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 text-white">
            <h3 className="font-black text-lg mb-1">💡 Prêt à choisir votre voie ?</h3>
            <p className="text-yellow-100 text-sm">
              Passez à l'onglet <strong>"Après Bac"</strong> pour explorer les universités et grandes écoles qui vous attendent.
            </p>
          </div>
        </div>
      )}

      {/* ══════════ APRÈS BAC ══════════ */}
      {activeTab === 'apres' && (
        <div className="space-y-10">

          {/* Universités publiques */}
          <section>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🏛️</span>
              <h3 className="text-lg font-black text-gray-800">Universités Publiques</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4 ml-9">
              Accessibles après le baccalauréat, gratuites ou à faibles frais, réparties sur tout le territoire.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {etablissementsPublics.map(e => (
                <EtablissementCard key={e.id} e={e} onClick={setSelected} />
              ))}
            </div>
          </section>

          {/* Grandes écoles */}
          <section>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🏆</span>
              <h3 className="text-lg font-black text-gray-800">Grandes Écoles Publiques</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4 ml-9">
              Accessibles via concours national. Forment des ingénieurs et cadres d'élite.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grandEcoles.map(e => (
                <EtablissementCard key={e.id} e={e} onClick={setSelected} />
              ))}
            </div>
          </section>

          {/* ── Universités & Écoles Privées ── */}
          <section>
            <div
              className="flex items-center gap-3 mb-1 pb-3"
              style={{ borderBottom: '2px solid #f3f4f6' }}
            >
              <span className="text-2xl">🏢</span>
              <h3 className="text-lg font-black text-gray-800">Universités & Écoles Privées</h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: '#f5f3ff', color: '#7c3aed' }}
              >
                {universitesPrivees.length}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4 ml-9">
              Ces établissements privés reconnus par l'État offrent des formations de qualité. Les frais sont plus élevés, mais beaucoup proposent des bourses partielles ou complètes.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {priveesAffichees.map(e => (
                <EtablissementCard key={e.id} e={e} onClick={setSelected} />
              ))}
            </div>

            {universitesPrivees.length > 4 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowAllPrivees(v => !v)}
                  className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  {showAllPrivees ? '▲ Réduire' : `Voir tout (${universitesPrivees.length}) ▼`}
                </button>
              </div>
            )}
          </section>

        </div>
      )}

      {/* Modal */}
      <Modal item={selected} onClose={() => setSelected(null)} />
    </Layout>
  );
}
