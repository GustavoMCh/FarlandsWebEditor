// src/components/modals/ItemEditModal.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ItemDetail } from '@/types/types';
import { TOOL_IDS, SINGLE_QUANTITY_TYPES } from '@/components/utils/itemValidation';

interface ItemEditModalProps {
  position: { x: number; y: number };
  slotData: { itemID: number; amount: number; isEmpty: boolean };
  onSave: (updates: { itemID: number; amount: number; isEmpty: boolean }) => void;
  onClose: () => void;
  items: ItemDetail[];
}

export default function ItemEditModal({
  position,
  slotData,
  onSave,
  onClose,
  items,
}: ItemEditModalProps) {
  const [itemID, setItemID] = useState(slotData.itemID);
  const [amount, setAmount] = useState(slotData.amount);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const itemMap = useMemo(() => {
    const map = new Map<number, ItemDetail>();
    items.forEach(item => map.set(item.id, item));
    return map;
  }, [items]);

  // Validación y guardado automático
  useEffect(() => {
    const isValid = validateItemChange(
      slotData.itemID,
      itemID,
      amount,
      itemMap,
      (msg) => alert(msg)
    );
    if (isValid) {
      onSave({ itemID, amount, isEmpty: itemID === 0 });
    }
  }, [itemID, amount]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return items.filter(
      item =>
        item.id.toString().includes(q) ||
        item.name.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [searchQuery, items]);

  const handleSelectItem = (item: ItemDetail) => {
    setItemID(item.id);
    setSearchQuery(item.name);
    setIsDropdownOpen(false);
  };

  // Evita que los clics dentro del modal cierren la ventana
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Overlay fijo: solo para cerrar al hacer clic fuera */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Modal fijo: posicionado exactamente donde debe */}
      <div
        className="fixed z-50 bg-gray-800 text-white p-4 rounded shadow-lg border border-gray-600  bg-dark"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          minWidth: '280px',
          maxWidth: '320px',
        }}
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold">Editar Slot</h4>
          <button
            onClick={onClose}
            className="text-gray-400 btn btn-danger hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Vista previa del ítem actual */}
        {itemID > 0 && (
          <div className="text-xs text-gray-300 mt-2 flex items-center gap-2">
            <img style={{width:"50px",height:"50px"}}
              src={`/static/items/Item_${itemID}.png`}
              alt={itemMap.get(itemID)?.name || 'Ítem'}
              className="w-6 h-6 object-contain"
              onError={(e) => (e.currentTarget.src = '/static/items/unknown.png')}
            />
            <div>
              {itemMap.get(itemID)?.name || 'Ítem desconocido'}
              {TOOL_IDS.has(itemID) && (
                <div className="text-yellow-400">⚠️ Herramienta: no editable</div>
              )}
            </div>
          </div>
        )}

        {/* Autocomplete con imagen */}
        <div className="mb-3 relative">
          <label className="text-xs block mb-1">Ítem</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              setIsDropdownOpen(true);
              const num = Number(val);
              if (!isNaN(num) && val.trim() !== '') {
                setItemID(num);
              } else if (val === '') {
                setItemID(0);
              }
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="ID o nombre..."
            className="w-full p-1 text-black rounded text-sm"
          />
          {isDropdownOpen && filteredItems.length > 0 && (
            <ul className="absolute z-10 w-full bg-white text-black mt-1 rounded shadow max-h-60 overflow-y-auto">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 cursor-pointer text-sm"
                  onClick={() => handleSelectItem(item)}
                >
                  <img
                    src={`/static/items/Item_${item.id}.png`}
                    alt={item.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => (e.currentTarget.src = '/static/items/unknown.png')}
                  />
                  <span>{item.id} - {item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cantidad */}
        <div className="mb-2">
          <label className="text-xs block mb-1">Cantidad</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              const num = val === '' ? 0 : Number(val);
              if (!isNaN(num) && num >= 0) {
                setAmount(num);
              }
            }}
            min={0}
            className="w-full p-1 text-black rounded text-sm"
          />
        </div>


      </div>
    </>
  );
}

// Validación local (evita import estático)
function validateItemChange(
  currentItemId: number,
  newItemId: number,
  newAmount: number,
  itemMap: Map<number, ItemDetail>,
  onWarning: (msg: string) => void
): boolean {
  if (TOOL_IDS.has(currentItemId) || TOOL_IDS.has(newItemId)) {
    onWarning("❌ No puedes modificar herramientas manualmente. Usa la sección de mejoras.");
    return false;
  }

  const newItem = itemMap.get(newItemId);
  if (newItem?.type && SINGLE_QUANTITY_TYPES.has(newItem.type)) {
    if (newAmount > 1) {
      onWarning("⚠️ Este ítem solo puede tener cantidad 1. Cantidad mayor puede causar problemas.");
    }
  }

  return true;
}