# NetHack-es — NetHack in Spanish

Spanish translation of **NetHack 5.0** (13,416 strings translated, 71%).

## 🎮 How to Play

```bash
# 1. Go to the project directory
cd nethack-es

# 2. Run
./playground/nethack
# Or using the launcher
./nethack-es
```

## ⌨️ Basic Controls

| Key             | Action                       |
| --------------- | ---------------------------- |
| `h` `j` `k` `l` | Move (left, down, up, right) |
| `y` `u` `b` `n` | Diagonal                     |
| `?`             | Help (in Spanish)            |
| `,`             | Pick up items                |
| `d`             | Drop items                   |
| `>`             | Go down stairs               |
| `<`             | Go up stairs                 |
| `i`             | View inventory               |
| `q`             | Quaff (drink)                |
| `e`             | Eat                          |
| `r`             | Read                         |
| `w`             | Wield weapon                 |
| `W`             | Wear armor                   |
| `S`             | Save game                    |
| `Q`             | Quit                         |
| Space           | Continue after `--More--`    |

## ✅ Translated to Spanish

- Welcome screen and help
- Command list
- Tomb epitaphs
- Floor engravings
- Rumors (true and false)
- Oracles
- Monster and object descriptions
- Configuration options
- Character creation prompts
- Combat, item, and status messages
- All C code messages

## ⏳ Not Translated

- **dat/tribute**: Terry Pratchett quotes (homage, kept in original English)

## 📦 Requirements

- Linux (tested on Ubuntu/Debian)
- Compatible terminal (xterm, gnome-terminal, etc.)

## 🔧 Compile from Source

```bash
git clone https://github.com/Ricard1974/nethack-es.git
cd nethack-es
sudo apt install build-essential libncurses-dev flex bison gettext
make fetch-lua
make
make install
```

## 📜 License

NetHack-es is under the **NetHack General Public License (NGPL)**.

- ✅ You may modify and distribute the code
- ✅ You must keep the same license
- ✅ You must include the source code
- ❌ You may not charge for it or restrict its use

Original NetHack code © 1985-2026 Stichting Mathematisch Centrum and M. Stephenson.

## 🙏 Credits

- **Original NetHack**: Stichting Mathematisch Centrum and M. Stephenson
- **Spanish translation**: NetHack-es Project
- **Approach**: Custom translation system (`nh_gettext`) with no external dependencies

## 📁 Repository

`https://github.com/Ricard1974/nethack-es`
