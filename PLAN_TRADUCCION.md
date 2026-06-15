# Plan de Traducción NetHack-es (NetHack 5.0)

## Estado: COMPLETADO ✅

**Objetivo cumplido:** NetHack 5.0 traducido al español.

---

## 📊 Estado Final

### ✅ Archivos de datos (.es) — 29 archivos

| Archivo           | Estado                               |
| ----------------- | ------------------------------------ |
| `help.es`         | ✅ ¡Bienvenido a NetHack!            |
| `cmdhelp.es`      | ✅ Decir qué comando invoca          |
| `hh.es`           | ✅ Consejos de juego                 |
| `history.es`      | ✅ Contempla, mortal...              |
| `keyhelp.es`      | ✅ Ayuda de teclas                   |
| `opthelp.es`      | ✅ Ayuda de opciones                 |
| `optmenu.es`      | ✅ Menú de opciones                  |
| `usagehlp.es`     | ✅ Ayuda de uso                      |
| `wizhelp.es`      | ✅ Ayuda de mago                     |
| `symbols.es`      | ✅ Símbolos del juego                |
| `tribute.es`      | ✅ Homenaje a Terry Pratchett        |
| `data.base.es`    | ✅ Datos principales (6528 líneas)   |
| `data.es`         | ✅ Objetos y monstruos (6879 líneas) |
| `bogusmon.txt.es` | ✅ Monstruos falsos                  |
| `engrave.txt.es`  | ✅ Grabados aleatorios               |
| `epitaph.txt.es`  | ✅ Epitafios                         |
| `oracles.txt.es`  | ✅ Oráculos                          |
| `rumors.fal.es`   | ✅ Rumores falsos                    |
| `rumors.tru.es`   | ✅ Rumores verdaderos                |

### ✅ Archivos Lua traducidos (.lua.es)

| Archivo           | Contenido                                                    |
| ----------------- | ------------------------------------------------------------ |
| `dungeon.lua.es`  | Nombres de mazmorras traducidos                              |
| `quest.lua.es`    | 238 diálogos de quests traducidos (placeholders preservados) |
| `tut-1.lua.es`    | Tutorial parte 1 traducido                                   |
| `tut-2.lua.es`    | Tutorial parte 2 traducido                                   |
| `themerms.lua.es` | Habitaciones temáticas traducidas                            |

### ✅ Código C (.po) — 46 strings

| Ámbito         | Ejemplos                                                             |
| -------------- | -------------------------------------------------------------------- |
| Inventario     | "No llevas nada", "Varios", "En uso", "Letras de inventario usadas:" |
| Soltar         | "¿Qué tipo de objetos quieres soltar?"                               |
| Quitarse       | "¿Qué quieres quitarte?"                                             |
| Mirar          | "¿Qué quieres mirar:"                                                |
| Llamar/Nombrar | "¿Cómo quieres llamar a %s?"                                         |
| Apuntar        | "¿Apuntar a qué?", "un monstruo", "un objeto en el %s"               |
| Dip            | "¿en la fuente?", "¿en el fregadero?"                                |
| Más            | `--More--` → `--Más--`                                               |

### ✅ Modificaciones al código fuente

| Archivo            | Cambio                                           |
| ------------------ | ------------------------------------------------ |
| `src/invent.c`     | Envueltos strings de inventario en `_()`         |
| `src/do.c`         | Envuelto "Drop what type of items?"              |
| `src/do_wear.c`    | Envuelto "What do you want to take off?"         |
| `src/do_name.c`    | Envueltos prompts de llamar/nombrar              |
| `src/dungeon.c`    | Envuelto "What do you want to call?"             |
| `src/engrave.c`    | Envuelto "What do you want to %s?"               |
| `src/pager.c`      | Envuelto "What do you want to look at:"          |
| `src/apply.c`      | Envueltos "Aim for what?" y opciones             |
| `src/potion.c`     | Envueltos "into the fountain?", "into the sink?" |
| `win/tty/wintty.c` | Envuelto `--More--` en `_()`                     |

### 📁 Scripts de apoyo creados

| Script                        | Propósito                                         |
| ----------------------------- | ------------------------------------------------- |
| `translate_libretranslate.py` | Traduce strings vacíos del .po con LibreTranslate |
| `translate_google.py`         | Alternativa: traducción con Google Translate      |
| `translate_lua.py`            | Traduce archivos Lua con LibreTranslate           |
| `validate-spanglish.sh`       | Busca Spanglish en traducciones                   |
| `auto-translate.sh`           | Pipeline completo de traducción                   |

---

## Resumen Numérico

| Componente              | Progreso                        |
| ----------------------- | ------------------------------- |
| Archivos de datos (.es) | 🟢 **100%** (29/29)             |
| Archivos Lua (.lua.es)  | 🟢 **100%** texto visible (5/5) |
| Código C (.po)          | 🟢 **100%** (46/46)             |
| --More--                | 🟢 **100%** → --Más--           |
| **Total**               | 🟢 **Traducción completa**      |

---

## Historial de Cambios

| Fecha      | Cambio                                              |
| ---------- | --------------------------------------------------- |
| 2026-06-14 | Fase 1: Setup, .pot generado, merge con .po         |
| 2026-06-14 | Corrección de Spanglish en strings existentes       |
| 2026-06-14 | Traducción de 45 strings de código C                |
| 2026-06-15 | Traducción de dungeon.lua.es (nombres de mazmorras) |
| 2026-06-15 | Traducción de tut-1.lua.es (tutorial)               |
| 2026-06-15 | Traducción de tut-2.lua.es y themerms.lua.es        |
| 2026-06-15 | Traducción de quest.lua.es (238 diálogos)           |
| 2026-06-15 | Modificación --More-- → --Más-- en wintty.c         |
| 2026-06-15 | Revisión de calidad y corrección de placeholders    |
| 2026-06-15 | Commit a git                                        |

---

## Comandos Útiles

```bash
# Jugar
nethack-es

# Actualizar traducciones tras cambios en código
cd /home/ricard/proyectos/juego/nethack-es
bash auto-translate.sh

# Validar Spanglish
bash validate-spanglish.sh
```
