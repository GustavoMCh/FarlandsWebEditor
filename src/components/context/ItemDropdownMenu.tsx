'use client';
import { useState, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSaveData } from '@/components/utils/useSaveData';
import { ItemAutocomplete } from '@/components/utils/ItemAutocomplete';
import { useItems } from '@/lib/useItems';

declare global {
  interface Window {
    items: Array<{ id: number; name: string; procesar?: string; description?: string }>;
  }
}

interface ItemDropdownMenuProps {
  slot: HTMLElement;
  itemID: number;
  amount: number;
  inventoryType: string;
  slotIndex: number;
  chestIndex?: number;
  onClose: () => void;
}

export default function ItemDropdownMenu({
  slot,
  itemID,
  amount,
  inventoryType,
  slotIndex,
  chestIndex,
  onClose,
}: ItemDropdownMenuProps) {
  const { savedData, currentSlot, currentSlotIndex, setSavedData } = useSaveData();
  const { items: allItems } = useItems();

  const [localItemId, setLocalItemId] = useState(itemID);
  const [quantity, setQuantity] = useState(amount);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);
  const autocompleteTriggerRef = useRef<HTMLDivElement>(null);

  const row = Math.floor(slotIndex / 9) + 1;
  const col = (slotIndex % 9) + 1;

  // Posicionamiento del menú
  useLayoutEffect(() => {
    if (!menuRef.current || !slot) return;
    const rect = slot.getBoundingClientRect();
    const menu = menuRef.current;

    // Lo posicionamos absoluto respecto al inicio de la página entera (body)
    menu.style.position = 'absolute';
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
    menu.style.zIndex = '9999';

    // Evitar que se salga por la derecha
    if (rect.left + 280 > window.innerWidth) {
      menu.style.left = `${window.innerWidth - 290 + window.scrollX}px`;
    }
  }, [slot]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const num = val === '' ? 0 : Number(val);
    if (!isNaN(num) && num >= 0) {
      setQuantity(num);
    }
  };

  const handleAutocompleteSelect = (id: number) => {
    setLocalItemId(id);
    if (quantity === 0 && id !== 0) {
      setQuantity(1);
    }
    setShowAutocomplete(false);
    setSearchQuery(allItems.find(i => i.id === id)?.name || '');
  };

  const applyChanges = () => {
    if (!savedData || !currentSlot || currentSlotIndex === -1) return;

    if (quantity <= 0) {
      handleDelete();
      return;
    }

    const updatedSlotData = [...savedData.gameData.slotData];
    const current = { ...updatedSlotData[currentSlotIndex] }; // clon shallow seguro

    const finalQuantity = isTool ? 1 : quantity;

    if (inventoryType === 'player') {
      current.inventorySaveItems = [...current.inventorySaveItems];
      current.inventorySaveItems[slotIndex] = {
        itemID: localItemId,
        amount: finalQuantity,
        isEmpty: localItemId === 0,
      };
    } else if (inventoryType === 'ship') {
      current.shipInventorySaveItems = [...current.shipInventorySaveItems];
      current.shipInventorySaveItems[slotIndex] = {
        itemID: localItemId,
        amount: finalQuantity,
        isEmpty: localItemId === 0,
      };
    } else if (inventoryType === 'chest' && chestIndex !== undefined) {
      current.chestSlots = [...current.chestSlots];
      const chest = { ...current.chestSlots[chestIndex] };
      chest.itemsID = [...chest.itemsID];
      chest.itemsAmount = [...chest.itemsAmount];
      chest.itemsID[slotIndex] = localItemId;
      chest.itemsAmount[slotIndex] = localItemId === 0 ? 0 : finalQuantity;
      current.chestSlots[chestIndex] = chest;
    }

    updatedSlotData[currentSlotIndex] = current;

    setSavedData({
      ...savedData,
      gameData: {
        ...savedData.gameData,
        slotData: updatedSlotData,
      },
    });

    onClose();
  };

  const handleDelete = () => {
    setLocalItemId(0);
    setQuantity(0);
    // Para que applyChanges pille el 0 de inmediato (ya que setIsAsync) no hace falta timeout
    // Inlinemos el borrado seguro aquí mismo:
    if (!savedData || !currentSlot || currentSlotIndex === -1) return;
    const updatedSlotData = [...savedData.gameData.slotData];
    const current = { ...updatedSlotData[currentSlotIndex] };

    if (inventoryType === 'player') {
      current.inventorySaveItems = [...current.inventorySaveItems];
      current.inventorySaveItems[slotIndex] = { itemID: 0, amount: 0, isEmpty: true };
    } else if (inventoryType === 'ship') {
      current.shipInventorySaveItems = [...current.shipInventorySaveItems];
      current.shipInventorySaveItems[slotIndex] = { itemID: 0, amount: 0, isEmpty: true };
    } else if (inventoryType === 'chest' && chestIndex !== undefined) {
      current.chestSlots = [...current.chestSlots];
      const chest = { ...current.chestSlots[chestIndex] };
      chest.itemsID = [...chest.itemsID];
      chest.itemsAmount = [...chest.itemsAmount];
      chest.itemsID[slotIndex] = 0;
      chest.itemsAmount[slotIndex] = 0;
      current.chestSlots[chestIndex] = chest;
    }

    updatedSlotData[currentSlotIndex] = current;
    setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: updatedSlotData } });
    onClose();
  };

  const selectedItem = allItems.find(i => i.id === localItemId);
  const description = selectedItem?.name || 'Sin nombre disponible.';

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
  const isTool = allToolsFlat.includes(localItemId);

  // Determinar tamaño de la matriz basado en el inventario activo
  let totalSlots = 27; // Inventario normal por defecto
  let occupiedSlots: boolean[] = [];

  if (savedData && currentSlot && currentSlotIndex !== -1) {
    if (inventoryType === 'player' && currentSlot.inventorySaveItems) {
      totalSlots = currentSlot.inventorySaveItems.length;
      occupiedSlots = currentSlot.inventorySaveItems.map(s => !s.isEmpty && s.itemID > 0);
    } else if (inventoryType === 'ship' && currentSlot.shipInventorySaveItems) {
      totalSlots = currentSlot.shipInventorySaveItems.length;
      occupiedSlots = currentSlot.shipInventorySaveItems.map(s => !s.isEmpty && s.itemID > 0);
    } else if (inventoryType === 'chest' && chestIndex !== undefined && currentSlot.chestSlots && currentSlot.chestSlots[chestIndex]) {
      totalSlots = currentSlot.chestSlots[chestIndex].itemsID.length;
      occupiedSlots = currentSlot.chestSlots[chestIndex].itemsID.map(id => id > 0);
    }
  }

  const handleMoveItem = (targetIndex: number) => {
    if (targetIndex === slotIndex) return; // Mover al mismo sitio no hace nada

    const swapEvent = new CustomEvent('inventory-swap', {
      detail: {
        source: { inventoryType, slotIndex, chestIndex, itemID, amount, isEmpty: itemID === 0 },
        target: { inventoryType, slotIndex: targetIndex, chestIndex, itemID: 0, amount: 0, isEmpty: true }
      },
      bubbles: true
    });
    window.dispatchEvent(swapEvent);
    onClose();
  };

  const menuContent = (
    <>
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: document.documentElement.scrollHeight, zIndex: 9998 }}
        onClick={onClose}
      />

      <div
        ref={menuRef}
        className="dropdown-menu show bg-dark text-light border border-primary shadow"
        style={{ width: '320px', padding: '12px', zIndex: 9999, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-light small mb-2 d-flex justify-content-between align-items-center">
          <span>Editar Ranura: <strong>{row}-{col}</strong></span>
          <button className="btn-close btn-close-white" style={{ fontSize: '0.6rem' }} onClick={onClose}></button>
        </div>

        {/* --- Sección: Ítem y Cantidad --- */}
        <div className="d-flex gap-2 mb-3 align-items-end">
          <div className="flex-grow-1" style={{ maxWidth: '165px' }}>
            <label className="small text-primary mb-1 fw-bold">Ítem</label>
            <div
              ref={autocompleteTriggerRef}
              className="form-control bg-secondary text-light cursor-pointer d-flex align-items-center"
              onClick={() => setShowAutocomplete(true)}
              style={{ height: '36px' }}
            >
              {localItemId > 0 ? (
                <>
                  <img src={`/static/items/Item_${localItemId}.png`} alt="" width="24" height="24" className="me-2" onError={(e) => (e.currentTarget.src = '/static/items/unknown.png')} />
                  <span className="text-truncate">{allItems.find(i => i.id === localItemId)?.name || `ID ${localItemId}`}</span>
                </>
              ) : (
                <span className="text-muted">Seleccionar ítem...</span>
              )}
            </div>
          </div>
          <div style={{ width: '80px', minWidth: '70px' }}>
            <label className="small text-primary mb-1 fw-bold">Cant.</label>
            <input type="number" className="form-control bg-secondary text-light px-2" value={isTool ? 1 : quantity} onChange={handleQuantityChange} min="0" max="999" style={{ height: '36px' }} disabled={isTool} title={isTool ? "Las herramientas fijan su cantidad a 1" : ""} />
          </div>
        </div>

        {/* --- Sección: Mover (Grid Visual) --- */}
        <div className="mb-3">
          <label className="small text-primary mb-1 fw-bold">Mover de Posición</label>
          {isTool ? (
            <div className="p-2 border border-warning rounded text-center" style={{ backgroundColor: 'rgba(255,193,7,0.1)' }}>
              <small className="text-warning"><i className="fa-solid fa-lock me-1"></i>Las herramientas no se pueden mover.</small>
            </div>
          ) : (
            <div
              className="d-grid gap-1 p-2 bg-secondary rounded"
              style={{ gridTemplateColumns: 'repeat(9, 1fr)', backgroundColor: 'rgba(0,0,0,0.3)' }}
            >
              {Array.from({ length: totalSlots }).map((_, idx) => {
                const isCurrent = idx === slotIndex;
                const isOccupied = occupiedSlots[idx];

                let bgColor = 'bg-dark';
                let borderColor = 'border-secondary';

                if (isCurrent) {
                  bgColor = 'bg-primary';
                  borderColor = 'border-primary';
                } else if (isOccupied) {
                  bgColor = 'bg-secondary';
                  borderColor = 'border-warning';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleMoveItem(idx)}
                    className={`border rounded cursor-pointer text-center hover-bg-secondary ${bgColor} ${borderColor}`}
                    style={{
                      height: '24px',
                      fontSize: '10px',
                      lineHeight: '22px',
                      color: isCurrent ? 'white' : (isOccupied ? '#ffc107' : 'transparent'),
                      opacity: isCurrent ? 1 : (isOccupied ? 0.7 : 0.4)
                    }}
                    title={`Slot ${idx} (Fila ${Math.floor(idx / 9) + 1}, Col ${(idx % 9) + 1})${isOccupied && !isCurrent ? ' - Ocupado' : ''}`}
                  >
                    {isCurrent ? '✓' : (isOccupied ? '■' : '')}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- Sección: Acciones (Guardar / Borrar) --- */}
        <div className="d-flex justify-content-between mt-2 pt-2 border-top border-secondary">
          <button className={`btn btn-sm ${isTool ? 'btn-secondary' : 'btn-danger'} d-flex align-items-center gap-2`} onClick={isTool ? undefined : handleDelete} disabled={isTool} title={isTool ? "No puedes borrar herramientas" : ""}>
            <i className="fa-solid fa-trash"></i> Borrar
          </button>
          <button className="btn btn-sm btn-success d-flex align-items-center gap-2" onClick={applyChanges}>
            <i className="fa-solid fa-save"></i> Guardar
          </button>
        </div>

        {/* Autocomplete Flotante */}
        {showAutocomplete && (
          <div style={{ position: 'fixed', zIndex: 1110, top: 0, left: 0 }}>
            <ItemAutocomplete
              onSelect={(id) => { handleAutocompleteSelect(id); setShowAutocomplete(false); }}
              onClose={() => setShowAutocomplete(false)}
              targetRef={autocompleteTriggerRef}
              originalItemId={localItemId}
            />
          </div>
        )}
      </div>
    </>
  );

  return createPortal(menuContent, document.body);
}