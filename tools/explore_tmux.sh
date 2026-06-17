#!/bin/bash
# Explorador de NetHack usando tmux para capturar pantallas reales
# Uso: cd playground && ../tools/explore_tmux.sh

set -e

SESSION="nethack_explore"
LOG_DIR="/tmp/nethack_explore_$$"
mkdir -p "$LOG_DIR"

# Limpiar sesión anterior si existe
tmux kill-session -t "$SESSION" 2>/dev/null || true

# Limpiar saves
rm -f save/*

echo "============================================================"
echo "EXPLORADOR DE NETHACK CON TMUX"
echo "============================================================"
echo ""

# Iniciar tmux con el juego
tmux new-session -d -s "$SESSION" -x 120 -y 40 "LANG=es.UTF-8 ./nethack"
sleep 2

# Función para capturar pantalla
capture() {
    local label="$1"
    local file="$LOG_DIR/$label.txt"
    tmux capture-pane -t "$SESSION" -p > "$file"
    echo "📸 Capturado: $label"
}

# Función para enviar tecla
key() {
    tmux send-keys -t "$SESSION" "$1"
    sleep 0.5
}

# Función para enviar comando
cmd() {
    tmux send-keys -t "$SESSION" "$1" Enter
    sleep 1
}

# Función para analizar inglés en una pantalla
check_english() {
    local file="$1"
    local label="$2"
    
    # Buscar palabras inglesas comunes (excluyendo términos del juego)
    local english_words=$(grep -iE '\b(the|your|you|is|are|was|were|have|has|had|can|could|will|would|should|must|may|might|shall|to|from|with|without|and|or|but|in|on|at|by|for|of|this|that|these|those|it|its|my|his|her|their|our|not|no|yes|if|then|else|when|where|what|which|who|how|why|all|each|every|both|few|more|most|other|some|such|only|own|same|so|than|too|very|just|because|as|until|while|about|between|through|during|before|after|above|below|up|down|in|out|off|over|under|again|further|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|can|will|just|should|now)\b' "$file" | wc -l)
    
    if [ "$english_words" -gt 5 ]; then
        echo "⚠️  [$label] Posible inglés detectado ($english_words palabras)"
        echo "   Primeras líneas:"
        head -5 "$file" | sed 's/^/   /'
    else
        echo "✓  [$label] Parece español"
    fi
}

echo "============================================================"
echo "FASE 1: CREACIÓN DE PERSONAJE"
echo "============================================================"

# Esperar a que aparezca el prompt inicial
sleep 3
capture "01_inicio"

# Responder al tutorial
key "n"
sleep 1
capture "02_tutorial_no"

# Auto-selección de personaje
key "y"
sleep 2
capture "03_auto_pick"

# Confirmar personaje
key "y"
sleep 3
capture "04_confirmado"

# Pasar mensajes iniciales
for i in {1..10}; do
    key " "
done
sleep 2
capture "05_entrada_juego"

echo ""
echo "============================================================"
echo "FASE 2: EXPLORACIÓN DE MENÚS"
echo "============================================================"

# Ayuda (?)
cmd "?"
capture "06_ayuda"
key "q"

# Comandos extendidos (&)
cmd "&"
capture "07_extendidos"
key "q"

# Ayuda de teclas (?k)
cmd "?k"
capture "08_teclas"
key "q"

# Ayuda de comandos (?c)
cmd "?c"
capture "09_comandos"
key "q"

# Historial (?h)
cmd "?h"
capture "10_historial"
key "q"

# Atributos (C)
cmd "C"
capture "11_atributos"
key " "

# Inventario (i)
cmd "i"
capture "12_inventario"
key "q"

# Mirar (:)
cmd ":"
capture "13_mirar"
key " "

# Opciones (#options)
cmd "#options"
capture "14_opciones"
key "q"

# Versión (#version)
cmd "#version"
capture "15_version"
key " "

echo ""
echo "============================================================"
echo "FASE 3: JUGAR UN POCO"
echo "============================================================"

# Moverse
key "h"
key "h"
key "j"
key "j"
key "l"
key "l"
key "k"
sleep 1
capture "16_movimiento"

# Buscar
key "s"
sleep 1
capture "17_buscar"

# Esperar
key "."
sleep 1
capture "18_esperar"

echo ""
echo "============================================================"
echo "FASE 4: ANÁLISIS"
echo "============================================================"
echo ""

# Analizar cada pantalla
for file in "$LOG_DIR"/*.txt; do
    label=$(basename "$file" .txt)
    check_english "$file" "$label"
done

echo ""
echo "============================================================"
echo "FASE 5: SALIR"
echo "============================================================"

cmd "#quit"
key "y"
sleep 2

# Cerrar tmux
tmux kill-session -t "$SESSION"

echo ""
echo "============================================================"
echo "RESUMEN"
echo "============================================================"
echo "Capturas guardadas en: $LOG_DIR"
echo ""
echo "Para ver una captura específica:"
echo "  cat $LOG_DIR/06_ayuda.txt"
echo ""
echo "Para ver todas las capturas:"
echo "  for f in $LOG_DIR/*.txt; do echo \"=== \$f ===\"; cat \"\$f\"; done"
echo ""
