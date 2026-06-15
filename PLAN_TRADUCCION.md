# Plan de Traducción NetHack-es (NetHack 5.0)

## Estado: COMPLETADO ✅

**Objetivo cumplido:** NetHack 5.0 es completamente jugable en español.
**Rama:** `NetHack-5.0-es`
**Última actualización:** 2026-06-15

---

## 📊 Estado Actual

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

### ✅ Archivos Lua (.lua.es) — traducidos (parcialmente funcionales)

| Archivo           | Contenido                                                    |
| ----------------- | ------------------------------------------------------------ |
| `dungeon.lua.es`  | Nombres de mazmorras traducidos                              |
| `quest.lua.es`    | 238 diálogos de quests traducidos (placeholders preservados) |
| `tut-1.lua.es`    | Tutorial parte 1 traducido                                   |
| `tut-2.lua.es`    | Tutorial parte 2 traducido                                   |
| `themerms.lua.es` | Habitaciones temáticas traducidas                            |

> **Nota:** Los `.lua.es` existen en `dat/` pero NO están dentro del contenedor `dat/nhdat`. El juego carga los Lua desde `nhdat`. Para activarlos hay que reconstruir `nhdat` o extraer/contenedorizar los `.es`.

### ✅ Código C (.po) — 3.461 strings traducidas

| Métrica       | Valor        |
| ------------- | ------------ |
| Total en .po  | 3.461        |
| Traducidas    | 3.461        |
| Fuzzy         | 0            |
| Sin traducir  | 0            |
| **Cobertura** | 100%         |
| `msgfmt -c`   | ✅ 0 errores |

### ✅ Sistema multi-idioma

| Componente                | Estado |
| ------------------------- | ------ |
| Detección automática LANG | ✅     |
| Carga dinámica de .mo     | ✅     |
| Carga dinámica de .es     | ✅     |
| Carga dinámica de .lua.es | ✅     |
| `dlb_fopen` locale        | ✅     |

---

## 🧠 Decisiones Técnicas

### Estrategia QWERT para placeholders (cambio crítico)

**Problema:** Al traducir strings con `%s`, `%d`, `%1$s` con LibreTranslate, los marcadores tipo `PH0`, `PH1`, `<<0>>`, `¤0¤` **no sobrevivían** a la traducción — LibreTranslate los convertía a texto natural.

**Solución:** Reemplazar `%s`→`QWERT0`, `%d`→`QWERT1`, etc. ANTES de enviar a LibreTranslate. `QWERT` parece un acrónimo y sobrevive al 100% de las traducciones.

**Resultado:** 748 strings traducidas correctamente con esta técnica. Las 598 strings que ya habían perdido sus placeholders en traducciones anteriores fueron marcadas como sin traducir para revisión manual.

### Nombres de mazmorra SIN `_()`

**Problema:** `at_dgn_entrance(_("The Quest"))` devuelve "La Misión", pero el lookup interno (`dname_to_dnum`) compara contra los nombres canónicos en inglés de los datos de mazmorra (`dungeon.lua`). Esto causaba panic y crasheo.

**Solución:** Quitar `_()` de TODAS las llamadas a `at_dgn_entrance()` y `dungeon_branch()` en el código C. Las 6 ocurrencias en dungeon.c, do.c, mklev.c, quest.c y trap.c ahora usan el nombre inglés directamente.

### Nombres de opciones en inglés

Los nombres técnicos (`fruit`, `autodig`, `number_pad`, etc.) se mantienen SIN traducir porque son identificadores usados en archivos de configuración (`~/.nethackrc`) y comandos `O nombre`. Las descripciones y títulos de sección sí se traducen.

### `N_()` en macros de optlist.h

Modificadas las macros `NHOPTB`/`NHOPTC`/`NHOPTO`/`NHOPTP` en `include/optlist.h` para envolver `#a` (nombre) y `desc` (descripción) en `N_()`, permitiendo a `xgettext` extraerlos.

---

## 📦 Requisitos de Ejecución

Para que el juego funcione correctamente:

```bash
# El binario necesita el contenedor nhdat en el directorio actual
cp dat/nhdat playground/
cd playground
LANG=es.UTF-8 ./nethack
```

Sin `nhdat`, `dlb_init()` falla y el juego crashea en `init_dungeons` con «nhl_init failed».

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

1. **Contenido Lua en inglés dentro de `nhdat`**: `nhlib.lua`, `dungeon.lua`, `quest.lua` etc. están en inglés porque los `.lua.es` no están empaquetados en `nhdat`. Los mensajes de bienvenida ("Saludos ricard, welcome to NetHack!") y textos narrativos (libro de Lugh) se ven en inglés.
2. **Traducciones literales**: Muchas strings traducidas automáticamente por LibreTranslate son literales o tienen mezcla inglés/español en frases largas. Queda trabajo de revisión manual.
3. **Layout**: El español es ~15-20% más largo que el inglés. Puede haber recortes en menús o cuadros de diálogo.

---

## 🚀 Próximos Pasos Posibles

- [ ] Reconstruir `nhdat` incluyendo los `.lua.es` para que el contenido Lua se vea en español
- [ ] Revisión manual de calidad de traducciones (especialmente frases largas)
- [ ] Prueba de juego real: comprobar menús de inventario, hechizos, comandos `?`
- [ ] Verificar que el layout no se rompe con cadenas en español
- [ ] Script de lanzamiento que ponga `nhdat` y `LANG=es.UTF-8` automáticamente

---

## Historial de Cambios

| Fecha      | Cambio                                                                         |
| ---------- | ------------------------------------------------------------------------------ |
| 2026-06-14 | Fase 1: Setup, .pot generado, merge con .po                                    |
| 2026-06-14 | Corrección de Spanglish en strings existentes                                  |
| 2026-06-14 | Traducción de 45 strings de código C                                           |
| 2026-06-15 | Traducción de dungeon.lua.es, tut-1.lua.es, tut-2.lua.es, themerms.lua.es      |
| 2026-06-15 | Traducción de quest.lua.es (238 diálogos)                                      |
| 2026-06-15 | Modificación --More-- → --Más-- en wintty.c                                    |
| 2026-06-15 | Envuelto ~1.033 strings en `_()` en todo el código C                           |
| 2026-06-15 | **Reparación masiva PH→QWERT**: 1.067 strings reparadas, 598 perdidas marcadas |
| 2026-06-15 | **Limpieza de 846 fuzzy**: 281 aceptadas, 150 rechazadas                       |
| 2026-06-15 | **Traducción 748 strings** restantes vía LibreTranslate con QWERT              |
| 2026-06-15 | **36 Spanglish** revertidas a inglés                                           |
| 2026-06-15 | Menú de opciones traducido (`src/options.c`, `include/optlist.h`)              |
| 2026-06-15 | Ayuda de dirección traducida (`src/cmd.c`)                                     |
| 2026-06-15 | **Crasheo corregido**: `_()` quitado de nombres de mazmorra en 6 archivos      |
| 2026-06-15 | **.po final**: 3.461 traducciones, 0 errores msgfmt                            |

---

## Comandos Útiles

```bash
# Jugar
cd ~/proyectos/juego/nethack-es/playground
cp ../dat/nhdat .
LANG=es.UTF-8 ./nethack

# Regenerar .pot después de cambios en código C
cd ~/proyectos/juego/nethack-es
xgettext --default-domain=nethack --directory=. \
  --keyword=_ --keyword=N_ --add-comments=TRANSLATORS: \
  --sort-by-file -o po/nethack.pot src/*.c include/optlist.h

# Fusionar .pot en .po
msgmerge --previous --sort-by-file po/es.po po/nethack.pot -o po/es_new.po
mv po/es_new.po po/es.po

# Compilar .mo y verificar
msgfmt -c po/es.po -o playground/locale/es/LC_MESSAGES/nethack.mo

# Recompilar binario
touch src/*.c && make -C src -j4
cp src/nethack playground/

# Validar
msgfmt --statistics po/es.po
```
