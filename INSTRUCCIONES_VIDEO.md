# 🎬 Crear Video Demo de SpaceHub

## Método 1: Grabador Web Automático (Recomendado)

### Pasos:

1. **Abre el grabador**:
   ```bash
   open demo-recorder.html
   ```
   O haz doble clic en `demo-recorder.html`

2. **Sigue las instrucciones en pantalla**:
   - Haz clic en "🎮 Abrir Juego en Nueva Pestaña"
   - Juega un poco para que el juego esté activo
   - Haz clic en "🔴 Iniciar Grabación"
   - Selecciona la pestaña del juego cuando Chrome te lo pida
   - La grabación durará 10 segundos automáticamente
   - El video se descargará como `spacehub-demo.webm`

3. **Convertir a MP4 (opcional)**:
   - Usa un convertidor online como [CloudConvert](https://cloudconvert.com/webm-to-mp4)
   - O si tienes ffmpeg: `ffmpeg -i spacehub-demo.webm spacehub-demo.mp4`

## Método 2: Grabación Manual con QuickTime (Mac)

### Pasos:

1. **Abre QuickTime Player**
2. **Archivo → Nueva grabación de pantalla**
3. **Configura**:
   - Haz clic en la flecha junto al botón de grabar
   - Selecciona "Micrófono: Ninguno" (sin audio)
   - Calidad: Alta
4. **Graba**:
   - Haz clic en el botón rojo de grabar
   - Selecciona el área de la ventana del juego
   - Juega durante 10 segundos
   - Presiona ⌘+Control+Esc para detener
5. **Guarda**: Archivo → Guardar como `spacehub-demo.mov`

## Método 3: Captura de Pantalla Nativa de macOS

### Pasos:

1. **Abre el juego** en tu navegador
2. **Presiona**: `⌘ + Shift + 5`
3. **Selecciona**: "Grabar toda la pantalla" o "Grabar porción seleccionada"
4. **Opciones**:
   - Desactiva el micrófono
   - Guarda en: Escritorio
5. **Haz clic en "Grabar"**
6. **Juega durante 10 segundos**
7. **Detén** haciendo clic en el icono de grabación en la barra de menú

## Método 4: Crear GIF Animado

Si prefieres un GIF en lugar de video:

### Usando Gifski (Recomendado para Mac):

1. **Instala Gifski**:
   - Descarga desde [App Store](https://apps.apple.com/app/gifski/id1351639930) (gratis)

2. **Graba un video** con cualquier método anterior

3. **Convierte a GIF**:
   - Abre Gifski
   - Arrastra tu video
   - Ajusta la calidad y FPS
   - Exporta

### Usando un convertidor online:

1. Sube tu video a [ezgif.com](https://ezgif.com/video-to-gif)
2. Ajusta duración a 10 segundos
3. Descarga el GIF

## Consejos para un Buen Video Demo

### Qué Mostrar (10 segundos):

**Opción A - Tour Rápido:**
- 0-2s: Pantalla de inicio con logo
- 2-4s: Selección de astronauta
- 4-7s: Jugador moviéndose por la nave
- 7-9s: Interacción con un objeto
- 9-10s: Vista del mapa

**Opción B - Gameplay:**
- 0-3s: Jugador explorando habitaciones
- 3-6s: Minijuego en acción
- 6-8s: Recolectando recursos
- 8-10s: Vista del inventario/mapa

**Opción C - Características:**
- 0-2s: Logo y título
- 2-4s: Habitaciones diferentes
- 4-6s: Minijuegos
- 6-8s: Sistema de misiones
- 8-10s: Modo Marte

### Configuración Recomendada:

- **Resolución**: 1920x1080 (Full HD)
- **FPS**: 30 fps
- **Duración**: Exactamente 10 segundos
- **Formato**: MP4 (para compartir) o WebM (más ligero)
- **Sin audio**: O agrega música después

## Editar el Video (Opcional)

### Agregar Música:

Usa música libre de derechos de:
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)
- [Free Music Archive](https://freemusicarchive.org)
- [Incompetech](https://incompetech.com)

### Agregar Texto/Títulos:

**En Mac (iMovie - Gratis):**
1. Abre iMovie
2. Importa tu video
3. Agrega títulos: "SpaceHub - Educational Space Adventure"
4. Exporta en HD

**Online:**
- [Kapwing](https://www.kapwing.com) - Editor de video online
- [Clipchamp](https://clipchamp.com) - Editor gratuito

## Subir a GitHub

Una vez tengas tu video:

1. **Sube a YouTube** (como unlisted):
   - Crea un video unlisted en YouTube
   - Copia el link

2. **Agrega al README**:
   ```markdown
   ## 🎮 Demo
   
   [![SpaceHub Demo](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)
   ```

3. **O usa GitHub Assets**:
   - En tu repositorio → Issues → New Issue
   - Arrastra el video/GIF
   - Copia el link generado
   - Úsalo en tu README

4. **O usa GIF directamente**:
   ```markdown
   ![SpaceHub Demo](demo.gif)
   ```
   Y sube el GIF al repositorio

## Formato Final Recomendado

Para GitHub/Redes Sociales:
- **Formato**: MP4 (H.264)
- **Resolución**: 1920x1080 o 1280x720
- **Duración**: 10 segundos
- **Tamaño**: < 10 MB
- **FPS**: 30

Para README (GIF):
- **Formato**: GIF
- **Resolución**: 800x600 o 1000x750
- **Duración**: 10 segundos
- **Tamaño**: < 5 MB
- **FPS**: 15-20

---

**¡Tu video demo estará listo para impresionar! 🚀**
