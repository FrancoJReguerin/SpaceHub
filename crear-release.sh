#!/bin/bash

# Script para crear una release de SpaceHub
# Uso: ./crear-release.sh

echo "🚀 SpaceHub - Generador de Release"
echo "=================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encuentra package.json${NC}"
    echo "Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que node y npm están instalados
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js no está instalado${NC}"
    echo "Instala Node.js con: brew install node"
    exit 1
fi

echo -e "${BLUE}📦 Paso 1: Instalando dependencias...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Preguntar qué plataformas compilar
echo -e "${YELLOW}¿Para qué plataformas quieres compilar?${NC}"
echo "1) Solo macOS (recomendado para empezar)"
echo "2) macOS + Windows"
echo "3) macOS + Windows + Linux"
echo "4) Todas las plataformas"
read -p "Selecciona una opción (1-4): " opcion

echo ""
echo -e "${BLUE}📦 Paso 2: Generando archivos de instalación...${NC}"

case $opcion in
    1)
        echo "Compilando para macOS..."
        npm run build-mac
        ;;
    2)
        echo "Compilando para macOS y Windows..."
        npm run build-mac
        npm run build-win
        ;;
    3)
        echo "Compilando para macOS, Windows y Linux..."
        npm run build-mac
        npm run build-win
        npm run build-linux
        ;;
    4)
        echo "Compilando para todas las plataformas..."
        npm run build-mac
        npm run build-win
        npm run build-linux
        ;;
    *)
        echo -e "${RED}Opción inválida. Compilando solo para macOS...${NC}"
        npm run build-mac
        ;;
esac

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al compilar${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Compilación completada${NC}"
echo ""

# Mostrar archivos generados
echo -e "${BLUE}📁 Archivos generados en dist/:${NC}"
ls -lh dist/ | grep -E '\.(dmg|exe|AppImage)$' | awk '{print "  - " $9 " (" $5 ")"}'
echo ""

# Actualizar README
echo -e "${BLUE}📝 Paso 3: Actualizando README...${NC}"
if [ -f "README_GITHUB.md" ]; then
    cp README_GITHUB.md README.md
    echo -e "${GREEN}✅ README actualizado${NC}"
else
    echo -e "${YELLOW}⚠️  README_GITHUB.md no encontrado, saltando...${NC}"
fi
echo ""

# Instrucciones para GitHub
echo -e "${GREEN}✅ ¡Todo listo!${NC}"
echo ""
echo -e "${YELLOW}📤 Próximos pasos para activar las descargas en GitHub:${NC}"
echo ""
echo "1. Sube los cambios a GitHub:"
echo -e "   ${BLUE}git add .${NC}"
echo -e "   ${BLUE}git commit -m 'Preparar release v1.0.0'${NC}"
echo -e "   ${BLUE}git push origin main${NC}"
echo ""
echo "2. Ve a tu repositorio en GitHub y haz clic en 'Releases'"
echo ""
echo "3. Haz clic en 'Create a new release'"
echo ""
echo "4. Configura la release:"
echo "   - Tag: v1.0.0"
echo "   - Title: SpaceHub v1.0.0"
echo "   - Description: Primera versión de SpaceHub"
echo ""
echo "5. Arrastra estos archivos desde la carpeta dist/:"
ls dist/ | grep -E '\.(dmg|exe|AppImage)$' | sed 's/^/   - /'
echo ""
echo "6. Haz clic en 'Publish release'"
echo ""
echo -e "${GREEN}🎉 ¡Los botones de descarga funcionarán después de publicar la release!${NC}"
echo ""
echo -e "${BLUE}📚 Para más información, consulta: COMO_ACTIVAR_DESCARGAS.md${NC}"
