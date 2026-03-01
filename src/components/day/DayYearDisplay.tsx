'use client';

import { useSaveData } from '@/components/utils/useSaveData';
import FieldEditorModal from '@/components/utils/FieldEditorModal';
import { useState } from 'react';
import type { SlotData } from '@/types/types';

export default function DayYearDisplay() {
  const { savedData, currentSlot, currentSlotIndex, setSavedData } = useSaveData();
  const [editingField, setEditingField] = useState<null | 'day' | 'season' | 'credits'>(null);

  if (!savedData || !currentSlot || currentSlotIndex === -1) {
    return <div></div>;
  }

  const dias = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];
  const day = currentSlot.currentDay ?? 1;
  const year = currentSlot.currentYear ?? 1;
  const season = currentSlot.currentSeason ?? 1;
  const currentCredits = currentSlot.credits ?? 0;
  const indice = (day - 1) % 7;

  const image_season = `/static/UI/seasson_${season}.png`;

const updateField = (field: keyof SlotData, value: number) => {
  if (!savedData || !savedData.gameData || currentSlotIndex === -1) return;

  const updatedSlotData = [...savedData.gameData.slotData];
  updatedSlotData[currentSlotIndex] = {
    ...updatedSlotData[currentSlotIndex],
    [field]: value,
  };

  setSavedData({
    ...savedData,
    gameData: {
      ...savedData.gameData,
      slotData: updatedSlotData,
    },
  });
};

  const handleSave = (field: 'day' | 'season' | 'credits') => (value: number) => {
    switch (field) {
      case 'day':
        updateField('currentDay', value);
        break;
      case 'season':
        updateField('currentSeason', value);
        break;
      case 'credits':
        updateField('credits', value);
        break;
    }
    setEditingField(null);
  };

 return (
  <>
    <div className="position-relative w-100" style={{ height: '200px' }}>
      {/* Imagen de fondo (no interactiva) */}
      <img
        src="/static/ui/dia_hora_dinero.png"
        alt="Fondo UI"
        className="position-absolute end-0"
        style={{ width: '200px', height: 'auto', zIndex: 1 }}
      />

      {/* Capa interactiva sobre la imagen */}
      <div className="position-absolute end-0" style={{ width: '200px', height: '150px', zIndex: 2 }}>
        {/* Día y año */}
        <div
          className="cursor-pointer"
          style={{ position: 'absolute', top: '20px', left: '80px', fontSize: '14px', color: 'white' }}
          onClick={() => setEditingField('day')}
        >
          <span>{dias[indice]} </span>
          <span>{day}</span> <span style={{display:"none"}}> /{' AÑO '}
          <span
            onClick={(e) => {
              e.stopPropagation();
              alert('El año no es editable en Farlands.');
            }}
            style={{ textDecoration: 'underline', cursor: 'help' }}
          >
            {year}
          </span>
          </span>
        </div>

        {/* Estación (imagen clickeable completa) */}
        <div
          className="cursor-pointer"
          style={{
            position: 'absolute',
            top: '72px',
            left: '25px',
            width: '32px',
            height: '32px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setEditingField('season');
          }}
        >
          <img
            src={image_season}
            alt="Estación"
            style={{
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Hora (solo texto, no editable) */}
        <div
          style={{
            position: 'absolute',
            top: '75px',
            left: '90px', // A la derecha de la imagen de estación
            fontSize: '14px',
            color: 'white',
          }}
        >
          6:00
        </div>

        {/* Créditos */}
        <div
          className="cursor-pointer"
          style={{
            position: 'absolute',
            top: '125px',
            left: '90px',
            fontSize: '14px',
            color: 'white',
          }}
          onClick={() => setEditingField('credits')}
        >
          {currentCredits.toLocaleString()}
        </div>
      </div>
    </div>

    {/* Modales */}
    {editingField && (
      <FieldEditorModal
        field={editingField}
        initialValue={
          editingField === 'day'
            ? day
            : editingField === 'season'
            ? season
            : currentCredits
        }
        onSave={handleSave(editingField)}
        onClose={() => setEditingField(null)}
      />
    )}
  </>
);
}