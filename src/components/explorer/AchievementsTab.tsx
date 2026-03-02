'use client';

import React, { useState } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';

const TOTAL_ACHIEVEMENTS = 50; // Logros_01 to Logros_50 (51 is empty/placeholder)

export default function AchievementsTab() {
    const { currentSlot } = useSaveData();
    const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

    const unlockedSet = new Set<number>(currentSlot?.achievementsUnlocked ?? []);
    const unlockedCount = [...Array(TOTAL_ACHIEVEMENTS).keys()]
        .map(i => i + 1)
        .filter(n => unlockedSet.has(n)).length;

    const achievements = Array.from({ length: TOTAL_ACHIEVEMENTS }, (_, i) => {
        const num = i + 1;
        return { num, unlocked: unlockedSet.has(num) };
    }).filter(a => {
        if (filter === 'unlocked') return a.unlocked;
        if (filter === 'locked') return !a.unlocked;
        return true;
    });

    return (
        <div className="card bg-dark border-warning my-3 w-100">
            <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h4 className="mb-0">🏆 Logros</h4>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                    <span className="badge bg-dark text-warning fs-6">
                        {unlockedCount} / {TOTAL_ACHIEVEMENTS} desbloqueados
                    </span>
                    <div className="btn-group btn-group-sm">
                        <button
                            className={`btn ${filter === 'all' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setFilter('all')}
                        >Todos</button>
                        <button
                            className={`btn ${filter === 'unlocked' ? 'btn-success' : 'btn-outline-dark'}`}
                            onClick={() => setFilter('unlocked')}
                        >✅ Obtenidos</button>
                        <button
                            className={`btn ${filter === 'locked' ? 'btn-secondary' : 'btn-outline-dark'}`}
                            onClick={() => setFilter('locked')}
                        >🔒 Pendientes</button>
                    </div>
                </div>
            </div>

            <div className="card-body">
                {/* Progress bar */}
                <div className="mb-3">
                    <div className="progress" style={{ height: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)' }}>
                        <div
                            className="progress-bar bg-warning"
                            style={{ width: `${(unlockedCount / TOTAL_ACHIEVEMENTS) * 100}%`, transition: 'width 0.5s' }}
                        />
                    </div>
                    <small className="text-muted mt-1 d-block text-end">
                        {Math.round((unlockedCount / TOTAL_ACHIEVEMENTS) * 100)}% completado
                    </small>
                </div>

                <div
                    className="d-flex flex-wrap gap-3 justify-content-center"
                    style={{ maxHeight: '600px', overflowY: 'auto', padding: '10px' }}
                >
                    {achievements.map(({ num, unlocked }) => {
                        const pad = String(num).padStart(2, '0');
                        return (
                            <div
                                key={num}
                                title={`Logro #${num}${unlocked ? ' ✅ Desbloqueado' : ' 🔒 Bloqueado'}`}
                                style={{
                                    position: 'relative',
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '10px',
                                    border: unlocked ? '2px solid #ffc107' : '2px solid #495057',
                                    boxShadow: unlocked ? '0 0 8px 2px rgba(255,193,7,0.4)' : undefined,
                                    overflow: 'hidden',
                                    background: '#1a1a2e',
                                    transition: 'box-shadow 0.2s',
                                    cursor: 'default',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src={`/static/logros/Logros_${pad}.png`}
                                    alt={`Logro ${num}`}
                                    width={64}
                                    height={64}
                                    style={{
                                        imageRendering: 'pixelated',
                                        filter: unlocked ? 'none' : 'grayscale(1) brightness(0.3)',
                                        transition: 'filter 0.2s',
                                    }}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                {/* Lock overlay */}
                                {!unlocked && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            fontSize: '22px',
                                            opacity: 0.7,
                                        }}
                                    >🔒</span>
                                )}
                                {/* Number badge */}
                                <span
                                    style={{
                                        position: 'absolute',
                                        bottom: '2px',
                                        right: '4px',
                                        fontSize: '9px',
                                        color: unlocked ? '#ffc107' : '#6c757d',
                                        fontWeight: 700,
                                    }}
                                >#{num}</span>
                            </div>
                        );
                    })}

                    {achievements.length === 0 && (
                        <div className="text-center text-muted w-100 py-5">
                            No hay logros en esta categoría.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
