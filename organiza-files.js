const fs = require('fs').promises;
const path = require('path');

// Directorio base donde están los archivos a organizar
const SOURCE_DIR = 'G:/FarLlandsEditor_portable/EXPORT/Texture2D'; // Cambia esto a tu directorio

async function organizeFiles() {
  try {
    const files = await fs.readdir(SOURCE_DIR);

    for (const file of files) {
      const filePath = path.join(SOURCE_DIR, file);

      // Saltar si es un directorio
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) continue;

      // Extraer nombre del archivo sin extensión
      const ext = path.extname(file);
      const basename = path.basename(file, ext);

      // Si no hay guion bajo, no procesar
      if (!basename.includes('_')) {
        console.log(`⚠️  Saltando (sin '_'): ${file}`);
        continue;
      }

      // Obtener la primera parte antes del primer '_'
      const prefix = basename.split('_')?.[0] || null;

      if (!prefix) {
        console.log(`⚠️  Prefijo vacío en: ${file}`);
        continue;
      }

      // Ruta de la carpeta destino
      const destDir = path.join(SOURCE_DIR, prefix);

      // Crear carpeta si no existe
      await fs.mkdir(destDir, { recursive: true });

      // Ruta destino completa
      const destPath = path.join(destDir, file);

      // Mover el archivo
      await fs.rename(filePath, destPath);
      console.log(`✅ Movido: ${file} → ${prefix}/`);
    }

    console.log('✨ Organización completada.');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

// Ejecutar
organizeFiles();