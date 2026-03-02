'use client';

import React, { useState, useRef } from 'react';
import { useItems } from '@/lib/useItems';
import { SpawnMenu } from './SpawnMenu';
import { useSaveData } from '@/components/utils/useSaveData';
import { SlotData } from '@/types/types';

// ── helper: compute total quantity of an item across all inventories/chests ──
function computeInventoryTotal(itemId: number, slot: SlotData): { total: number; breakdown: string[] } {
    const breakdown: string[] = [];
    let total = 0;

    // Player inventory
    const playerQty = slot.inventorySaveItems
        ?.filter(s => !s.isEmpty && s.itemID === itemId)
        .reduce((acc, s) => acc + (s.amount || 0), 0) ?? 0;
    if (playerQty > 0) {
        total += playerQty;
        breakdown.push(`Mochila: ×${playerQty}`);
    }

    // Ship inventory
    const shipQty = slot.shipInventorySaveItems
        ?.filter(s => !s.isEmpty && s.itemID === itemId)
        .reduce((acc, s) => acc + (s.amount || 0), 0) ?? 0;
    if (shipQty > 0) {
        total += shipQty;
        breakdown.push(`Nave: ×${shipQty}`);
    }

    // Chests
    slot.chestSlots?.forEach((chest, ci) => {
        const chestQty = chest.itemsID?.reduce((acc, id, idx) => {
            if (id === itemId) return acc + (chest.itemsAmount?.[idx] ?? 1);
            return acc;
        }, 0) ?? 0;
        if (chestQty > 0) {
            total += chestQty;
            breakdown.push(`Cofre ${ci + 1}: ×${chestQty}`);
        }
    });

    return { total, breakdown };
}

export default function ItemExplorerTab() {
    const { items, loading } = useItems();
    const { savedData } = useSaveData();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    // Tooltip state — uses fixed viewport coords so scroll doesn't affect it
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number; y: number;
        placement: 'above-center' | 'right' | 'below-center';
        content: string[];
    }>({ visible: false, x: 0, y: 0, placement: 'above-center', content: [] });
    const containerRef = useRef<HTMLDivElement>(null);

    if (loading) {
        return (
            <div className="card bg-dark border-primary my-3">
                <div className="card-body text-center p-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Cargando catálogo de ítems...</p>
                </div>
            </div>
        );
    }

    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.id.toString() === searchQuery
    );

    const selectedItemName = selectedItemId ? items.find(i => i.id === selectedItemId)?.name || `ID ${selectedItemId}` : '';

    // Current slot (for inventory lookup)
    const currentSlot = savedData?.gameData?.slotData?.[savedData.gameData.currentSlot ?? 0];

    const handleMouseEnter = (
        e: React.MouseEvent<HTMLDivElement>,
        item: { id: number; name: string },
        breakdown: string[],
        total: number
    ) => {
        e.currentTarget.classList.replace('border-secondary', 'border-warning');
        const rect = e.currentTarget.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();

        // Detect edge cases using viewport coords
        const isNearLeft = containerRect ? (rect.left - containerRect.left) < 90 : rect.left < 120;
        const isNearTop = containerRect ? (rect.top - containerRect.top) < 90 : rect.top < 120;

        let placement: 'above-center' | 'right' | 'below-center';
        let x: number;
        let y: number;

        if (isNearLeft) {
            placement = 'right';
            x = rect.right + 8;
            y = rect.top + rect.height / 2;
        } else if (isNearTop) {
            placement = 'below-center';
            x = rect.left + rect.width / 2;
            y = rect.bottom + 8;
        } else {
            placement = 'above-center';
            x = rect.left + rect.width / 2;
            y = rect.top - 8;
        }

        const content = [
            `${item.name} (ID: ${item.id})`,
            ...(total > 0 ? [`Total en inventario: ×${total}`, ...breakdown] : []),
        ];
        setTooltip({ visible: true, x, y, placement, content });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, inInventory: boolean) => {
        e.currentTarget.classList.replace('border-warning', inInventory ? 'border-success' : 'border-secondary');
        setTooltip(t => ({ ...t, visible: false }));
    };

    return (
        <div className="card bg-dark border-primary my-3 w-100">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-0"><i className="fa-solid fa-book-open me-2"></i>Catálogo de Ítems</h4>
                <input
                    type="text"
                    placeholder="Buscar ítem por nombre o ID..."
                    className="form-control bg-dark text-light border-light w-auto mt-2 mt-md-0"
                    style={{ width: '250px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="card-body">
                <p className="text-muted small mb-2">
                    Selecciona cualquier ítem del catálogo para inyectarlo en el Inventario del Jugador, en la Nave o en un Cofre.
                    Mostrando {filteredItems.length} ítems.
                    {currentSlot && (
                        <span className="ms-2 badge bg-success">
                            <i className="fa-solid fa-circle-check me-1"></i>Los ítems con borde verde están en tu inventario/cofres
                        </span>
                    )}
                </p>

                {/* Grid container — position:relative for tooltip */}
                <div
                    ref={containerRef}
                    className="d-flex flex-wrap gap-2 justify-content-center"
                    style={{ maxHeight: '600px', overflowY: 'auto', padding: '10px', position: 'relative' }}
                >
                    {filteredItems.map(item => {
                        const { total, breakdown } = currentSlot
                            ? computeInventoryTotal(item.id, currentSlot)
                            : { total: 0, breakdown: [] };
                        const inInventory = total > 0;

                        return (
                            <div
                                key={item.id}
                                className={`bg-secondary rounded border cursor-pointer d-flex justify-content-center align-items-center ${inInventory ? 'border-success' : 'border-secondary'}`}
                                style={{
                                    width: '72px',
                                    height: '72px',
                                    position: 'relative',
                                    transition: 'border-color 0.15s, box-shadow 0.15s',
                                    boxShadow: inInventory ? '0 0 6px 2px rgba(40,167,69,0.5)' : undefined,
                                    cursor: 'pointer',
                                }}
                                onClick={() => setSelectedItemId(item.id)}
                                onMouseEnter={(e) => handleMouseEnter(e, item, breakdown, total)}
                                onMouseLeave={(e) => handleMouseLeave(e, inInventory)}
                            >
                                <img
                                    src={`/static/items/Item_${item.id}.png`}
                                    alt={item.name}
                                    width="64"
                                    height="64"
                                    onError={(e) => (e.currentTarget.src = '/static/items/unknown.png')}
                                />
                                {/* ID badge */}
                                <span
                                    className="position-absolute bottom-0 end-0 bg-dark text-white rounded px-1 fw-bold"
                                    style={{ fontSize: '10px', opacity: 0.9, transform: 'translate(-2px, -2px)' }}
                                >
                                    {item.id}
                                </span>
                                {/* Quantity badge (only if in inventory) */}
                                {inInventory && (
                                    <span
                                        className="position-absolute top-0 start-0 bg-success text-white rounded px-1 fw-bold"
                                        style={{ fontSize: '10px', opacity: 0.95, transform: 'translate(2px, 2px)' }}
                                    >
                                        ×{total}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    {filteredItems.length === 0 && (
                        <div className="text-center text-muted w-100 py-4">
                            No se encontraron ítems con esa búsqueda.
                        </div>
                    )}

                    {/* Custom tooltip — rendered here just as a placeholder; real one is portaled below */}
                </div>
            </div>

            {selectedItemId && (
                <SpawnMenu
                    isOpen={true}
                    itemId={selectedItemId}
                    itemName={selectedItemName}
                    onClose={() => setSelectedItemId(null)}
                />
            )}

            {/* Tooltip fixed to viewport — unaffected by scroll */}
            {tooltip.visible && (
                <div
                    style={{
                        position: 'fixed',
                        left: tooltip.x,
                        top: tooltip.y,
                        transform:
                            tooltip.placement === 'above-center' ? 'translate(-50%, -100%)' :
                                tooltip.placement === 'right' ? 'translate(0, -50%)' :
                                    'translate(-50%, 0)',
                        background: 'rgba(20,20,30,0.97)',
                        border: '1px solid #6c757d',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        minWidth: '160px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {tooltip.content.map((line, i) => (
                        <div
                            key={i}
                            style={{
                                fontSize: i === 0 ? '13px' : '11px',
                                fontWeight: i === 0 ? 700 : 400,
                                color: i === 0 ? '#f8f9fa' : i === 1 ? '#28a745' : '#adb5bd',
                                marginTop: i === 2 ? '2px' : 0,
                            }}
                        >
                            {i === 0 && <i className="fa-solid fa-cube me-1" style={{ fontSize: '11px' }}></i>}
                            {line}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
