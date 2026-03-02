'use client';

import { useState } from 'react';
import { ToolName, toolUpgradeGuides } from '@/lib/herramientas';
import { ToolLevel, Requirement } from '@/types/types';
import { useSaveData } from '@/components/utils/useSaveData';

// First 7 slots in player inventory are locked (tool slots)
const LOCKED_PLAYER_SLOTS = 7;

function parseAmount(amount: string): number {
  const match = amount.replace(/\./g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

type Step = 'pick-inventory' | 'pick-slot';
type InventoryTarget = 'player' | 'ship';

interface ApplyFlow {
  level: ToolLevel;
  step: Step;
  target?: InventoryTarget;
}

export default function ToolGuideModal({
  toolName, isOpen, onClose,
}: {
  toolName: string; isOpen: boolean; onClose: () => void;
}) {
  const { savedData, currentSlotIndex, setSavedData, currentSlot } = useSaveData();
  const [flow, setFlow] = useState<ApplyFlow | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const normalizedName = Object.keys(toolUpgradeGuides).find(
    (k) => k.toLowerCase() === toolName.toLowerCase()
  ) as ToolName | undefined;
  const guide: ToolLevel[] = normalizedName ? toolUpgradeGuides[normalizedName] : [];

  // Items to place (excluding Dinero)
  const itemReqs = (level: ToolLevel) =>
    level.requirements.filter((r) => r.id && r.item !== 'Dinero');
  const moneyReq = (level: ToolLevel) =>
    level.requirements.find((r) => r.item === 'Dinero');

  // ── Apply items starting at a specific slot index ──
  const applyAtSlot = (level: ToolLevel, target: InventoryTarget, startSlot: number) => {
    if (!savedData || currentSlotIndex === -1 || !currentSlot) return;

    const newSlotData = [...savedData.gameData.slotData];
    const slot = { ...newSlotData[currentSlotIndex] };

    const inv = target === 'player'
      ? [...(slot.inventorySaveItems || [])]
      : [...(slot.shipInventorySaveItems || [])];

    const items = itemReqs(level);
    const addedItems: string[] = [];
    let idx = startSlot;

    items.forEach((req) => {
      const qty = parseAmount(req.amount);
      if (!qty || !req.id) return;
      // Make sure slot exists
      while (inv.length <= idx) inv.push({ itemID: 0, amount: 0, isEmpty: true });
      inv[idx] = { itemID: req.id, amount: qty, isEmpty: false };
      addedItems.push(`${req.item} ×${qty}`);
      idx++;
    });

    // Credits
    let creditsAdded = 0;
    const money = moneyReq(level);
    if (money) {
      const qty = parseAmount(money.amount);
      slot.credits = (slot.credits || 0) + qty;
      creditsAdded = qty;
    }

    if (target === 'player') slot.inventorySaveItems = inv;
    else slot.shipInventorySaveItems = inv;

    newSlotData[currentSlotIndex] = slot;
    setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: newSlotData } });

    const msgs: string[] = [];
    if (addedItems.length) msgs.push(`✅ ${target === 'player' ? 'Mochila' : 'Nave'} (desde slot ${startSlot + 1}): ${addedItems.join(', ')}`);
    if (creditsAdded) msgs.push(`💰 +${creditsAdded.toLocaleString()} créditos`);
    setFeedback(msgs.join(' · ') || '⚠️ Nada que añadir');
    setFlow(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  // ── Slot picker grid ──
  const SlotPicker = ({ level, target }: { level: ToolLevel; target: InventoryTarget }) => {
    const inv = target === 'player'
      ? (currentSlot?.inventorySaveItems || [])
      : (currentSlot?.shipInventorySaveItems || []);

    const neededSlots = itemReqs(level).length;
    const totalSlots = Math.max(inv.length, (target === 'player' ? 27 : 18));
    const minStart = target === 'player' ? LOCKED_PLAYER_SLOTS : 0;

    return (
      <div>
        <p className="text-muted small mb-2">
          Elige el slot de inicio. Los ítems se colocarán consecutivamente desde ahí ({neededSlots} slot{neededSlots !== 1 ? 's' : ''} necesario{neededSlots !== 1 ? 's' : ''}).
          {target === 'player' && <span className="text-danger ms-1">🔒 Los primeros {LOCKED_PLAYER_SLOTS} slots están bloqueados.</span>}
          <span className="text-warning ms-2">⚠️ El contenido existente será reemplazado.</span>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 3 }}>
          {Array.from({ length: totalSlots }).map((_, i) => {
            const isLocked = target === 'player' && i < LOCKED_PLAYER_SLOTS;
            const wouldOverflow = i + neededSlots > totalSlots;
            const isDisabled = isLocked || wouldOverflow;
            const slotItem = inv[i];
            const hasItem = slotItem && !slotItem.isEmpty && slotItem.itemID > 0;

            return (
              <div
                key={i}
                onClick={() => !isDisabled && applyAtSlot(level, target, i)}
                title={
                  isLocked ? `🔒 Slot reservado para herramientas` :
                    wouldOverflow ? `No hay espacio suficiente desde aquí` :
                      hasItem ? `Slot ${i + 1}: Item ${slotItem.itemID} ×${slotItem.amount} — se reemplazará` :
                        `Slot ${i + 1}: vacío`
                }
                style={{
                  width: 36, height: 36,
                  border: isLocked ? '2px solid #dc3545' :
                    wouldOverflow ? '2px solid #555' :
                      hasItem ? '2px solid #ffc107' : '2px solid #495057',
                  borderRadius: 6,
                  background: isLocked ? 'rgba(220,53,69,0.15)' :
                    wouldOverflow ? 'rgba(50,50,50,0.3)' :
                      hasItem ? 'rgba(255,193,7,0.1)' : 'rgba(255,255,255,0.05)',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: isLocked ? '#dc3545' : '#adb5bd',
                  position: 'relative',
                  transition: 'border-color 0.1s',
                }}
              >
                {isLocked ? '🔒' : hasItem ? (
                  <img
                    src={`/static/items/Item_${slotItem.itemID}.png`}
                    width={28} height={28}
                    style={{ imageRendering: 'pixelated' }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span style={{ fontSize: 9, opacity: 0.4 }}>{i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Fixed toast — always visible above all modals */}
      {feedback && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1300,
          minWidth: '320px',
          maxWidth: '90vw',
          pointerEvents: 'none',
        }}>
          <div className="alert alert-success shadow py-2 px-3 mb-0" style={{ fontSize: '14px', borderRadius: '10px' }}>
            {feedback}
          </div>
        </div>
      )}

      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          zIndex: 1050, display: 'flex', alignItems: 'flex-start',
          justifyContent: 'center', paddingTop: '60px', overflowY: 'auto',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="bg-dark text-light rounded shadow"
          style={{ width: '100%', maxWidth: '860px', maxHeight: '80vh', overflowY: 'auto', margin: '0 16px 40px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-3 border-bottom border-primary d-flex justify-content-between align-items-center sticky-top bg-dark">
            <h5 className="text-primary mb-0">📘 Guía: {toolName}</h5>
            <button onClick={onClose} className="btn btn-sm btn-outline-danger">✕</button>
          </div>


          {/* Guide levels */}
          <div className="p-3">
            {guide.length === 0 && <p className="text-muted">No hay guía disponible.</p>}
            {guide.map((level) => (
              <div key={level.level} className="card bg-secondary border-primary my-3" style={{ borderLeft: '3px solid #00b894' }}>
                <div className="card-header bg-primary text-white p-2 d-flex align-items-center gap-2">
                  <img src={level.img} width={40} height={40} style={{ imageRendering: 'pixelated', borderRadius: 4 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  <h6 className="mb-0 flex-grow-1">{level.title}</h6>
                  {savedData && itemReqs(level).length > 0 && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => setFlow({ level, step: 'pick-inventory' })}
                    >🎒 Aplicar requisitos</button>
                  )}
                </div>
                <div className="card-body p-2">
                  <p className="text-warning small fw-bold mb-1">Efectos:</p>
                  <ul className="list-group list-group-flush mb-3">
                    {level.effects.map((eff, i) => (
                      <li key={i} className="list-group-item bg-dark text-light border-0 p-1" style={{ fontSize: '0.85rem' }}>{eff}</li>
                    ))}
                  </ul>
                  {level.requirements.length > 0 && (
                    <>
                      <p className="text-warning small fw-bold mb-1">Requisitos:</p>
                      <table className="table table-sm table-dark mb-0" style={{ fontSize: '0.85rem' }}>
                        <thead><tr><th style={{ width: '20%' }}>Item</th><th style={{ width: '20%' }}>Cantidad</th><th>Obtención</th></tr></thead>
                        <tbody>
                          {level.requirements.map((req, i) => (
                            <tr key={i}>
                              <td>
                                {req.id && <img src={`/static/items/Item_${req.id}.png`} width={22} height={22}
                                  style={{ verticalAlign: 'middle', marginRight: 6, borderRadius: 3, imageRendering: 'pixelated' }}
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />}
                                <strong>{req.item}</strong>
                              </td>
                              <td>{req.amount}</td>
                              <td><small>{req.source || (req.item === 'Dinero' ? '💰 Se sumará a tus créditos' : '—')}</small></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step modal */}
        {flow && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
              zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => setFlow(null)}
          >
            <div
              className="bg-dark border border-warning rounded p-4 shadow"
              style={{ maxWidth: '520px', width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              {flow.step === 'pick-inventory' && (
                <>
                  <h6 className="text-warning mb-3">🎒 ¿En qué inventario quieres añadir los ítems?</h6>
                  {moneyReq(flow.level) && (
                    <p className="text-info small">💰 También se añadirán <strong>{moneyReq(flow.level)!.amount}</strong> a tus créditos.</p>
                  )}
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-primary" onClick={() => setFlow({ ...flow, step: 'pick-slot', target: 'player' })}>
                      🧍 Mochila del Jugador
                    </button>
                    <button className="btn btn-info text-dark" onClick={() => setFlow({ ...flow, step: 'pick-slot', target: 'ship' })}>
                      🚀 Inventario de la Nave
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => setFlow(null)}>✕</button>
                  </div>
                </>
              )}

              {flow.step === 'pick-slot' && flow.target && (
                <>
                  <h6 className="text-warning mb-2">
                    📦 Elige el slot de inicio en {flow.target === 'player' ? '🧍 Mochila' : '🚀 Nave'}
                  </h6>

                  {/* Item preview */}
                  <div className="mb-3 p-2 rounded" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #495057' }}>
                    <p className="text-muted small mb-2">Ítems que se asignarán:</p>
                    <div className="d-flex gap-2 flex-wrap align-items-center">
                      {itemReqs(flow.level).map((req, i) => (
                        <div key={i} className="d-flex align-items-center gap-1 px-2 py-1 rounded"
                          style={{ background: 'rgba(13,110,253,0.15)', border: '1px solid #0d6efd' }}>
                          {req.id && (
                            <img src={`/static/items/Item_${req.id}.png`} width={28} height={28}
                              style={{ imageRendering: 'pixelated', borderRadius: 3 }}
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                          )}
                          <div style={{ fontSize: '12px', lineHeight: '1.2' }}>
                            <div className="text-white fw-bold">{req.item}</div>
                            <div className="text-info">×{parseAmount(req.amount)}</div>
                          </div>
                        </div>
                      ))}
                      {moneyReq(flow.level) && (
                        <div className="d-flex align-items-center gap-1 px-2 py-1 rounded"
                          style={{ background: 'rgba(255,193,7,0.15)', border: '1px solid #ffc107' }}>
                          <span style={{ fontSize: '20px' }}>💰</span>
                          <div style={{ fontSize: '12px', lineHeight: '1.2' }}>
                            <div className="text-white fw-bold">Créditos</div>
                            <div className="text-warning">+{moneyReq(flow.level)!.amount}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <SlotPicker level={flow.level} target={flow.target} />
                  <div className="mt-3 text-end">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setFlow({ ...flow, step: 'pick-inventory', target: undefined })}>
                      ← Volver
                    </button>
                    <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => setFlow(null)}>✕ Cancelar</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}