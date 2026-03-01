'use client';

import { useEffect, useState } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';


// Aseguramos que window.items esté tipado
declare global {
  interface Window {
    itemsNames: [key: number],
    items: Array<{
      id: number;
      name: string;
      procesar?: string;
    }>;
  }
}

export default function ItemSelectorModal() {
  const { savedData } = useSaveData();
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Array<{ id: number; name: string; procesar?: string }>>([]);
  const [filteredItems, setFilteredItems] = useState<typeof items>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Referencias DOM
  let selectedSlot: HTMLElement | null = null;

  // Solo inicializar si hay datos
  useEffect(() => {
    if (!window.items) return;

    const itemList = window.items.map(item => ({
      id: item.id,
      name: item.name,
      procesar: item.procesar || "+0%"
    }));

    setItems(itemList);
    setFilteredItems(itemList);
  }, []);

  // Aplicar filtro
  useEffect(() => {
    if (!items.length) return;

    const term = searchTerm.toLowerCase().trim();
    if (term === '') {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(
      item =>
        item.name.toLowerCase().includes(term) ||
        item.id.toString().includes(term)
    );

    setFilteredItems(filtered);
  }, [searchTerm, items]);

  // Mostrar modal
  const openModal = (targetSlot: HTMLElement) => {
    selectedSlot = targetSlot;
    setIsOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsOpen(false);
    selectedSlot = null;
  };

  // Seleccionar ítem
  const handleSelect = (id: number) => {
    if (!selectedSlot) return;

    const amount = parseInt(selectedSlot.getAttribute('data-quantity') || '1') || 1;
    const inventoryType = selectedSlot.getAttribute('data-inventory');
    const index = parseInt(selectedSlot.getAttribute('data-index') || '0');
    const chestIndex = parseInt(selectedSlot.getAttribute('data-chest') || '0');

    // Actualizar datos internos
    selectedSlot.setAttribute('data-id', id.toString());
    selectedSlot.setAttribute('data-quantity', amount.toString());

    // Limpiar contenido visual
    selectedSlot.innerHTML = '';

    // Imagen
    const img = getImageForItem(id);
    img.width = 48;
    img.height = 48;
    img.alt = `Ítem ${id}`;
    img.title = `${id} (${amount})`;
    selectedSlot.appendChild(img);

    // Badge de cantidad
    if (amount > 1) {
      const $badge = document.createElement('span');
      $badge.className = 'badge';
      $badge.style.position = 'absolute';
      $badge.style.top = '4px';
      $badge.style.right = '4px';
      $badge.style.background = '#00b894';
      $badge.style.color = 'white';
      $badge.style.fontSize = '8px';
      $badge.style.padding = '2px 5px';
      $badge.style.borderRadius = '3px';
      $badge.textContent = amount.toString();
      selectedSlot.appendChild($badge);
    }

    // ID pequeño debajo
    const $idSmall = document.createElement('small');
    $idSmall.className = 'item-id text-center mt-1';
    $idSmall.style.fontSize = '7px';
    $idSmall.style.color = '#88adac';
    $idSmall.style.fontWeight = 'bold';
    $idSmall.textContent = id.toString();
    selectedSlot.appendChild($idSmall);

    // Restaurar fondo normal
    selectedSlot.style.backgroundColor = '';

    // Actualizar menú contextual
    updateContextMenu(id, amount);

    // Guardar cambios
    saveToStorage();

    // Cerrar modal
    closeModal();
  };

  // Función auxiliar: Obtener imagen
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

  // Función auxiliar: Actualizar menú contextual
  const updateContextMenu = (id: number, qty: number) => {
    const item = window.items?.find(i => i.id === id) || { id, name: "NOMBRE PDTE.", procesar: "+0%" };
    const processPercent = item.procesar || "+0%";

    const itemNameEl = document.getElementById('item-name');
    const selectItemEl = document.getElementById('select-item') as HTMLSelectElement;
    const quantityInputEl = document.getElementById('item-quantity') as HTMLInputElement;
    const idDisplayEl = document.getElementById('item-id-display') as HTMLInputElement;

    if (itemNameEl) itemNameEl.textContent = `${item.name} (${processPercent})`;
    if (selectItemEl) selectItemEl.value = id.toString();
    if (quantityInputEl) quantityInputEl.value = qty.toString();
    if (idDisplayEl) idDisplayEl.value = id.toString();
  };

  // Función auxiliar: Guardar en localStorage
  const saveToStorage = () => {
    if (!savedData) return;
    try {
      localStorage.setItem('farlandsSaveData', JSON.stringify(savedData));
    } catch (err) {
      console.error("❌ Error al guardar en localStorage:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1050
      }}
      onClick={closeModal}
    >
      <div
        className="modal-dialog modal-xl"
        style={{ margin: '60px auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content bg-dark text-light"
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #457b9d'
          }}
        >
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Selecciona un nuevo ítem</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Buscador */}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o ID (ej: 127, Célula de combustible)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
            </div>

            {/* Grid de ítems */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
                gap: '8px',
                padding: '8px'
              }}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '4px',
                      background: '#2d3436',
                      borderRadius: '6px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 184, 148, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <img
                      src={`/items/Item_${item.id}.png`}
                      alt={item.name}
                      title={`${item.name} (${item.procesar})`}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = '/static/items/unknown.png';
                        img.title = 'Ítem desconocido';
                      }}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'contain',
                        margin: '0 auto'
                      }}
                    />
                    <div
                      style={{
                        fontSize: '8px',
                        color: '#f1faee',
                        marginTop: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.name.length > 8 ? `${item.name.slice(0, 8)}...` : item.name}
                    </div>
                    <div
                      style={{
                        fontSize: '8px',
                        color: '#00b894',
                        fontWeight: 'bold'
                      }}
                    >
                      {item.id}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center w-100">
                  No se encontraron ítems.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}