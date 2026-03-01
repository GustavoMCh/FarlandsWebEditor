# Farlands Web Editor

¡Bienvenido al **Farlands Web Editor**! 🚀

Una herramienta web no oficial, de código abierto, diseñada para leer y editar archivos de guardado (`.json`) del videojuego **Farlands**. Permite modificar multitud de aspectos de tu partida directamente desde el navegador, sin necesidad de instalar programas adicionales.

## ✨ Características Principales

Con este editor podrás modificar de manera visual e intuitiva parámetros de tu partida:

-   **Jugador (Stats):** Cambia tu cantidad de dinero (creds), energía, salud y más.
-   **Inventario y Herramientas:** Gestiona los objetos en el inventario del jugador y el nivel/durabilidad de las herramientas, protegiendo los slots esenciales.
-   **Vehículo (Gato-Nave):** Edita el nivel de combustible, integridad de la nave e inventario del vehículo.
-   **Relaciones con NPCs:** Ajusta los puntos de relación social con cada NPC.
-   **Entorno y Ubicaciones:** Modifica los elementos de las distintas granjas, invernadero y baúles con una interfaz visual en cuadrícula.
-   **Tiempo del Juego:** Cambia el día actual y la hora de tu partida.

> **⚠️ Advertencia Importante:** Modificar archivos de guardado siempre conlleva un pequeño riesgo. **Haz siempre una copia de seguridad (backup)** de tu partida original antes de sobrescribirla con el archivo editado.

## 🛠️ Tecnologías Utilizadas

Este proyecto es una aplicación web moderna construida usando:

-   [Next.js](https://nextjs.org/) (React Framework)
-   TypeScript
-   CSS Modules / Bootstrap (para el sistema de cuadrículas)
-   FontAwesome (Iconografía)

## 🚀 Instalación y Uso Local

Si deseas probar el proyecto ejecutándolo localmente en tu propia máquina (requiere [Node.js](https://nodejs.org/)):

1.  **Clona o descarga este repositorio**.
2.  Abre una terminal en la carpeta del proyecto.
3.  **Instala las dependencias**:
    ```bash
    npm install
    ```
4.  **Inicia el servidor de desarrollo**:
    ```bash
    npm run dev
    ```
5.  Abre tu navegador y ve a [http://localhost:3000](http://localhost:3000).

## 📦 Cómo usar el Editor

1.  Abre la página web del editor.
2.  Pulsa en **"Cargar Save"** y selecciona tu archivo de guardado (`saveX.json`).
3.  Navega por las distintas pestañas y realiza las modificaciones deseadas.
4.  Pulsa en el botón para **Descargar Save** para obtener tu partida modificada.
5.  Reemplaza el archivo original en la carpeta de *saves* del juego (¡recuerda hacer backup primero!).

## 📜 Licencia

Este proyecto se distribuye bajo la **Licencia MIT**. Siéntete libre de utilizar, modificar y distribuir este código para tus propios proyectos siempre que se incluya la licencia original.

---
*Nota: Este proyecto es una herramienta creada por la comunidad y no está afiliada ni avalada oficialmente por Javiator (creador de Farlands) ni su equipo de desarrollo.*
