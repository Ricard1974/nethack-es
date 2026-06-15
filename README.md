# NetHack-es — NetHack en Español

Traducción al español de **NetHack 5.0** — 3.461 strings traducidos, **100% del código C**.

Rama: `NetHack-5.0-es`

## ⌨️ Teclas básicas

| Tecla           | Acción                          |
| --------------- | ------------------------------- |
| `h` `j` `k` `l` | Mover (izq, abajo, arriba, der) |
| `y` `u` `b` `n` | Diagonal                        |
| `?`             | Ayuda (en español)              |
| `,`             | Recoger objetos                 |
| `d`             | Soltar objetos                  |
| `>`             | Bajar escaleras                 |
| `<`             | Subir escaleras                 |
| `i`             | Ver inventario                  |
| `q`             | Beber                           |
| `e`             | Comer                           |
| `r`             | Leer                            |
| `w`             | Equipar arma                    |
| `W`             | Ponerse armadura                |
| `S`             | Guardar partida                 |
| `Q`             | Salir                           |
| Espacio         | Continuar tras `--More--`       |

---

## ✅ Traducido al español

- **100% del código C**: todas las strings visibles envueltas en `_()` (3.461 traducciones)
- Pantalla de bienvenida, ayuda y comandos
- Epitafios, grabados, rumores, oráculos
- Descripciones de monstruos y objetos
- Menú de opciones (nombres, descripciones, títulos de sección)
- Ayuda de dirección (teclas, cmdassist)
- Prompts de creación de personaje, combate, inventario
- Archivos de datos: `data.es`, `help.es`, `cmdhelp.es`, etc. (29 archivos)
- Archivos Lua: `dungeon.lua.es`, `quest.lua.es`, tutoriales (5 archivos)

## ⏳ No traducido (o pendiente)

- **Contenido Lua dentro de `nhdat`**: `nhlib.lua`, `dungeon.lua`, `quest.lua` dentro del contenedor `nhdat` están en inglés. Los `.lua.es` existen pero no están empaquetados.
- **`dat/tribute`** (~6.800 citas): homenaje a Terry Pratchett, se mantienen en su inglés original.
- **Mensajes de plataformas obsoletas** (~200): depuración de Amiga, VMS, MSDOS, etc.

---

## 🔧 Compilar desde cero

```bash
git clone https://github.com/Ricard1974/nethack-es.git
cd nethack-es
git checkout NetHack-5.0-es
sudo apt install build-essential libncurses-dev flex bison gettext
cd sys/unix && sh setup.sh hints/linux.500 && cd ../..
make fetch-lua && make
msgfmt po/es.po -o playground/locale/es/LC_MESSAGES/nethack.mo
cp dat/nhdat playground/
cd playground
LANG=es.UTF-8 ./nethack
```

## 📋 Requisitos

- Linux (probado en Ubuntu/Debian)
- Terminal compatible (xterm, gnome-terminal, etc.)
- `LANG=es.UTF-8` para activar las traducciones

---

## 📜 Licencia

NetHack-es está bajo la **NetHack General Public License (NGPL)**.
El código original de NetHack es © 1985-2026 Stichting Mathematisch Centrum y M. Stephenson.

## 🙏 Créditos

- **NetHack original**: Stichting Mathematisch Centrum y M. Stephenson
- **Traducción al español**: Ricard1974 (NetHack-es)
- **Sistema de traducción**: `nh_gettext` propio con `_()` / `N_()` / `dlb_fopen` locale

## 📁 Repositorio

`https://github.com/Ricard1974/nethack-es` — rama `NetHack-5.0-es`
