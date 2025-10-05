# 📦 Guía para Crear Releases en GitHub

Esta guía te mostrará cómo generar los archivos de distribución y crear una release en GitHub para que los botones de descarga funcionen correctamente.

## 🔧 Paso 1: Preparar el Entorno

### Instalar Dependencias

```bash
cd /Users/mom/CascadeProjects/windsurf-project-2
npm install
```

Esto instalará:
- `electron` - Para ejecutar la aplicación
- `electron-builder` - Para crear los instaladores

## 🏗️ Paso 2: Generar los Archivos de Distribución

### Opción A: Generar para tu Sistema Operativo Actual (macOS)

```bash
npm run build-mac
```

Esto creará:
- `dist/SpaceHub-1.0.0.dmg` - Instalador para macOS (~95 MB)
- `dist/SpaceHub-1.0.0-arm64.dmg` - Para Mac con chip Apple Silicon (si aplica)

### Opción B: Generar para Windows (requiere configuración adicional en macOS)

```bash
npm run build-win
```

**Nota:** Para compilar para Windows desde macOS, necesitas instalar `wine`:
```bash
brew install --cask wine-stable
```

Esto creará:
- `dist/SpaceHub-Setup-1.0.0.exe` - Instalador para Windows (~100 MB)

### Opción C: Generar para Linux

```bash
npm run build-linux
```

Esto creará:
- `dist/SpaceHub-1.0.0.AppImage` - Ejecutable para Linux (~100 MB)

### Opción D: Generar para Todas las Plataformas

```bash
npm run build-mac && npm run build-win && npm run build-linux
```

**⚠️ Importante:** Los archivos se generarán en la carpeta `dist/`

## 📤 Paso 3: Crear una Release en GitHub

### 3.1 Subir los Cambios a GitHub (si no lo has hecho)

```bash
git add .
git commit -m "Preparar release v1.0.0"
git push origin main
```

### 3.2 Crear la Release en GitHub

1. **Ve a tu repositorio en GitHub:**
   - https://github.com/Franco/RequerinSpaceHub (o tu URL)

2. **Navega a la sección de Releases:**
   - Haz clic en "Releases" en el menú lateral derecho
   - O ve directamente a: `https://github.com/TU_USUARIO/SpaceHub/releases`

3. **Crear una Nueva Release:**
   - Haz clic en **"Create a new release"** o **"Draft a new release"**

4. **Configurar la Release:**
   
   **Tag version:** `v1.0.0`
   - Haz clic en "Choose a tag" y escribe `v1.0.0`
   - Selecciona "Create new tag: v1.0.0 on publish"
   
   **Release title:** `SpaceHub v1.0.0 - Primera Versión`
   
   **Description:** (Copia esto)
   ```markdown
   # 🚀 SpaceHub v1.0.0 - Primera Versión
   
   ## ✨ Características Principales
   
   - 🎮 10 habitaciones explorables en la estación espacial
   - 🧩 Minijuegos educativos interactivos
   - 📚 Información científica real de la NASA
   - 🌌 Modo Marte con desafíos únicos
   - 👨‍🚀 Astronautas legendarios jugables
   - 📊 Sistema de gestión de recursos
   - 🗺️ Mapa interactivo de la nave
   - 🎒 Sistema de inventario
   
   ## 📥 Descargas
   
   Elige el instalador según tu sistema operativo:
   
   - **macOS:** Descarga `SpaceHub-1.0.0.dmg`
   - **Windows:** Descarga `SpaceHub-Setup-1.0.0.exe`
   - **Linux:** Descarga `SpaceHub-1.0.0.AppImage`
   
   ## 🎮 Cómo Instalar
   
   ### macOS
   1. Descarga el archivo `.dmg`
   2. Abre el archivo descargado
   3. Arrastra SpaceHub a la carpeta Aplicaciones
   4. Abre SpaceHub desde Aplicaciones
   
   ### Windows
   1. Descarga el archivo `.exe`
   2. Ejecuta el instalador
   3. Sigue las instrucciones en pantalla
   4. Busca SpaceHub en el menú de inicio
   
   ### Linux
   1. Descarga el archivo `.AppImage`
   2. Dale permisos de ejecución: `chmod +x SpaceHub-1.0.0.AppImage`
   3. Ejecuta el archivo: `./SpaceHub-1.0.0.AppImage`
   
   ## 🐛 Reportar Problemas
   
   Si encuentras algún bug, por favor repórtalo en la sección de [Issues](../../issues)
   ```

5. **Subir los Archivos:**
   - En la sección **"Attach binaries"** o **"Upload assets"**
   - Arrastra y suelta los archivos desde tu carpeta `dist/`:
     - `SpaceHub-1.0.0.dmg` (macOS)
     - `SpaceHub-Setup-1.0.0.exe` (Windows)
     - `SpaceHub-1.0.0.AppImage` (Linux)
   - Espera a que se suban todos los archivos (puede tardar varios minutos)

6. **Publicar la Release:**
   - Marca la casilla **"Set as the latest release"**
   - Haz clic en **"Publish release"**

## ✅ Paso 4: Verificar que Funciona

1. Ve a tu repositorio en GitHub
2. Los enlaces de descarga en el README ahora deberían funcionar
3. Prueba hacer clic en uno de los enlaces de descarga

Los enlaces `../../releases` ahora redirigirán a la página de releases donde están los archivos.

## 🔄 Para Futuras Versiones

Cuando quieras lanzar una nueva versión:

1. **Actualiza la versión en `package.json`:**
   ```json
   "version": "1.1.0"
   ```

2. **Genera los nuevos builds:**
   ```bash
   npm run build-mac
   npm run build-win
   npm run build-linux
   ```

3. **Crea una nueva release en GitHub:**
   - Tag: `v1.1.0`
   - Sube los nuevos archivos
   - Describe los cambios en las notas de la versión

## 🚨 Solución de Problemas

### Error: "electron-builder not found"
```bash
npm install --save-dev electron-builder
```

### Error al compilar para Windows desde macOS
```bash
brew install --cask wine-stable
```

### Los archivos son muy grandes
- Es normal, Electron empaqueta Chromium y Node.js
- Los tamaños típicos son:
  - macOS: 90-100 MB
  - Windows: 95-105 MB
  - Linux: 95-105 MB

### La release no aparece
- Asegúrate de haber marcado "Set as the latest release"
- Verifica que los archivos se hayan subido completamente
- Actualiza la página del repositorio

## 📝 Notas Importantes

1. **Iconos:** El proyecto busca `icon.icns` (macOS), `icon.ico` (Windows) y `icon.png` (Linux). Si no los tienes, electron-builder usará un icono por defecto.

2. **Firma de Código:** Para distribución profesional, deberías firmar las aplicaciones:
   - macOS: Requiere Apple Developer Account
   - Windows: Requiere certificado de firma de código

3. **Tamaño del Repositorio:** No subas los archivos de `dist/` al repositorio Git. Ya están en `.gitignore`.

4. **GitHub Releases:** Los archivos en releases no cuentan para el límite de tamaño del repositorio.

---

## 🎯 Resumen Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Generar builds
npm run build-mac    # Para macOS
npm run build-win    # Para Windows  
npm run build-linux  # Para Linux

# 3. Ir a GitHub → Releases → Create new release
# 4. Tag: v1.0.0
# 5. Subir archivos de dist/
# 6. Publicar

# ✅ ¡Los botones de descarga ahora funcionarán!
```
