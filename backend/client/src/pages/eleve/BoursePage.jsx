import { useState } from 'react';
import Layout from '../../components/Layout';

const bourses = [
  {
    id: 1,
    nom: 'Bourse d\'excellence AMCI',
    organisme: 'AMCI – Agence Marocaine de Coopération Internationale',
    type: 'Études à l\'étranger',
    pays: ['France', 'Canada', 'Espagne', 'Allemagne', 'Chine', 'Russie'],
    description:
      'Plus de 500 bourses d\'études octroyées chaque année aux lauréats des classes préparatoires et bacheliers excellents pour poursuivre leurs études supérieures à l\'étranger.',
    conditions: [
      'Nationalité marocaine',
      'Mention Très Bien ou Bien au Baccalauréat',
      'Âge inférieur à 25 ans',
      'Dossier académique solide',
    ],
    lien: 'https://www.amci.ma',
    deadline: 'Juin – Juillet (chaque année)',
    couleur: '#1d4ed8',
    bg: '#eff6ff',
    emoji: '🌍',
  },
  {
    id: 2,
    nom: 'Bourse du Ministère de l\'Enseignement Supérieur',
    organisme: 'Ministère de l\'Enseignement Supérieur – Maroc',
    type: 'Études au Maroc',
    pays: ['Maroc'],
    description:
      'Bourse nationale accordée aux étudiants inscrits dans les établissements publics d\'enseignement supérieur selon des critères sociaux et académiques.',
    conditions: [
      'Inscription dans un établissement public',
      'Revenu familial inférieur au seuil défini',
      'Assiduité et résultats satisfaisants',
    ],
    lien: 'https://www.enssup.gov.ma',
    deadline: 'Octobre – Novembre (début d\'année universitaire)',
    couleur: '#15803d',
    bg: '#f0fdf4',
    emoji: '🎓',
  },
  {
    id: 3,
    nom: 'Bourse OCP Foundation',
    organisme: 'OCP Foundation',
    type: 'Soutien scolaire & universitaire',
    pays: ['Maroc'],
    description:
      'Programme de bourses destiné aux jeunes talents issus de milieux défavorisés, couvrant les frais de scolarité, le logement et un accompagnement pédagogique personnalisé.',
    conditions: [
      'Excellents résultats scolaires',
      'Situation socio-économique difficile',
      'Motivation et projet professionnel défini',
    ],
    lien: 'https://www.ocpfoundation.ma',
    deadline: 'Variable selon les programmes',
    couleur: '#b45309',
    bg: '#fffbeb',
    emoji: '🏭',
  },
  {
    id: 4,
    nom: 'Bourse Campus France Maroc',
    organisme: 'Ambassade de France au Maroc',
    type: 'Études en France',
    pays: ['France'],
    description:
      'Bourses du gouvernement français destinées aux étudiants marocains souhaitant poursuivre un Master ou un Doctorat en France, via le programme BGF (Bourse du Gouvernement Français).',
    conditions: [
      'Licence validée avec mention',
      'Niveau B2 en français minimum',
      'Lettre de motivation et projet d\'études',
      'Acceptation préalable d\'un établissement français',
    ],
    lien: 'https://maroc.campusfrance.org',
    deadline: 'Janvier – Mars',
    couleur: '#7c3aed',
    bg: '#f5f3ff',
    emoji: '🇫🇷',
  },
  {
    id: 5,
    nom: 'Bourse Erasmus+ Maroc',
    organisme: 'Union Européenne – Programme Erasmus+',
    type: 'Mobilité internationale',
    pays: ['Union Européenne'],
    description:
      'Financement de mobilité pour étudiants marocains inscrits dans des universités partenaires, permettant de passer un ou deux semestres dans une université européenne.',
    conditions: [
      'Inscription dans une université marocaine partenaire Erasmus+',
      'Niveau linguistique requis (français/anglais/espagnol)',
      'Validation de la mobilité par les deux universités',
    ],
    lien: 'https://erasmus-plus.ec.europa.eu',
    deadline: 'Février – Avril (selon les universités)',
    couleur: '#0891b2',
    bg: '#ecfeff',
    emoji: '🇪🇺',
  },
  {
    id: 6,
    nom: 'Bourse Al Jisr',
    organisme: 'Fondation Al Jisr – Secteur Privé',
    type: 'Soutien scolaire',
    pays: ['Maroc'],
    description:
      'Programme de parrainage entre élèves méritants du secondaire et entreprises marocaines, offrant une aide financière mensuelle et un accompagnement tout au long du parcours scolaire.',
    conditions: [
      'Élève en 2ème ou Terminale',
      'Moyenne générale ≥ 14/20',
      'Situation familiale modeste',
      'Recommandation du directeur d\'établissement',
    ],
    lien: 'https://www.fondation-aljisr.ma',
    deadline: 'Septembre – Octobre',
    couleur: '#be185d',
    bg: '#fdf2f8',
    emoji: '🤝',
  },
  {
    id: 7,
    nom: 'Bourse Minhaty (Bourse Nationale)',
    organisme: 'Ministère de l\'Enseignement Supérieur – Portail Minhaty',
    type: 'Études au Maroc',
    pays: ['Maroc'],
    description:
      'La bourse nationale marocaine gérée via le portail Minhaty.ma, accordée aux étudiants inscrits dans les établissements publics d\'enseignement supérieur. Le montant varie selon le semestre : 1 900 DH/mois pour les 1er et 2ème semestres, et 2 533 DH/mois pour le 3ème semestre.',
    conditions: [
      'Nationalité marocaine',
      'Inscription dans un établissement public d\'enseignement supérieur',
      'Revenu familial inférieur au seuil fixé par le ministère',
      'Assiduité et résultats académiques satisfaisants',
      'Dépôt du dossier via le portail e-bourse-maroc.onousc.ma',
    ],
    lien: 'https://www.minhaty.ma',
    deadline: 'Octobre – Novembre (début d\'année universitaire)',
    couleur: '#0369a1',
    bg: '#f0f9ff',
    emoji: '🏛️',
  },
];

const types = ['Tous', 'Études à l\'étranger', 'Études au Maroc', 'Mobilité internationale', 'Soutien scolaire & universitaire', 'Soutien scolaire'];

export default function BoursePage() {
  const [filtre, setFiltre] = useState('Tous');
  const [selected, setSelected] = useState(null);

  const affichees = filtre === 'Tous' ? bourses : bourses.filter(b => b.type === filtre);

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-2">🎓 Bourses d'études</h2>
      <p className="text-gray-500 text-sm mb-6">
        Découvrez les bourses disponibles pour les étudiants marocains — nationales et internationales.
      </p>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-8">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFiltre(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filtre === t
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-400 hover:text-yellow-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grille des bourses */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {affichees.map(b => (
          <div
            key={b.id}
            onClick={() => setSelected(b)}
            className="card p-6 cursor-pointer hover:shadow-lg transition-all border border-transparent hover:border-yellow-300"
            style={{ borderTop: `4px solid ${b.couleur}` }}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{b.emoji}</span>
              <div>
                <h3 className="font-bold text-gray-800 text-base leading-tight">{b.nom}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{b.organisme}</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{b.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {b.pays.map(p => (
                <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p}</span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span
                className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{ background: b.bg, color: b.couleur }}
              >
                {b.type}
              </span>
              <span className="text-xs text-gray-400">📅 {b.deadline}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal détail */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selected.emoji}</span>
              <div>
                <h3 className="text-xl font-black text-gray-800">{selected.nom}</h3>
                <p className="text-sm text-gray-400">{selected.organisme}</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-5">{selected.description}</p>

            <div className="mb-5">
              <h4 className="font-bold text-gray-700 mb-2 text-sm">✅ Conditions d'éligibilité</h4>
              <ul className="space-y-1">
                {selected.conditions.map((c, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <span>📅</span>
              <span><strong>Deadline :</strong> {selected.deadline}</span>
            </div>

            <div className="flex gap-3">
              <a
                href={selected.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
                style={{ background: selected.couleur }}
              >
                🌐 Visiter le site officiel
              </a>
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
