import { useState } from 'react';
import Layout from '../../components/Layout';

/* ─── DATA ─── */
const regions = [
  {
    id: 'TT', nom: 'Tanger-Tétouan-Al Hoceïma', abbr: 'TTA', color: '#3b82f6',
    provinces: ['Tanger', 'Tétouan', 'Al Hoceïma', 'Larache', 'Chefchaouen', 'Ouazzane'],
    top: '6%', left: '20%',
    etablissements: [
      { nom: 'Université Abdelmalek Essaâdi', ville: 'Tétouan', type: 'Université publique', lien: 'https://www.uae.ac.ma', emoji: '🏛️' },
      { nom: 'ENSA Tanger', ville: 'Tanger', type: 'Grande école', lien: 'https://www.ensa.uae.ac.ma', emoji: '⚙️' },
    ],
  },
  {
    id: 'OR', nom: "L'Oriental", abbr: 'ORI', color: '#f59e0b',
    provinces: ['Oujda', 'Nador', 'Berkane', 'Taourirt', 'Jerada', 'Driouch'],
    top: '14%', left: '65%',
    etablissements: [
      { nom: 'Université Mohammed Ier', ville: 'Oujda', type: 'Université publique', lien: 'https://www.ump.ma', emoji: '🏛️' },
      { nom: 'ENSA Oujda', ville: 'Oujda', type: 'Grande école', lien: 'https://www.ensao.ump.ma', emoji: '⚙️' },
    ],
  },
  {
    id: 'FES', nom: 'Fès-Meknès', abbr: 'FES', color: '#8b5cf6',
    provinces: ['Fès', 'Meknès', 'Sefrou', 'Ifrane', 'El Hajeb', 'Taounate'],
    top: '20%', left: '42%',
    etablissements: [
      { nom: 'Université Sidi Mohamed Ben Abdellah', ville: 'Fès', type: 'Université publique', lien: 'https://www.usmba.ac.ma', emoji: '🏛️' },
      { nom: 'ENSA Fès', ville: 'Fès', type: 'Grande école', lien: 'https://ensaf.ac.ma', emoji: '⚙️' },
    ],
  },
  {
    id: 'RAB', nom: 'Rabat-Salé-Kénitra', abbr: 'RAB', color: '#10b981',
    provinces: ['Rabat', 'Salé', 'Kénitra', 'Skhirat-Témara', 'Khémisset'],
    top: '25%', left: '22%',
    etablissements: [
      { nom: 'Université Mohammed V', ville: 'Rabat', type: 'Université publique', lien: 'https://www.um5.ac.ma', emoji: '🏛️' },
      { nom: 'ENSIAS', ville: 'Rabat', type: 'Grande école', lien: 'https://ensias.um5.ac.ma', emoji: '💻' },
      { nom: "École Mohammadia d'Ingénieurs (EMI)", ville: 'Rabat', type: 'Grande école', lien: 'https://www.emi.ac.ma', emoji: '⚙️' },
    ],
  },
  {
    id: 'CASA', nom: 'Casablanca-Settat', abbr: 'CSB', color: '#ef4444',
    provinces: ['Casablanca', 'Mohammedia', 'Settat', 'El Jadida', 'Berrechid'],
    top: '35%', left: '20%',
    etablissements: [
      { nom: 'Université Hassan II', ville: 'Casablanca', type: 'Université publique', lien: 'https://www.uh2c.ac.ma', emoji: '🏛️' },
      { nom: 'ESCA École de Management', ville: 'Casablanca', type: 'École privée', lien: 'https://www.esca.ma', emoji: '🎓' },
    ],
  },
  {
    id: 'BM', nom: 'Béni Mellal-Khénifra', abbr: 'BMK', color: '#0891b2',
    provinces: ['Béni Mellal', 'Azilal', 'Khénifra', 'Khouribga'],
    top: '38%', left: '38%',
    etablissements: [
      { nom: 'Université Sultan Moulay Slimane', ville: 'Béni Mellal', type: 'Université publique', lien: 'https://www.usms.ac.ma', emoji: '🏛️' },
    ],
  },
  {
    id: 'MARR', nom: 'Marrakech-Safi', abbr: 'MRS', color: '#d97706',
    provinces: ['Marrakech', 'Safi', 'Essaouira', 'El Kelâa des Sraghna'],
    top: '47%', left: '28%',
    etablissements: [
      { nom: 'Université Cadi Ayyad', ville: 'Marrakech', type: 'Université publique', lien: 'https://www.uca.ac.ma', emoji: '🏛️' },
      { nom: 'ENSA Marrakech', ville: 'Marrakech', type: 'Grande école', lien: 'https://www.ensa-marrakech.ac.ma', emoji: '⚙️' },
    ],
  },
  {
    id: 'DRA', nom: 'Drâa-Tafilalet', abbr: 'DTF', color: '#b45309',
    provinces: ['Ouarzazate', 'Errachidia', 'Zagora', 'Tinghir', 'Midelt'],
    top: '52%', left: '50%',
    etablissements: [
      { nom: 'Université Moulay Ismail – Errachidia', ville: 'Errachidia', type: 'Université publique', lien: 'https://www.umi.ac.ma', emoji: '🏛️' },
    ],
  },
  {
    id: 'SOUS', nom: 'Souss-Massa', abbr: 'SMA', color: '#be185d',
    provinces: ['Agadir', 'Taroudant', 'Tiznit', 'Chtouka Aït Baha'],
    top: '55%', left: '18%',
    etablissements: [
      { nom: 'Université Ibn Zohr – Agadir', ville: 'Agadir', type: 'Université publique', lien: 'https://www.uiz.ac.ma', emoji: '🏛️' },
      { nom: 'ENSA Agadir', ville: 'Agadir', type: 'Grande école', lien: 'https://ensa.uiz.ac.ma', emoji: '⚙️' },
    ],
  },
  {
    id: 'GUEL', nom: 'Guelmim-Oued Noun', abbr: 'GON', color: '#7c3aed',
    provinces: ['Guelmim', 'Tan-Tan', 'Sidi Ifni', 'Assa-Zag'],
    top: '64%', left: '15%',
    etablissements: [
      { nom: 'EST Guelmim', ville: 'Guelmim', type: 'Grande école', lien: 'https://www.uiz.ac.ma', emoji: '🏫' },
    ],
  },
  {
    id: 'LSH', nom: 'Laâyoune-Sakia El Hamra', abbr: 'LSH', color: '#9333ea',
    provinces: ['Laâyoune', 'Boujdour', 'Tarfaya', 'Es-Semara'],
    top: '72%', left: '14%',
    etablissements: [
      {
        nom: 'Université Ibn Zohr — Laâyoune',
        ville: 'Laâyoune', type: 'Université publique',
        lien: 'https://www.uiz.ac.ma', emoji: '🏛️',
        badge: 'Université', badgeBg: '#eff6ff', badgeColor: '#1d4ed8',
        presentation: 'Antenne universitaire du sud : droit, sciences et économie au service des provinces du Sahara.',
        programmes: ['Droit', 'Sciences', 'Économie'],
        frais: '400–600 MAD/an',
        conditions: ['Bac marocain'],
        bourses: 'Bourse nationale',
      },
      {
        nom: 'École Supérieure de Technologie (EST Laâyoune)',
        ville: 'Laâyoune', type: 'Grande école publique',
        lien: 'https://est-laayoune.uiz.ac.ma', emoji: '🏫',
        badge: 'Technologie', badgeBg: '#f0fdf4', badgeColor: '#15803d',
        presentation: 'Tابعة لجامعة Ibn Zohr، تكوين تقني عالٍ في الإعلاميات والشبكات والإلكترونيك.',
        programmes: ['Génie Informatique', 'Réseaux & Télécoms', 'Électronique'],
        frais: '400–600 MAD/an',
        conditions: ['Bac scientifique ou technique', 'Concours ou dossier'],
        bourses: 'Bourse nationale',
        specialites: ['Génie Informatique', 'Réseaux & Télécoms', 'Électronique'],
      },
      {
        nom: 'Universiapolis — Université Internationale de Laâyoune',
        ville: 'Laâyoune', type: 'Université privée',
        lien: 'https://www.universiapolis.ma', emoji: '🎓',
        badge: 'Privée', badgeBg: '#f5f3ff', badgeColor: '#7c3aed',
        presentation: "Université privée internationale à Laâyoune, formations pluridisciplinaires reconnues par l'État marocain.",
        programmes: ['Management', 'Génie Informatique', 'Génie Industriel', 'Génie Électrique'],
        frais: '20 000–35 000 MAD/an',
        conditions: ['Baccalauréat toutes filières', 'Entretien de sélection'],
        bourses: 'Bourses partielles disponibles',
        specialites: ['Management', 'Génie Informatique', 'Génie Industriel', 'Génie Électrique'],
      },
      {
        nom: 'Cité des Métiers et Compétences — العيون (CMC / OFPPT)',
        ville: 'Laâyoune', type: 'Formation professionnelle',
        lien: 'https://www.ofppt.ma', emoji: '🛠️',
        badge: 'OFPPT', badgeBg: '#fef3c7', badgeColor: '#b45309',
        presentation: 'مدينة المهن والكفاءات — تكوين مهني بمستويي Technicien و Technicien Spécialisé في عدة مجالات.',
        programmes: ['Technicien', 'Technicien Spécialisé'],
        frais: 'Gratuit / faibles frais',
        conditions: ['Bac ou niveau Bac', 'Concours OFPPT'],
        bourses: 'Aide sociale OFPPT',
        specialites: ['Technicien', 'Technicien Spécialisé', 'Plusieurs filières'],
      },
      {
        nom: "ISGI Laâyoune — Institut Spécialisé de Gestion et d'Informatique",
        ville: 'Laâyoune', type: 'Formation professionnelle',
        lien: 'https://www.ofppt.ma/inscription', emoji: '💻',
        badge: 'OFPPT', badgeBg: '#fef3c7', badgeColor: '#b45309',
        presentation: "Institut OFPPT spécialisé en gestion et informatique à Laâyoune — filières reconnues sur le marché de l'emploi.",
        programmes: ['Développement Informatique', 'Réseaux Informatiques', 'Gestion des Entreprises'],
        frais: 'Gratuit / faibles frais',
        conditions: ['Bac ou niveau Bac', 'Concours OFPPT'],
        bourses: 'Aide sociale OFPPT',
        specialites: ['Développement Informatique', 'Réseaux Informatiques', 'Gestion des Entreprises'],
      },
    ],
  },
  {
    id: 'DAK', nom: 'Dakhla-Oued Ed-Dahab', abbr: 'DOD', color: '#0e7490',
    provinces: ['Dakhla', 'Aousserd'],
    top: '84%', left: '22%',
    etablissements: [
      { nom: 'Centre de Formation par Apprentissage – Dakhla', ville: 'Dakhla', type: 'Formation professionnelle', lien: 'https://www.ofppt.ma', emoji: '🛠️' },
    ],
  },
];

/* ─── MODAL ─── */
function EtabModal({ e, onClose }) {
  if (!e) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={ev => ev.stopPropagation()}>
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{e.emoji}</span>
              <div>
                <h3 className="font-black text-gray-800 text-base leading-snug">{e.nom}</h3>
                <p className="text-xs text-gray-400 mt-0.5">📍 {e.ville} · {e.type}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xl mt-1">✕</button>
          </div>
          {e.badge && (
            <span className="inline-block mt-3 text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: e.badgeBg, color: e.badgeColor }}>{e.badge}</span>
          )}
        </div>
        <div className="px-6 py-4 space-y-4 max-h-72 overflow-y-auto">
          {e.presentation && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">📋 Présentation</p>
              <p className="text-sm text-gray-600">{e.presentation}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {e.programmes?.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-blue-600 mb-1.5">📘 Programmes</p>
                <div className="flex flex-wrap gap-1">
                  {e.programmes.map((p, i) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">{p}</span>
                  ))}
                </div>
              </div>
            )}
            {e.frais && (
              <div className="bg-yellow-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-yellow-700 mb-1.5">💰 Frais</p>
                <p className="text-sm font-bold text-yellow-800">{e.frais}</p>
              </div>
            )}
          </div>
          {e.conditions?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">📝 Conditions d'admission</p>
              {e.conditions.map((c, i) => (
                <p key={i} className="text-sm text-gray-600 flex items-center gap-1.5"><span className="text-green-500">•</span>{c}</p>
              ))}
            </div>
          )}
          {e.bourses && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">🎓 Bourses</p>
              <p className="text-sm text-green-700 font-medium">{e.bourses}</p>
            </div>
          )}
        </div>
        <div className="px-6 pb-5 pt-2 border-t border-gray-100">
          <a href={e.lien} target="_blank" rel="noopener noreferrer"
            className="w-full text-center py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: e.badgeColor || '#7c3aed' }}>
            🌐 Site officiel — {e.lien.replace('https://', '')}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── CARD ─── */
function EtabCard({ e, color, index, onClick }) {
  return (
    <button onClick={() => onClick(e)}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 px-4 py-3 hover:shadow-md hover:border-purple-200 transition-all group flex items-start gap-3">
      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
        style={{ background: color }}>{index + 1}</span>
      <span className="text-xl flex-shrink-0">{e.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-gray-800 text-sm leading-snug group-hover:text-purple-700 transition-colors">{e.nom}</p>
        <p className="text-xs text-gray-400 mt-0.5">{e.type}</p>
        {e.specialites && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {e.specialites.map((s, i) => (
              <span key={i} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#f5f3ff', color: '#7c3aed' }}>{s}</span>
            ))}
          </div>
        )}
      </div>
      <span className="text-gray-300 group-hover:text-purple-400 flex-shrink-0 mt-1">›</span>
    </button>
  );
}

/* ─── MAP DOT ─── */
function MapDot({ region, isSelected, onClick }) {
  return (
    <button onClick={onClick} style={{ top: region.top, left: region.left }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10" title={region.nom}>
      <div className={`rounded-full transition-all duration-200 flex items-center justify-center text-white font-bold text-xs shadow-lg
        ${isSelected ? 'w-10 h-10' : 'w-7 h-7 hover:w-9 hover:h-9'}`}
        style={{ background: region.color, boxShadow: isSelected ? `0 0 0 4px ${region.color}40` : '' }}>
        {isSelected ? region.abbr : region.abbr.slice(0, 1)}
      </div>
    </button>
  );
}

/* ─── MAIN PAGE ─── */
export default function CarteEcolesPage() {
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedEtab, setSelectedEtab] = useState(null);

  const region = regions.find(r => r.id === selectedRegionId) || null;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-800">MA Carte des Écoles & Universités du Maroc</h2>
        <p className="text-gray-500 mt-1 text-sm">Choisis une région (jiha) pour découvrir les meilleures écoles</p>
      </div>

      {/* Region Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedRegionId(null)}
          className={`text-sm px-3 py-1.5 rounded-full font-medium border transition-all ${
            !selectedRegionId ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}>
          <span className="font-black text-xs">MA</span> Toutes les régions
        </button>
        {regions.map(r => (
          <button key={r.id} onClick={() => setSelectedRegionId(r.id === selectedRegionId ? null : r.id)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium border transition-all ${
              selectedRegionId === r.id ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
            style={selectedRegionId === r.id ? { background: r.color } : {}}>
            <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
            {r.nom.split('-')[0]}
          </button>
        ))}
      </div>

      {/* Map + Panel */}
      <div className="flex gap-6 flex-col lg:flex-row items-start">
        {/* MAP */}
        <div className="flex-shrink-0 rounded-2xl overflow-hidden border border-gray-100 relative"
          style={{ width: '100%', maxWidth: 520, height: 440, background: 'linear-gradient(160deg, #bfdbfe 0%, #dbeafe 60%, #e0f2fe 100%)' }}>
          <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <path d="M22,8 L55,6 L70,10 L80,18 L82,30 L75,38 L72,48 L68,58 L62,68 L55,76 L48,84 L42,90 L38,98 L34,106 L28,112 L22,110 L16,100 L12,88 L10,76 L8,62 L10,48 L14,34 L18,20 Z"
              fill="rgba(219,234,254,0.6)" stroke="rgba(147,197,253,0.8)" strokeWidth="1" />
            <path d="M16,76 L50,72 L62,78 L58,100 L50,110 L38,114 L28,112 L22,106 L16,100 Z"
              fill="rgba(233,213,255,0.5)" stroke="rgba(196,181,253,0.6)" strokeWidth="0.8" />
          </svg>
          {regions.map(r => (
            <MapDot key={r.id} region={r} isSelected={selectedRegionId === r.id}
              onClick={() => setSelectedRegionId(r.id === selectedRegionId ? null : r.id)} />
          ))}
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 text-xs text-gray-500">
            🖱️ Clique sur un point pour explorer
          </div>
        </div>

        {/* PANEL */}
        <div className="flex-1 min-w-0">
          {!region ? (
            <div className="space-y-3">
              {regions.map(r => (
                <button key={r.id} onClick={() => setSelectedRegionId(r.id)}
                  className="w-full text-left bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                    style={{ background: r.color }}>{r.abbr}</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{r.nom}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.provinces.length} provinces · {r.etablissements.length} établissement{r.etablissements.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-gray-300">›</span>
                </button>
              ))}
            </div>
          ) : (
            <div>
              {/* Region header */}
              <div className="rounded-2xl px-5 py-4 mb-4 text-white"
                style={{ background: `linear-gradient(135deg, ${region.color} 0%, ${region.color}cc 100%)` }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">{region.abbr}</div>
                  <div>
                    <h3 className="font-black text-lg">{region.nom}</h3>
                    <p className="text-white/70 text-sm">{region.provinces.length} provinces</p>
                  </div>
                </div>
              </div>

              {/* Province pills - info only */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {region.provinces.map(p => {
                  const n = region.etablissements.filter(e => e.ville === p).length;
                  return (
                    <span key={p} className="text-xs px-3 py-1.5 rounded-full font-medium bg-white border border-gray-200 text-gray-500 flex items-center gap-1">
                      {p}
                      {n > 0 && <span className="text-xs font-bold px-1 rounded" style={{ background: `${region.color}22`, color: region.color }}>{n}</span>}
                    </span>
                  );
                })}
              </div>

              {/* ALL etablissements - no filter */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                {region.etablissements.length} Établissement{region.etablissements.length > 1 ? 's' : ''} — {region.nom.split('-')[0]}
              </p>
              <div className="space-y-2">
                {region.etablissements.map((e, i) => (
                  <EtabCard key={i} e={e} color={region.color} index={i} onClick={setSelectedEtab} />
                ))}
              </div>

              <button onClick={() => setSelectedRegionId(null)}
                className="mt-5 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
                ‹ Toutes les régions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <EtabModal e={selectedEtab} onClose={() => setSelectedEtab(null)} />
    </Layout>
  );
}
