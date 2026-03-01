'use client';

import React, { useState, useEffect } from 'react';

interface FieldEditorModalProps {
  field: 'day' | 'season' | 'credits';
  initialValue: number;
  onSave: (value: number) => void;
  onClose: () => void;
}

const diasSemana = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

export default function FieldEditorModal({ field, initialValue, onSave, onClose }: FieldEditorModalProps) {
  // ✅ Usa string para edición libre (solo créditos)
  const [inputValue, setInputValue] = useState<string>(initialValue.toString());

  // Para día y estación, seguimos usando número (selección por botones)
  const [selectedValue, setSelectedValue] = useState<number>(initialValue);

  const handleSave = () => {
    if (field === 'day' || field === 'season') {
      // Día y estación ya están validados por botones
      onSave(selectedValue);
    } else if (field === 'credits') {
      // ✅ Validar SOLO al guardar
      const num = parseInt(inputValue.trim(), 10);
      const finalValue = isNaN(num) || num < 200 ? 200 :  num > 999999999 ? 999999999 :  num;
      onSave(finalValue);
    }
  };

  const renderContent = () => {
    if (field === 'day') {
      return (
        <div className="mt-2">
          <div className="d-flex justify-content-between mb-2 fw-bold text-white small">
            {diasSemana.map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="d-grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {Array.from({ length: 28 }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                type="button"
                className={`btn btn-sm ${selectedValue === num ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedValue(num)}
                style={{ fontSize: '0.85rem', padding: '4px' }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (field === 'season') {
      const seasons = [
        { id: 1, name: 'Templada', icon: '/static/UI/seasson_1.png' },
        { id: 2, name: 'Cálida', icon: '/static/UI/seasson_2.png' },
        { id: 3, name: 'Fría', icon: '/static/UI/seasson_3.png' },
      ];
      return (
        <div className="d-flex gap-2 mt-3 justify-content-center">
          {seasons.map(season => (
            <div
              key={season.id}
              className={`p-2 rounded ${selectedValue === season.id ? 'bg-success' : 'bg-secondary'}`}
              style={{ cursor: 'pointer', width: '80px' }}
              onClick={() => setSelectedValue(season.id)}
            >
              <img
                src={season.icon}
                alt={season.name}
                className="d-block mx-auto mb-1"
                style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }}
              />
              <small className="text-white">{season.name}</small>
            </div>
          ))}
        </div>
      );
    }

    if (field === 'credits') {
      return (
        <input
          type="text"
          className="form-control mt-2"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)} // ✅ Edición libre
          placeholder="Ej: 1500"
          autoFocus
        />
      );
    }

    return null;
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
     
      onClick={onClose}
    >
      <div
       style={{ zIndex: 2200 }}
        className="modal-dialog modal-dialog-centered"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content bg-dark text-light border border-primary">
          <div className="modal-header border-bottom border-primary">
            <h5 className="modal-title">
              {field === 'day' ? '📅 Día del mes' :
               field === 'season' ? '🌍 Estación' :
               '💰 Créditos'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {renderContent()}
          </div>
          <div className="modal-footer border-top border-primary">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-success" onClick={handleSave}>
              Aplicar
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" style={{ zIndex: 1999 }}></div>
    </div>
  );
}