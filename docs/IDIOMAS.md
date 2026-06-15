# Idiomas en NetHack-es

NetHack-es soporta múltiples idiomas mediante detección automática de la variable de entorno `LANG`.

## Cómo funciona

1. El juego detecta el idioma del sistema al iniciar (`init_lang()` en `src/lang.c`)
2. Según el idioma detectado:
   - **Carga de traducciones (.mo)**: Busca `locale/{idioma}/LC_MESSAGES/nethack.mo`
   - **Carga de datos (.{idioma})**: Busca archivos como `help.{idioma}` antes de `help`
3. Si el idioma no está disponible, fallback a inglés

## Idiomas soportados

| Código | Idioma  | Traducciones C (.mo)        | Datos (help, etc.)   |
| ------ | ------- | --------------------------- | -------------------- |
| `en`   | Inglés  | No necesita (nativo)        | No necesita (nativo) |
| `es`   | Español | ✅ `po/es.po` (979 strings) | ✅ 29 archivos `.es` |

## Cómo añadir un nuevo idioma

### 1. Preparar el archivo .po

```bash
# Crear archivo .po desde plantilla
cd /home/ricard/proyectos/juego/nethack-es
msginit -l fr -o po/fr.po -i po/nethack.pot --no-translator

# Editar con Poedit
poedit po/fr.po
```

### 2. Añadir al sistema de detección

Editar `src/lang.c`:

```c
if (strcmp(current_lang, "es") != 0
    && strcmp(current_lang, "en") != 0
    && strcmp(current_lang, "fr") != 0)  // ← añadir aquí
    strcpy(current_lang, "en");
```

### 3. Crear archivos de datos

```bash
# Copiar y traducir archivos de datos
cp dat/help dat/help.fr
# Traducir help.fr manualmente
```

### 4. Compilar y probar

```bash
# Compilar .mo
./auto-translate.sh fr

# Probar
LANG=fr_FR.UTF-8 nethack-es
```

## Variables de entorno

| Variable             | Propósito                                 | Ejemplo                                |
| -------------------- | ----------------------------------------- | -------------------------------------- |
| `LANG`               | Idioma del sistema (detección automática) | `LANG=es_ES.UTF-8`                     |
| `NETHACKDIR`         | Directorio de datos (opcional)            | `NETHACKDIR=~/.local/games/nethack-es` |
| `NETHACK_LOCALE_DIR` | Directorio de traducciones (opcional)     | (Usa `NETHACKDIR/locale` por defecto)  |

## Estructura de archivos

```
locale/
├── es/LC_MESSAGES/nethack.mo    ← español
├── fr/LC_MESSAGES/nethack.mo    ← francés (futuro)
└── de/LC_MESSAGES/nethack.mo    ← alemán (futuro)

po/
├── es.po   ← español (actual)
├── fr.po   ← francés (futuro)
├── de.po   ← alemán (futuro)
├── nethack.pot  ← plantilla
└── LINGUAS     ← lista de idiomas disponibles

dat/
├── help    ← inglés (original)
├── help.es ← español
├── help.fr ← francés (futuro)
└── ...
```
