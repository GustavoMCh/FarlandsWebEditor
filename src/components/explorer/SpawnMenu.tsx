'use client';

import React, { useState } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';

interface SpawnMenuProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: number;
    itemName: string;
}

const TOOL_FAMILIES = {
    hachas: [1, 281, 282, 283],
    azadas: [2, 284, 285, 286],
    picos: [3, 278, 279, 280],
    hoces: [4, 287, 288, 289],
    regaderas: [22, 290, 291, 292],
    canas: [5, 411, 412],
    redes: [6, 413, 414]
};
const allToolsFlat = Object.values(TOOL_FAMILIES).flat();

export const SpawnMenu = ({ isOpen, onClose, itemId, itemName }: SpawnMenuProps) => {
    const { savedData, setSavedData, currentSlotIndex, currentSlot } = useSaveData();
    const [quantity, setQuantity] = useState(1);
    const [inventoryType, setInventoryType] = useState<'player' | 'ship' | 'chest'>('player');
    const [chestIndex, setChestIndex] = useState(0);

    if (!isOpen) return null;

    const isTool = allToolsFlat.includes(itemId);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setQuantity(isNaN(val) ? 0 : val);
    };

    // Determinar tamaño de la matriz y ocupación
    let totalSlots = 27;
    let occupiedSlots: boolean[] = [];

    if (savedData && currentSlot && currentSlotIndex !== -1) {
        if (inventoryType === 'player' && currentSlot.inventorySaveItems) {
            totalSlots = currentSlot.inventorySaveItems.length;
            occupiedSlots = currentSlot.inventorySaveItems.map(s => !s.isEmpty && s.itemID > 0);
        } else if (inventoryType === 'ship' && currentSlot.shipInventorySaveItems) {
            totalSlots = currentSlot.shipInventorySaveItems.length;
            occupiedSlots = currentSlot.shipInventorySaveItems.map(s => !s.isEmpty && s.itemID > 0);
        } else if (inventoryType === 'chest' && currentSlot.chestSlots && currentSlot.chestSlots[chestIndex]) {
            totalSlots = currentSlot.chestSlots[chestIndex].itemsID.length;
            occupiedSlots = currentSlot.chestSlots[chestIndex].itemsID.map(id => id > 0);
        }
    }

    const handleSpawn = (slotIndex: number) => {
        if (!savedData || !currentSlot || currentSlotIndex === -1) return;
        if (inventoryType === 'player' && slotIndex < 7) return; // Bloquear inyección en slots de herramientas

        const updatedSlotData = [...savedData.gameData.slotData];
        const current = { ...updatedSlotData[currentSlotIndex] };
        const finalQuantity = isTool ? 1 : quantity;

        if (inventoryType === 'player') {
            current.inventorySaveItems = [...current.inventorySaveItems];
            current.inventorySaveItems[slotIndex] = {
                itemID: itemId,
                amount: finalQuantity,
                isEmpty: false,
            };
        } else if (inventoryType === 'ship') {
            current.shipInventorySaveItems = [...current.shipInventorySaveItems];
            current.shipInventorySaveItems[slotIndex] = {
                itemID: itemId,
                amount: finalQuantity,
                isEmpty: false,
            };
        } else if (inventoryType === 'chest') {
            current.chestSlots = [...current.chestSlots];
            const chest = { ...current.chestSlots[chestIndex] };
            chest.itemsID = [...chest.itemsID];
            chest.itemsAmount = [...chest.itemsAmount];
            chest.itemsID[slotIndex] = itemId;
            chest.itemsAmount[slotIndex] = finalQuantity;
            current.chestSlots[chestIndex] = chest;
        }

        updatedSlotData[currentSlotIndex] = current;
        setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: updatedSlotData } });

        // Cierra el menú al finalizar
        onClose();
    };

    if (typeof document === 'undefined') return null;
    const { createPortal } = require('react-dom');

    return createPortal(
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                <div className="modal-content bg-dark text-light border-primary">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title">Añadir Ítem</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Ítem y Cantidad */}
                        <div className="d-flex gap-3 align-items-center mb-4 p-2 bg-secondary rounded">
                            <img src={`/static/items/Item_${itemId}.png`} alt="" width="64" height="64" className="bg-dark rounded flex-shrink-0" onError={(e) => (e.currentTarget.src = '/static/items/unknown.png')} />
                            <div className="flex-grow-1">
                                <h6 className="mb-0 text-white font-weight-bold">{itemName}</h6>
                                <small className="text-muted d-block mb-1">ID: {itemId}</small>
                                {isTool && <small className="text-warning d-block lh-1">1 unidad máx. (Herramienta)</small>}
                            </div>
                            <div style={{ width: '80px', minWidth: '70px' }}>
                                <label className="small text-light mb-1 d-block text-center">Cant.</label>
                                <input type="number" className="form-control bg-dark text-light border-secondary text-center px-1" value={isTool ? 1 : quantity} onChange={handleQuantityChange} min="1" max="999" disabled={isTool} />
                            </div>
                        </div>

                        {/* Destino */}
                        <div className="mb-4">
                            <label className="small text-light mb-2 fw-bold text-uppercase">1. Selecciona Destino</label>
                            <div className="d-flex gap-2 mb-2">
                                <select className="form-select bg-secondary text-light border-secondary w-100" value={inventoryType} onChange={(e) => setInventoryType(e.target.value as any)}>
                                    <option value="player">Inventario del Jugador</option>
                                    <option value="ship">Inventario de la Nave</option>
                                    <option value="chest">Cofres de la Granja</option>
                                </select>

                                {inventoryType === 'chest' && (
                                    <select className="form-select bg-secondary text-light border-secondary w-50" value={chestIndex} onChange={(e) => setChestIndex(Number(e.target.value))}>
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <option key={i} value={i}>Cofre {i + 1}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Grid para Seleccionar Hubicación exacta */}
                        <div className="mb-2">
                            <label className="small text-light mb-2 fw-bold text-uppercase d-block">2. Elige la Posición (Click para inyectar)</label>
                            <div
                                className="d-grid gap-1 p-2 bg-secondary rounded"
                                style={{ gridTemplateColumns: 'repeat(9, 1fr)', backgroundColor: 'rgba(0,0,0,0.3)' }}
                            >
                                {Array.from({ length: totalSlots }).map((_, idx) => {
                                    const isLockedToolSlot = inventoryType === 'player' && idx < 7;
                                    const isOccupied = occupiedSlots[idx];

                                    let bgColor = 'bg-dark';
                                    let borderColor = 'border-secondary';
                                    let textColor = 'transparent';

                                    if (isLockedToolSlot) {
                                        bgColor = 'bg-danger';
                                        borderColor = 'border-danger';
                                        textColor = 'white';
                                    } else if (isOccupied) {
                                        bgColor = 'bg-secondary';
                                        borderColor = 'border-warning';
                                        textColor = '#ffc107';
                                    }

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => { if (!isLockedToolSlot) handleSpawn(idx); }}
                                            className={`border rounded text-center ${isLockedToolSlot ? '' : 'cursor-pointer hover-bg-primary'} ${bgColor} ${borderColor}`}
                                            style={{
                                                height: '30px',
                                                fontSize: '12px',
                                                lineHeight: '28px',
                                                color: textColor,
                                                opacity: isOccupied || isLockedToolSlot ? 0.7 : 0.4,
                                                transition: 'all 0.2s',
                                                userSelect: 'none'
                                            }}
                                            title={isLockedToolSlot ? 'Bloqueado (Herramienta Fija)' : (`Slot ${idx} (Fila ${Math.floor(idx / 9) + 1}, Col ${(idx % 9) + 1})${isOccupied ? ' - Reemplazará el ítem actual' : ' - Hueco libre'}`)}
                                            onMouseEnter={(e) => {
                                                if (!isLockedToolSlot) {
                                                    e.currentTarget.style.opacity = '1';
                                                    e.currentTarget.style.color = 'white';
                                                    e.currentTarget.innerText = '+';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isLockedToolSlot) {
                                                    e.currentTarget.style.opacity = isOccupied ? '0.7' : '0.4';
                                                    e.currentTarget.style.color = isOccupied ? '#ffc107' : 'transparent';
                                                    e.currentTarget.innerText = isOccupied ? '■' : '✓';
                                                }
                                            }}
                                        >
                                            {isLockedToolSlot ? 'X' : (isOccupied ? '■' : '✓')}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
