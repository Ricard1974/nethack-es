#!/usr/bin/env python3
"""
Script para envolver arrays de strings estaticos con N_()
y sus usos con _().

Patron: static const char *const nombre[] = { "texto", ... };
-> N_("texto") en el array
-> _(array[...]) en el uso

Uso: python3 tools/wrap_arrays.py [--dry-run]
"""

import re, os, sys

SRC_DIR = os.path.expanduser("~/proyectos/juego/nethack-es/src")

# Archivos con arrays de strings visibles pendientes
TARGET_FILES = [
    "eat.c",
    "trap.c",
    "zap.c",
    "pray.c",
    "apply.c",
    "potion.c",
    "cmd.c",
    "pickup.c",
    "shk.c",
    "fountain.c",
    "dig.c",
    "sounds.c",
    "engrave.c",
    "uhitm.c",
    "hack.c",
    "priest.c",
    "vault.c",
    "wield.c",
    "teleport.c",
    "mhitu.c",
    "mon.c",
    "muse.c",
    "sit.c",
    "detect.c",
    "lock.c",
    "mcastu.c",
    "polyself.c",
    "steed.c",
    "dokick.c",
]

# Funciones conocidas que muestran texto al usuario
DISPLAY_FUNCS = [
    "pline",
    "You",
    "You_cant",
    "You_feel",
    "You_hear",
    "You_see",
    "Your",
    "There",
    "Norep",
    "verbalize",
    "urgent_pline",
    "raw_printf",
    "add_menu_str",
    "end_menu",
]


def find_arrays(content):
    """Encuentra arrays de strings y sus contenidos."""
    # Patron: static const char *const nombre[] = { ... };
    pattern = re.compile(
        r"(static\s+(?:NEARDATA\s+)?const\s+char\s+\*?\*?\s*"
        r"\w+\s*\[\]\s*=\s*\{)"
        r"([^}]*)\}",
        re.DOTALL,
    )

    arrays = []
    for m in pattern.finditer(content):
        header = m.group(1)
        body = m.group(2)
        array_start = m.start(2)

        strings = []
        for sm in re.finditer(r'"((?:[^"\\]|\\.)*)"', body):
            inner = sm.group(1)
            s_start = array_start + sm.start(0)
            s_end = array_start + sm.end(0)

            # Saltar strings ya envueltos
            before = content[max(0, s_start - 4) : s_start]
            if '_("' in before or 'N_("' in before:
                continue

            # Saltar strings muy cortos o tecnicos
            if len(inner) < 6:
                continue
            if inner.startswith(("Copyright", "NetHack", "Stichting")):
                continue
            if "/" in inner or "\\" in inner:
                continue
            # Solo texto con letras
            if not re.search(r"[a-zA-Záéíóú]", inner):
                continue

            strings.append((s_start, s_end, inner))

        if strings:
            arrays.append(strings)

    return arrays


def find_array_usages(content, array_name):
    """Encuentra usos de un array que necesitan _()."""
    pattern = re.compile(r"\b" + re.escape(array_name) + r"\s*\[[^\]]*\]")
    usages = []
    for m in pattern.finditer(content):
        before = content[max(0, m.start() - 3) : m.start()]
        if "_(" in before:
            continue
        # Verificar que no sea una declaracion
        line_start = content.rfind("\n", 0, m.start())
        if line_start == -1:
            line_start = 0
        line = content[line_start : m.start()]
        if "static" in line or "const" in line:
            continue
        usages.append((m.start(), m.end(), m.group()))
    return usages


def process_file(fpath, dry_run=False):
    """Procesa un archivo."""
    with open(fpath, "r", encoding="latin-1", errors="replace") as f:
        content = f.read()

    changes = 0
    replacements = []

    # 1. Envolver strings en arrays con N_()
    arrays = find_arrays(content)
    for strings in arrays:
        for s_start, s_end, inner in strings:
            old = content[s_start:s_end]
            new = "N_(" + old + ")"
            replacements.append((s_start, s_end, old, new))

    # Aplicar reemplazos (de atras a adelante)
    for s_start, s_end, old, new in sorted(replacements, reverse=True):
        if dry_run:
            print(f"  N_: {old[:60]}")
        else:
            content = content[:s_start] + new + content[s_end:]
            changes += 1

    # 2. Envolver usos de arrays con _() - solo para funciones de salida
    # Esta parte es mas compleja y requiere analisis contextual
    # Por ahora solo reportamos en dry_run

    if not dry_run and changes > 0:
        with open(fpath, "w", encoding="latin-1") as f:
            f.write(content)

    return changes


def main():
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("MODO DRY RUN - solo reporte\n")

    total = 0
    for fname in TARGET_FILES:
        fpath = os.path.join(SRC_DIR, fname)
        if not os.path.exists(fpath):
            continue
        changes = process_file(fpath, dry_run)
        if changes > 0 or dry_run:
            status = f"{changes} cambios" if not dry_run else "(reportado)"
            print(f"  {fname}: {status}")
        total += changes

    print(f"\nTotal: {total} cambios" if not dry_run else "")


if __name__ == "__main__":
    main()
