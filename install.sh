#!/bin/bash
# NetHack-es: Instalación con un solo clic
# Uso: curl -sL https://git.io/JUMP | bash
# O:   bash install.sh

set -e

VERDE='\033[0;32m'
AZUL='\033[0;34m'
AMARILLO='\033[1;33m'
ROJO='\033[0;31m'
NC='\033[0m'

echo -e "${AZUL}╔══════════════════════════════════════╗${NC}"
echo -e "${AZUL}║${NC}     ${VERDE}NetHack-es${NC} — Instalación      ${AZUL}║${NC}"
echo -e "${AZUL}║${NC}  NetHack 5.0 en Español            ${AZUL}║${NC}"
echo -e "${AZUL}╚══════════════════════════════════════╝${NC}"
echo ""

# Directorio de instalación
INSTALL_DIR="$HOME/.local/games/nethack-es"
BIN_DIR="$HOME/.local/bin"
APP_DIR="$HOME/.local/share/applications"
TMP_DIR="/tmp/nethack-es-install"

echo -e "${AZUL}📦 Instalando en:${NC} $INSTALL_DIR"
echo ""

# 1. Dependencias
echo -e "${AZUL}🔧 Instalando dependencias...${NC}"
if command -v apt &> /dev/null; then
    sudo apt update -qq
    sudo apt install -y -qq build-essential libncurses-dev flex bison gettext git 2>&1 | tail -1
elif command -v dnf &> /dev/null; then
    sudo dnf install -y gcc ncurses-devel flex bison gettext git
elif command -v pacman &> /dev/null; then
    sudo pacman -S --noconfirm base-devel ncurses flex bison gettext git
else
    echo -e "${ROJO}❌ No se pudo instalar dependencias. Instálalas manualmente.${NC}"
    exit 1
fi

# 2. Clonar o actualizar
echo -e "${AZUL}📥 Descargando NetHack-es...${NC}"
if [ -d "$TMP_DIR" ]; then
    rm -rf "$TMP_DIR"
fi
git clone --depth 1 https://github.com/Ricard1974/nethack-es.git "$TMP_DIR" 2>&1 | tail -1
cd "$TMP_DIR"

# 3. Compilar
echo -e "${AZUL}⚙️  Compilando (tarda unos minutos)...${NC}"
cd sys/unix && sh setup.sh hints/linux.500 2>&1 | tail -1 && cd ../..
make fetch-lua 2>&1 | tail -1
make 2>&1 | tail -1

# 4. Preparar .mo
msgfmt po/combined-es.po -o po/combined-es.mo 2>&1 | tail -1

# 5. Instalar
echo -e "${AZUL}📂 Instalando en $INSTALL_DIR...${NC}"
mkdir -p "$INSTALL_DIR"
cp src/nethack "$INSTALL_DIR/"
cp dat/nhdat "$INSTALL_DIR/"
mkdir -p "$INSTALL_DIR/locale/es/LC_MESSAGES"
cp po/combined-es.mo "$INSTALL_DIR/locale/es/LC_MESSAGES/nethack.mo"
cp nethack-es "$INSTALL_DIR/" 2>/dev/null || true

# 6. Crear lanzador
echo -e "${AZUL}🚀 Creando lanzador...${NC}"
mkdir -p "$BIN_DIR"
cat > "$BIN_DIR/nethack-es" << EOF
#!/bin/bash
# NetHack-es lanzador
cd "$INSTALL_DIR"
exec ./nethack "\$@"
EOF
chmod +x "$BIN_DIR/nethack-es"

# Añadir ~/.local/bin al PATH si no está
if ! grep -q "\.local/bin" "$HOME/.bashrc" 2>/dev/null; then
    echo 'export PATH="$PATH:$HOME/.local/bin"' >> "$HOME/.bashrc"
    echo -e "${AZUL}➕ Añadido ~/.local/bin al PATH${NC}"
fi

# 7. Crear acceso directo (menú de aplicaciones)
mkdir -p "$APP_DIR"
cat > "$APP_DIR/nethack-es.desktop" << EOF
[Desktop Entry]
Type=Application
Name=NetHack-es
Comment=NetHack 5.0 en Español
Exec=$BIN_DIR/nethack-es
Icon=applications-games
Terminal=true
Categories=Game;RolePlaying;
Keywords=nethack;roguelike;spanish;
EOF

# 8. Limpiar
rm -rf "$TMP_DIR"

# 9. Resultado
echo ""
echo -e "${VERDE}╔══════════════════════════════════════╗${NC}"
echo -e "${VERDE}║${NC}     ✅  NetHack-es instalado        ${VERDE}║${NC}"
echo -e "${VERDE}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "  📍 ${AZUL}Juego:${NC}        $INSTALL_DIR"
echo -e "  🎮 ${AZUL}Ejecutar:${NC}     $BIN_DIR/nethack-es"
echo -e "  🖥️ ${AZUL}Menú:${NC}          Busca 'NetHack-es' en tus aplicaciones"
echo ""
echo -e "  Para jugar ahora:"
echo -e "    ${VERDE}export PATH=\"\$PATH:$BIN_DIR\"${NC}"
echo -e "    ${VERDE}nethack-es${NC}"
echo ""
echo -e "  Si no te funciona el PATH, abre una terminal nueva o ejecuta:"
echo -e "    ${VERDE}source ~/.bashrc${NC}"
echo ""
echo -e "${AMARILLO}⚠️  Necesitas cerrar y abrir la terminal${NC}"
echo -e "${AMARILLO}   o ejecutar 'source ~/.bashrc' para usar 'nethack-es'${NC}"
