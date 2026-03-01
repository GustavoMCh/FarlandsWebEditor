'use client';

import { useEffect, useRef } from 'react';
import { ToolName, toolUpgradeGuides } from '@/lib/herramientas'; // ✅ Bien importado
import { ToolLevel } from '@/types/types';


export default function ToolGuideModal({ 
  toolName, 
  isOpen, 
  onClose 
}: { 
  toolName: string; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !toolName || !modalRef.current) return;

    // Normalizar nombre de la herramienta
    const normalizedToolName = Object.keys(toolUpgradeGuides).find(
      key => key.toLowerCase() === toolName.toLowerCase()
    ) as ToolName | undefined; // 👈 Cast explícito

    if (!normalizedToolName) return;
    const guide = toolUpgradeGuides[normalizedToolName];
    if (!guide) return;

    let html = '';
    guide.forEach((level) => {
      html += `
        <div class="card bg-secondary my-3 border-primary" style="border-left: 3px solid #00b894;">
          <div class="card-header bg-primary text-white p-2">
            <h6 class="mb-0"><img src="${level.img}" width="48" height="48"> ${level.title}</h6>
          </div>
          <div class="card-body p-2">
            <h7 class="text-warning mb-1">Efectos:</h7>
            <ul class="list-group list-group-flush mb-2">
      `;
      level.effects.forEach((effect: string) => {
        html += `<li class="list-group-item bg-dark text-light border-0 p-1" style="font-size: 0.85rem;">${effect}</li>`;
      });
      html += `
            </ul>
            <h7 class="text-warning mb-1">Requisitos:</h7>
            <table class="table table-sm table-dark mb-0" style="font-size: 0.85rem;">
              <thead>
                <tr>
                  <th style="width: 20%;">Item</th>
                  <th style="width: 20%;">Cantidad</th>
                  <th style="width: 60%;">Obtención</th>
                </tr>
              </thead>
              <tbody>
      `;
      level.requirements.forEach((req: any) => {
        const source = req.source || "No especificado";
        let img = '';

        const validIds = [55, 117, 19, 41, 332, 7, 43, 42];

        if (req.id && validIds.includes(req.id)) {
          img = `<img src="/static/items/Item_${req.id}.png" width="24" height="24" 
                   style="vertical-align: middle; margin-right: 8px; border-radius: 4px;"
                   onerror="this.src='/static/static/items/unknown.png'; this.title='Ítem desconocido'">`;
        }

        html += `
          <tr>
            <td><strong>${req.item}</strong> ${img}</td>
            <td>${req.amount}</td>
            <td><small>${source}</small></td>
          </tr>
        `;
      });
      html += `
              </tbody>
            </table>
          </div>
        </div>
      `;
    });

    modalRef.current.innerHTML = html;
  }, [toolName, isOpen]);

  // Cerrar al hacer clic fuera
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50 pt-10"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark text-light rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-primary flex justify-between items-center">
          <h5 className="text-primary mb-0">📘 Guía: {toolName}</h5>
          <button
            onClick={onClose}
            className="text-danger hover:text-light transition-colors"
            style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
        <div
          ref={modalRef}
          className="p-4"
          style={{ minHeight: '200px' }}
        ></div>
      </div>
    </div>
  );
}