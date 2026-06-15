# Problemas Encontrados en NetHack-es

Este documento recopila los problemas recurrentes encontrados durante el desarrollo de la traducción al español de NetHack 5.0. Sirve como referencia para evitar repetir los mismos fallos.

---

## Problema 1: El .mo no se regenera automáticamente

**Síntoma:** Las traducciones no aparecen aunque estén en el `.po`.

**Causa:** Después de editar `po/es.po`, el `.mo` no se regenera solo. Hay que ejecutar manualmente:

```bash
msgfmt po/es.po -o playground/locale/es/LC_MESSAGES/nethack.mo
cp playground/locale/es/LC_MESSAGES/nethack.mo ~/.local/games/nethack-es/locale/es/LC_MESSAGES/
```

**Solución:** Añadir esto al script `auto-translate.sh` o crear un hook de git post-commit.

---

## Problema 2: Nombres de mazmorras traducidos causan crashes

**Síntoma:** `panic("Couldn't resolve dungeon number for name ...")` en `dname_to_dnum()`.

**Causa:** El código C tiene referencias hardcodeadas a nombres de mazmorras en inglés. Si se traduce el nombre en `dungeon.lua.es` pero no se envuelve la referencia en C, el juego busca el nombre inglés y no lo encuentra.

**Ejemplo:**

```c
// Código original (busca el nombre en inglés):
quest_dnum = dname_to_dnum("The Quest");
// Si dungeon.lua.es tiene "La Misión", esta búsqueda falla
```

**Solución:** Envolver las referencias en `_()` en el código C:

```c
quest_dnum = dname_to_dnum(_("The Quest"));
```

**Archivos modificados (11 referencias total):**

- `src/dungeon.c:1175` — `dname_to_dnum("The Quest")`
- `src/dungeon.c:1176` — `dname_to_dnum("Sokoban")`
- `src/dungeon.c:1177` — `dname_to_dnum("The Gnomish Mines")`
- `src/dungeon.c:1178` — `dname_to_dnum("Vlad's Tower")`
- `src/dungeon.c:1179` — `dname_to_dnum("The Tutorial")`
- `src/dungeon.c:2435` — `at_dgn_entrance("The Quest")`
- `src/dungeon.c:3137` — `at_dgn_entrance("The Quest")`
- `src/do.c:1923` — `at_dgn_entrance("The Quest")`
- `src/mklev.c:2634` — `dungeon_branch("Fort Ludios")`
- `src/quest.c:193` — `dungeon_branch("The Quest")`
- `src/trap.c:4406` — `at_dgn_entrance("The Quest")`

---

## Problema 3: Nombres de mazmorras demasiado largos

**Síntoma:** `panic("dname too long for dungeon %d")` en `init_dungeon_dungeons()`.

**Causa:** El buffer `dname[24]` en `include/dungeon.h:62` solo acepta 24 caracteres (más el null terminator). Las traducciones largas exceden este límite.

**Ejemplos:**
| Nombre | Caracteres | ¿Cabe? |
|--------|-----------|--------|
| `"The Dungeons of Doom"` | 20 | ✅ |
| `"Las Mazmorras de la Perdición"` | 29 | ❌ CRASHEA |
| `"Mazmorras de la Perdición"` | 25 | ❌ CRASHEA |
| `"Mazmorras de Perdición"` | 22 | ✅ |

**Solución:** Usar nombres de **24 caracteres o menos**. Verificar siempre con:

```bash
grep 'name = "' dat/dungeon.lua.es | while read line; do
  name=$(echo "$line" | sed 's/.*"\(.*\)".*/\1/')
  [ ${#name} -gt 24 ] && echo "❌ '$name' = ${#name} caracteres"
done
```

---

## Problema 4: Variables de entorno no se propagan

**Síntoma:** El juego no carga las traducciones (todo en inglés). `echo $NETHACK_LOCALE_DIR` devuelve vacío.

**Causa:** El lanzador `~/.local/bin/nethack-es` debe exportar las variables ANTES de ejecutar el binario. Si no se configuran, `nh_getenv("NETHACK_LOCALE_DIR")` devuelve NULL y el .mo no se carga.

**Solución:** El lanzador debe contener:

```bash
export NETHACKDIR="$HOME/.local/games/nethack-es"
export NETHACK_LOCALE_DIR="$HOME/.local/games/nethack-es/locale"
cd "$NETHACKDIR"
exec ./nethack "$@"
```

**Verificación:**

```bash
# Después de ejecutar el lanzador:
echo $NETHACK_LOCALE_DIR
# Debe mostrar: /home/ricard/.local/games/nethack-es/locale
```

**Nota:** El `exec` reemplaza el proceso actual, pero las variables de entorno se heredan correctamente.

---

## Problema 5: Strings del juego no están envueltos en `_()`

**Síntoma:** El juego muestra texto en inglés aunque haya traducciones en el `.mo`.

**Causa:** Solo ~57 strings están envueltos en `_()` en el código C, de miles que existen. Para que un string se traduzca necesita:

1. Estar envuelto en `_()` en el código C
2. Tener una entrada `msgid`/`msgstr` en el `.po`
3. El `.mo` debe estar compilado con esa traducción

**Archivos con más strings sin envolver:**
| Archivo | Contenido |
|---------|-----------|
| `src/combat.c` | Mensajes de combate ("You hit the orc") |
| `src/objnam.c` | Nombres de objetos ("scroll of fire") |
| `src/role.c` | Nombres de roles ("Archeologist", "Barbarian") |
| `src/mon.c` | Mensajes de monstruos |
| `src/you.c` | Mensajes del jugador |
| `src/allmain.c` | Mensajes de inicio |

**Solución:** Envolver strings visibles en `_()` y añadir traducciones al `.po`. Priorizar los archivos con más impacto visual.

---

## Problema 6: El binario no se recompila automáticamente

**Síntoma:** Los cambios en código C no tienen efecto al ejecutar el juego. La versión del binario no cambia.

**Causa:** El Makefile de NetHack no siempre detecta cambios en archivos `.c`, especialmente después de un `make clean`.

**Solución:** Forzar recompilación:

```bash
touch src/*.c                    # Actualizar timestamps
make -C src                      # Recompilar solo src
make                             # Reconstruir datos (nhdat)
make install                     # Copiar a playground/
cp playground/nethack ~/.local/games/nethack-es/  # Copiar a instalación
```

**Verificación:**

```bash
nethack-es --version
# Debe mostrar la fecha/hora actual
```

---

## Problema 7: Archivos .lua.es no se copian a la instalación

**Síntoma:** El juego no encuentra las traducciones de archivos Lua (dungeon names, quest dialogues, tutorial).

**Causa:** El script `install.sh` original no copiaba los archivos `.lua.es` al directorio de instalación. `dlb_fopen` busca primero `.es` en el filesystem, luego en `nhdat`.

**Solución:** Añadir al `install.sh`:

```bash
cp dat/*.lua.es "$INSTALL_DIR/"
```

Y actualizar manualmente:

```bash
cp dat/*.lua.es playground/
cp dat/*.lua.es ~/.local/games/nethack-es/
```

---

## Problema 8: Faltan archivos de sistema en la instalación

**Síntoma:** El juego crashea al iniciar con `panic` en `init_dungeons`.

**Causa:** El directorio de instalación necesita archivos como `sysconf`, `license`, `logfile`, `perm`, `record`, `xlogfile`, `livelog`. Sin ellos, el juego no puede inicializarse correctamente.

**Solución:** Añadir al `install.sh`:

```bash
cp playground/sysconf "$INSTALL_DIR/"
cp playground/license "$INSTALL_DIR/"
touch "$INSTALL_DIR/perm" "$INSTALL_DIR/record"
touch "$INSTALL_DIR/logfile" "$INSTALL_DIR/xlogfile" "$INSTALL_DIR/livelog"
chmod 0660 "$INSTALL_DIR"/perm "$INSTALL_DIR"/record
chmod 0660 "$INSTALL_DIR"/logfile "$INSTALL_DIR"/xlogfile "$INSTALL_DIR"/livelog
```

---

## Problema 9: LibreTranslate rompe sintaxis Lua

**Síntoma:** Error `'}' expected near ...` al cargar archivos `.lua.es` traducidos.

**Causa:** LibreTranslate modifica la estructura de bloques `[[...]]` en archivos Lua, rompiendo la sintaxis. Especialmente problemático en `quest.lua` por los diálogos anidados.

**Solución:**

1. No usar traducción automática para archivos Lua con placeholders (`%p`, `%n`, etc.) o bloques anidados
2. Para archivos simples (tutorial, themerms), usar reemplazos selectivos solo en `text = "..."` o `text = [[...]]`
3. Para `quest.lua`, mantenerlo en inglés hasta tener traducción manual

---

## Problema 10: Placeholders de NetHack se pierden al traducir

**Síntoma:** Los placeholders `%p`, `%n`, `%d`, etc. aparecen en posiciones incorrectas o se duplican en el texto traducido.

**Causa:** LibreTranslate modifica o elimina placeholders durante la traducción. Incluso usando UUIDs como marcadores, algunos se pierden.

**Solución:**

1. Traducir solo bloques SIN placeholders (seguro, 100% preservación)
2. Para bloques CON placeholders, mantener en inglés
3. Si se necesita traducción, usar el método de UUIDs largos (12+ caracteres) y verificar conteo post-traducción

---

## Checklist de Verificación

Después de cualquier cambio, verificar en orden:

- [ ] **.po**: ¿Tiene las traducciones nuevas? (`grep "msgid" po/es.po | wc -l`)
- [ ] **.po**: ¿Es válido? (`msgfmt --check po/es.po`)
- [ ] **.mo**: ¿Está regenerado? (`msgfmt po/es.po -o playground/locale/.../nethack.mo`)
- [ ] **.mo**: ¿Está copiado a la instalación? (`cp ... ~/.local/games/nethack-es/locale/.../`)
- [ ] **Binario**: ¿Está recompilado? (`make -C src`)
- [ ] **Binario**: ¿Está copiado a la instalación? (`cp playground/nethack ~/.local/games/nethack-es/`)
- [ ] **.lua.es**: ¿Están en `playground/` y `~/.local/games/nethack-es/`?
- [ ] **Variables**: `NETHACKDIR` y `NETHACK_LOCALE_DIR` configuradas en el lanzador
- [ ] **Nombres**: Todos los nombres de mazmorras tienen ≤24 caracteres
- [ ] **Referencias**: Las 11 referencias en C están envueltas en `_()`
- [ ] **Archivos sistema**: `sysconf`, `license`, `logfile`, `perm`, `record`, `xlogfile`, `livelog` existen en la instalación
- [ ] **Versión**: `nethack-es --version` muestra la fecha/hora actual

---

## Comandos Rápidos de Reparación

```bash
# Regenerar .mo y copiar
msgfmt po/es.po -o playground/locale/es/LC_MESSAGES/nethack.mo
cp playground/locale/es/LC_MESSAGES/nethack.mo ~/.local/games/nethack-es/locale/es/LC_MESSAGES/

# Recompilar binario
touch src/*.c && make -C src && make && make install
cp playground/nethack ~/.local/games/nethack-es/

# Copiar .lua.es
cp dat/*.lua.es playground/
cp dat/*.lua.es ~/.local/games/nethack-es/

# Verificar todo
nethack-es --version
echo "NETHACKDIR=$NETHACKDIR"
echo "NETHACK_LOCALE_DIR=$NETHACK_LOCALE_DIR"
```
