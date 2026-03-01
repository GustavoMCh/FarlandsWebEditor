// src/components/utils/ModalInput.tsx
import React from 'react';

interface ModalInputProps {
  title: string;
  initialValue: string;
  onChange: (val: string, title:string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function ModalInput({ title, initialValue, onChange, onSave, onClose }: ModalInputProps) {
  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog" style={{ height: "200px", zIndex: 2200 }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
             
              value={initialValue}
              onChange={(e) => onChange(e.target.value,title)}
              autoFocus
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={onSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </div>
  );
}