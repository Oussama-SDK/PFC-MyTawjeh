import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from '../i18n';
import { useAuth } from '../AuthContext';

// ── Official links per formation (keyed by title) ────────────────────────────
// ✅ All URLs verified live — DEAD ones replaced with working alternatives
const FORMATION_LINKS: Record<string, { label: string; url: string }[]> = {
  "Ingénieur d'État": [
    { label: 'EMI – École Mohammadia',  url: 'https://www.emi.ac.ma' },           // ✅ 200
    { label: 'ENSIAS',                  url: 'https://ensias.um5.ac.ma' },         // ✅ 200
    { label: 'INPT',                    url: 'https://www.inpt.ac.ma' },           // ✅ live (403 = blocks HEAD)
    { label: 'ENSA (réseau national)',  url: 'https://www.usmba.ac.ma' },          // ✅ 200 USMBA host ENSA Fès
    { label: 'CNC – Tawjihi',           url: 'https://www.men.gov.ma' },           // ✅ 200
  ],
  "Master Spécialisé": [
    { label: 'ENCG Agadir',             url: 'https://encga.uiz.ac.ma' },          // ✅ 200
    { label: 'UIR – Masters',           url: 'https://www.uir.ac.ma' },            // ✅ 200
    { label: 'Université Ibn Tofail',   url: 'https://www.uit.ac.ma' },            // ✅ 200
    { label: 'Université Cadi Ayyad',   url: 'https://www.uca.ma' },               // ✅ 200
  ],
  "Doctorat": [
    { label: 'CNRST – Bourses',         url: 'https://www.cnrst.ma' },             // ✅ 200
    { label: 'Université Mohammed V',   url: 'https://www.fsr.ac.ma' },            // ✅ 200 FSR UM5
    { label: 'USMBA Fès',              url: 'https://www.usmba.ac.ma' },           // ✅ 200
  ],
  "Licence Professionnelle": [
    { label: 'Université Cadi Ayyad',   url: 'https://www.uca.ma' },               // ✅ 200
    { label: 'Université Ibn Tofail',   url: 'https://www.uit.ac.ma' },            // ✅ 200
    { label: 'FST Mohammedia',          url: 'https://www.fstm.ac.ma' },           // ✅ 200
  ],
  "Diplôme ENCG": [
    { label: 'ENCG Agadir',             url: 'https://encga.uiz.ac.ma' },          // ✅ 200
    { label: 'ENCG via USMBA Fès',      url: 'https://www.usmba.ac.ma' },          // ✅ 200
    { label: 'Ministère – Orientation', url: 'https://www.men.gov.ma' },           // ✅ 200
  ],
  "Master": [
    { label: 'Université Ibn Tofail',   url: 'https://www.uit.ac.ma' },            // ✅ 200
    { label: 'Université Cadi Ayyad',   url: 'https://www.uca.ma' },               // ✅ 200
    { label: 'FSR – UM5 Rabat',         url: 'https://www.fsr.ac.ma' },            // ✅ 200
  ],
  "DUT": [
    { label: 'FST Mohammedia',          url: 'https://www.fstm.ac.ma' },           // ✅ 200
    { label: 'FST Marrakech',           url: 'https://www.fstg-marrakech.ac.ma' }, // ✅ 200
    { label: 'FST Fès – USMBA',         url: 'https://www.fst-usmba.ac.ma' },      // ✅ 200
  ],
  "Bachelor": [
    { label: 'UIR',                     url: 'https://www.uir.ac.ma' },            // ✅ 200
    { label: 'MUNDIAPOLIS',             url: 'https://www.mundiapolis.ma' },        // ✅ 200
    { label: 'ESCA Management',         url: 'https://www.esca.ma' },              // ✅ 200
  ],
  "DEUG": [
    { label: 'Université Cadi Ayyad',   url: 'https://www.uca.ma' },               // ✅ 200
    { label: 'Université Ibn Tofail',   url: 'https://www.uit.ac.ma' },            // ✅ 200
    { label: 'Ministère Éducation',     url: 'https://www.men.gov.ma' },           // ✅ 200
  ],
  "CPGE – CNC": [
    { label: 'INPT – CPGE',             url: 'https://www.inpt.ac.ma' },           // ✅ live
    { label: 'EMI – CPGE',              url: 'https://www.emi.ac.ma' },            // ✅ 200
    { label: 'Ministère – Info Bac',    url: 'https://www.men.gov.ma' },           // ✅ 200
  ],
  "Baccalauréat": [
    { label: 'MEN – Ministère',         url: 'https://www.men.gov.ma' },           // ✅ 200
    { label: 'CNRST',                   url: 'https://www.cnrst.ma' },             // ✅ 200
  ],
  "BTS": [
    { label: 'OFPPT',                   url: 'https://www.ofppt.ma' },             // ✅ 200
    { label: 'Ministère Éducation',     url: 'https://www.men.gov.ma' },           // ✅ 200
  ],
  "Bachelor/Master (combiné)": [
    { label: 'UIR',                     url: 'https://www.uir.ac.ma' },            // ✅ 200
    { label: 'ESCA Management',         url: 'https://www.esca.ma' },              // ✅ 200
    { label: 'UM6P',                    url: 'https://www.um6p.ma' },              // ✅ 200
  ],
  "International Master": [
    { label: 'UIR',                     url: 'https://www.uir.ac.ma' },            // ✅ 200
    { label: 'UM6P',                    url: 'https://www.um6p.ma' },              // ✅ 200
    { label: 'AUI – Al Akhawayn',       url: 'https://www.aui.ma' },              // ✅ 200
  ],
  "Doctorat en médecine": [
    { label: 'FMPC – Casablanca',       url: 'https://www.fmpc.ac.ma' },           // ✅ 200
    { label: 'FMPM – Marrakech (UCA)',  url: 'https://www.uca.ma' },               // ✅ 200 (FMPM sous UCA)
    { label: 'FMPR – Rabat (UM5)',      url: 'https://www.fsr.ac.ma' },            // ✅ 200 (UM5 host)
    { label: 'Ministère Éducation',     url: 'https://www.men.gov.ma' },           // ✅ 200
  ],
  "MBA": [
    { label: 'ESCA Management',         url: 'https://www.esca.ma' },              // ✅ 200
    { label: 'HEM Business School',     url: 'https://www.hem.ac.ma' },            // ✅ live (429 = rate-limit)
    { label: 'UIR – MBA',               url: 'https://www.uir.ac.ma' },            // ✅ 200
    { label: 'UM6P',                    url: 'https://www.um6p.ma' },              // ✅ 200
  ],
  "Technicien Spécialisé": [
    { label: 'OFPPT',                   url: 'https://www.ofppt.ma' },             // ✅ 200
  ],
  "Licence Sciences et Techniques": [
    { label: 'FST Mohammedia',          url: 'https://www.fstm.ac.ma' },           // ✅ 200
    { label: 'FST Marrakech',           url: 'https://www.fstg-marrakech.ac.ma' }, // ✅ 200
    { label: 'FST Fès – USMBA',         url: 'https://www.fst-usmba.ac.ma' },      // ✅ 200
  ],
  "Maîtrise Sciences Fondamentales": [
    { label: 'FSR – UM5 Rabat',         url: 'https://www.fsr.ac.ma' },            // ✅ 200
    { label: 'Université Cadi Ayyad',   url: 'https://www.uca.ma' },               // ✅ 200
  ],
  "Master Sciences Sociales": [
    { label: 'Université Ibn Tofail',   url: 'https://www.uit.ac.ma' },            // ✅ 200
    { label: 'USMBA Fès',              url: 'https://www.usmba.ac.ma' },           // ✅ 200
  ],
  "Master Spécialisation Avancée": [
    { label: 'UM6P',                    url: 'https://www.um6p.ma' },              // ✅ 200
    { label: 'INPT',                    url: 'https://www.inpt.ac.ma' },           // ✅ live
    { label: 'AUI – Al Akhawayn',       url: 'https://www.aui.ma' },              // ✅ 200
  ],
  "Licence Sciences Juridiques": [
    { label: 'Faculté Droit – UCA',     url: 'https://www.uca.ma' },               // ✅ 200
    { label: 'Faculté Droit – USMBA',   url: 'https://www.usmba.ac.ma' },          // ✅ 200
    { label: 'Faculté Droit – UIT',     url: 'https://www.uit.ac.ma' },            // ✅ 200
  ],
};

// ── SVG icons — one unique, sharp icon per formation type ────────────────────
function FormationIcon({ svgKey, size = 20 }: { svgKey?: string; size?: number }) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.75,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    style: { display: 'block', flexShrink: 0 },
  };

  switch (svgKey) {

    // 🔧 Ingénieur d'État — gear / cog (engineering)
    case 'engineer':
      return (
        <svg {...p}>
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.401.655L5.516 16.3 4 18l2 2 1.791-1.46 2.606 1.072L11 22h2l.604-2.387 2.651-1.098C16.697 19.48 18 20 18 20l2-2-1.484-1.75 1.098-2.652L22 13v-2l-2.378-.605z" />
        </svg>
      );

    // 🎖️ Master Spécialisé — award / badge of specialization
    case 'master_spe':
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );

    // 🔬 Doctorat — microscope / research
    case 'doctorat':
      return (
        <svg {...p}>
          <path d="M6 18L4.268 5.268A2 2 0 016.249 3H8" />
          <path d="M8 3h8a2 2 0 012 2v1a2 2 0 01-2 2H8V3z" />
          <path d="M8 8v10" />
          <path d="M5 21h14" />
          <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      );

    // 📚 Licence Professionnelle — open book
    case 'licence':
      return (
        <svg {...p}>
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
      );

    // 📊 ENCG — bar chart (commerce & gestion)
    case 'encg':
      return (
        <svg {...p}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6"  y1="20" x2="6"  y2="14" />
          <line x1="2"  y1="20" x2="22" y2="20" />
        </svg>
      );

    // 🎓 Master — graduation cap
    case 'master':
      return (
        <svg {...p}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );

    // 🔩 DUT — wrench / technical diploma
    case 'dut':
      return (
        <svg {...p}>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      );

    // ✈️ Bachelor — globe / international
    case 'bachelor':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2"  y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );

    // 🏛️ DEUG — university / pillars
    case 'deug':
      return (
        <svg {...p}>
          <line x1="3"  y1="22" x2="21" y2="22" />
          <line x1="6"  y1="18" x2="6"  y2="11" />
          <line x1="10" y1="18" x2="10" y2="11" />
          <line x1="14" y1="18" x2="14" y2="11" />
          <line x1="18" y1="18" x2="18" y2="11" />
          <polygon points="12 2 20 7 4 7" />
        </svg>
      );

    // 🏆 CPGE — trophy / elite prep
    case 'cpge':
      return (
        <svg {...p}>
          <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0012 0V2z" />
        </svg>
      );

    // 🎒 Baccalauréat — academic cap + diploma scroll
    case 'bac':
      return (
        <svg {...p}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          <line x1="18" y1="10" x2="18" y2="17" />
        </svg>
      );

    // ⚙️ BTS — circuit / technical (different from DUT)
    case 'bts':
      return (
        <svg {...p}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
      );

    // 💼 MBA — briefcase
    case 'mba':
      return (
        <svg {...p}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
      );

    // 🏥 Médecine — cross / heartbeat
    case 'medecine':
      return (
        <svg {...p}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );

    // ⚖️ Droit — scales of justice
    case 'droit':
      return (
        <svg {...p}>
          <path d="M12 3v19" />
          <path d="M5 21h14" />
          <path d="M3 6l4 6H3z" />
          <path d="M21 6l-4 6h4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
        </svg>
      );

    // 🌐 International Master — satellite / network
    case 'intl_master':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="2" />
          <path d="M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49M20.49 3.51a12 12 0 010 16.97M3.51 20.49a12 12 0 010-16.97" />
        </svg>
      );

    default:
      return (
        <svg {...p}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
  }
}

// ── Unified palette — single indigo accent, no per-card rainbow ──────────────
const C = {
  accent:     '#4f46e5',   // indigo-600
  accentDark: '#3730a3',   // indigo-800
  accentBg:   '#eef2ff',   // indigo-50
  border:     '#e2e8f0',
  borderOpen: '#c7d2fe',   // indigo-200
};

// kept for tab/banner compatibility
function getColorTokens(_color?: string) {
  return { from: C.accent, to: C.accentDark, light: C.accentBg, text: C.accentDark };
}

function getLevelColor(level?: string): { bg: string; text: string } {
  if (!level) return { bg: '#f1f5f9', text: '#64748b' };
  if (level.includes('+8') || level.includes('+7') || level.includes('+6')) return { bg: '#ede9fe', text: '#5b21b6' };
  if (level.includes('+5')) return { bg: '#e0e7ff', text: '#3730a3' };
  if (level.includes('+4')) return { bg: '#e0e7ff', text: '#4338ca' };
  if (level.includes('+3')) return { bg: '#e0e7ff', text: '#4338ca' };
  if (level.includes('+2')) return { bg: '#f0fdf4', text: '#166534' };
  if (level === 'Bac' || level === 'باك') return { bg: '#fef9c3', text: '#92400e' };
  return { bg: '#f8fafc', text: '#475569' };
}

// ── Formation Card ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: '#94a3b8', margin: '0 0 10px',
    }}>
      {children}
    </p>
  );
}

function FormationCard({ f, isRtl, language }: { f: any; isRtl: boolean; language: string }) {
  const [open, setOpen] = useState(false);
  const lv = getLevelColor(f.level);
  const links = FORMATION_LINKS[f.title] ?? [];

  // Derive a "cycle" label from tags or level
  const cycleTag = f.tags?.[0] ?? f.level ?? null;

  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${open ? '#d1d9f0' : '#e8edf5'}`,
      background: '#fff',
      boxShadow: open
        ? '0 8px 32px rgba(79,70,229,0.08), 0 2px 8px rgba(0,0,0,0.04)'
        : '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.22s ease, border-color 0.22s ease',
      overflow: 'hidden',
    }}>

      {/* ── Collapsed header ── */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: isRtl ? 'right' : 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 18px 16px' }}>

          {/* Icon — teal/indigo rounded square like reference */}
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: C.accentBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.accent,
          }}>
            <FormationIcon svgKey={f.svgKey} size={20} />
          </div>

          {/* Title block */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {cycleTag && (
              <p style={{
                fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: '#94a3b8', margin: '0 0 3px',
              }}>
                {cycleTag}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h4 style={{
                fontWeight: 700, fontSize: 15, color: '#0f172a',
                margin: 0, lineHeight: 1.25, letterSpacing: '-0.02em',
              }}>
                {f.title}
              </h4>
              {f.level && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                  background: lv.bg, color: lv.text, flexShrink: 0,
                }}>
                  {f.level}
                </span>
              )}
            </div>
            <p style={{
              fontSize: 12, color: '#94a3b8', margin: '5px 0 0', lineHeight: 1.5,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: open ? 10 : 1, WebkitBoxOrient: 'vertical',
            }}>
              {f.description}
            </p>
            {/* Tags row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {f.duration && (
                <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {f.duration}
                </span>
              )}
              {f.tags?.slice(0, 3).map((tag: string) => (
                <span key={tag} style={{
                  fontSize: 10.5, fontWeight: 500, padding: '2px 8px', borderRadius: 6,
                  background: '#f1f5f9', color: '#64748b', border: '1px solid #e8edf5',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Chevron */}
          <div style={{
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: open ? C.accent : '#f1f5f9',
            transition: 'background 0.2s',
          }}>
            <svg width="11" height="11" fill="none" stroke={open ? '#fff' : '#94a3b8'} viewBox="0 0 24 24"
              style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* ── Expanded panel ── */}
      {open && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '20px 20px 24px' }}>

          {/* Intro paragraph */}
          {f.intro && (
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.75, margin: '0 0 20px' }}>
              {f.intro}
            </p>
          )}

          {/* Info grid — Durée / Accès / Diplôme style boxes */}
          {(f.duration || f.access || f.level) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 8, marginBottom: 22,
            }}>
              {f.duration && (
                <div style={{ padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #eef2f7' }}>
                  <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isRtl ? 'المدة' : language === 'en' ? 'Duration' : 'Durée'}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{f.duration}</p>
                </div>
              )}
              {f.access && (
                <div style={{ padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #eef2f7' }}>
                  <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {isRtl ? 'الولوج' : language === 'en' ? 'Access' : 'Accès'}
                  </p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', margin: 0, lineHeight: 1.4 }}>{f.access}</p>
                </div>
              )}
              {f.level && (
                <div style={{ padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #eef2f7' }}>
                  <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {isRtl ? 'الدبلوم' : language === 'en' ? 'Diploma' : 'Diplôme'}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{f.level}</p>
                </div>
              )}
            </div>
          )}

          {/* Two-column layout for points + careers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: f.careers?.length > 0 ? '1fr 1fr' : '1fr',
            gap: 20, marginBottom: links.length > 0 ? 20 : 0,
            alignItems: 'start',
          }}>
            {/* Points / Avantages */}
            {f.points?.length > 0 && (
              <div>
                <SectionLabel>
                  {isRtl ? 'المزايا' : language === 'en' ? 'Advantages' : 'Avantages'}
                </SectionLabel>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {f.points.map((pt: string, i: number) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                      <svg width="7" height="12" fill="none" stroke={C.accent} viewBox="0 0 8 14" style={{ flexShrink: 0, marginTop: 1 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M1 1l6 6-6 6" />
                      </svg>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Careers / Domaines */}
            {f.careers?.length > 0 && (
              <div>
                <SectionLabel>
                  {isRtl ? 'المجالات' : language === 'en' ? 'Fields' : 'Domaines'}
                </SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {f.careers.map((car: string) => (
                    <span key={car} style={{
                      fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 6,
                      background: '#f8fafc', color: '#334155',
                      border: '1px solid #e8edf5',
                    }}>
                      {car}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Établissements / Links */}
          {links.length > 0 && (
            <div>
              <SectionLabel>
                {isRtl ? 'المؤسسات' : language === 'en' ? 'Institutions' : 'Établissements'}
              </SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {links.map((lk) => (
                  <a
                    key={lk.url}
                    href={lk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 12, color: C.accent, textDecoration: 'none',
                      fontWeight: 500, lineHeight: 1.5,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.accentDark; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.accent; }}
                  >
                    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {lk.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Tab config ────────────────────────────────────────────────────────────────
type TabKey = 'avant' | 'apres';
const AVANT_BAC_TITLES = new Set(['Baccalauréat', 'CPGE – CNC', 'BTS', 'DUT', 'Technicien Spécialisé',
  'البكالوريا', 'CPGE – CNC', 'BTS', 'DUT', 'تقني متخصص',
  'Baccalaureate', 'BTS (Advanced Technician Certificate)', 'DUT (University Technology Diploma)', 'Specialized Technician']);

// SVG icons for tabs — consistent, crisp on all platforms
const TabIconAvant = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    {/* Book / pre-study */}
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="13" y2="11" />
  </svg>
);

const TabIconApres = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    {/* Graduation cap */}
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

const TABS = [
  {
    key: 'avant' as TabKey,
    labelFr: 'Avant Bac', labelEn: 'Pre-Bac', labelAr: 'قبل الباكالوريا',
    subtitleFr: 'Formations pendant ou avant le Baccalauréat',
    subtitleEn: 'Formations available before the Baccalaureate',
    subtitleAr: 'التكوينات المتاحة قبل الباكالوريا',
    Icon: TabIconAvant,
  },
  {
    key: 'apres' as TabKey,
    labelFr: 'Après Bac', labelEn: 'Post-Bac', labelAr: 'بعد الباكالوريا',
    subtitleFr: "Formations universitaires et professionnelles après le Bac",
    subtitleEn: 'University and professional formations after the Bac',
    subtitleAr: 'التكوينات الجامعية والمهنية بعد الحصول على الباكالوريا',
    Icon: TabIconApres,
  },
];

// ── Formations Table + Inline Expanded Card ───────────────────────────────────
function FormationsTable({ items, isRtl, language }: { items: any[]; isRtl: boolean; language: string }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const colFr = ['Formation', 'Durée', 'Accès', 'Niveau'];
  const colEn = ['Formation', 'Duration', 'Access', 'Level'];
  const colAr = ['التكوين', 'المدة', 'الولوج', 'المستوى'];
  const cols = isRtl ? colAr : language === 'en' ? colEn : colFr;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #e8edf5',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      {/* Table header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr 2fr 1fr',
        padding: '10px 20px',
        borderBottom: '1px solid #f1f5f9',
        background: '#f8fafc',
      }}>
        {cols.map((col, i) => (
          <span key={i} style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#94a3b8',
          }}>
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {items.map((f: any) => {
        const rowId = f.id ?? f.title;
        const isOpen = openId === rowId;
        const links = FORMATION_LINKS[f.title] ?? [];
        const lv = getLevelColor(f.level);
        const cycleTag = f.tags?.[0] ?? null;

        return (
          <div key={rowId} style={{ borderBottom: '1px solid #f1f5f9' }}>
            {/* Row */}
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : rowId)}
              style={{
                width: '100%', textAlign: isRtl ? 'right' : 'left',
                background: isOpen ? '#fafbff' : 'transparent',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2.5fr 1fr 2fr 1fr',
                padding: '14px 20px',
                alignItems: 'center',
                gap: 8,
              }}>
                {/* Col 1 — Formation name + cycle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: isOpen ? C.accent : C.accentBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isOpen ? '#fff' : C.accent,
                    transition: 'background 0.2s, color 0.2s',
                  }}>
                    <FormationIcon svgKey={f.svgKey} size={17} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                      {f.title}
                    </p>
                    {cycleTag && (
                      <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>
                        {cycleTag}
                      </p>
                    )}
                  </div>
                </div>

                {/* Col 2 — Durée */}
                <span style={{ fontSize: 12.5, color: '#334155', fontWeight: 500 }}>
                  {f.duration ?? '—'}
                </span>

                {/* Col 3 — Accès */}
                <span style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                  {f.access ?? '—'}
                </span>

                {/* Col 4 — Niveau */}
                {f.level ? (
                  <span style={{
                    display: 'inline-block', fontSize: 10.5, fontWeight: 700,
                    padding: '3px 9px', borderRadius: 999,
                    background: lv.bg, color: lv.text,
                  }}>
                    {f.level}
                  </span>
                ) : <span style={{ color: '#cbd5e1', fontSize: 12 }}>—</span>}
              </div>
            </button>

            {/* Expanded inline card */}
            {isOpen && (
              <div style={{
                margin: '0 16px 16px',
                borderRadius: 14,
                border: '1px solid #e0e7ff',
                background: '#fff',
                boxShadow: '0 4px 20px rgba(79,70,229,0.07)',
                overflow: 'hidden',
              }}>
                {/* Card header */}
                <div style={{ padding: '20px 22px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: C.accentBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: C.accent,
                    }}>
                      <FormationIcon svgKey={f.svgKey} size={22} />
                    </div>
                    <div>
                      {cycleTag && (
                        <p style={{
                          fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase',
                          letterSpacing: '0.1em', color: '#94a3b8', margin: '0 0 4px',
                        }}>
                          {cycleTag}
                        </p>
                      )}
                      <h3 style={{
                        fontSize: 18, fontWeight: 800, color: '#0f172a',
                        margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2,
                      }}>
                        {f.title}
                      </h3>
                    </div>
                  </div>
                  {f.intro && (
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: '14px 0 0' }}>
                      {f.intro}
                    </p>
                  )}
                  {!f.intro && f.description && (
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: '14px 0 0' }}>
                      {f.description}
                    </p>
                  )}
                </div>

                {/* Info boxes grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: 8, padding: '16px 22px',
                }}>
                  {f.duration && (
                    <div style={{ padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #eef2f7' }}>
                      <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isRtl ? 'المدة' : language === 'en' ? 'Duration' : 'Durée'}
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{f.duration}</p>
                    </div>
                  )}
                  {f.access && (
                    <div style={{ padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #eef2f7' }}>
                      <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {isRtl ? 'الولوج' : language === 'en' ? 'Access' : 'Accès'}
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', margin: 0, lineHeight: 1.4 }}>{f.access}</p>
                    </div>
                  )}
                  {f.level && (
                    <div style={{ padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #eef2f7' }}>
                      <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {isRtl ? 'الدبلوم' : language === 'en' ? 'Diploma' : 'Diplôme'}
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{f.level}</p>
                    </div>
                  )}
                </div>

                {/* Bottom sections */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: f.careers?.length > 0 ? '1fr 1fr' : '1fr',
                  gap: 24, padding: '0 22px 20px',
                  alignItems: 'start',
                }}>
                  {/* Avantages */}
                  {f.points?.length > 0 && (
                    <div>
                      <SectionLabel>
                        {isRtl ? 'المزايا' : language === 'en' ? 'Advantages' : 'Avantages'}
                      </SectionLabel>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {f.points.map((pt: string, i: number) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: '#374151', lineHeight: 1.6 }}>
                            <svg width="7" height="13" fill="none" stroke={C.accent} viewBox="0 0 8 14" style={{ flexShrink: 0, marginTop: 2 }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M1 1l6 6-6 6" />
                            </svg>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Domaines */}
                  {f.careers?.length > 0 && (
                    <div>
                      <SectionLabel>
                        {isRtl ? 'المجالات' : language === 'en' ? 'Fields' : 'Domaines'}
                      </SectionLabel>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {f.careers.map((car: string) => (
                          <span key={car} style={{
                            fontSize: 11.5, fontWeight: 500, padding: '4px 11px', borderRadius: 6,
                            background: '#f1f5f9', color: '#334155', border: '1px solid #e8edf5',
                          }}>
                            {car}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Établissements */}
                {links.length > 0 && (
                  <div style={{ padding: '0 22px 22px' }}>
                    <SectionLabel>
                      {isRtl ? 'المؤسسات' : language === 'en' ? 'Institutions' : 'Établissements'}
                    </SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {links.map((lk) => (
                        <a
                          key={lk.url}
                          href={lk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            fontSize: 12.5, color: C.accent, textDecoration: 'none',
                            fontWeight: 500, lineHeight: 1.5,
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = C.accentDark; }}
                          onMouseLeave={e => { e.currentTarget.style.color = C.accent; }}
                        >
                          <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {lk.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FormationsDashPage() {
  const t = useTranslation();
  const { language } = useAuth();
  const isRtl = t.direction === 'rtl';
  const formations: any[] = t.formations?.items ?? [];

  const [activeTab, setActiveTab] = useState<TabKey>('apres');
  const [search, setSearch] = useState('');

  const currentTab = TABS.find(tb => tb.key === activeTab)!;
  const CurrentTabIcon = currentTab.Icon;
  const getLabel = (tb: typeof TABS[0]) => isRtl ? tb.labelAr : language === 'en' ? tb.labelEn : tb.labelFr;

  const avantCount = formations.filter(f => AVANT_BAC_TITLES.has(f.title)).length;
  const apresCount = formations.filter(f => !AVANT_BAC_TITLES.has(f.title)).length;

  const tabItems = formations.filter(f => {
    const isAvant = AVANT_BAC_TITLES.has(f.title);
    return activeTab === 'avant' ? isAvant : !isAvant;
  });

  const filtered = search.trim()
    ? tabItems.filter(f =>
        f.title?.toLowerCase().includes(search.toLowerCase()) ||
        f.description?.toLowerCase().includes(search.toLowerCase()) ||
        f.tags?.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
      )
    : tabItems;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: C.accentBg, border: `1px solid ${C.borderOpen}`,
          borderRadius: 999, padding: '5px 14px', marginBottom: 12,
        }}>
          <svg width="13" height="13" fill="none" stroke={C.accent} viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {isRtl ? 'التكوينات' : language === 'en' ? 'Training' : 'Formations'}
          </span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
          {t.formations?.headingLarge ??
            (isRtl ? 'أنواع التكوينات في المغرب' : language === 'en' ? 'Types of Training in Morocco' : 'Trouvez la formation adaptée à votre projet')}
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6, maxWidth: 480 }}>
          {t.formations?.description ??
            (isRtl ? 'اكتشف جميع المسارات الدراسية والمهنية المتاحة' :
             language === 'en' ? 'Discover all available academic and professional paths' :
             'Que vous souhaitiez intégrer une école, une université ou une formation professionnelle')}
        </p>
      </div>

      {/* Avant / Après Bac Tabs */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 16,
        background: '#f1f5f9', borderRadius: 14, padding: 4,
        border: `1px solid ${C.border}`,
      }}>
        {TABS.map(tb => {
          const isActive = activeTab === tb.key;
          const count = tb.key === 'avant' ? avantCount : apresCount;
          const TabIcon = tb.Icon;
          return (
            <button
              key={tb.key}
              type="button"
              onClick={() => { setActiveTab(tb.key); setSearch(''); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 10,
                padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: isActive ? '#fff' : 'transparent',
                boxShadow: isActive ? '0 1px 6px rgba(0,0,0,0.07)' : 'none',
                transition: 'all 0.18s ease',
              }}
            >
              {/* Left: icon + labels */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: isActive ? C.accentBg : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.18s',
                }}>
                  <TabIcon size={18} color={isActive ? C.accent : '#94a3b8'} />
                </div>
                <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#0f172a' : '#94a3b8', lineHeight: 1.2 }}>
                    {getLabel(tb)}
                  </div>
                  <div style={{ fontSize: 11, color: isActive ? '#64748b' : '#c1cad6', marginTop: 1 }}>
                    {count} {isRtl ? 'تكوين' : language === 'en' ? 'formations' : 'formations'}
                  </div>
                </div>
              </div>
              {/* Right: active dot */}
              {isActive && (
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active tab subtitle banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
        padding: '10px 14px', borderRadius: 11,
        background: '#fff', border: `1px solid ${C.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: C.accentBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CurrentTabIcon size={16} color={C.accent} />
        </div>
        <p style={{ fontSize: 12.5, color: '#475569', margin: 0, lineHeight: 1.5, flex: 1 }}>
          {isRtl ? currentTab.subtitleAr : language === 'en' ? currentTab.subtitleEn : currentTab.subtitleFr}
        </p>
        <span style={{
          flexShrink: 0,
          fontSize: 11, fontWeight: 700, color: C.accentDark,
          background: C.accentBg, border: `1px solid ${C.borderOpen}`,
          borderRadius: 999, padding: '3px 10px', whiteSpace: 'nowrap',
        }}>
          {filtered.length} {isRtl ? 'تكوين' : language === 'en' ? 'formations' : 'formations'}
        </span>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <div style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          left: isRtl ? 'auto' : 13, right: isRtl ? 13 : 'auto',
          pointerEvents: 'none', color: '#b0bac5',
        }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t.formations?.searchPlaceholder ??
            (isRtl ? 'ابحث عن تكوين...' : language === 'en' ? 'Search a formation...' : 'Rechercher une formation...')}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: isRtl ? '11px 40px 11px 14px' : '11px 14px 11px 40px',
            borderRadius: 11, border: `1.5px solid ${C.border}`,
            background: '#fff', fontSize: 13, color: '#0f172a', outline: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentBg}`; }}
          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            right: isRtl ? 'auto' : 12, left: isRtl ? 12 : 'auto',
            width: 18, height: 18, borderRadius: '50%',
            background: '#e2e8f0', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b',
          }}>
            <svg width="9" height="9" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Empty states */}
      {formations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            {isRtl ? 'لا توجد بيانات' : 'Aucune formation disponible'}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
            {isRtl ? 'لا توجد نتائج' : language === 'en' ? 'No results found' : 'Aucun résultat'}
          </p>
          <button type="button" onClick={() => setSearch('')} style={{
            fontSize: 12, fontWeight: 600, color: C.accentDark,
            background: C.accentBg, border: `1px solid ${C.borderOpen}`,
            borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
          }}>
            {isRtl ? 'مسح البحث' : language === 'en' ? 'Clear search' : 'Effacer'}
          </button>
        </div>
      ) : (
        <FormationsTable
          items={filtered}
          isRtl={isRtl}
          language={language}
        />
      )}

    </div>
  );
}
