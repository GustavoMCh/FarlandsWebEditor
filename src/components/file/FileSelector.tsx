'use client';

import { useEffect, useRef } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import { copyToClipboard } from '@/lib/utils';
import { useSpriteSheet } from '@/lib/useSpriteSheet'; // ← Hook nuevo
import { GameSaveData } from '@/types/types';
import GameSelector from '../game/GameSelector';

export default function FileSelector() {
  const { savedData, setSavedData, setLoadedFromFile, setCurrentSlotIndex, clearSaveData } = useSaveData();
  const fileSelectorRef = useRef<HTMLDivElement>(null);


  const tileset = useSpriteSheet({
    src: '/static/Tileset_Menu.png',
    x: 240,
    y: 255,
    width: 255,
    height: 70,
  });


  const planet = useSpriteSheet({
    src: '/static/Tileset_Menu.png',
    x: 0,
    y: 270,
    width: 240,
    height: 245,
  });

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  const onFileLoaded = (data: GameSaveData) => {
    setSavedData(data);
    setLoadedFromFile(true);
    // El useEffect en page.tsx detectará savedData y cambiará la vista
  };

  // Cuando la imagen esté lista → dibuja en el canvas
  useEffect(() => {
    if (!canvasRef.current || tileset.loading || tileset.error) return;

    const canvas = canvasRef.current;
    const container = fileSelectorRef.current;

    if (!container) return;

    // Ajusta tamaño del canvas al contenedor
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // ✅ Dibuja el recorte
    tileset.drawOnCanvas(canvas);
  }, [tileset.loading, tileset.image]);

  useEffect(() => {
    if (!canvasRef2.current || planet.loading || planet.error) return;

    const canvas = canvasRef2.current;
    const container = fileSelectorRef.current;

    if (!container) return;

    // Ajusta tamaño del canvas al contenedor
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // ✅ Dibuja el recorte
    planet.drawOnCanvas(canvas);
  }, [planet.loading, planet.image]);

  // Redimensionar al cambiar ventana
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !fileSelectorRef.current || tileset.loading) return;

      const canvas = canvasRef.current;
      const container = fileSelectorRef.current;

      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      tileset.drawOnCanvas(canvas); // Vuelve a dibujar
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [tileset]);

  // === Copiar ruta al portapapeles ===
  const handleCopyPath = () => {
    const path = '%USERPROFILE%\\AppData\\LocalLow\\Jandusoft\\Farlands\\gamedata.dat';
    copyToClipboard(path)
      .then(() => showTooltip(`✅ Ruta copiada: ${path}`))
      .catch(() => alert('No se pudo copiar automáticamente. Copia manualmente.'));
  };

  const showTooltip = (message: string) => {
    const tooltip = document.createElement('span');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = message;
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
    const codeEl = document.querySelector('code');
    if (!codeEl) return;

    const rect = codeEl.getBoundingClientRect();
    const container = document.body;

    container.appendChild(tooltip);
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top + rect.height / 2}px`;

    setTimeout(() => {
      if (tooltip.parentNode) tooltip.remove();
    }, 1500);
  };

  // === Manejar carga de archivo ===
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.group('Cargando fichero...', file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonText = event.target?.result as string;
        console.log('Cotenido txt:', { text: jsonText });
        const data = JSON.parse(jsonText);
        console.log('Contenido json', { data });

        if (!data.gameData?.slotData) {

          throw new Error("❌ Formato inválido: 'gameData.slotData' no encontrado.");
        }

        // ✅ Actualizar estado global
        console.log("✅ Grabando contenido");
        setSavedData(data);
        console.log("✅ Fichero cargado");
        setLoadedFromFile(true);
        console.log("✅ Mostrando slot");;
        setCurrentSlotIndex(data.gameData.currentSlot ?? 0);

      } catch (err) {
        alert("❌ Error al analizar el archivo: " + (err as Error).message);
      }
    };
    console.log("Fin");
    console.groupEnd();
    reader.readAsText(file);
  };


  return (
    <div
      ref={fileSelectorRef}
      id="fileSelector"
      className="text-center mb-4 position-relative"
    >


      {/* CANVAS: Recorte del banner superior */}
      <img src='/static/FarlandsLogo.png'></img>


      {/* Si NO hay savedData → mostramos el selector de archivo */}
      {!savedData ? (
        <>
          <div className='card text-left mt-3'>
            <div className="card-body">
              <h5 className='card-title'>
                🌟 ¡Antes de usar esta herramienta, una pequeña reflexión!
              </h5>
              <p className='card-text'>
                <b><a href='https://store.steampowered.com/app/2305520/Farlands/' target='_blank'>Farlands</a></b> es una experiencia única, si has llegado aquí es porque ya has jugado y he publicado la guía... llena de descubrimientos, desafíos y momentos que solo tienen sentido si los vives por ti mismo. Te animo encarecidamente a jugar el juego completo al menos una vez sin ayudas externas. La magia está en la exploración, en los errores, en las sorpresas… ¡y en construir tu propia historia!
              </p>

              <p className='card-text'>
                <b>⚠️ Advertencia:</b>
                <br />Esta utilidad está diseñada para editar partidas guardadas, lo que significa que puede contener <b>SPOILERS</b> de ítems, mecánicas, logros y contenido que forma parte del progreso natural del juego.
              </p>
              <p className='card-text'>
                <b>🔧 ¿Para quién es esta herramienta?</b>
                <br />Ideal para jugadores que ya completaron el juego o quieren comenzar una nueva partida con cierto progreso (por ejemplo, con herramientas mejoradas, inventario inicial, créditos, etc.), sin tener que repetir todo desde cero.
              </p>
              <p className='card-text'>
                🛑 Úsala bajo tu propia responsabilidad. No me hago responsable por partidas corruptas, spoilers no deseados o la pérdida de la experiencia original del juego.
              </p>

              <hr />

              <p className='card-text'>
                <b>🤖 Sobre esta herramienta</b>
                <br />Esta aplicación es un proyecto <b>sin ánimo de lucro</b>, desarrollado únicamente con fines demostrativos para explorar la potencia de las <b>IAs actuales</b> a la hora de leer, interpretar y modificar ficheros de datos de videojuegos. No ha sido creada para obtener ningún tipo de beneficio económico.
              </p>
              <p className='card-text'>
                <b>©️ Derechos de autor</b>
                <br />Todas las imágenes, assets y contenido del juego son propiedad exclusiva de sus desarrolladores y de <b>Jandusoft</b>. Esta herramienta no está afiliada ni respaldada oficialmente por los creadores de Farlands.
              </p>
              <p className='card-text'>
                <b>🔒 Privacidad</b>
                <br />Las partidas cargadas en esta herramienta <b>no se registran, no se almacenan en ningún servidor ni se comparten</b> con terceros. Todo el procesamiento se realiza localmente en tu navegador.
              </p>
              <p className='card-text'>
                <b>💻 Código abierto</b>
                <br />Si quieres explorar el código, contribuir o adaptar esta herramienta, el proyecto está disponible públicamente en GitHub:{' '}
                <a href='https://github.com/GustavoMCh/FarlandsWebEditor' target='_blank' rel='noopener noreferrer'>
                  github.com/GustavoMCh/FarlandsWebEditor
                </a>
              </p>

              <br />
              ¡Disfruta Farlands… a tu manera, pero con conciencia! 🚀

            </div>
          </div>

          <p>&nbsp;</p>
          <h1 className="text-primary">📂 Carga tu partida</h1>
          <div className="upload-section justify-content-center  position-relative">
            <label htmlFor="saveFile" className="form-label h5">
              💾 Selecciona tu archivo gamedata.dat:
            </label>
            <input
              type="file"
              id="saveFile"
              className="form-control"
              accept=".dat"
              style={{ maxWidth: '400px', margin: '0 auto' }}
              onChange={handleFileChange}
            />
            <div style={{ margin: "auto" }}>
              <div className="alert alert-info p-1 m-1 shadow mt-2">
                Ubicación recomendada{' '}
                <span style={{ fontSize: 'small' }}>
                  (pulsa sobre ella para copiarla)
                </span>
                :<br />
                <code
                  onClick={handleCopyPath}
                  data-text="%USERPROFILE%\AppData\LocalLow\Jandusoft\Farlands\gamedata.dat"
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    marginTop: '4px',
                  }}
                >
                  📋 %USERPROFILE%\AppData\LocalLow\Jandusoft\Farlands\gamedata.dat
                </code>



              </div>
              <div className="d-flex justify-content-around bd-highlight mb-3">
                <div className="p-2 bd-highlight">
                  <canvas
                    style={{ maxWidth: '255px', height: '255px', margin: '0 auto' }}
                    ref={canvasRef2}
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Si SÍ hay savedData → mostramos un mensaje o nada */
        <div className="mt-5">
          <h2 className="text-success">✅ Fichero cargado correctamente</h2>
          {/* Opcional: puedes poner un botón para volver a cargar */}
          <button
            className="btn btn-outline-warning mt-3"
            onClick={() => {
              setSavedData(null);
              setLoadedFromFile(false);
              setCurrentSlotIndex(-1);
              clearSaveData
            }}
          >
            🔄 Cargar otro archivo
          </button>

          <GameSelector />
        </div>
      )}
    </div>
  );
}

