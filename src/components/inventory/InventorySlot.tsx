'use client';

import { useState, useRef } from 'react';
import { useItems } from '@/lib/useItems';
import ItemDropdownMenu from '@/components/context/ItemDropdownMenu';
import { useSaveData } from '@/components/utils/useSaveData';

interface InventorySlotProps {
  itemID: number;
  amount: number;
  isEmpty: boolean;
  slotIndex: number;
  inventoryType: 'player' | 'ship' | 'chest';
  chestIndex?: number;
}

export default function InventorySlot({
  itemID,
  amount,
  isEmpty,
  slotIndex,
  inventoryType,
  chestIndex,
}: InventorySlotProps) {
  const { items, loaded } = useItems();
  const { editingSlotKey, setEditingSlotKey } = useSaveData();
  const slotRef = useRef<HTMLDivElement>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const itemMap = new Map(items.map(item => [item.id, item]));

  if (!loaded) {
    return (
      <div
        className="slot loading relative"
        style={{ width: '75px', height: '50px', backgroundColor: '#333' }}
      />
    );
  }

  const isLocked = false; // Desactivado para permitir edición manual

  const uniqueSlotKey = `${inventoryType}-${chestIndex ?? 'none'}-${slotIndex}`;
  const showMenu = editingSlotKey === uniqueSlotKey;

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Si el ratón se ha movido más de 5 píxeles, consideramos que es un arrastre, no un clic.
    const distanceX = Math.abs(e.clientX - dragStartPos.x);
    const distanceY = Math.abs(e.clientY - dragStartPos.y);
    if (distanceX > 5 || distanceY > 5) {
      return;
    }

    if (slotRef.current) {
      setEditingSlotKey(uniqueSlotKey);
    }
  };

  const handleClose = () => {
    if (editingSlotKey === uniqueSlotKey) {
      setEditingSlotKey(null);
    }
  };

  // === DRAG & DROP HANDLERS ===
  const handleDragStart = (e: React.DragEvent) => {

    e.dataTransfer.setData('text/plain', JSON.stringify({
      inventoryType,
      slotIndex,
      chestIndex,
      itemID,
      amount,
      isEmpty
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    try {
      const source = JSON.parse(data);
      // We will dispatch a custom event that the root or context can catch to swap items, 
      // or we can implement a custom hook `useInventoryDragAction` to do it. 
      // For simplicity, let's dispatch a custom DOM event.
      const swapEvent = new CustomEvent('inventory-swap', {
        detail: {
          source,
          target: { inventoryType, slotIndex, chestIndex, itemID, amount, isEmpty }
        },
        bubbles: true
      });
      if (slotRef.current) slotRef.current.dispatchEvent(swapEvent);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      ref={slotRef}
      className={`item-slot cursor-pointer border p-1 rounded position-relative transition-all duration-200 ${showMenu ? 'border-success shadow-[0_0_10px_rgba(40,167,69,0.9)] z-10 scale-105' : 'border-gray-700 bg-gray-900'}`}
      style={{ width: '100%', aspectRatio: '1/0.66', opacity: isEmpty && !isLocked ? 0.5 : 1 }}
      data-id={itemID}
      data-quantity={amount}
      data-inventory={inventoryType}
      data-index={slotIndex}
      {...(chestIndex !== undefined ? { 'data-chest': chestIndex } : {})}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      draggable={!isEmpty}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {itemID > 0 && (
        <>
          <img
            src={`/static/items/Item_${itemID}.png`}
            alt={itemMap.get(itemID)?.name || 'Ítem'}
            className="w-full h-full object-contain"
            onError={(e) => (e.currentTarget.src = '/static/items/unknown.png')}
          />
          {amount > 1 && (
            <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 opacity-50">
              {amount}
            </div>
          )}
        </>
      )}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
          Vacío
        </div>
      )}
      {isLocked && (
        <div className="absolute top-0 right-0 p-1 m-0 text-warning" style={{ fontSize: '10px' }}>
          🔒
        </div>
      )}

      {showMenu && slotRef.current && (
        <ItemDropdownMenu
          slot={slotRef.current}
          itemID={itemID}
          amount={amount}
          inventoryType={inventoryType}
          slotIndex={slotIndex}
          chestIndex={chestIndex}
          onClose={handleClose}
        />
      )}
    </div>
  );
}