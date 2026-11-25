import { useState } from 'react';
import { useTranslation } from '../i18n';

// ─── Data Types ───────────────────────────────────────────────────────────────

interface City {
  name: string;
  nameFr: string;
  nameAr: string;
  population?: string;
}

interface Region {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  code: string;
  color: string;
  cities: City[];
  population?: string;
  area?: string;
}

// ─── Morocco Regions Data ─────────────────────────────────────────────────────

const MOROCCO_REGIONS: Region[] = [
  {
    id: 'tanger',
    name: 'Tanger-Tétouan-Al Hoceïma',
    nameFr: 'Tanger-Tétouan-Al Hoceïma',
    nameAr: 'طنجة تطوان الحسيمة',
    code: 'TTA',
    color: '#ef4444',
    population: '3.9M',
    area: '14,945 km²',
    cities: [
      { name: 'Tangier', nameFr: 'Tanger', nameAr: 'طنجة' },
      { name: 'Tetouan', nameFr: 'Tétouan', nameAr: 'تطوان' },
      { name: 'Al Hoceima', nameFr: 'Al Hoceïma', nameAr: 'الحسيمة' },
      { name: 'Larache', nameFr: 'Larache', nameAr: 'العرائش' },
      { name: 'Chefchaouen', nameFr: 'Chefchaouen', nameAr: 'شفشاون' },
    ],
  },
  {
    id: 'oriental',
    name: 'L\'Oriental',
    nameFr: 'L\'Oriental',
    nameAr: 'الشرق',
    code: 'OR',
    color: '#f97316',
    population: '2.2M',
    area: '15,370 km²',
    cities: [
      { name: 'Oujda', nameFr: 'Oujda', nameAr: 'وجدة' },
      { name: 'Berkane', nameFr: 'Berkane', nameAr: 'بركان' },
      { name: 'Jerada', nameFr: 'Jerarda', nameAr: 'جرادة' },
      { name: 'Nador', nameFr: 'Nador', nameAr: 'الناظور' },
      { name: 'Taourirt', nameFr: 'Taourirt', nameAr: 'تاوريرت' },
    ],
  },
  {
    id: 'fes',
    name: 'Fès-Meknès',
    nameFr: 'Fès-Meknès',
    nameAr: 'فاس مكناس',
    code: 'FM',
    color: '#eab308',
    population: '4.0M',
    area: '19,395 km²',
    cities: [
      { name: 'Fez', nameFr: 'Fès', nameAr: 'فاس' },
      { name: 'Meknes', nameFr: 'Meknès', nameAr: 'مكناس' },
      { name: 'Ifrane', nameFr: 'Ifrane', nameAr: 'إفران' },
      { name: 'Sefrou', nameFr: 'Sefrou', nameAr: 'صفرو' },
      { name: 'Taza', nameFr: 'Taza', nameAr: 'تازة' },
    ],
  },
  {
    id: 'rabat',
    name: 'Rabat-Salé-Kénitra',
    nameFr: 'Rabat-Salé-Kénitra',
    nameAr: 'الرباط سلا القنيطرة',
    code: 'RSK',
    color: '#22c55e',
    population: '4.2M',
    area: '10,166 km²',
    cities: [
      { name: 'Rabat', nameFr: 'Rabat', nameAr: 'الرباط' },
      { name: 'Salé', nameFr: 'Salé', nameAr: 'سلا' },
      { name: 'Kénitra', nameFr: 'Kénitra', nameAr: 'القنيطرة' },
      { name: 'Skhirat', nameFr: 'Skhirat', nameAr: 'الصخيرات' },
      { name: 'Temara', nameFr: 'Temara', nameAr: 'تمارة' },
    ],
  },
  {
    id: 'casablanca',
    name: 'Casablanca-Settat',
    nameFr: 'Casablanca-Settat',
    nameAr: 'الدار البيضاء سطات',
    code: 'CS',
    color: '#06b6d4',
    population: '8.4M',
    area: '20,249 km²',
    cities: [
      { name: 'Casablanca', nameFr: 'Casablanca', nameAr: 'الدار البيضاء' },
      { name: 'Settat', nameFr: 'Settat', nameAr: 'سطات' },
      { name: 'Mohammedia', nameFr: 'Mohammedia', nameAr: 'المحمدية' },
      { name: 'Ben Slimane', nameFr: 'Ben Slimane', nameAr: 'بن سليمان' },
      { name: 'Sidi Bennour', nameFr: 'Sidi Bennour', nameAr: 'سيدي بنور' },
    ],
  },
  {
    id: 'marrakech',
    name: 'Marrakech-Safi',
    nameFr: 'Marrakech-Safi',
    nameAr: 'مراكش آسفي',
    code: 'MS',
    color: '#8b5cf6',
    population: '4.6M',
    area: '35,896 km²',
    cities: [
      { name: 'Marrakech', nameFr: 'Marrakech', nameAr: 'مراكش' },
      { name: 'Safi', nameFr: 'Safi', nameAr: 'آسفي' },
      { name: 'Essaouira', nameFr: 'Essaouira', nameAr: 'الصويرة' },
      { name: 'Chichaoua', nameFr: 'Chichaoua', nameAr: 'الشيشاوة' },
      { name: 'Kelaat des Sraghna', nameFr: 'Kelaat des Sraghna', nameAr: 'قلعة السراغنة' },
    ],
  },
  {
    id: 'draa',
    name: 'Drâa-Tafilalet',
    nameFr: 'Drâa-Tafilalet',
    nameAr: 'درعة تافيلالت',
    code: 'DT',
    color: '#ec4899',
    population: '1.6M',
    area: '45,255 km²',
    cities: [
      { name: 'Zagora', nameFr: 'Zagora', nameAr: 'زاكورة' },
      { name: 'Tafilalet', nameFr: 'Tafilalet', nameAr: 'تافيلالت' },
      { name: 'Midelt', nameFr: 'Midelt', nameAr: 'ميدلت' },
      { name: 'Erfoud', nameFr: 'Erfoud', nameAr: 'الرشيد' },
      { name: 'Merzouga', nameFr: 'Merzouga', nameAr: 'مرزوقة' },
    ],
  },
  {
    id: 'souss',
    name: 'Souss-Massa',
    nameFr: 'Souss-Massa',
    nameAr: 'سوس ماسة',
    code: 'SM',
    color: '#14b8a6',
    population: '2.8M',
    area: '19,933 km²',
    cities: [
      { name: 'Agadir', nameFr: 'Agadir', nameAr: 'أغادير' },
      { name: 'Taroudant', nameFr: 'Taroudant', nameAr: 'تارودانت' },
      { name: 'Tiznit', nameFr: 'Tiznit', nameAr: 'تيزنيت' },
      { name: 'Inezgane', nameFr: 'Inezgane', nameAr: 'إنزكان' },
      { name: 'Dchira', nameFr: 'Dchira', nameAr: 'الذخيرة' },
    ],
  },
  {
    id: 'beni',
    name: 'Béni Mellal-Khénifra',
    nameFr: 'Béni Mellal-Khénifra',
    nameAr: 'بني ملال خنيفرة',
    code: 'BK',
    color: '#f59e0b',
    population: '1.9M',
    area: '19,259 km²',
    cities: [
      { name: 'Béni Mellal', nameFr: 'Béni Mellal', nameAr: 'بني ملال' },
      { name: 'Khénifra', nameFr: 'Khénifra', nameAr: 'خنيفرة' },
      { name: 'Azilal', nameFr: 'Azilal', nameAr: 'أزيلال' },
      { name: 'Kasba Tadla', nameFr: 'Kasba Tadla', nameAr: 'قصبة تادلة' },
      { name: 'Ouaoua', nameFr: 'Ouaoua', nameAr: 'واوة' },
    ],
  },
  {
    id: 'gulmim',
    name: 'Gulmim-Oued Noun',
    nameFr: 'Gulmim-Oued Noun',
    nameAr: 'كلميم واد نون',
    code: 'GON',
    color: '#06b6d4',
    population: '0.5M',
    area: '19,521 km²',
    cities: [
      { name: 'Gulmim', nameFr: 'Gulmim', nameAr: 'كلميم' },
      { name: 'Tan-Tan', nameFr: 'Tan-Tan', nameAr: 'تان تان' },
      { name: 'Assa', nameFr: 'Assa', nameAr: 'آسا' },
      { name: 'Tantan', nameFr: 'Tantan', nameAr: 'تنتان' },
      { name: 'Tata', nameFr: 'Tata', nameAr: 'تاتا' },
    ],
  },
  {
    id: 'laayoune',
    name: 'Laâyoune-Sakia El Hamra',
    nameFr: 'Laâyoune-Sakia El Hamra',
    nameAr: 'العيون الساقية الحمراء',
    code: 'LSH',
    color: '#d946ef',
    population: '0.6M',
    area: '20,418 km²',
    cities: [
      { name: 'Laâyoune', nameFr: 'Laâyoune', nameAr: 'العيون' },
      { name: 'Smara', nameFr: 'Smara', nameAr: 'السمارة' },
      { name: 'Boujdour', nameFr: 'Boujdour', nameAr: 'بوجدور' },
      { name: 'Tarfaya', nameFr: 'Tarfaya', nameAr: 'طرفاية' },
    ],
  },
  {
    id: 'dakhla',
    name: 'Dakhla-Oued Ed-Dahab',
    nameFr: 'Dakhla-Oued Ed-Dahab',
    nameAr: 'الداخلة وادي الذهب',
    code: 'DOD',
    color: '#0d9488',
    population: '0.2M',
    area: '31,902 km²',
    cities: [
      { name: 'Dakhla', nameFr: 'Dakhla', nameAr: 'الداخلة' },
      { name: 'Oued Ed-Dahab', nameFr: 'Oued Ed-Dahab', nameAr: 'وادي الذهب' },
      { name: 'Lagouira', nameFr: 'Lagouira', nameAr: 'لاكويرة' },
    ],
  },
];

// ─── Morocco Map Component ────────────────────────────────────────────────────

export function MoroccoMap() {
  const t = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegions = MOROCCO_REGIONS.filter((region) => {
    const query = searchQuery.toLowerCase();
    return (
      region.name.toLowerCase().includes(query) ||
      region.nameFr.toLowerCase().includes(query) ||
      region.cities.some(
        (city) =>
          city.name.toLowerCase().includes(query) ||
          city.nameFr.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          🗺️ Carte Interactive du Maroc
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Explorez les régions et villes du Maroc</p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Rechercher une région ou une ville..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            boxSizing: 'border-box',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        />
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1200px' }}>
        {/* Left: Regions List */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Régions ({filteredRegions.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
            {filteredRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: selectedRegion?.id === region.id ? `2px solid ${region.color}` : '1px solid #e5e7eb',
                  background: selectedRegion?.id === region.id ? `${region.color}15` : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  boxShadow: selectedRegion?.id === region.id ? `0 0 0 3px ${region.color}20` : 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${region.color}25`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = region.color;
                }}
                onMouseLeave={(e) => {
                  if (selectedRegion?.id !== region.id) {
                    (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '14px' }}>{region.nameFr}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {region.cities.length} villes • {region.population}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: region.color,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Region Details */}
        <div>
          {selectedRegion ? (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                ℹ️ Détails de la région
              </h3>
              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: `2px solid ${selectedRegion.color}`,
                  background: `${selectedRegion.color}08`,
                }}
              >
                {/* Header */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: selectedRegion.color,
                      }}
                    />
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                      {selectedRegion.nameFr}
                    </h4>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>Code: {selectedRegion.code}</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Population</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: selectedRegion.color }}>
                      {selectedRegion.population}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Superficie</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: selectedRegion.color }}>
                      {selectedRegion.area}
                    </div>
                  </div>
                </div>

                {/* Cities */}
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
                    Villes principales ({selectedRegion.cities.length})
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                    {selectedRegion.cities.map((city, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '6px',
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          fontSize: '14px',
                          color: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: selectedRegion.color, fontWeight: 'bold' }}>📍</span>
                        <span>{city.nameFr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '40px 20px',
                borderRadius: '12px',
                border: '2px dashed #d1d5db',
                background: '#f9fafb',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗺️</div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Sélectionnez une région pour voir les détails</p>
            </div>
          )}
        </div>
      </div>

      {/* All Regions Grid View */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
          Vue d'ensemble des régions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {MOROCCO_REGIONS.map((region) => (
            <div
              key={region.id}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: `1px solid ${region.color}40`,
                background: `${region.color}08`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => setSelectedRegion(region)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 16px ${region.color}30`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '80px',
                  borderRadius: '6px',
                  background: `linear-gradient(135deg, ${region.color}40, ${region.color}20)`,
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '32px' }}>📍</div>
              </div>
              <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '13px', marginBottom: '4px' }}>
                {region.nameFr}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{region.cities.length} villes</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoroccoMap;
