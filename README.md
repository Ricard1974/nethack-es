# NetHack-es — NetHack en Español

Traducción al español de **NetHack 5.0** (13.489 cadenas traducidas, 72%).

---

## 🚀 Instalación en un clic

```bash
bash <(curl -sL https://raw.githubusercontent.com/Ricard1974/nethack-es/NetHack-5.0-es/install.sh)
```

O si ya descargaste el repositorio:

```bash
bash install.sh
```

Esto instala todo automáticamente: dependencias, compilación, traducciones
y acceso directo en el menú de aplicaciones.

---

## 🎮 Cómo jugar

Después de instalar:

```bash
nethack-es
```

O si estás en el directorio del proyecto:

```bash
./jugar.sh
```

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

- Pantalla de bienvenida y ayuda
- Lista de comandos
- Epitafios de tumbas
- Grabados en el suelo
- Rumores (verdaderos y falsos)
- Oráculos
- Descripciones de monstruos y objetos
- Opciones de configuración
- Prompts de creación de personaje
- Mensajes de combate, objetos y estado
- Categorías del inventario (Armas, Armadura, Pociones...)
- Prompts de confirmación (guardar, soltar, comer...)
- Diálogo de nombrar monstruos/objetos
- Prefijos gramaticales: "You can't" → "No puedes", "You" → "", "There" → ""
- **100% del código C**

## ⏳ No traducido

- **`dat/tribute`** (~6.800 citas): homenaje a Terry Pratchett, se mantienen en su inglés original
- **Mensajes de plataformas obsoletas** (~200): depuración de Amiga, VMS, MSDOS, etc.

---

## 📦 Usar solo las traducciones (sin compilar)

Si ya tienes NetHack 5.0 compilado con `nh_gettext`, puedes descargar el archivo de traducción desde
**[GitHub Releases](https://github.com/Ricard1974/nethack-es/releases)**:

```bash
mkdir -p /ruta/a/tu/nethack/locale/es/LC_MESSAGES
cp nethack-es.mo /ruta/a/tu/nethack/locale/es/LC_MESSAGES/nethack.mo
NETHACK_LOCALE_DIR=/ruta/a/tu/nethack/locale nethack
```

No necesita dependencias adicionales.

## 🔧 Compilar desde cero

```bash
git clone https://github.com/Ricard1974/nethack-es.git
cd nethack-es
sudo apt install build-essential libncurses-dev flex bison gettext
cd sys/unix && sh setup.sh hints/linux.500 && cd ../..
make fetch-lua && make
msgfmt po/combined-es.po -o po/combined-es.mo
make install
./jugar.sh
```

## 📋 Requisitos

- Linux (probado en Ubuntu/Debian, Fedora, Arch)
- Terminal compatible (xterm, gnome-terminal, etc.)

---

## 📜 Licencia

NetHack-es está bajo la **NetHack General Public License (NGPL)**.

- ✅ Puedes modificar y distribuir el código
- ✅ Debes mantener la misma licencia
- ✅ Debes incluir el código fuente
- ❌ No puedes cobrar por él ni restringir su uso

El código original de NetHack es © 1985-2026 Stichting Mathematisch Centrum y M. Stephenson.

## 🙏 Créditos

- **NetHack original**: Stichting Mathematisch Centrum y M. Stephenson
- **Traducción al español**: Ricard1974 (NetHack-es)
- **Sistema de traducción**: `nh_gettext` propio + `build_msg` con prefijos gramaticales, sin dependencias externas

## 📁 Repositorio

`https://github.com/Ricard1974/nethack-es`
