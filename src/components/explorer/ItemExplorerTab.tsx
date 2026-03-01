'use client';

import React, { useState } from 'react';
import { useItems } from '@/lib/useItems';
import { SpawnMenu } from './SpawnMenu';

export default function ItemExplorerTab() {
    const { items, loading } = useItems();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

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
                <p className="text-muted small mb-3">
                    Selecciona cualquier ítem del catálogo para inyectarlo en el Inventario del Jugador, en la Nave o en un Cofre.
                    Mostrando {filteredItems.length} ítems.
                </p>
                <div className="d-flex flex-wrap gap-2 justify-content-center" style={{ maxHeight: '600px', overflowY: 'auto', padding: '10px' }}>
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className="bg-secondary rounded border border-secondary cursor-pointer hover-border-primary d-flex justify-content-center align-items-center"
                            style={{ width: '72px', height: '72px', position: 'relative', transition: 'border 0.2s' }}
                            title={`${item.name} (ID: ${item.id})`}
                            onClick={() => setSelectedItemId(item.id)}
                            onMouseEnter={(e) => e.currentTarget.classList.replace('border-secondary', 'border-primary')}
                            onMouseLeave={(e) => e.currentTarget.classList.replace('border-primary', 'border-secondary')}
                        >
                            <img
                                src={`/static/items/Item_${item.id}.png`}
                                alt={item.name}
                                width="64"
                                height="64"
                                onError={(e) => (e.currentTarget.src = '/static/items/unknown.png')}
                            />
                            <span
                                className="position-absolute bottom-0 end-0 bg-dark text-white rounded px-1 fw-bold"
                                style={{ fontSize: '10px', opacity: 0.9, transform: 'translate(-2px, -2px)' }}
                            >
                                {item.id}
                            </span>
                        </div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="text-center text-muted w-100 py-4">
                            No se encontraron ítems con esa búsqueda.
                        </div>
                    )}
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
        </div>
    );
}
