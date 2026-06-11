# NetHack-es — NetHack en Español

Traducción al español de **NetHack 5.0** (13.416 cadenas traducidas, 71%).

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
make fetch-lua
make
make install
```

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
