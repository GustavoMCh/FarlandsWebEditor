// src/components/utils/ItemAutocomplete.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useItems } from '@/lib/useItems';
import { useSaveData } from '@/components/utils/useSaveData';
import styles from './ItemAutocomplete.module.css';

interface ItemAutocompleteProps {
  onSelect: (id: number) => void;
  onClose: () => void;
  targetRef: React.RefObject<HTMLElement | null>;
  originalItemId?: number; // ← para saber qué ítem había antes de abrir el menú
}

export const ItemAutocomplete = ({ onSelect, onClose, targetRef, originalItemId = 0 }: ItemAutocompleteProps) => {
  const { items, loading } = useItems();
  const { savedData } = useSaveData();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Familias de herramientas conocidas por sus IDs base
  const TOOL_FAMILIES = {
    hachas: [1, 281, 282, 283],
    azadas: [2, 284, 285, 286],
    picos: [3, 278, 279, 280],
    hoces: [4, 287, 288, 289],
    canas: [5, 290, 291, 292],
    redes: [6, 298, 299, 300],
    regaderas: [22, 293, 294, 295],
  };

  const allToolsFlat = Object.values(TOOL_FAMILIES).flat();

  // Determinar si el slot original era una herramienta de alguna familia específica
  const getOriginalFamily = (id: number) => {
    return Object.values(TOOL_FAMILIES).find(family => family.includes(id)) || null;
  };

  const originalFamily = getOriginalFamily(originalItemId);
  const isTargetingTool = originalFamily !== null;

  // Filtrar ítems - Aplicar regla estricta de herramietas
  const filteredItems = items
    .filter(item => {
      // Regla principal:
      // - Si el hueco tenía un hacha, SOLO puedes buscar/ver otras hachas.
      // - Si el hueco NO era una herramienta, NUNCA puedes buscar/ver ninguna herramienta.
      if (isTargetingTool) {
        if (!originalFamily.includes(item.id)) return false;
      } else {
        if (allToolsFlat.includes(item.id)) return false;
      }

      // Filtro de texto normal
      return item.id.toString().includes(query) || item.name.toLowerCase().includes(query.toLowerCase());
    })
    .slice(0, 43); // Tomamos 43 para saber si hay más de 42

  const showMoreIndicator = filteredItems.length > 42;
  const displayItems = showMoreIndicator ? filteredItems.slice(0, 42) : filteredItems;

  const getQuantityInfo = (itemId: number) => {
    // Si es una herramienta no mostramos cantitad total (solo hay 1 válida)
    if (!savedData || itemId === 0 || allToolsFlat.includes(itemId)) return { total: 0, breakdown: '' };

    let total = 0;
    let player = 0;
    let ship = 0;
    let chests = 0;

    savedData.gameData.slotData.forEach(slot => {
      slot.inventorySaveItems?.forEach(i => {
        if (i && i.itemID === itemId) { total += i.amount || 0; player += i.amount || 0; }
      });
      slot.shipInventorySaveItems?.forEach(i => {
        if (i && i.itemID === itemId) { total += i.amount || 0; ship += i.amount || 0; }
      });
      slot.chestSlots?.forEach(chest => {
        chest?.itemsID?.forEach((id, index) => {
          if (id === itemId) {
            const amt = chest?.itemsAmount?.[index] || 0;
            total += amt;
            chests += amt;
          }
        });
      });
    });

    let breakdown = '';
    if (total > 0) {
      const parts = [];
      if (player > 0) parts.push(`${player} en Jugador`);
      if (ship > 0) parts.push(`${ship} en Nave`);
      if (chests > 0) parts.push(`${chests} en Cofres`);
      breakdown = parts.join(' | ');
    }

    return { total, breakdown };
  };

  // Posicionar el dropdown justo debajo del target (y anclado al documento para que haga scroll natural)
  useEffect(() => {
    if (!targetRef.current || !dropdownRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const dropdown = dropdownRef.current;

    dropdown.style.position = 'absolute';
    dropdown.style.left = `${Math.min(targetRect.left + window.scrollX, window.innerWidth - 300)}px`;
    dropdown.style.top = `${targetRect.bottom + window.scrollY}px`;
    // Ancho ajustado para acomodar iconos de 40px u list view con margen
    dropdown.style.width = `340px`;
    dropdown.style.zIndex = '10000'; // Mayor que el z-index de 9999 del ItemDropdownMenu
  }, [targetRef]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        targetRef.current &&
        !targetRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, targetRef]);

  const handleSelect = (id: number) => {
    onSelect(id);
    onClose();
  };

  // Usar Portal para montar el menú flotante en el body y evitar problemas de contención
  if (!isOpen) return null;

  if (typeof document === 'undefined') return null;
  const { createPortal } = require('react-dom');

  return createPortal(
    <div ref={dropdownRef} className={styles.dropdown}>
      <div className={styles.headerContainer}>
        <input
          type="text"
          placeholder="Buscar ítem..."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className={styles.toggleBtn}
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          title={viewMode === 'grid' ? "Cambiar a vista de lista" : "Cambiar a vista de cuadrícula"}
        >
          <i className={viewMode === 'grid' ? "fa-solid fa-list-ul" : "fa-solid fa-table-cells-large"}></i>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '8px', textAlign: 'center' }}>Cargando...</div>
      ) : displayItems.length === 0 ? (
        <div style={{ padding: '8px', textAlign: 'center' }}>Nada encontrado</div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className={styles.itemsGrid}>
              {displayItems.map((item) => {
                const { total, breakdown } = getQuantityInfo(item.id);
                return (
                  <div
                    key={item.id}
                    className={styles.itemGridSlot}
                    onClick={() => handleSelect(item.id)}
                    data-tooltip={`${item.name}${item.procesar ? ` (${item.procesar})` : ''}\nID: #${item.id}${total > 0 ? `\nTienes: ${total}\n(${breakdown})` : ''}`}
                  >
                    {item.procesar && (
                      <span className={styles.procBadgeGrid}>{item.procesar}</span>
                    )}
                    <img
                      src={`/static/items/Item_${item.id}.png`}
                      alt=""
                      className={styles.itemImageGrid}
                      onError={(e) => (e.currentTarget.src = '/static/items/unknown.png')}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.itemsList}>
              {displayItems.map((item) => {
                const { total, breakdown } = getQuantityInfo(item.id);
                return (
                  <div
                    key={item.id}
                    className={styles.itemListRow}
                    onClick={() => handleSelect(item.id)}
                    title={total > 0 ? breakdown : ''}
                  >
                    <img
                      src={`/static/items/Item_${item.id}.png`}
                      alt={item.name}
                      className={styles.itemImageList}
                      onError={(e) => (e.currentTarget.src = '/static/items/unknown.png')}
                    />
                    <div className={styles.itemInfoList}>
                      <div className="d-flex align-items-center gap-2">
                        <span className={styles.itemIdList}>#{item.id}</span>
                        {item.procesar && (
                          <span className={styles.procBadgeList}>{item.procesar}</span>
                        )}
                        {total > 0 && (
                          <span className="badge bg-secondary" style={{ fontSize: '9px' }} title={breakdown}>
                            Tienes {total}
                          </span>
                        )}
                      </div>
                      <span className={styles.itemNameList}>{item.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {showMoreIndicator && (
            <div className={styles.moreIndicator}>Hay más resultados... afina la búsqueda.</div>
          )}
        </>
      )}
    </div>,
    document.body
  );
};