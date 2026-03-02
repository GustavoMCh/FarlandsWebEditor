'use client';

import { useState, useMemo } from 'react';
import { useSaveData } from '../utils/useSaveData';
import { ARCA_DATA } from '@/lib/arca_data';

export default function ArcaTab() {
    const { savedData, currentSlotIndex, currentSlot, setSavedData } = useSaveData();
    const [filter, setFilter] = useState<'all' | 'discovered' | 'locked'>('all');

    // Stats calculation
    const stats = useMemo(() => {
        if (!currentSlot) return { total: 0, discovered: 0, percent: 0, categories: [] };

        const discoveredIds = currentSlot.arcaItemsDiscovered || [];
        let totalItems = 0;
        let totalDiscovered = 0;

        const categoryStats = ARCA_DATA.map(cat => {
            const catTotal = cat.items.length;
            const catDiscovered = cat.items.filter(item => discoveredIds.includes(item.id)).length;
            totalItems += catTotal;
            totalDiscovered += catDiscovered;
            return {
                name: cat.category,
                total: catTotal,
                discovered: catDiscovered,
                percent: (catDiscovered / catTotal) * 100
            };
        });

        return {
            total: totalItems,
            discovered: totalDiscovered,
            percent: (totalDiscovered / totalItems) * 100,
            categories: categoryStats
        };
    }, [currentSlot]);

    if (!savedData || !currentSlot) {
        return (
            <div className="text-center p-5">
                <p>Selecciona una partida para ver el progreso del Arca.</p>
            </div>
        );
    }

    const discoveredItems = currentSlot.arcaItemsDiscovered || [];

    const updateSaveData = (newDiscovered: number[]) => {
        const newSlotData = [...savedData.gameData.slotData];
        // Recalculate global percent for the save file too
        const totalItems = ARCA_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
        const newPercent = newDiscovered.length / totalItems;

        newSlotData[currentSlotIndex] = {
            ...newSlotData[currentSlotIndex],
            arcaItemsDiscovered: newDiscovered,
            arcaCurrentProgress: newPercent
        };

        setSavedData({
            ...savedData,
            gameData: { ...savedData.gameData, slotData: newSlotData },
        });
    };

    const toggleItem = (itemId: number) => {
        const isDiscovered = discoveredItems.includes(itemId);
        let newDiscovered = [...discoveredItems];

        if (isDiscovered) {
            newDiscovered = newDiscovered.filter((id) => id !== itemId);
        } else {
            newDiscovered.push(itemId);
        }
        updateSaveData(newDiscovered);
    };

    const filteredData = ARCA_DATA.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => {
            const isDiscovered = discoveredItems.includes(item.id);
            if (filter === 'discovered') return isDiscovered;
            if (filter === 'locked') return !isDiscovered;
            return true;
        }),
    })).filter((cat) => cat.items.length > 0);

    return (
        <div className="container-fluid p-0 pb-5">
            <div className="card bg-dark border-primary mb-4 shadow">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h3 className="text-primary mb-0">🏺 Donaciones del Arca</h3>
                        <div className="text-end">
                            <div className="badge bg-primary fs-6 mb-1">
                                Nivel {currentSlot.arcaCurrentLevel || 0}
                            </div>
                            <div className="text-info small">{stats.discovered} / {stats.total} items</div>
                        </div>
                    </div>

                    <div className="progress mb-3" style={{ height: '14px', borderRadius: '7px' }}>
                        <div
                            className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: `${stats.percent}%` }}
                            aria-valuenow={stats.percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            {stats.percent > 10 && `${stats.percent.toFixed(1)}%`}
                        </div>
                    </div>

                    <div className="btn-group w-100 shadow-sm">
                        <button
                            className={`btn btn-outline-primary ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            Todos
                        </button>
                        <button
                            className={`btn btn-outline-success ${filter === 'discovered' ? 'active' : ''}`}
                            onClick={() => setFilter('discovered')}
                        >
                            Donados
                        </button>
                        <button
                            className={`btn btn-outline-warning ${filter === 'locked' ? 'active' : ''}`}
                            onClick={() => setFilter('locked')}
                        >
                            Pendientes
                        </button>
                    </div>
                </div>
            </div>

            <div className="arca-sections">
                {filteredData.map((cat) => {
                    const catStat = stats.categories.find(s => s.name === cat.category);
                    return (
                        <div key={cat.category} className="card bg-dark border-secondary mb-4 shadow-sm overflow-hidden">
                            <div className="card-header bg-secondary bg-opacity-75 text-white py-2 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fs-6 fw-bold">{cat.category}</h5>
                                <small className="badge bg-dark bg-opacity-50">
                                    {catStat?.percent.toFixed(0)}% ({catStat?.discovered}/{catStat?.total})
                                </small>
                            </div>
                            <div className="card-body p-3">
                                <p className="text-info small opacity-75 mb-3 border-start border-info ps-2" style={{ fontStyle: 'italic' }}>
                                    {cat.description}
                                </p>
                                <div className="d-flex flex-wrap gap-2">
                                    {cat.items.map((item) => {
                                        const isDiscovered = discoveredItems.includes(item.id);
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => toggleItem(item.id)}
                                                className={`d-flex align-items-center gap-2 p-2 border rounded transition-all item-card ${isDiscovered
                                                        ? 'border-success bg-success bg-opacity-10 text-success'
                                                        : 'border-secondary bg-black bg-opacity-25 text-muted'
                                                    }`}
                                                style={{ minWidth: '220px', flex: '1 1 calc(25% - 0.75rem)', cursor: 'pointer' }}
                                                title={isDiscovered ? item.name : 'Ítem no descubierto'}
                                            >
                                                <div
                                                    className="flex-shrink-0"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundImage: `url(/static/items/Item_${item.id}.png)`,
                                                        backgroundSize: 'contain',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'center',
                                                        imageRendering: 'pixelated',
                                                        filter: isDiscovered ? 'none' : 'grayscale(1) brightness(0.3) contrast(1.2)'
                                                    }}
                                                />
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <div className={`fw-bold text-truncate ${!isDiscovered ? 'opacity-50' : ''}`} style={{ fontSize: '0.85rem' }}>
                                                        {isDiscovered ? item.name : '???'}
                                                    </div>
                                                    {(item.planet || item.source) && (
                                                        <div className="x-small text-truncate opacity-50" style={{ fontSize: '0.7rem' }}>
                                                            {item.planet && <span className="me-1">🌍 {item.planet}</span>}
                                                            {item.source && <span>🔍 {item.source}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                                {isDiscovered && <span className="text-success fw-bold">✓</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
        .item-card:hover {
          filter: brightness(1.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.5);
        }
        .item-card {
          border-width: 2px !important;
          transition: all 0.2s ease-in-out;
          user-select: none;
        }
        .item-card.text-muted:hover {
          color: #fff !important;
          border-color: #6c757d !important;
        }
      `}</style>
        </div>
    );
}
