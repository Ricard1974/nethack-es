# Revisión: Traducción NetHack 5.0 al Español

## Estado Actual

| Métrica          | Valor                        |
| ---------------- | ---------------------------- |
| Strings en .po   | **3.461**                    |
| Traducidas       | **3.461 (100%)**             |
| Fuzzy            | 0                            |
| Sin traducir     | 0                            |
| `msgfmt -c`      | ✅ 0 errores                 |
| Archivos .es     | 29                           |
| Archivos .lua.es | 5                            |
| Binario          | 11.7 MB, compila sin errores |

---

## Componentes Traducidos

### Código C (.po) — 100%

Todas las strings visibles en el código fuente C están envueltas en `_()`:

- Pantalla de bienvenida, menús, prompts
- Combate, objetos, estado del personaje
- Menú de opciones (títulos, descripciones, secciones)
- Ayuda de dirección (teclas, cmdassist)
- Creación de personaje, inventario

### Archivos de datos (.es) — 29 archivos

`help.es`, `cmdhelp.es`, `hh.es`, `history.es`, `keyhelp.es`, `opthelp.es`, `optmenu.es`, `usagehlp.es`, `wizhelp.es`, `symbols.es`, `tribute.es`, `data.base.es`, `data.es`, `bogusmon.txt.es`, `engrave.txt.es`, `epitaph.txt.es`, `oracles.txt.es`, `rumors.fal.es`, `rumors.tru.es` y más.

### Archivos Lua (.lua.es) — 5 archivos

`dungeon.lua.es`, `quest.lua.es`, `tut-1.lua.es`, `tut-2.lua.es`, `themerms.lua.es`

> ⚠️ Estos archivos existen en `dat/` pero NO están empaquetados dentro de `nhdat`. El juego carga Lua desde el contenedor.

---

## Problemas Conocidos

1. **Contenido Lua en inglés dentro de `nhdat`**: `nhlib.lua`, `dungeon.lua`, `quest.lua` dentro del contenedor están en inglés. Mensajes de bienvenida ("Saludos ricard, welcome to NetHack!") y textos narrativos se ven en inglés.
2. **Traducciones literales**: Muchas strings traducidas automáticamente son literales o tienen mezcla inglés/español. Queda trabajo de revisión manual.
3. **Layout**: El español es ~15-20% más largo. Posibles recortes en menús y buffers.
4. **Nombres de mazmorra sin traducir en C**: Por decisión técnica, los nombres de mazmorra en `at_dgn_entrance()` y `dungeon_branch()` se mantienen en inglés para evitar crasheos.

---

## Estrategia QWERT para Placeholders

Al traducir con LibreTranslate, los placeholders `%s`, `%d` se pierden. Solución:

1. Reemplazar `%s`→`QWERT0`, `%d`→`QWERT1` antes de traducir
2. `QWERT` sobrevive al 100% porque parece un acrónimo
3. Restaurar después de traducir

---

## Decisiones Técnicas

| Decisión                      | Motivo                                                    |
| ----------------------------- | --------------------------------------------------------- |
| Nombres de opciones en inglés | Son identificadores de configuración (`fruit`, `autodig`) |
| Nombres de mazmorra sin `_()` | El lookup interno usa nombres canónicos en inglés         |
| `N_()` en macros de optlist.h | Para que xgettext extraiga nombres y descripciones        |
| Estrategia QWERT              | Único marcador que sobrevive a LibreTranslate             |

---

## Fecha de revisión: 15 de junio de 2026

## Rama: `NetHack-5.0-es`
