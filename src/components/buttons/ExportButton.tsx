'use client';

import { useSaveData } from '@/components/utils/useSaveData';

export default function ExportButton() {
  const { savedData } = useSaveData();

  const handleExport = () => {
    if (!savedData) {
      alert("Primero carga un archivo.");
      return;
    }
    const jsonStr = JSON.stringify(savedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gamedata_export_${new Date().toISOString().slice(0, 10)}.dat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-center mt-4">
      <button
        className="btn btn-warning btn-lg"
        onClick={handleExport}
      >
        💾 Exportar Cambios (¡Backup!)
      </button>
      <div className="text-danger mt-2 small border shadow alert alert-warning">
        ⚠️ Esto genera un nuevo archivo formato: gamedata_export_aaaa-mm-dd.dat
        <br /> ¡No sobrescribe el original!
        <br /> Recuerda reemplazarlo por :
        <code
          onClick={(e) => {
            const text = e.currentTarget.getAttribute('data-text') || '';
            navigator.clipboard.writeText(text)
              .then(() => {
                const tooltip = document.createElement('span');
                tooltip.className = 'copy-tooltip';
                tooltip.textContent = `Texto copiado: ${text}`;
                tooltip.style.cssText = `
                  position: absolute;
                  background-color: #00b894;
                  color: white;
                  padding: 6px 12px;
                  border-radius: 4px;
                  font-size: 12px;
                  white-space: nowrap;
                  z-index: 1000;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                  animation: fadeInOut 1.5s ease-out;
                  pointer-events: none;
                  transform: translate(-50%, -100%);
                  left: 50%;
                  top: 50%;
                `;
                const rect = e.currentTarget.getBoundingClientRect();
                const container = e.currentTarget.closest('.container-fluid') || document.body;
                container.appendChild(tooltip);
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top + rect.height / 2}px`;
                setTimeout(() => {
                  if (tooltip.parentNode) tooltip.remove();
                }, 1500);
              })
              .catch(err => {
                alert('No se pudo copiar el texto. Por favor, prueba manualmente.');
              });
          }}
          data-text="%USERPROFILE%\\AppData\\LocalLow\\Jandusoft\\Farlands\\gamedata.dat"
        >
          📋 %USERPROFILE%\\AppData\\LocalLow\\Jandusoft\\Farlands\\gamedata.dat
        </code>
      </div>


      <div className='alert alert-info text-left'>
        <b>📝 Últimas notas:</b>
        <br />A ver conseguir que funcione no es una ciencia cierta, esto son los pasos que sigo y tengo un exito del 80%
        <ul className="list-group">
          <li className="list-group-item">Inicio el juego</li>
          <li className="list-group-item">Selecciono empezar</li>
          <li className="list-group-item">Pongo el nuevo fichero</li>
          <li className="list-group-item">Elijo la partida</li>
        </ul>
        ¿El 20%?, desconzco el motivo pero no coge los cambios.
        <br />
        Bueno he descubierto que Steam hace una copia del contenido de la carpeta, porque tenía más archivos de copias y si borro la carpeta me los vuelve a traer.
      </div>
    </div>
  );
}