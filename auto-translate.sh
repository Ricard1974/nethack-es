#!/bin/bash
# auto-translate.sh - Pipeline completo de traducción

set -e

cd "$(dirname "$0")"
echo "🎯 Pipeline de Traducción NetHack-es"
echo "=================================="
echo ""

# 1. Generar .pot actualizado
echo "1/5 🔄 Generando archivo .pot desde código fuente..."
if xgettext --keyword=_ --keyword=N_ --keyword=pgettext:1c,2 \
  --from-code=UTF-8 -o po/nethack.pot src/**/*.c include/**/*.h 2>/dev/null; then
    echo "   ✅ .pot generado"
else
    echo "   ⚠️  No se pudo generar .pot (puede que no haya nuevos strings)"
fi

# 2. Merge con .po existente
echo "2/5 🔀 Merge .pot con .po existente..."
if msgmerge -U po/combined-es.po po/nethack.pot 2>/dev/null; then
    echo "   ✅ Merge completado"
else
    echo "   ⚠️  No se pudo hacer merge"
fi

# 3. Traducir con LibreTranslate
echo "3/5 🤖 Traduciendo strings vacíos con LibreTranslate..."
if python3 translate_libretranslate.py; then
    echo "   ✅ Traducción completada"
else
    echo "   ❌ Error en traducción"
    exit 1
fi

# 4. Validar
echo "4/5 🔍 Validando integridad..."
if msgfmt po/combined-es.po --check 2>/dev/null; then
    echo "   ✅ Sintaxis válida"
else
    echo "   ❌ Error de sintaxis en .po"
    exit 1
fi

stats=$(msgfmt po/combined-es.po --statistics 2>&1)
echo "   📊 $stats"

# 5. Compilar
echo "5/5 ✅ Compilando a .mo..."
if msgfmt po/combined-es.po -o ~/.local/games/nethack-es/locale/es/LC_MESSAGES/nethack.mo; then
    echo "   ✅ .mo compilado"
else
    echo "   ❌ Error compilando .mo"
    exit 1
fi

echo ""
echo "🎉 Pipeline completado!"
echo "Para jugar: nethack-es"
