'use client';

import { useState, useEffect } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import { InventoryGrid } from '../inventory/InventoryGrid';
import ShipRefuelSystem from './ShipRefuelSystem';

const SHIP_LEVELS = [0, 1, 2, 3, 4];
const ANIMATION_FRAMES = 16;

const SHIP_DECORATIONS = [
  { id: 0, name: 'Ninguno', folder: null },
  { id: 1, name: 'Bola #8', folder: 'ambBall' },
  { id: 2, name: 'Dados', folder: 'ambDice' },
  { id: 3, name: 'Jandu', folder: 'ambJandu' },
  { id: 4, name: 'Pino', folder: 'ambPino' },
  { id: 5, name: 'Calabaza', folder: 'ambPumpkin' },
  { id: 6, name: 'Quetejo', folder: 'ambQuetejo' },
  { id: 7, name: 'Mini-Nave', folder: 'ambShip' },
  { id: 8, name: 'Tigre', folder: 'ambTiger' },
];
const DECO_FRAMES = 73; // 0 a 72

const PLANETS = [
  { name: 'Hafnir', description: 'Un puñado de rocas flotando juntos en el espacio, es un milagro que no se hayan desperdigado todas. En Hafnir pueden encontrarse minerales muy útiles, aunque es difícil acceder a ellos.' },
  { name: 'Terbin', description: 'Un asentamiento se estableció en Terbin hace muchos años, en su momento estaba lleno de vida, aunque ahora no es más que la sombra de lo que un día fue.' },
  { name: 'farm', isFarm: true, description: 'En este planetoide destartalado se encuentra la granja donde vives actualmente, ha visto mejores días aunque tiene mucho potencial.' },
  { name: 'Galea', description: 'Un planeta pantanoso con una vegetación muy densa. En Galea viven algunas especies superiores que se adaptan mejor a su clima que los humanos.' },
  { name: 'Bohr', description: 'Una luna apenas explorada, la superficie está cubierta de unos hongos que no aparecen en ningún otro lugar del universo. Los escáneres muestran un intrincado sistema de cavernas en el interior.' },
  { name: 'Vanadian', description: 'Un planeta desértico, parece haber restos de alguna civilización antigua, aunque lo que ahora queda son kilómetros de arena y poco más.' },
  { name: 'Goddol', description: 'Colorido, tropical y único, la flora y fauna de Goddol son incomparables.' },
];

// Spritesheet: 12 cols × 11 rows × 180×180px per tile
const DISPLAY = 80;
const TILE = 180;
const COLS = 12;
const ROWS = 11;
const BG_W = Math.round(COLS * TILE * (DISPLAY / TILE)); // 960
const BG_H = Math.round(ROWS * TILE * (DISPLAY / TILE)); // 880

function spriteCss(src: string, selected: boolean) {
  return {
    width: `${DISPLAY}px`,
    height: `${DISPLAY}px`,
    backgroundImage: `url(${src})`,
    backgroundSize: `${BG_W}px ${BG_H}px`,
    backgroundPosition: '0 0',
    backgroundRepeat: 'no-repeat' as const,
    imageRendering: 'pixelated' as const,
    borderRadius: '6px',
    filter: selected ? 'none' : 'brightness(0.45)',
    transition: 'filter 0.15s',
    flexShrink: 0,
  };
}

export default function ShipSection() {
  const { savedData, currentSlotIndex, currentSlot, setSavedData } = useSaveData();
  const [frameIndex, setFrameIndex] = useState(0);
  const [decoFrame, setDecoFrame] = useState(0);
  const [leverFrame, setLeverFrame] = useState(0);
  const [isLeverAnimating, setIsLeverAnimating] = useState(false);

  // Mapeo seguro para frames de palanca (faltan 1 y 8 en el disco)
  const getLeverFrameFile = (frame: number) => {
    const map: Record<number, number> = { 1: 0, 8: 7 };
    return map[frame] ?? frame;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % ANIMATION_FRAMES);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDecoFrame((prev) => (prev + 1) % DECO_FRAMES);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLeverAnimating) return;

    const interval = setInterval(() => {
      setLeverFrame((prev) => {
        if (prev >= 11) {
          setIsLeverAnimating(false);
          return 0; // Vuelve a reposo
        }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isLeverAnimating]);

  if (!savedData || !currentSlot) return null;

  const activeCells = currentSlot.spaceShipActiveCells ?? 0;
  const availableCells = currentSlot.spaceShipAvailableCells ?? 0;
  const currentLevel = Math.min(Math.max(activeCells, 0), 4);

  const updateSlot = (patch: Record<string, any>) => {
    const newSlotData = [...savedData.gameData.slotData];
    newSlotData[currentSlotIndex] = { ...newSlotData[currentSlotIndex], ...patch };
    setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: newSlotData } });
  };

  const handleLevelSelect = (level: number) => {
    updateSlot({ spaceShipActiveCells: level, spaceShipAvailableCells: Math.max(availableCells, level) });
  };

  const getCurrentPlanetName = () => {
    const tag = (currentSlot.spawnTag || '').toLowerCase();
    if (tag.includes('granja') || tag.includes('farm')) return 'farm';
    if (tag.includes('hafnir')) return 'Hafnir';
    if (tag.includes('bohr')) return 'Bohr';
    if (tag.includes('galea')) return 'Galea';
    if (tag.includes('terbin')) return 'Terbin';
    if (tag.includes('vanadian')) return 'Vanadian';
    if (tag.includes('goddol')) return 'Goddol';
    return null;
  };

  const handleTravel = (planetName: string) => {
    const mapping: Record<string, string> = {
      'farm': 'Granja_Spawn',
      'Hafnir': 'Hafnir_Spawn',
      'Terbin': 'Terbin_Spawn',
      'Galea': 'Galea_Spawn',
      'Bohr': 'Bohr_Spawn',
      'Vanadian': 'Vanadian_Spawn',
      'Goddol': 'Goddol_Spawn'
    };

    const newTag = mapping[planetName];
    if (newTag) {
      if (window.confirm(`¿Quieres viajar a ${planetName}? Esto cambiará tu punto de aparición.`)) {
        updateSlot({ spawnTag: newTag });
      }
    }
  };

  const currentPlanet = getCurrentPlanetName();

  return (
    <div className="card bg-dark border-info my-3">
      <div className="card-header bg-info text-dark d-flex align-items-center gap-2">
        <img
          src={`/static/ship/animate/5 nave 48x48_${frameIndex}.png`}
          alt="Ship Animation"
          width={32}
          height={32}
          style={{ imageRendering: 'pixelated' }}
        />
        <h4 className="mb-0">Nave Espacial</h4>

        {/* Palanca Animada */}
        <div
          className="ms-3 p-1 rounded-circle bg-dark border border-info"
          onClick={() => !isLeverAnimating && setIsLeverAnimating(true)}
          style={{ cursor: isLeverAnimating ? 'default' : 'pointer', transition: 'all 0.2s', backgroundColor: 'rgba(0,0,0,0.5)' }}
          title="Tirar de la palanca"
        >
          <img
            src={`/static/ship/palanca/palanca_54x64_${getLeverFrameFile(leverFrame)}.png`}
            alt="Palanca"
            width={24}
            height={28}
            style={{ imageRendering: 'pixelated', transform: 'scale(1.2)' }}
          />
        </div>

        <span className="ms-auto badge bg-dark text-info">
          Celdas: {activeCells} / {availableCells} | Energía: {currentSlot.spaceShipCurrentEnergy ?? 0}
        </span>
      </div>
      <div className="card-body">

        {/* Ship Energy level */}
        <div className="mb-4 p-3 rounded bg-black-50 border border-info-subtle">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label text-info mb-0">⚡ Nivel de Energía Actual</label>
            <div className="d-flex align-items-center gap-2">
              <input
                type="number"
                value={currentSlot.spaceShipCurrentEnergy ?? 0}
                onChange={(e) => updateSlot({ spaceShipCurrentEnergy: parseInt(e.target.value) || 0 })}
                className="form-control form-control-sm bg-dark text-info border-info text-center"
                style={{ width: '80px' }}
              />
              <span className="text-muted small">unid.</span>
            </div>
          </div>
          <input
            type="range"
            className="form-range"
            min="0"
            max={Math.max(availableCells * 100, (currentSlot.spaceShipCurrentEnergy ?? 0), 100)}
            step="1"
            value={currentSlot.spaceShipCurrentEnergy ?? 0}
            onChange={(e) => updateSlot({ spaceShipCurrentEnergy: parseInt(e.target.value) })}
          />
          <div className="d-flex justify-content-between text-muted" style={{ fontSize: '10px' }}>
            <span>0</span>
            <span>Máx estimado ({availableCells * 100})</span>
          </div>
        </div>

        {/* Ship level selector */}
        <div className="mb-4">
          <label className="form-label text-muted small mb-2">Nivel de la cabina</label>
          <div className="d-flex gap-3 flex-wrap">
            {SHIP_LEVELS.map(level => {
              const isSelected = level === currentLevel;
              return (
                <div
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  title={`Nivel ${level}`}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: isSelected ? '3px solid #0dcaf0' : '3px solid #495057',
                    boxShadow: isSelected ? '0 0 10px 2px rgba(13,202,240,0.4)' : undefined,
                    padding: '6px',
                    background: isSelected ? 'rgba(13,202,240,0.12)' : 'rgba(255,255,255,0.04)',
                    transition: 'all 0.15s',
                    textAlign: 'center' as const,
                  }}
                >
                  <div style={{ position: 'relative', width: `${DISPLAY}px`, height: `${DISPLAY}px` }}>
                    {/* Reactor — base layer */}
                    <div style={{ ...spriteCss(`/static/ship/reactor_${level}.png`, isSelected), position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                    {/* Cabin — on top */}
                    <div style={{ ...spriteCss(`/static/ship/cabin_${level}.png`, isSelected), position: 'absolute', top: 0, left: 0, zIndex: 2 }} />
                  </div>
                  <div style={{ fontSize: '11px', color: isSelected ? '#4dd9ea' : '#6c757d', marginTop: '4px' }}>
                    Nivel {level}{isSelected && ' ✔'}
                  </div>
                </div>
              );
            })}
          </div>
          <small className="text-muted mt-2 d-block">Haz clic en un nivel para cambiarlo.</small>
        </div>

        {/* Ship decoration selector (Ambientadores) */}
        <div className="mb-4">
          <label className="form-label text-muted small mb-2">Ambientador de la Nave (Decoración)</label>
          <div className="d-flex gap-2 flex-wrap">
            {SHIP_DECORATIONS.map(deco => {
              const isSelected = (currentSlot.shipCurrentDecorationIndex ?? 0) === deco.id;
              return (
                <button
                  key={deco.id}
                  onClick={() => updateSlot({ shipCurrentDecorationIndex: deco.id })}
                  className={`btn btn-sm d-flex flex-column align-items-center p-2 ${isSelected ? 'btn-info border-2' : 'btn-outline-secondary text-light'}`}
                  style={{ minWidth: '110px', transition: 'all 0.2s' }}
                >
                  <div className="mb-2" style={{ width: '64px', height: '64px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {deco.folder ? (
                      <img
                        src={`/static/amb/${deco.folder}/${deco.folder}_80x80_${decoFrame}.png`}
                        alt={deco.name}
                        style={{ width: '64px', height: '64px', imageRendering: 'pixelated', objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="text-muted small">Ø</div>
                    )}
                  </div>
                  <span style={{ fontSize: '12px' }}>{deco.name}</span>
                  {isSelected && <span className="badge bg-dark text-info mt-1">Activo</span>}
                </button>
              );
            })}
          </div>
          <small className="text-muted mt-2 d-block">
            Cambia la &quot;bola&quot; u ornamento que cuelga en la cabina de la nave.
          </small>
        </div>

        {/* Refuel / Processor System */}
        <div className="mb-4">
          <label className="form-label text-muted small mb-3">Sistema de Procesado de Combustible</label>
          <ShipRefuelSystem />
          <small className="text-muted mt-2 d-block">
            Carga materiales para llenar las celdas de combustible de la nave.
          </small>
        </div>

        {/* Planets Info */}
        <div className="mb-4">
          <label className="form-label text-muted small mb-3 d-flex justify-content-between">
            <span>Cartografía del Sistema (Planetas)</span>
            <span className="text-info" style={{ fontSize: '10px' }}>Ubicación actual: <b className="text-uppercase">{currentPlanet === 'farm' ? (currentSlot.farmName || 'Granja') : (currentPlanet || 'Desconocida')}</b></span>
          </label>
          <div className="custom-tabs-scroll d-flex gap-3 pb-3">
            {PLANETS.map((planet, idx) => {
              const isHere = currentPlanet === planet.name;
              return (
                <div
                  key={idx}
                  onClick={() => handleTravel(planet.name)}
                  className={`p-3 rounded flex-shrink-0 transition-all ${isHere ? 'border-info shadow-lg' : 'border-secondary'}`}
                  style={{
                    width: '145px',
                    minHeight: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    whiteSpace: 'normal',
                    backgroundColor: isHere ? 'rgba(13,202,240,0.15)' : 'rgba(0,0,0,0.3)',
                    border: isHere ? '2px solid #0dcaf0' : '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    cursor: 'pointer',
                    boxShadow: isHere ? '0 0 15px rgba(13,202,240,0.3)' : 'none'
                  }}
                >
                  {isHere && (
                    <span className="badge bg-info text-dark position-absolute" style={{ top: '0px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      📍 ESTÁS AQUÍ
                    </span>
                  )}

                  <h6 className={`mb-2 text-center pb-2 border-bottom ${isHere ? 'text-info border-info' : 'text-light border-secondary border-opacity-25'}`} style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {planet.isFarm ? (currentSlot.farmName || 'Tu Granja') : planet.name}
                  </h6>

                  <p className="text-light mb-0" style={{ fontSize: '10.5px', lineHeight: '1.4', opacity: isHere ? 1 : 0.7, textShadow: '1px 1px 1px black' }}>
                    {planet.description}
                  </p>

                  <div className="mt-auto pt-2 text-center">
                    <span style={{ fontSize: '8px', color: isHere ? '#0dcaf0' : '#6c757d', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      {isHere ? '🛰️ Orbita actual' : '🚀 Viajar aquí'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ship inventory */}
        <InventoryGrid
          items={currentSlot.shipInventorySaveItems || []}
          inventoryType="ship"
          title="Inventario de la Nave"
        />
      </div>
    </div>
  );
}