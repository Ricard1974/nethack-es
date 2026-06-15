# Problemas Encontrados en NetHack-es

Este documento recopila los problemas recurrentes encontrados durante el desarrollo de la traducción al español de NetHack 5.0.

---

## Problema 1: Nombres de mazmorra con `_()` causan crasheo

**Síntoma:** `panic("Couldn't resolve dungeon number for name ...")` en `dname_to_dnum()` durante el juego (al abrir puertas, invocar quest, etc.).

**Causa:** Envolver nombres de mazmorra en `_()` en llamadas a `at_dgn_entrance()` y `dungeon_branch()`: el lookup interno compara contra nombres canónicos en inglés de `dungeon.lua`, pero `_()` devuelve el nombre traducido.

**Ejemplo de código que CRASHEABA:**

```c
at_dgn_entrance(_("The Quest"));  // ❌ "La Misión" no existe en datos de mazmorra
```

**Solución:** NO usar `_()` en nombres de mazmorra. Pasar siempre el nombre inglés.

```c
at_dgn_entrance("The Quest");     // ✅ lookup correcto
```

**Archivos corregidos (6 referencias):**

- `src/dungeon.c:2435` — `at_dgn_entrance("The Quest")`
- `src/dungeon.c:3137` — `at_dgn_entrance("The Quest")`
- `src/do.c:1896` — `at_dgn_entrance("The Quest")`
- `src/mklev.c:2634` — `dungeon_branch("Fort Ludios")`
- `src/quest.c:191` — `dungeon_branch("The Quest")`
- `src/trap.c:4335` — `at_dgn_entrance("The Quest")`

---

## Problema 2: Placeholders no sobreviven a traducción automática

**Síntoma:** Strings con `%s`, `%d`, `%1$s` aparecen con los placeholders en posiciones incorrectas, duplicados, o convertidos a texto natural después de traducir con LibreTranslate.

**Causa:** LibreTranslate modifica o elimina placeholders. Marcadores como `PH0`, `PH1`, `<<0>>`, `¤0¤` no sobreviven porque el traductor los interpreta como texto y los "traduce".

**Solución (estrategia QWERT):**

1. Reemplazar `%s`→`QWERT0`, `%d`→`QWERT1`, etc. ANTES de enviar a traducción
2. `QWERT` sobrevive al 100% porque parece un acrónimo
3. Restaurar `QWERT0`→`%s` después de traducir

**Resultado:** 748 strings traducidas correctamente. 598 strings que ya habían perdido sus placeholders en traducciones previas fueron marcadas como sin traducir.

---

## Problema 3: El .mo no se regenera automáticamente

**Síntoma:** Las traducciones no aparecen aunque estén en el `.po`.

**Causa:** El `.mo` no se regenera solo. Hay que ejecutar manualmente:

```bash
msgfmt po/es.po -o playground/locale/es/LC_MESSAGES/nethack.mo
```

---

## Problema 4: El juego necesita `nhdat` en el directorio actual

**Síntoma:** `nhl_loadlua: Error opening (nhlib.lua)` seguido de `panic: 'nhl_init' failed`.

**Causa:** `dlb_init()` abre el contenedor `nhdat` para cargar los archivos Lua. Sin él, `dlb_fopen` devuelve NULL y el juego no puede inicializar el motor Lua.

**Solución:** Copiar `dat/nhdat` al directorio de juego:

```bash
cp dat/nhdat playground/
cd playground
LANG=es.UTF-8 ./nethack
```

---

## Problema 5: Nombres de opciones en inglés (por diseño)

Los nombres técnicos de opciones (`fruit`, `autodig`, `number_pad`) se mantienen SIN traducir porque son identificadores usados en:

- Archivos de configuración (`~/.nethackrc`)
- Comandos en juego (`O nombre`)

Las descripciones y títulos de sección SÍ se traducen.

---

## Problema 6: Contenido Lua dentro de `nhdat` sin traducir

**Síntoma:** Mensajes como "Saludos ricard, welcome to NetHack!" y el libro de Lugh aparecen en inglés.

**Causa:** Los `.lua.es` existen en `dat/` pero no están empaquetados dentro del contenedor `nhdat`. El juego carga los Lua desde `nhdat`, no del filesystem.

**Solución pendiente:** Reconstruir `nhdat` incluyendo los `.lua.es`, o extraer los Lua del contenedor y ponerlos en el filesystem.

---

## Problema 7: Layout con texto en español

**Precaución:** El español es ~15-20% más largo que el inglés. Puede haber recortes en menús, cuadros de diálogo, o nombres de objetos que excedan los buffers reservados.

**Verificación:**

- Nombres de mazmorra: buffer `dname[24]` en `include/dungeon.h` — máximo 24 caracteres
- Nombres de opciones: `OPTION_LEN` en `include/optlist.h`
- Mensajes de `pline()`: buffer `BUFSZ` (generalmente 256)

---

## Problema 8: Variables de entorno para locale

**Síntoma:** El juego no carga las traducciones (todo en inglés).

**Causa:** `LANG=es.UTF-8` debe estar definida. Adicionalmente, `NETHACK_LOCALE_DIR` y `NETHACKDIR` pueden configurarse para rutas personalizadas.

**Solución:**

```bash
export LANG=es.UTF-8
export NETHACKDIR="$HOME/.local/games/nethack-es"
export NETHACK_LOCALE_DIR="$HOME/.local/games/nethack-es/locale"
cd "$NETHACKDIR"
./nethack
```

---

## Checklist de Verificación

Después de cualquier cambio:

- [ ] `.po` válido: `msgfmt -c po/es.po`
- [ ] `.mo` compilado: `msgfmt po/es.po -o playground/locale/es/LC_MESSAGES/nethack.mo`
- [ ] Binario compila: `make -C src`
- [ ] `nhdat` presente: `cp dat/nhdat playground/`
- [ ] `LANG=es.UTF-8` al ejecutar
- [ ] Nombres de mazmorra sin `_()` en C (grep `at_dgn_entrance\(_\|dungeon_branch\(_`)

---

## Comandos Rápidos

```bash
# Compilar .mo y copiar
msgfmt po/es.po -o playground/locale/es/LC_MESSAGES/nethack.mo

# Recompilar binario
make -C src -j4 && cp src/nethack playground/

# Poner nhdat y jugar
cp dat/nhdat playground/
cd playground && LANG=es.UTF-8 ./nethack
```
