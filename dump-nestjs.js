const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Configuración
const OUTPUT_FILE = './Farlands_Editor_web_project_context.txt';

// Carpetas a procesar recursivamente
const FOLDERS_TO_PROCESS = ['src', 'public', 'style'];

// Archivos raíz a incluir explícitamente
const ROOT_FILES = [
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  '.eslintrc.json',
  '.eslintrc.js',
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  '.gitignore',
  'README.md',
  'next-env.d.ts'
];

// Extensiones de texto a incluir
const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.json', '.md', '.env', '.yaml', '.yml',
  '.html', '.css', '.scss', '.svg', '.txt', '.xml', '.toml'
]);

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return TEXT_EXTENSIONS.has(ext);
}

// Generar árbol recursivo para una carpeta
async function buildTree(dirPath, tree = [], prefix = '') {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = entries.filter(e => !e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
    const dirs = entries.filter(e => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));

    for (const file of files) {
      tree.push(prefix + '├── ' + file.name);
    }

    for (let i = 0; i < dirs.length; i++) {
      const dirEntry = dirs[i];
      const isLast = i === dirs.length - 1;
      tree.push(prefix + '├── ' + dirEntry.name + '/');
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      await buildTree(path.join(dirPath, dirEntry.name), tree, newPrefix);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`⚠️ No se pudo leer ${dirPath}: ${err.message}`);
    }
  }
  return tree;
}

// Leer y volcar contenido de una carpeta
async function processFolder(folderName, output) {
  const folderPath = `./${folderName}`;
  try {
    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory()) return;
  } catch {
    output.push(`\n⚠️ Carpeta ${folderName}/ no encontrada.\n`);
    return;
  }

  output.push(`\n\n========== CONTENIDO DE: ${folderName}/ ==========\n`);

  async function walk(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && isTextFile(fullPath)) {
        output.push(`\n--- ${fullPath} ---\n`);
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          output.push(content);
        } catch (err) {
          output.push(`[ERROR al leer: ${err.message}]\n`);
        }
      }
    }
  }

  await walk(folderPath);
}

// Procesar archivos raíz
async function processRootFiles(output) {
  let foundAny = false;
  for (const file of ROOT_FILES) {
    try {
      const content = await fs.readFile(`./${file}`, 'utf8');
      if (!foundAny) {
        output.push(`\n\n========== CONTENIDO DE: RAÍZ DEL PROYECTO ==========\n`);
        foundAny = true;
      }
      output.push(`\n--- ./${file} ---\n`);
      output.push(content);
    } catch (err) {
      // Silenciosamente omitir si no existe
    }
  }
  if (!foundAny) {
    output.push(`\n\n========== CONTENIDO DE: RAÍZ DEL PROYECTO ==========\n`);
    output.push(`(Ninguno de los archivos raíz configurados fue encontrado)\n`);
  }
}

// Generar árbol del proyecto
async function generateProjectTree() {
  const tree = ['farlands-editor-web/'];

  // Añadir archivos raíz
  const rootFilesFound = [];
  for (const file of ROOT_FILES) {
    try {
      await fs.stat(`./${file}`);
      rootFilesFound.push(file);
    } catch {}
  }
  rootFilesFound.sort();
  for (const file of rootFilesFound) {
    tree.push(`├── ${file}`);
  }

  // Añadir carpetas
  for (const folder of FOLDERS_TO_PROCESS) {
    const folderPath = `./${folder}`;
    try {
      await fs.stat(folderPath);
      tree.push(`├── ${folder}/`);
      const subTree = await buildTree(folderPath);
      tree.push(...subTree.map(line => `│   ${line}`));
    } catch {
      tree.push(`├── ${folder}/ [no existe]`);
    }
  }

  return tree;
}

// Preguntar modo al usuario
function askMode() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('¿Modo de volcado? (full / scr) [Enter = full]: ', (input) => {
      const mode = input.trim().toLowerCase();
      if (mode === 'scr') {
        resolve('scr');
      } else {
        resolve('full');
      }
      rl.close();
    });
  });
}

// Función principal
async function dumpProject() {
  const mode = await askMode();
  const output = [];

  const summary = `# Resumen del Volcado del Proyecto

- **Modo**: ${mode === 'full' ? 'Volcado completo (estructura + contenido)' : 'Solo estructura (árbol de archivos)'}
- **Carpetas procesadas**: ${FOLDERS_TO_PROCESS.join(', ')}
- **Archivos raíz incluidos**: ${ROOT_FILES.join(', ')}
- **Extensiones incluidas**: ${Array.from(TEXT_EXTENSIONS).join(', ')}
- **Fecha de generación**: ${new Date().toISOString()}
- **Propósito**: Este archivo contiene un volcado textual del código fuente y recursos del proyecto "farlands-editor-web", útil para análisis, documentación o contexto en LLMs.
El proyecto se ha realizado en Next.js, Sass, Bootstrap, fontawesome 
Permite la modificación de la partida guardada del juego Farlands. 
Se le facilita el fichero gamedata.dat 
Se almacena una copia en el storage del navegador 
Se solicita indicar una de las partidas guardada 
Muestra por pantalla la información de la partida en curso 
Se permite modificar: 
- Los Items almacenado en el inventario o en los cofres 
- El crédito 
- El día en el que nos encontramos 
- El Nivel de las herramientas, Nave y Casa 
- Muestra el progreso del arca 

- **Prompt para el Qwen**: Como experto informático en Next.js, Sass, Bootstrap ayudarás en el desarrollo y mejoras de la aplicación. En los cambios a realizar, además de la explicación del mismo, se mostrará el código completo del fichero a modificar, no solo el fragmento en concreto a corregir, ni códigos a medias.
Se intentará tener el código lo más desglosable y legible posible, para tener unidades pequeñas de trabajo.

Si no se te indica nada en el prompt quedarás a la esperas a la petición, con la confirmación de que se ha entendido las instrucciones y el contenido del mismo. 


${mode === 'full' ? 'A continuación se incluye el contenido completo de los archivos de texto, seguido de la estructura del proyecto.' : 'A continuación se incluye únicamente la estructura del proyecto (árbol de carpetas y archivos).'}
`;

  output.push(summary);

  if (mode === 'full') {
    await processRootFiles(output);
    for (const folder of FOLDERS_TO_PROCESS) {
      await processFolder(folder, output);
    }
  }

  output.push('\n\n========== ESTRUCTURA DEL PROYECTO ==========\n');
  const tree = await generateProjectTree();
  output.push(...tree);

  await fs.writeFile(OUTPUT_FILE, output.join('\n'), 'utf8');
  console.log(`✅ Volcado completado en: ${path.resolve(OUTPUT_FILE)}`);
  console.log(`📝 Modo seleccionado: ${mode}`);
}

dumpProject().catch(console.error);