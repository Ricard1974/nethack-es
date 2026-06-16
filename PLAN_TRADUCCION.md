# Plan de Traducción NetHack-es (NetHack 5.0)

## Estado: EN PROGRESO — jugable en español con limitaciones

**Última actualización:** 2026-06-16

---

## 📊 Estado Actual

### Código C (.po)

| Métrica               | Valor                                         |
| --------------------- | --------------------------------------------- |
| Total en .po          | ~2.714                                        |
| Traducciones activas  | **2.580**                                     |
| Fuzzy (desactivadas)  | **134** (placeholders rotos, muestran inglés) |
| Sin traducir          | 0                                             |
| `msgfmt -c`           | ✅ 0 errores                                  |
| Cobertura real activa | ~95%                                          |

> Las 134 fuzzy son traducciones automáticas con placeholders `%s`/`%d` dañados.
> Se mantienen fuzzy para que el juego muestre el inglés original en lugar de
> texto roto. Requieren traducción manual.

### Archivos de datos (.es) — 29 archivos

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

### Archivos Lua

| Archivo           | Estado                                             |
| ----------------- | -------------------------------------------------- |
| `quest.lua.es`    | ✅ Traducido y **empaquetado en nhdat**            |
| `dungeon.lua`     | ❌ NO traducible (causa crasheo, ver Problemas)    |
| `Arc-*.lua` ...   | ❌ ~60 quest de rol sin traducir (inglés en nhdat) |
| `tut-1.lua.es`    | ✅ Tutorial parte 1 (pero no en nhdat)             |
| `tut-2.lua.es`    | ✅ Tutorial parte 2 (pero no en nhdat)             |
| `themerms.lua.es` | ✅ Habitaciones temáticas (pero no en nhdat)       |

### Sistema multi-idioma

| Componente                    | Estado |
| ----------------------------- | ------ |
| Detección automática LANG     | ✅     |
| Carga dinámica de .mo         | ✅     |
| Carga dinámica de .{lang}     | ✅     |
| Carga dinámica de .lua.{lang} | ✅     |
| `dlb_fopen` locale            | ✅     |
| `s_suffix()` locale-aware     | ✅     |

---

## 🔧 Cambios Recientes (junio 2026)

### s_suffix() locale-aware

**Archivo:** `src/hacklib.c`

`'s` posesivo inglés no existe en español. En lugar de reestructurar ~100 mensajes
que usan `s_suffix()`, se modificó la función para que detecte `get_lang()` y sea
no-op cuando el idioma es español. Ejemplo: `"Arturo's dog"` → `"Arturo dog"`.

**Problema relacionado:** `hacklib.c` lo usan utilidades como `dlb` que no linkean
contra `lang.o`. Se añadieron stubs débiles (`__attribute__((weak))`) para
`get_lang()` y `nh_gettext()` en `hacklib.c`.

### "the" traducible (2 lugares)

- **`src/role.c:2830`**: descripción del personaje (`"ricard de Arqueólog@"`)
- **`src/botl.c:1000`**: título de rango (`"Ricard de Evoker"`)

Traducción en `.po`: `"the"` → `"de"`, `" the "` → `" de "`.

### align_gtitle() traducible

**Archivo:** `src/pray.c`

`"god"` → `"dios"`, `"goddess"` → `"diosa"` ahora son traducibles vía `.po`.

### Atributos envueltos en N\_()

**Archivos:** `src/attrib.c`, `src/insight.c`

`attrname[]` ahora usa `N_("strength")` etc. para que los nombres completos
de atributos sean traducibles en enlightenment y mensajes de mejora.

Traducción: Fuerza, Destreza, Constitución, Inteligencia, Sabiduría, Carisma.

### "your " y "a " reactivados

En la creación de personaje, "your class" y "a race" ahora se traducen como
"de tu clase" y "de una raza".

### quest.lua.es empaquetado en nhdat

El archivo `dat/quest.lua.es` se añadió a `VARDATD` en el Makefile para que
se incluya automáticamente al reconstruir `nhdat` con `make dlb`.

### Script de test mejorado

`/tmp/test_nethack_es.py` — 5 sesiones automáticas con:

- Filtrado de falsos positivos (palabras españolas que coinciden con inglesas)
- Clasificación de palabras (inglesas puras vs compartidas)
- Filtrado de términos multi-palabra del juego ("the lady")
- Verificación positiva de traducciones esperadas
- Argumentos CLI (`--session`, `--verbose`, `--skip-positive`)

---

## 🧠 Decisiones Técnicas

### Estrategia QWERT para placeholders (cambio crítico)

**Problema:** Al traducir strings con `%s`, `%d`, `%1$s` con LibreTranslate, los
marcadores tipo `PH0`, `PH1`, `<<0>>`, `¤0¤` **no sobrevivían** a la traducción.

**Solución:** Reemplazar `%s`→`QWERT0`, `%d`→`QWERT1`, etc. ANTES de enviar a
LibreTranslate. `QWERT` parece un acrónimo y sobrevive al 100% de las traducciones.

### Nombres de mazmorra SIN `_()`

**Problema:** `at_dgn_entrance(_("The Quest"))` devuelve "La Misión", pero el
lookup interno (`dname_to_dnum`) compara contra los nombres canónicos en inglés
de `dungeon.lua`. Causa panic y crasheo.

**Solución:** Quitar `_()` de todas las llamadas a `at_dgn_entrance()` y
`dungeon_branch()` en el código C.

### Stubs débiles en hacklib.c

`hacklib.c` es usado por utilidades (`dlb`, `recover`) que NO linkean el juego
completo. Cualquier función de `hacklib.c` que llame a funciones del juego
(`get_lang()`, `nh_gettext()`) rompe esas utilidades.

**Solución:** Añadir stubs débiles (`__attribute__((weak))`) para estas funciones
en `hacklib.c`. Las utilidades usan el stub; el juego linkea la función real que
sobrescribe al stub.

### Nombres de opciones en inglés

Los nombres técnicos (`fruit`, `autodig`, `number_pad`, etc.) se mantienen SIN
traducir porque son identificadores usados en archivos de configuración
(`~/.nethackrc`) y comandos `O nombre`. Las descripciones y títulos de sección
sí se traducen.

### `N_()` en macros de optlist.h

Modificadas las macros `NHOPTB`/`NHOPTC`/`NHOPTO`/`NHOPTP` en
`include/optlist.h` para envolver `#a` (nombre) y `desc` (descripción) en
`N_()`, permitiendo a `xgettext` extraerlos.

---

## 📦 Requisitos de Ejecución

```bash
# Compilar traducciones
msgfmt po/es.po -o playground/locale/es/LC_MESSAGES/nethack.mo

# nhdat debe incluir quest.lua.es (make dlb lo hace automáticamente)
make dlb
cp dat/nhdat playground/

# Jugar
cd playground
LANG=es.UTF-8 ./nethack
```

Sin `nhdat`, `dlb_init()` falla y el juego crashea en `init_dungeons`.

---

## 🧪 Probar

```bash
python3 /tmp/test_nethack_es.py
# Opciones: --session basic|help|extended|options|explore|all
#           --verbose, --skip-positive
```

---

## 🚀 Próximos Pasos

- [ ] Traducir manualmente las 134 entradas fuzzy del `.po`
- [ ] Traducir quest Lua de roles (~60 archivos `Arc-*.lua`, `Bar-*.lua` etc.)
- [ ] Empaquetar tutoriales Lua (tut-1.lua.es, tut-2.lua.es) en nhdat
- [ ] Revisión humana de calidad de traducciones automáticas
- [ ] Prueba de juego real: menús de inventario, hechizos, combate

---

## 📁 Scripts de apoyo

| Script                  | Propósito                                                     |
| ----------------------- | ------------------------------------------------------------- |
| `translate_bulk.py`     | Traduce strings vacíos del .po con LibreTranslate (usa QWERT) |
| `translate_google.py`   | Alternativa: traducción con Google Translate                  |
| `translate_lua.py`      | Traduce archivos Lua con LibreTranslate                       |
| `validate-spanglish.sh` | Busca Spanglish en traducciones                               |
| `auto-translate.sh`     | Pipeline completo de traducción                               |

---

## 🐛 Problemas Conocidos

1. **134 fuzzy con placeholders rotos**: traducciones automáticas dañadas,
   desactivadas con fuzzy. Muestran inglés.
2. **Quest Lua de rol sin traducir**: ~60 archivos que contienen diálogos
   específicos de cada quest.
3. **dungeon.lua no traducible**: el lookup interno `dname_to_dnum()` crashea
   si los nombres están traducidos.
4. **Layout**: el español es ~15-20% más largo que el inglés. Posibles recortes.
5. **Nombres de opciones en inglés por diseño**: `fruit`, `autodig`, etc.
6. **Mensajes de plataformas obsoletas** (~200): Amiga, VMS, MSDOS sin traducir.

---

## 📜 Historial de Cambios

| Fecha      | Cambio                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| 2026-06-14 | Fase 1: Setup, .pot, merge con .po                                      |
| 2026-06-14 | Traducción de 45 strings de código C                                    |
| 2026-06-15 | Traducción de dungeon.lua.es, tut-\*.lua.es, themerms.lua.es            |
| 2026-06-15 | Traducción de quest.lua.es (238 diálogos)                               |
| 2026-06-15 | Envuelto ~1.033 strings en `_()` en todo el código C                    |
| 2026-06-15 | Reparación masiva PH→QWERT (1.067 strings)                              |
| 2026-06-15 | Menú de opciones traducido                                              |
| 2026-06-15 | Crasheo corregido: `_()` quitado de nombres de mazmorra                 |
| 2026-06-16 | **s_suffix() locale-aware**: no-op para español en hacklib.c            |
| 2026-06-16 | **Stubs débiles** para get_lang/nh_gettext en hacklib.c                 |
| 2026-06-16 | **"the" traducible**: role.c (descripción) y botl.c (título)            |
| 2026-06-16 | **align_gtitle()** con `_()` para god/goddess                           |
| 2026-06-16 | **Atributos** envueltos en N*()/ *() (attrib.c, insight.c)              |
| 2026-06-16 | **quest.lua.es** empaquetado en nhdat (VARDATD)                         |
| 2026-06-16 | **Test script mejorado**: 5 sesiones, filtrado español, verificación    |
| 2026-06-16 | **Traducciones reactivadas**: "your ", "a ", "Is this ok", "Yes; start" |

---

## Comandos Útiles

```bash
# Jugar
cd ~/proyectos/juego/nethack-es/playground
LANG=es.UTF-8 ./nethack

# Test
python3 /tmp/test_nethack_es.py

# Compilar .mo
msgfmt po/es.po -o playground/locale/es/LC_MESSAGES/nethack.mo

# Recompilar binario y nhdat
make -C src -j4 && cp src/nethack playground/
make dlb && cp dat/nhdat playground/

# Regenerar .pot después de cambios en código C
xgettext --default-domain=nethack --directory=. \
  --keyword=_ --keyword=N_ --add-comments=TRANSLATORS: \
  --sort-by-file -o po/nethack.pot src/*.c include/optlist.h

# Fusionar .pot en .po
msgmerge --previous --sort-by-file po/es.po po/nethack.pot -o po/es_new.po
mv po/es_new.po po/es.po

# Validar
msgfmt --statistics po/es.po
```
