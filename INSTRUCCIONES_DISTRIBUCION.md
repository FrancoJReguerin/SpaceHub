# 🚀 SpaceHub - Instrucciones de Distribución

## 📦 Archivos de la Aplicación

La aplicación ha sido construida exitosamente. Encontrarás los archivos en la carpeta `dist/`:

### Para macOS:
- **SpaceHub-1.0.0.dmg** - Instalador DMG (recomendado para compartir)
- **SpaceHub-1.0.0-mac.zip** - Archivo ZIP con la aplicación

### Ubicación:
```
/Users/mom/CascadeProjects/windsurf-project-2/dist/
```

## 🎮 Cómo Instalar y Usar

### En tu Mac:
1. Abre el archivo `SpaceHub-1.0.0.dmg`
2. Arrastra el icono de SpaceHub a la carpeta Aplicaciones
3. Abre SpaceHub desde tu carpeta de Aplicaciones
4. Si macOS te pide permisos, ve a: **Preferencias del Sistema > Seguridad y Privacidad** y permite la aplicación

## 📤 Cómo Compartir la Aplicación

### Opción 1: Compartir el DMG (Recomendado)
El archivo `SpaceHub-1.0.0.dmg` es el mejor para compartir:
- Es fácil de instalar para otros usuarios de Mac
- Solo arrastra y suelta en Aplicaciones
- Tamaño aproximado: ~100-150 MB

### Opción 2: Compartir el ZIP
El archivo `SpaceHub-1.0.0-mac.zip`:
- Más compacto para subir a la nube
- Requiere descomprimir antes de usar

### Dónde Compartir:
1. **Google Drive / Dropbox**: Sube el DMG y comparte el enlace
2. **WeTransfer**: Envío directo hasta 2GB gratis
3. **iCloud**: Comparte con otros usuarios de Apple
4. **USB**: Copia el DMG directamente

## 🌐 Construir para Otras Plataformas

### Para Windows:
```bash
npm run build-win
```
Genera: `SpaceHub Setup 1.0.0.exe`

### Para Linux:
```bash
npm run build-linux
```
Genera: `SpaceHub-1.0.0.AppImage`

## 🔧 Reconstruir la Aplicación

Si haces cambios al código:

```bash
# 1. Asegúrate de tener las dependencias
npm install

# 2. Construye para Mac
npm run build-mac

# 3. Los nuevos archivos estarán en dist/
```

## 📝 Notas Importantes

- **Firma de Código**: La aplicación no está firmada con certificado de Apple Developer. Los usuarios verán una advertencia de seguridad la primera vez.
- **Solución**: Los usuarios deben hacer clic derecho > Abrir la primera vez, o permitir en Preferencias del Sistema.
- **Tamaño**: La aplicación incluye Electron (~100MB) más el juego (~1MB).

## 🎯 Contenido del Juego

✅ Mapa corregido y funcional
✅ 10 habitaciones explorables
✅ Minijuegos educativos sobre el espacio
✅ Sistema de misiones y recursos
✅ Información científica de la NASA
✅ Modo Marte con combate espacial

## 👥 Créditos

Creado por:
- Franco Reguerin
- Alejandro Mendoza
- Rudy Navarro
- Octavio Pereyra
- Cesar Pereyra
- Diego Peña

---

**¡Disfruta explorando el espacio! 🌌**
