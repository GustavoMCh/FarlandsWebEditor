'use client';

import { useEffect, useRef } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';

// Asegurar acceso a window.items
declare global {
  interface Window {
    items: Array<{
      id: number;
      name: string;
      procesar?: string;
    }>;
  }
}

export default function ManualIdModal() {
  const { savedData, currentSlotIndex, currentSlot, setSavedData } = useSaveData();

  // === Referencias DOM ===
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const warningRef = useRef<HTMLDivElement>(null);

  // === Estado local: slot seleccionado ===
  let selectedSlot: HTMLElement | null = null;

  // === Función para abrir el modal desde otro componente ===
  const openModal = (slot: HTMLElement) => {
    if (!savedData ||  !currentSlot) return;

    selectedSlot = slot;

    // Obtener datos actuales del slot
    const itemId = parseInt(slot.getAttribute('data-id') || '0');
    const qty = parseInt(slot.getAttribute('data-quantity') || '1');

    // Mostrar modal
    if (modalRef.current) {
      modalRef.current.style.display = 'block';
    }

    if (inputRef.current) {
      inputRef.current.value = itemId.toString();
      inputRef.current.focus();
    }

    validateId(itemId);
  };

  // === Validar si el ID existe en items.json ===
  const validateId = (id: number) => {
    if (!window.items) return;

    const exists = window.items.some(item => item.id === id);
    if (warningRef.current) {
      warningRef.current.style.display = exists ? 'none' : 'block';
    }
  };

  // === Aplicar nuevo ID al ítem ===
  const applyNewId = () => {
    if (!selectedSlot || !inputRef.current || !savedData) return;

    const newId = parseInt(inputRef.current.value) || 0;
    const min = 0,
      max = 503;
    if (newId < min || newId > max) {
      alert(`ID debe estar entre ${min} y ${max}`);
      return;
    }

    const inventoryType = selectedSlot.getAttribute('data-inventory');
    const index = parseInt(selectedSlot.getAttribute('data-index') || '0');
    const chestIndex = parseInt(selectedSlot.getAttribute('data-chest') || '0');

    // Actualizar estructura de datos
    const updatedSlotData = [...savedData.slotData];
    if (!currentSlot) return <div>Selecciona una partida</div>;

    if (inventoryType === 'inventory') {
      currentSlot.inventorySaveItems[index] = {
        itemID: newId,
        amount: 1,
        isEmpty: newId === 0,
      };
    } else if (inventoryType === 'ship') {
      currentSlot.shipInventorySaveItems[index] = {
        itemID: newId,
        amount: 1,
        isEmpty: newId === 0,
      };
    } else if (inventoryType === 'chest') {
      const chest = currentSlot.chestSlots[chestIndex];
      chest.itemsID[index] = newId;
      chest.itemsAmount[index] = 1;
      if (newId === 0) {
        chest.itemsAmount[index] = 0;
      }
    }

    // Actualizar estado global
    setSavedData({
      ...savedData,
      slotData: updatedSlotData,
    });

    // Reflejar cambios visuales
    updateVisualForItem(selectedSlot, newId, 1);
    updateContextMenu(newId, 1);

    // Guardar en localStorage
    saveToStorage();

    closeModal();
  };

  // === Actualizar visual del slot ===
  const updateVisualForItem = (slot: HTMLElement, itemId: number, quantity: number) => {
    slot.setAttribute('data-id', itemId.toString());
    slot.setAttribute('data-quantity', quantity.toString());

    slot.innerHTML = '';

    if (itemId === 0) {
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
      placeholder.style.color = '#7f8c8d';
      placeholder.style.fontSize = '10px';
      placeholder.textContent = 'Vacío';
      slot.appendChild(placeholder);
      slot.style.backgroundColor = '#34495e';
    } else {
      const img = getImageForItem(itemId);
      img.width = 48;
      img.height = 48;
      img.alt = `Ítem ${itemId}`;
      img.title = `${itemId} (${quantity})`;
      slot.appendChild(img);

      if (quantity > 1) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.style.position = 'absolute';
        badge.style.top = '4px';
        badge.style.right = '4px';
        badge.style.background = '#00b894';
        badge.style.color = 'white';
        badge.style.fontSize = '8px';
        badge.style.padding = '2px 5px';
        badge.style.borderRadius = '3px';
        badge.textContent = quantity.toString();
        slot.appendChild(badge);
      }

      const idSmall = document.createElement('small');
      idSmall.className = 'item-id text-center mt-1';
      idSmall.style.fontSize = '7px';
      idSmall.style.color = '#88adac';
      idSmall.style.fontWeight = 'bold';
      idSmall.textContent = itemId.toString();
      slot.appendChild(idSmall);

      slot.style.backgroundColor = '';
    }
  };

  // === Actualizar menú contextual ===
  const updateContextMenu = (id: number, qty: number) => {
    const item = window.items?.find(i => i.id === id) || { id, name: "NOMBRE PDTE.", procesar: "+0%" };
    const processPercent = item.procesar || "+0%";

    const titleEl = document.getElementById('item-name');
    if (titleEl) {
      titleEl.textContent = `${item.name} (${processPercent})`;
    }

    const selectEl = document.getElementById('select-item') as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = id.toString();
    }

    const qtyInput = document.getElementById('item-quantity') as HTMLInputElement;
    if (qtyInput) {
      qtyInput.value = qty.toString();
    }

    const idDisplay = document.getElementById('item-id-display') as HTMLInputElement;
    if (idDisplay) {
      idDisplay.value = id.toString();
    }
  };

  // === Cerrar modal ===
  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.style.display = 'none';
    }
    selectedSlot = null;
  };

  // === Escuchar eventos ===

  // Input en campo ID
  useEffect(() => {
    const handleInput = () => {
      if (!inputRef.current) return;
      const id = parseInt(inputRef.current.value) || 0;
      validateId(id);
    };

    const input = inputRef.current;
    if (input) input.addEventListener('input', handleInput);
    return () => {
      if (input) input.removeEventListener('input', handleInput);
    };
  }, []);

  // Botón "Aplicar"
  useEffect(() => {
    const handleClick = () => {
      applyNewId();
    };

    const btn = document.getElementById('applyManualId');
    if (btn) btn.addEventListener('click', handleClick);
    return () => {
      if (btn) btn.removeEventListener('click', handleClick);
    };
  }, [savedData, currentSlotIndex]);

  // Escape para cerrar
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalRef.current?.style.display !== 'none') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // === Funciones auxiliares ===

  const getImageForItem = (itemId: number): HTMLImageElement => {
    const img = new Image();
    img.src = `/items/Item_${itemId}.png`;
    img.alt = `Ítem ${itemId}`;
    img.onerror = () => {
      img.src = '/static/items/unknown.png';
      img.alt = 'Ítem desconocido';
    };
    return img;
  };

  const saveToStorage = () => {
    if (!savedData) return;
    try {
      localStorage.setItem('farlandsSaveData', JSON.stringify(savedData));
    } catch (err) {
      console.error("❌ Error al guardar en localStorage:", err);
    }
  };

  // Hacer que `openManualIdInput` esté disponible globalmente
  if (typeof window !== 'undefined') {
    (window as any).openManualIdInput = (slot: HTMLElement) => {
      openModal(slot);
    };
  }

  return (
    <div
      ref={modalRef}
      style={{
        display: 'none',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        maxHeight: '600px',
        background: '#2d3436',
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        zIndex: 1050,
        padding: '20px',
        border: '1px solid #457b9d'
      }}
    >
      <h4 className="text-primary mb-3">Modificar ID del ítem</h4>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="manualItemId" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
          Nuevo ID:
        </label>
        <input
          ref={inputRef}
          type="number"
          id="manualItemId"
          min="0"
          max="503"
          autoFocus
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#34495e',
            color: 'white',
            fontSize: '14px'
          }}
        />
        <div
          ref={warningRef}
          style={{
            display: 'none',
            marginTop: '5px',
            color: '#e63946',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          ⚠️ Bajo su propio riesgo: puede ser que el objeto no exista.
        </div>
      </div>
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <button
          id="applyManualId"
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            background: '#00b894',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Aplicar
        </button>
        <button
          onClick={closeModal}
          style={{
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}