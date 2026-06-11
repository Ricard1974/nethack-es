# NetHack-es — NetHack en Español

Traducción al español de **NetHack 5.0** (13.416 cadenas traducidas, 71%).

> El **29% restante** no está traducido principalmente por dos motivos:
>
> 1. **`dat/tribute`** (~6.800 citas): homenaje a Terry Pratchett, se mantienen en su inglés original
> 2. **Mensajes de plataformas obsoletas** (~200): depuración de Amiga, VMS, MSDOS, etc.
>
> El 100% del código C, ayuda, descripciones y mensajes de juego está traducido.

## 🎮 Cómo jugar

```bash
# 1. Ir al directorio del proyecto (donde lo hayas descargado)
cd nethack-es

# 2. Ejecutar
./playground/nethack

# O usando el lanzador
./nethack-es
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
- Todos los mensajes del código C

## ⏳ No traducido

- **dat/tribute**: citas de Terry Pratchett (homenaje, se mantienen en inglés)

## 📦 Requisitos

- Linux (probado en Ubuntu/Debian)
- Terminal compatible (xterm, gnome-terminal, etc.)

## 🔧 Compilar desde cero

```bash
git clone https://github.com/Ricard1974/nethack-es.git
cd nethack-es
sudo apt install build-essential libncurses-dev flex bison gettext
cd sys/unix && sh setup.sh hints/linux.500 && cd ../..
make fetch-lua
make
msgfmt po/combined-es.po -o po/combined-es.mo
mkdir -p playground/locale/es/LC_MESSAGES
cp po/combined-es.mo playground/locale/es/LC_MESSAGES/nethack.mo
make install
```

## 📦 Usar solo las traducciones (sin compilar)

Si ya tienes NetHack 5.0 instalado, puedes descargar solo el archivo de traducción desde
**[GitHub Releases](https://github.com/Ricard1974/nethack-es/releases)**:

```bash
# 1. Descargar nethack-es.mo de GitHub Releases
# 2. Colocarlo en el directorio de tu NetHack:
mkdir -p /ruta/a/tu/nethack/locale/es/LC_MESSAGES
cp nethack-es.mo /ruta/a/tu/nethack/locale/es/LC_MESSAGES/nethack.mo

# 3. Ejecutar NetHack con la variable NETHACK_LOCALE_DIR:
NETHACK_LOCALE_DIR=/ruta/a/tu/nethack/locale nethack
```

El juego cargará automáticamente las traducciones al arrancar.
No necesita ninguna dependencia adicional. El sistema de traducción (`nh_gettext`) está integrado en el binario.

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
- **Enfoque**: Sistema propio de traducción (`nh_gettext`) sin dependencias externas

## 📁 Repositorio

`https://github.com/Ricard1974/nethack-es`
