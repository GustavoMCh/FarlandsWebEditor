// src/components/ship/ShipRefuelSystem.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import { InventoryGrid } from '../inventory/InventoryGrid';
import ItemDropdownMenu from '@/components/context/ItemDropdownMenu';

interface Item {
    id: number;
    name: string;
    procesar?: string;
}

export default function ShipRefuelSystem() {
    const { savedData, currentSlotIndex, currentSlot, setSavedData, editingSlotKey, setEditingSlotKey } = useSaveData();
    const [items, setItems] = useState<Item[]>([]);
    const [selectedSlotIndices, setSelectedSlotIndices] = useState<number[]>([]);
    const [internalProgress, setInternalProgress] = useState(0);

    useEffect(() => {
        fetch('/guides/items.json')
            .then(res => res.json())
            .then(data => setItems(data.items))
            .catch(err => console.error("Error loading items for refuel system", err));
    }, []);

    if (!savedData || !currentSlot) return null;

    const activeCells = currentSlot.spaceShipActiveCells ?? 0;
    const availableCells = currentSlot.spaceShipAvailableCells ?? 0;
    const playerItems = currentSlot.inventorySaveItems || [];

    const parseProcesar = (val?: string) => {
        if (!val) return 0;
        const match = val.match(/([+-]?\d+)%/);
        return match ? parseInt(match[1]) : 0;
    };

    const isTool = (id: number) => {
        const toolIds = [1, 2, 3, 4, 5, 6, 22];
        return toolIds.includes(id) || (id >= 240 && id <= 267);
    };

    const getProcessValue = (itemID: number) => {
        const meta = items.find(i => i.id === itemID);
        return parseProcesar(meta?.procesar);
    };

    // Calculate totals for selected items
    const selectedItemsData = selectedSlotIndices.map(idx => ({
        idx,
        data: playerItems[idx],
        meta: items.find(i => i.id === playerItems[idx].itemID)
    }));

    const totalPotentialGain = selectedItemsData.reduce((acc, item) => {
        const val = parseProcesar(item.meta?.procesar);
        return acc + (val * item.data.amount);
    }, 0);

    const handleProcesar = () => {
        if (selectedSlotIndices.length === 0) return;

        let newProgress = internalProgress + totalPotentialGain;
        let newActiveCells = activeCells;

        // Process increments of 100 into cells
        while (newProgress >= 100 && newActiveCells < availableCells) {
            newProgress -= 100;
            newActiveCells += 1;
        }

        // Update save data
        const newSlotData = [...savedData.gameData.slotData];
        const newInventory = [...currentSlot.inventorySaveItems];

        // Consume all selected items
        selectedSlotIndices.forEach(idx => {
            newInventory[idx] = { itemID: 0, amount: 0, isEmpty: true };
        });

        newSlotData[currentSlotIndex] = {
            ...currentSlot,
            spaceShipActiveCells: newActiveCells,
            inventorySaveItems: newInventory
        };

        setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: newSlotData } });
        setInternalProgress(newProgress);
        setSelectedSlotIndices([]);
    };

    const toggleSelection = (idx: number) => {
        setSelectedSlotIndices(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    return (
        <div className="refuel-system p-3 rounded shadow-lg" style={{ backgroundColor: '#1a3c40', border: '3px solid #45a29e', imageRendering: 'pixelated' }}>

            {/* Top Bars (Fuel Cells) */}
            <div className="d-flex justify-content-center gap-1 mb-4 bg-dark p-2 rounded border border-secondary border-opacity-25">
                {Array.from({ length: 12 }).map((_, i) => {
                    const exists = i < availableCells;
                    const isActive = i < activeCells;
                    return (
                        <div
                            key={i}
                            title={!exists ? 'Bloqueado' : isActive ? 'Cargado' : 'Vacío'}
                            style={{
                                width: '18px',
                                height: '28px',
                                border: '1px solid #000',
                                backgroundColor: !exists ? '#2c3e50' : isActive ? '#2ecc71' : '#e67e22',
                                boxShadow: isActive ? '0 0 8px #2ecc71' : 'none',
                                opacity: exists ? 1 : 0.3,
                                transition: 'all 0.3s'
                            }}
                        />
                    );
                })}
            </div>

            <div className="row g-0 align-items-center">
                {/* Left Power Bar (0-100%) */}
                <div className="col-3 d-flex flex-column align-items-center">
                    <div className="power-bar-outer" style={{
                        height: '180px',
                        width: '45px',
                        border: '4px solid #7f8c8d',
                        backgroundColor: '#0b0c10',
                        position: 'relative',
                        padding: '2px',
                        borderRadius: '4px'
                    }}>
                        <div className="labels" style={{ position: 'absolute', right: '100%', marginRight: '8px', height: '100%', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: '9px', color: '#45a29e', fontWeight: 'bold' }}>
                            <span>0</span>
                            <span>50</span>
                            <span>100</span>
                        </div>
                        {/* Liquid Fill */}
                        <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            left: '2px',
                            right: '2px',
                            height: `${Math.min(internalProgress, 100)}%`,
                            backgroundColor: '#2ecc71',
                            transition: 'height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: '0 0 15px #2ecc71',
                        }} />
                    </div>
                    <button
                        className={`btn mt-3 border-2 ${selectedSlotIndices.length === 0 ? 'btn-outline-secondary opacity-50' : 'btn-success shadow'}`}
                        disabled={selectedSlotIndices.length === 0}
                        onClick={handleProcesar}
                        style={{ fontFamily: 'LanaPixel', textTransform: 'uppercase', fontSize: '11px', minWidth: '85px' }}
                    >
                        {selectedSlotIndices.length > 0 ? '⚡ Cargar' : 'Procesar'}
                    </button>
                </div>

                {/* Center Screen / Hologram */}
                <div className="col-9 ps-3">
                    <div className="main-panel shadow-inset rounded position-relative" style={{
                        height: '180px',
                        backgroundColor: 'rgba(69, 162, 158, 0.05)',
                        border: '2px solid #45a29e',
                        padding: '10px',
                        overflowY: 'auto'
                    }}>
                        {/* Background Grid Pattern */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(#45a29e 1px, transparent 1px)', backgroundSize: '15px 15px', opacity: 0.1, pointerEvents: 'none' }} />

                        {selectedSlotIndices.length > 0 ? (
                            <div className="z-1 animate-fadeIn w-100">
                                <div className="d-flex justify-content-between align-items-center border-bottom border-info border-opacity-25 pb-1 mb-2">
                                    <span className="text-info small fw-bold">CARGA SELECCIONADA</span>
                                    <span className="badge bg-success text-dark">+{totalPotentialGain}%</span>
                                </div>
                                <div className="selected-items-list" style={{ maxHeight: '110px' }}>
                                    {selectedItemsData.map((item, i) => (
                                        <div key={i} className="d-flex align-items-center gap-2 mb-1 p-1 bg-black-25 rounded border border-info border-opacity-10">
                                            <img src={`/static/items/Item_${item.data.itemID}.png`} style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
                                            <div className="flex-grow-1">
                                                <div className="text-white" style={{ fontSize: '10px' }}>{item.meta?.name} x{item.data.amount}</div>
                                            </div>
                                            <div className="text-success small" style={{ fontSize: '9px' }}>+{parseProcesar(item.meta?.procesar) * item.data.amount}%</div>
                                            <button className="btn btn-link btn-sm text-danger p-0" onClick={() => toggleSelection(item.idx)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                                {totalPotentialGain >= 100 && (
                                    <div className="text-warning text-center mt-1 small" style={{ fontSize: '9px' }}>
                                        ⚠️ ¡Llenará {Math.floor((internalProgress + totalPotentialGain) / 100)} celdas!
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-100 d-flex flex-column justify-content-center align-items-center opacity-50">
                                <div style={{ fontSize: '28px', marginBottom: '5px' }}>🔋</div>
                                <p className="text-info small mb-0">Selecciona materiales</p>
                                <small className="text-muted" style={{ fontSize: '9px' }}>Máx combustible para el viaje</small>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid Inventory */}
            <div className="mt-4 border-top border-secondary border-opacity-25 pt-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="text-secondary small fw-bold" style={{ textTransform: 'uppercase', fontSize: '10px' }}>🛒 ALMACÉN DE MATERIAS PRIMAS</label>
                    <button
                        className="btn btn-link btn-sm text-info text-decoration-none p-0"
                        style={{ fontSize: '9px' }}
                        onClick={() => setSelectedSlotIndices([])}
                    >
                        Limpiar Selección
                    </button>
                </div>
                <div
                    className="p-1 rounded custom-tabs-scroll"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(9, 1fr)',
                        gap: '3px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid #333',
                        height: '180px',
                        overflowY: 'auto'
                    }}
                >
                    {playerItems.map((slot, idx) => {
                        const isEmpty = !slot || slot.isEmpty || slot.itemID === 0;
                        const uniqueKey = `refuel-inventory-${idx}`;
                        const showMenu = editingSlotKey === uniqueKey;

                        const isSelected = selectedSlotIndices.includes(idx);
                        const procValue = getProcessValue(slot.itemID);
                        const blocked = isTool(slot.itemID) || (procValue < 1 && !isEmpty);

                        return (
                            <div
                                key={idx}
                                id={uniqueKey}
                                onClick={() => !blocked && !isEmpty && toggleSelection(idx)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setEditingSlotKey(uniqueKey);
                                }}
                                title={blocked ? 'No procesable' : isEmpty ? 'Vacío (Click derecho para editar)' : `${slot.itemID}: ${procValue}%`}
                                className="position-relative"
                                style={{
                                    aspectRatio: '1/1',
                                    backgroundColor: isSelected ? 'rgba(46, 204, 113, 0.25)' : blocked ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.06)',
                                    border: isSelected ? '2px solid #2ecc71' : blocked ? '1px solid #441a1a' : '1px solid #3d3d3d',
                                    cursor: blocked ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '3px',
                                    opacity: blocked ? 0.4 : 1,
                                    transition: 'all 0.1s',
                                    zIndex: showMenu ? 100 : 1
                                }}
                            >
                                {/* Process % Label Top Right */}
                                {!blocked && !isEmpty && (
                                    <span style={{ position: 'absolute', top: 1, right: 1, fontSize: '8px', color: '#2ecc71', fontWeight: 'bold', zIndex: 1, textShadow: '1px 1px 0 #000' }}>
                                        {procValue}%
                                    </span>
                                )}

                                {!isEmpty && (
                                    <img
                                        src={`/static/items/Item_${slot.itemID}.png`}
                                        alt="item"
                                        style={{ width: '75%', height: '75%', imageRendering: 'pixelated', filter: blocked ? 'grayscale(1) brightness(0.5)' : 'none' }}
                                    />
                                )}

                                {/* Amount Label Bottom Right */}
                                {!blocked && !isEmpty && slot.amount > 1 && (
                                    <span style={{ position: 'absolute', bottom: 0, right: 1, fontSize: '8.5px', color: '#fff', textShadow: '1px 1px 1px #000' }}>
                                        {slot.amount}
                                    </span>
                                )}

                                {blocked && !isEmpty && (
                                    <span style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>
                                        🚫
                                    </span>
                                )}

                                {isEmpty && !showMenu && (
                                    <span style={{ fontSize: '7px', color: '#555' }}>[ + ]</span>
                                )}

                                {showMenu && (
                                    <ItemDropdownMenu
                                        slot={document.getElementById(uniqueKey)!}
                                        itemID={slot?.itemID || 0}
                                        amount={slot?.amount || 0}
                                        inventoryType="player"
                                        slotIndex={idx}
                                        onClose={() => setEditingSlotKey(null)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .shadow-inset {
                    box-shadow: inset 0 0 15px rgba(69, 162, 158, 0.5);
                }
                .refuel-system {
                    font-family: 'LanaPixel', Courier, monospace;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .selected-items-list::-webkit-scrollbar {
                    width: 4px;
                }
                .selected-items-list::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.2);
                }
                .selected-items-list::-webkit-scrollbar-thumb {
                    background: #45a29e;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}
