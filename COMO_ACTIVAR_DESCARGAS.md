# 🚀 Cómo Activar los Botones de Descarga en GitHub

## ❓ El Problema

Los enlaces de descarga en tu README de GitHub no funcionan porque apuntan a archivos que aún no existen. Necesitas crear una **Release** (versión) en GitHub con los archivos compilados.

## ✅ Solución Rápida (3 Pasos)

### Paso 1: Generar los Archivos de Instalación

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
cd /Users/mom/CascadeProjects/windsurf-project-2

# Instalar dependencias (solo la primera vez)
npm install

# Generar el instalador para macOS
npm run build-mac
```

**Resultado:** Se creará el archivo `dist/SpaceHub-1.0.0.dmg` (~95 MB)

**Opcional - Para Windows y Linux:**
```bash
npm run build-win    # Crea SpaceHub-Setup-1.0.0.exe
npm run build-linux  # Crea SpaceHub-1.0.0.AppImage
```

### Paso 2: Crear una Release en GitHub

1. **Ve a tu repositorio en GitHub:**
   - https://github.com/Franco/RequerinSpaceHub (o tu URL)

2. **Haz clic en "Releases"** (en el menú lateral derecho)

3. **Haz clic en "Create a new release"**

4. **Completa el formulario:**
   - **Tag version:** Escribe `v1.0.0` y selecciona "Create new tag"
   - **Release title:** `SpaceHub v1.0.0`
   - **Description:** Puedes copiar esto:
     ```
     Primera versión de SpaceHub - Aventura Espacial Educativa
     
     Descargas disponibles para macOS, Windows y Linux.
     ```

5. **Sube los archivos:**
   - Arrastra los archivos desde `dist/` a la sección "Attach binaries"
   - Archivos a subir:
     - `SpaceHub-1.0.0.dmg` (macOS)
     - `SpaceHub-Setup-1.0.0.exe` (Windows) - si lo generaste
     - `SpaceHub-1.0.0.AppImage` (Linux) - si lo generaste

6. **Haz clic en "Publish release"**

### Paso 3: Actualizar el README en GitHub

Necesitas reemplazar el README actual con el nuevo que tiene los enlaces correctos:

```bash
# En la terminal, en la carpeta del proyecto:
cd /Users/mom/CascadeProjects/windsurf-project-2

# Reemplazar README.md con README_GITHUB.md
cp README_GITHUB.md README.md

# Subir los cambios a GitHub
git add README.md GUIA_RELEASES_GITHUB.md COMO_ACTIVAR_DESCARGAS.md
git commit -m "Actualizar README con enlaces de descarga funcionales"
git push origin main
```

## ✨ ¡Listo!

Ahora los botones de descarga en tu repositorio de GitHub funcionarán correctamente. Los usuarios podrán:

1. Ver la página de releases
2. Descargar los instaladores para su sistema operativo
3. Instalar y jugar SpaceHub

## 🔍 Verificar que Funciona

1. Ve a tu repositorio en GitHub
2. Busca la sección "📥 Descargas" en el README
3. Haz clic en uno de los enlaces (ej: SpaceHub-1.0.0.dmg)
4. Debería iniciar la descarga del archivo

## 📚 Documentación Completa

Para más detalles, consulta:
- [GUIA_RELEASES_GITHUB.md](GUIA_RELEASES_GITHUB.md) - Guía completa paso a paso
- [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) - Instrucciones de compilación
- [INSTRUCCIONES_GITHUB.md](INSTRUCCIONES_GITHUB.md) - Configuración de GitHub

## 🆘 Problemas Comunes

### "npm: command not found"
Necesitas instalar Node.js:
```bash
brew install node
```

### "electron-builder not found"
```bash
npm install
```

### Los archivos son muy grandes para GitHub
No hay problema, GitHub Releases acepta archivos grandes (hasta 2 GB por archivo).

### No puedo compilar para Windows desde macOS
Es normal. Puedes:
1. Solo ofrecer la versión de macOS por ahora
2. Instalar Wine: `brew install --cask wine-stable`
3. Usar un servicio de CI/CD como GitHub Actions

---

**💡 Consejo:** Si solo quieres probar rápido, genera solo la versión de macOS con `npm run build-mac` y sube solo ese archivo a la release.
