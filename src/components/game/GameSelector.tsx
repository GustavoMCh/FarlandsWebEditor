// src/components/game/GameSelector.tsx
'use client';

import { useEffect } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import SlotItem from './SlotItem';
import FileSelector from '../file/FileSelector';
import Editor from '../editor/Editor';

export default function GameSelector() {
  const { savedData, currentSlotIndex, setCurrentSlotIndex } = useSaveData();

  // Validación básica
  if (!savedData || !savedData.gameData?.slotData) return null;

  const slots = savedData.gameData.slotData.slice(0, 3);

  // Si ya se seleccionó una partida, mostrar solo esa + botón para volver
  if (currentSlotIndex !== -1 && currentSlotIndex < slots.length) {
    const selectedSlot = slots[currentSlotIndex];

    return (
      <div
        id="gameSelector"
        className="position-relative d-flex flex-column align-items-center justify-content-center py-4"
      >
        <h2 className="text-success mb-4">Partida seleccionada</h2>
        <div className="row w-100">
          <div className="col-md-6 offset-md-3 position-relative">
            <div className='position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger'>{currentSlotIndex + 1}</div>
            <div className="p-3 bg-dark rounded shadow">
              <div className="d-flex justify-content-between position-relative">
                <div className=''>

                  <div><strong>Granja:</strong> {selectedSlot.farmName || 'Nueva'}</div>
                  <div><strong>Jugador:</strong> {selectedSlot.playerName || 'Partida'}</div>
                  <div><strong>Créditos:</strong> {selectedSlot.credits.toLocaleString()} C</div>
                  <div><strong>Día:</strong> {selectedSlot.currentDay} | <strong>Año:</strong> {selectedSlot.currentYear}</div>
                </div>
                <div className='position-absolute' style={{ top: '-130px', right: "-45px" }}><img src='/static/Farm/menu.png'></img></div>
                <div className="text-muted align-self-start">Partida {currentSlotIndex + 1}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 d-flex gap-3">
          <button
            className="btn btn-primary"
            onClick={() => setCurrentSlotIndex(-1)} // ← Volver al selector
          >
            ← Volver a elegir partida
          </button>

        </div>

        <Editor />
      </div>
    );
  }

  // Si NO hay partida seleccionada, mostrar el selector
  return (
    <div
      id="gameSelector"
      className="position-relative d-flex flex-column align-items-center justify-content-center py-4 w-100"
    >
      <h2 style={{ color: 'white', fontSize: '48px', marginBottom: '30px' }}>
        Elige tu partida
      </h2>
      <div className="d-flex flex-column gap-3">
        {slots.map((slot, index) => (
          <SlotItem
            key={index}
            slot={slot}
            index={index}
            onClick={() => setCurrentSlotIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}