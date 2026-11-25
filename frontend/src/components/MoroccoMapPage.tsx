import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { Lang } from '../types';
import MoroccoMapSvg, {
  MAP_ZOOM_MAX,
  MAP_ZOOM_MIN,
  MAP_ZOOM_STEP,
  clampMapPan,
  getMapViewBox,
} from './MoroccoMapSvg';
import {
  MOROCCO_MAP_REGIONS,
  MOROCCO_STATS,
  PROVINCES_WITH_UNIVERSITIES,
  provinceEstablishmentCount,
  provinceHasUniversity,
  provinceUniversityCount,
  type MoroccoRegionData,
  type MoroccoProvince,
  type Establishment,
} from '../data/moroccoMapData';

interface MoroccoMapPageProps {
  lang: Lang;
  onClose: () => void;
  onSignup: () => void;
}

export default function MoroccoMapPage({ lang, onClose, onSignup }: MoroccoMapPageProps) {
  const isAr = lang === 'ar';
  const isEn = lang === 'en';
  const [selectedRegion, setSelectedRegion] = useState<MoroccoRegionData | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<MoroccoProvince | null>(null);
  const [activeRegionFilter, setActiveRegionFilter] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const didDragRef = useRef(false);

  const zoomIn = () =>
    setMapZoom((z) => Math.min(MAP_ZOOM_MAX, Math.round((z + MAP_ZOOM_STEP) * 100) / 100));
  const zoomOut = () => {
    setMapZoom((z) => {
      const next = Math.max(MAP_ZOOM_MIN, Math.round((z - MAP_ZOOM_STEP) * 100) / 100);
      if (next <= 1) setMapPan({ x: 0, y: 0 });
      return next;
    });
  };

  useEffect(() => {
    if (mapZoom <= 1) setMapPan({ x: 0, y: 0 });
  }, [mapZoom]);

  const applyPanDelta = useCallback(
    (deltaX: number, deltaY: number, basePan: { x: number; y: number }) => {
      const el = mapViewportRef.current;
      if (!el || mapZoom <= 1) return;
      const rect = el.getBoundingClientRect();
      const vb = getMapViewBox(mapZoom, basePan.x, basePan.y);
      const scaleX = vb.w / rect.width;
      const scaleY = vb.h / rect.height;
      setMapPan(clampMapPan(mapZoom, basePan.x - deltaX * scaleX, basePan.y - deltaY * scaleY));
    },
    [mapZoom]
  );

  const handleMapPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mapZoom <= 1 || e.button !== 0) return;
    didDragRef.current = false;
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: mapPan.x, panY: mapPan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleMapPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDragRef.current = true;
    applyPanDelta(dx, dy, { x: dragRef.current.panX, y: dragRef.current.panY });
  };

  const handleMapPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  useEffect(() => {
    const el = mapViewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (mapZoom <= 1) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const vb = getMapViewBox(mapZoom, mapPan.x, mapPan.y);
      const scaleY = vb.h / rect.height;
      const scaleX = vb.w / rect.width;
      setMapPan(
        clampMapPan(
          mapZoom,
          mapPan.x + e.deltaX * scaleX * 0.6,
          mapPan.y + e.deltaY * scaleY * 0.6
        )
      );
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [mapZoom, mapPan]);

  const handleMapSelectRegion = useCallback(
    (r: MoroccoRegionData) => {
      if (didDragRef.current) return;
      setSelectedRegion(r);
      setSelectedProvince(null);
      setExpandedIdx(null);
      setActiveRegionFilter(r.id);
    },
    []
  );

  const regionLabel = (r: MoroccoRegionData) => (isAr ? r.nameAr : r.nameFr);
  const provinceLabel = (p: MoroccoProvince) => (isAr ? p.nameAr : p.nameFr);

  const visibleRegions = useMemo(
    () =>
      activeRegionFilter
        ? MOROCCO_MAP_REGIONS.filter((r) => r.id === activeRegionFilter)
        : MOROCCO_MAP_REGIONS,
    [activeRegionFilter]
  );

  const establishments: Establishment[] = useMemo(() => {
    if (selectedProvince) return selectedProvince.establishments;
    if (selectedRegion) {
      return selectedRegion.provinces.flatMap((p) => p.establishments);
    }
    return [];
  }, [selectedRegion, selectedProvince]);

  const handleSelectRegion = (r: MoroccoRegionData) => {
    setSelectedRegion(r);
    setSelectedProvince(null);
    setExpandedIdx(null);
    setActiveRegionFilter(r.id);
  };

  const handleSelectProvince = (p: MoroccoProvince) => {
    setSelectedProvince(p);
    setExpandedIdx(null);
  };

  const handleSelectProvinceInRegion = (region: MoroccoRegionData, province: MoroccoProvince) => {
    setSelectedRegion(region);
    setSelectedProvince(province);
    setExpandedIdx(null);
    setActiveRegionFilter(region.id);
  };

  const sortedProvinces = (provinces: MoroccoProvince[]) =>
    [...provinces].sort((a, b) => {
      const aUni = provinceHasUniversity(a) ? 1 : 0;
      const bUni = provinceHasUniversity(b) ? 1 : 0;
      if (bUni !== aUni) return bUni - aUni;
      return provinceEstablishmentCount(b) - provinceEstablishmentCount(a);
    });

  const introText = (est: Establishment) =>
    isAr ? est.introductionAr : isEn ? est.introductionEn : est.introduction;

  const typeLabel = (t: Establishment['type']) =>
    isAr
      ? t === 'université'
        ? 'جامعة'
        : t === 'grande école'
          ? 'مدرسة عليا'
          : 'مدرسة'
      : isEn
        ? t === 'université'
          ? 'University'
          : t === 'grande école'
            ? 'Grande école'
            : 'School'
        : t === 'université'
          ? 'Université'
          : t === 'grande école'
            ? 'Grande école'
            : 'École';

  return (
    <div className="fixed inset-0 z-[9000] bg-white overflow-y-auto" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇲🇦</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isAr ? 'خريطة المدارس والجامعات بالمغرب' : isEn ? 'Morocco Schools & Universities Map' : 'Carte des Écoles & Universités du Maroc'}
              </h1>
              <p className="text-sm text-gray-500">
                {isAr
                  ? 'اختر جهة أو إقليم لاكتشاف أفضل المؤسسات'
                  : isEn
                    ? 'Pick a region or province to discover top institutions'
                    : 'Choisis une région (jiha) ou un province (iqlim) pour découvrir les meilleures écoles'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Nav: Jihat */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button
            onClick={() => {
              setActiveRegionFilter(null);
              setSelectedRegion(null);
              setSelectedProvince(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              !activeRegionFilter
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
            }`}
          >
            {isAr ? '🇲🇦 كل الجهات' : isEn ? '🇲🇦 All regions' : '🇲🇦 Toutes les régions'}
          </button>
          {MOROCCO_MAP_REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() =>
                activeRegionFilter === r.id
                  ? (setActiveRegionFilter(null), setSelectedRegion(null), setSelectedProvince(null))
                  : handleSelectRegion(r)
              }
              className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                activeRegionFilter === r.id
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                style={{ backgroundColor: r.color }}
              />
              {regionLabel(r).split('-')[0].trim()}
            </button>
          ))}
        </div>

        {/* Promo */}
        {!selectedRegion && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 p-6 text-white shadow-xl mb-6">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎓</span>
                  <span className="text-xs font-bold bg-white/20 rounded-full px-3 py-1 uppercase tracking-wide">
                    {isAr ? 'حصري MyTawjeh' : isEn ? 'Exclusive MyTawjeh' : 'Exclusif MyTawjeh'}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black leading-tight mb-2">
                  {isAr
                    ? `${MOROCCO_STATS.regions} جهات · ${MOROCCO_STATS.provinces} أقاليم · ${MOROCCO_STATS.establishments}+ مؤسسة`
                    : isEn
                      ? `${MOROCCO_STATS.regions} regions · ${MOROCCO_STATS.provinces} provinces · ${MOROCCO_STATS.establishments}+ institutions`
                      : `${MOROCCO_STATS.regions} régions · ${MOROCCO_STATS.provinces} provinces · ${MOROCCO_STATS.establishments}+ établissements`}
                </h3>
                <p className="text-purple-100 text-sm">
                  {isAr
                    ? 'اكتشف أفضل الجامعات والمدارس العليا في كل جهة وإقليم بالمغرب.'
                    : isEn
                      ? 'Discover the best universities and schools in every Moroccan region and province.'
                      : 'Découvre les meilleures universités et grandes écoles de chaque jiha et iqlim au Maroc.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: `${MOROCCO_STATS.regions}`, lbl: isAr ? 'جهة' : isEn ? 'Regions' : 'Régions' },
                    { val: `${MOROCCO_STATS.provinces}`, lbl: isAr ? 'إقليم' : isEn ? 'Provinces' : 'Provinces' },
                    { val: '100%', lbl: isAr ? 'مجاني' : isEn ? 'Free' : 'Gratuit' },
                  ].map((s) => (
                    <div key={s.lbl} className="bg-white/15 rounded-xl p-2 text-center">
                      <div className="text-lg font-black">{s.val}</div>
                      <div className="text-xs text-purple-200">{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onSignup}
                  className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl text-sm hover:bg-purple-50 transition-all shadow-lg"
                >
                  {isAr ? '✨ إنشاء حساب مجاني' : isEn ? '✨ Create free account' : '✨ Créer un compte gratuit'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map */}
          <div className="lg:w-[58%] w-full">
            <div className="rounded-2xl p-1.5 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-900/15">
              <div className="relative rounded-xl overflow-hidden ring-1 ring-white/30 bg-[#3d94c7]">
                <div
                  ref={mapViewportRef}
                  className={`overflow-hidden touch-none ${
                    mapZoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''
                  }`}
                  onPointerDown={handleMapPointerDown}
                  onPointerMove={handleMapPointerMove}
                  onPointerUp={handleMapPointerUp}
                  onPointerCancel={handleMapPointerUp}
                >
                  <MoroccoMapSvg
                    regions={MOROCCO_MAP_REGIONS}
                    selectedRegionId={selectedRegion?.id ?? null}
                    activeRegionFilter={activeRegionFilter}
                    hoveredPin={hoveredPin}
                    lang={lang}
                    zoom={mapZoom}
                    panX={mapPan.x}
                    panY={mapPan.y}
                    regionLabel={regionLabel}
                    onHover={setHoveredPin}
                    onSelect={handleMapSelectRegion}
                  />
                </div>

                {/* Zoom +/- — côté carte, centré verticalement */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 z-20 flex flex-col overflow-hidden rounded-lg border border-white/50 shadow-lg ${
                    isAr ? 'left-3' : 'right-3'
                  }`}
                >
                  <button
                    type="button"
                    onClick={zoomIn}
                    disabled={mapZoom >= MAP_ZOOM_MAX}
                    aria-label={isAr ? 'تكبير' : isEn ? 'Zoom in' : 'Zoom avant'}
                    className="flex h-9 w-9 items-center justify-center bg-white/95 text-lg font-bold text-slate-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 border-b border-slate-200/80"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={zoomOut}
                    disabled={mapZoom <= MAP_ZOOM_MIN}
                    aria-label={isAr ? 'تصغير' : isEn ? 'Zoom out' : 'Zoom arrière'}
                    className="flex h-9 w-9 items-center justify-center bg-white/95 text-lg font-bold text-slate-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>
                </div>
              </div>
            </div>

            {/* Légende régions */}
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 justify-center">
              {MOROCCO_MAP_REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRegion(r)}
                  className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.code}
                </button>
              ))}
            </div>

            {/* Grille régions */}
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {visibleRegions.map((region) => {
                const isSel = selectedRegion?.id === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => handleSelectRegion(region)}
                    className={`rounded-xl p-2 text-center border-2 transition-all hover:scale-105 ${
                      isSel ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: region.color }}
                    >
                      {region.code}
                    </div>
                    <div className="text-[10px] font-medium text-gray-700 leading-tight line-clamp-2">
                      {regionLabel(region)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel */}
          <div className="lg:w-[42%] w-full">
            {!selectedRegion ? (
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    {isAr ? 'ماذا ستجد في الخريطة' : isEn ? 'What you will find' : 'Ce que tu trouves sur la carte'}
                  </p>
                  <ul className="space-y-2.5">
                    {(isAr
                      ? [
                          { icon: <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>, text: `${MOROCCO_STATS.regions} جهات و ${MOROCCO_STATS.provinces} إقليمًا بالمغرب` },
                          { icon: <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>, text: 'جامعات ومدارس عليا مصنّفة' },
                          { icon: <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>, text: 'شروط القبول والرسوم' },
                          { icon: <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: 'منح ومساعدات' },
                        ]
                      : isEn
                        ? [
                            { icon: <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>, text: `${MOROCCO_STATS.regions} regions & ${MOROCCO_STATS.provinces} provinces in Morocco` },
                            { icon: <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>, text: 'Ranked universities & grandes écoles' },
                            { icon: <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>, text: 'Admission requirements & fees' },
                            { icon: <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: 'Scholarships & financial aid' },
                          ]
                        : [
                            { icon: <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>, text: `${MOROCCO_STATS.regions} régions & ${MOROCCO_STATS.provinces} provinces du Maroc` },
                            { icon: <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>, text: 'Universités & grandes écoles classées' },
                            { icon: <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>, text: "Conditions d'admission & frais" },
                            { icon: <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: 'Bourses & aides financières' },
                          ]
                    ).map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        {item.icon}
                        <span className="text-sm text-gray-600">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
                  <p className="text-sm font-bold text-gray-700 mb-1">
                    {isAr
                      ? `🎓 ${MOROCCO_STATS.provincesWithUniversities} أقاليم فيها جامعات`
                      : isEn
                        ? `🎓 ${MOROCCO_STATS.provincesWithUniversities} provinces with universities`
                        : `🎓 ${MOROCCO_STATS.provincesWithUniversities} provinces avec universités`}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    {isAr
                      ? 'اضغط على إقليم لعرض الجامعات المتوفرة'
                      : isEn
                        ? 'Click a province to view its universities'
                        : 'Clique sur un iqlim pour voir les universités disponibles'}
                  </p>
                  <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                    {PROVINCES_WITH_UNIVERSITIES.map(({ region, province }) => (
                      <button
                        key={`${region.id}-${province.id}`}
                        type="button"
                        onClick={() => handleSelectProvinceInRegion(region, province)}
                        className="w-full flex items-center justify-between gap-2 rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-left hover:bg-emerald-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-800 truncate">
                            {provinceLabel(province)}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate">{regionLabel(region)}</div>
                        </div>
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          🎓 {provinceUniversityCount(province)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                  <span className="text-lg">👆</span>
                  <p className="text-xs text-blue-700 font-medium">
                    {isAr
                      ? 'اضغط على جهة ثم اختر إقليمًا'
                      : isEn
                        ? 'Click a region, then pick a province'
                        : 'Clique sur une région (jiha) puis un iqlim'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                <div
                  className="p-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${selectedRegion.color}, #6366f1)`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
                    >
                      {selectedRegion.code}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{regionLabel(selectedRegion)}</h2>
                      <p className="text-white/80 text-xs">
                        {selectedRegion.population} · {selectedRegion.provinces.length}{' '}
                        {isAr ? 'أقاليم' : isEn ? 'provinces' : 'provinces'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nav Aqlim */}
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      {isAr ? 'الأقاليم' : isEn ? 'Provinces' : 'Provinces (Aqlim)'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {isAr
                        ? '🎓 = فيه جامعة'
                        : isEn
                          ? '🎓 = has university'
                          : '🎓 = avec université'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedProvince(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        !selectedProvince
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {isAr ? 'الكل' : isEn ? 'All' : 'Tous'}
                    </button>
                    {sortedProvinces(selectedRegion.provinces).map((p) => {
                      const hasUni = provinceHasUniversity(p);
                      const estCount = provinceEstablishmentCount(p);
                      const uniCount = provinceUniversityCount(p);
                      const isSelected = selectedProvince?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectProvince(p)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-600'
                              : hasUni
                                ? 'bg-white text-gray-700 border-emerald-200 hover:border-emerald-400'
                                : estCount > 0
                                  ? 'bg-white text-gray-600 border-amber-200 hover:border-amber-400'
                                  : 'bg-gray-50 text-gray-400 border-gray-200 border-dashed'
                          }`}
                        >
                          {hasUni && <span aria-hidden>🎓</span>}
                          <span>{provinceLabel(p)}</span>
                          {estCount > 0 && (
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : hasUni
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {estCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 overflow-y-auto max-h-[55vh]">
                  <p className="text-xs text-gray-400 mb-3">
                    {isAr
                      ? `أفضل ${establishments.length} مؤسسة`
                      : isEn
                        ? `Top ${establishments.length} institutions`
                        : `Top ${establishments.length} établissements`}
                    {selectedProvince
                      ? ` — ${provinceLabel(selectedProvince)}`
                      : ` — ${regionLabel(selectedRegion)}`}
                  </p>
                  {establishments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center">
                      <p className="text-sm text-gray-500">
                        {isAr
                          ? 'لا توجد مؤسسات مسجّلة بعد في هذا الإقليم. سيتم إضافتها قريبًا.'
                          : isEn
                            ? 'No institutions listed yet for this province. Coming soon.'
                            : 'Aucun établissement répertorié pour cet iqlim pour le moment. Bientôt disponible.'}
                      </p>
                    </div>
                  ) : (
                    establishments.map((est, i) => (
                    <div key={`${est.name}-${i}`} className="rounded-xl border border-gray-100 overflow-hidden mb-2">
                      <button
                        onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 text-xs truncate">{est.name}</div>
                            <div className="text-xs text-gray-400">
                              {est.city} · {typeLabel(est.type)} · {est.rank}
                            </div>
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm flex-shrink-0">{expandedIdx === i ? '▲' : '▼'}</span>
                      </button>
                      {expandedIdx === i && (
                        <div className="px-3 pb-3 space-y-2 border-t border-gray-50 pt-2">
                          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-100/80 p-3">
                            <p className="text-xs font-bold text-purple-800 mb-1.5">
                              {isAr ? '✨ نبذة' : isEn ? '✨ About' : '✨ Présentation'}
                            </p>
                            <p className="text-xs text-gray-700 leading-relaxed">{introText(est)}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50 rounded-lg p-2">
                              <div className="text-xs font-bold text-blue-700 mb-1">
                                {isAr ? '📚 التخصصات' : isEn ? '📚 Programs' : '📚 Programmes'}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {est.programs.map((p) => (
                                  <span key={p} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2">
                              <div className="text-xs font-bold text-green-700 mb-1">
                                {isAr ? '💰 الرسوم' : isEn ? '💰 Fees' : '💰 Frais'}
                              </div>
                              <div className="text-xs text-green-800 font-medium">{est.tuitionFees}</div>
                            </div>
                          </div>
                          <div className="bg-amber-50 rounded-lg p-2">
                            <div className="text-xs font-bold text-amber-700 mb-1">
                              {isAr ? '📋 القبول' : isEn ? '📋 Admission requirements' : "📋 Conditions d'admission"}
                            </div>
                            <ul className="space-y-0.5">
                              {est.admissionRequirements.map((req) => (
                                <li key={req} className="text-xs text-amber-800">
                                  • {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="text-xs font-bold text-purple-700 mb-1">
                              {isAr ? '🎁 المنح' : isEn ? '🎁 Scholarships' : '🎁 Bourses'}
                            </div>
                            <div className="text-xs text-purple-800">{est.scholarships}</div>
                          </div>
                          <a
                            href={`https://${est.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-3 py-2 rounded-xl transition-all shadow-sm mt-1"
                          >
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {isAr ? 'الموقع الرسمي' : isEn ? 'Official website' : 'Site officiel'}
                            <span className="opacity-75 font-normal">— {est.website}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
