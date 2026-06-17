#!/usr/bin/env python3
"""
Bot inteligente para NetHack-es con mapa interno y pathfinding BFS.
Construye un mapa del dungeon visitado, encuentra zonas sin explorar,
busca escaleras, evita paredes, se cura y come.
"""

import subprocess, time, re, sys, os, signal, atexit, argparse
from collections import deque

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

SESSION = f"nethack_bot_{os.getpid()}"
PLAYGROUND = os.path.expanduser("~/proyectos/juego/nethack-es/playground")
LANG_VAR = "es.UTF-8"
os.environ["LANG"] = LANG_VAR

# Caracteres del mapa
WALL = {"#", "-", "|", " "}
FLOOR = {".", ",", ";", ":"}
OBJECT = {"$", "%", "!", "?", "=", '"', "/", "*", "(", "[", "]", "\\", "{", "}"}
STAIR_DOWN = ">"
STAIR_UP = "<"
TRAP = {"^"}
WALKABLE = FLOOR | OBJECT | {STAIR_DOWN, STAIR_UP, "+", "^", "<", ">", "@"}

DIR_VEC = {
    "h": (-1, 0),
    "j": (0, 1),
    "k": (0, -1),
    "l": (1, 0),
    "y": (-1, -1),
    "u": (1, -1),
    "b": (-1, 1),
    "n": (1, 1),
}
DIR_NAMES = {
    "h": "oeste",
    "j": "sur",
    "k": "norte",
    "l": "este",
    "y": "noroeste",
    "u": "noreste",
    "b": "suroeste",
    "n": "sureste",
}

DEATH_PATTERNS = [
    "you die",
    "you are dead",
    "killed",
    "muerto",
    "has muerto",
    "do you want your possessions identified",
    "your quest is over",
]
ALLOWED_ENGLISH = {"fruit", "autodig", "pickup"}

# ─── Tmux ────────────────────────────────────────────────────────────


def send(key):
    subprocess.run(
        ["tmux", "send-keys", "-t", SESSION, key], capture_output=True, timeout=5
    )


def capture():
    r = subprocess.run(
        ["tmux", "capture-pane", "-t", SESSION, "-p", "-S", "-500"],
        capture_output=True,
        text=True,
        timeout=5,
    )
    return r.stdout


def clear_more(max_iter=15):
    for _ in range(max_iter):
        txt = capture()
        if "--More--" in txt or "Más--" in txt:
            send("Space")
            time.sleep(0.2)
        else:
            break


# ─── Análisis ────────────────────────────────────────────────────────


def get_hp(screen):
    m = re.search(r"HP:(\d+)\((\d+)\)", screen)
    return (int(m.group(1)), int(m.group(2))) if m else (None, None)


def is_playing(screen):
    return bool(re.search(r"HP:\d+", screen))


def is_dead(screen):
    return any(p in screen.lower() for p in DEATH_PATTERNS)


def parse_surroundings(screen):
    """Encuentra @ y analiza las 8 casillas alrededor.
    Devuelve: (px, py, dict_dir->char, map_lines)
    """
    lines = screen.split("\n")
    px = py = -1
    for y, line in enumerate(lines):
        x = line.find("@")
        if x >= 0:
            px, py = x, y
            break
    if px < 0:
        return None, None, {}, []

    surr = {}
    for key, (dx, dy) in DIR_VEC.items():
        nx, ny = px + dx, py + dy
        if 0 <= ny < len(lines) and 0 <= nx < len(lines[ny]):
            surr[key] = lines[ny][nx]
        else:
            surr[key] = " "

    # Líneas del mapa visible (±8 alrededor de @)
    map_start = max(0, py - 8)
    map_end = min(len(lines), py + 6)
    map_lines = []
    for y in range(map_start, map_end):
        line = lines[y]
        if not re.search(r"HP:|St:|Dx:|Co:", line):
            map_lines.append(line)

    return px, py, surr, map_lines


def render_minimap(surr):
    if not surr:
        return ""
    view = {
        (-1, -1): "y",
        (0, -1): "k",
        (1, -1): "u",
        (-1, 0): "h",
        (0, 0): "@",
        (1, 0): "l",
        (-1, 1): "b",
        (0, 1): "j",
        (1, 1): "n",
    }
    rows = []
    for dy in [-1, 0, 1]:
        row = ""
        for dx in [-1, 0, 1]:
            if dx == 0 and dy == 0:
                row += "@"
            else:
                row += surr.get(view[(dx, dy)], " ")
        rows.append(row)
    return "\n".join(rows)


# ─── Prompt handling ────────────────────────────────────────────────

ALL_PROMPTS = [
    ("die?", lambda: send("n")),
    ("[yn]", lambda: send("n")),
    ("[ynq]", lambda: send("n")),
    ("direction", lambda: send("Escape")),
    ("dirección", lambda: send("Escape")),
    ("pick up", lambda: send("Escape")),
    ("recoger", lambda: send("Escape")),
    ("in what direction", lambda: send("Escape")),
    ("what do you want to", lambda: send("Escape")),
    ("qué quieres", lambda: send("Escape")),
    ("identify what", lambda: send("Escape")),
    ("what is the thing", lambda: send("Escape")),
]


def answer_prompts():
    screen = capture()
    lines = screen.strip().split("\n")
    for line in lines[-5:]:
        lower = line.lower()
        for pat, action in ALL_PROMPTS:
            if pat in lower:
                action()
                time.sleep(0.3)
                return True
    return False


# ─── Creación de personaje ───────────────────────────────────────────


def create_character():
    log("  Creando personaje Valkyrie...")
    subprocess.run(
        ["tmux", "new-session", "-d", "-s", SESSION, "-x", "132", "-y", "50"],
        capture_output=True,
        timeout=5,
    )
    time.sleep(1)
    subprocess.run(
        ["tmux", "set", "-t", SESSION, "remain-on-exit", "on"],
        capture_output=True,
        timeout=5,
    )
    # Language set via .nethackrc OPTIONS=language:es, no LANG env needed
    send(f"cd {PLAYGROUND} && ./nethack")
    send("Enter")
    time.sleep(3)
    clear_more()
    time.sleep(1)
    send("Enter")  # Who are you?
    time.sleep(1.5)
    clear_more()
    send("y")  # Shall I pick a character?
    time.sleep(1)
    clear_more()
    # Confirm character selection ("Is this ok?" / "¿Está bien? [ynq]")
    screen = capture()
    if "ynq" in screen or "yn" in screen:
        send("y")  # Confirm
        time.sleep(1)
        clear_more()
    screen = capture()
    if "tutorial" in screen.lower():
        send("n")
        time.sleep(1)
    for _ in range(40):
        screen = capture()
        if is_playing(screen):
            break
        send("Space")
        time.sleep(0.2)
    # Wait stable
    for _ in range(20):
        time.sleep(0.3)
        if is_playing(capture()):
            break
    screen = capture()
    if is_playing(screen):
        log("  ✅ Personaje creado")
    else:
        log("  ⚠️  No se pudo crear el personaje")
    return screen


# ─── Bot con mapa interno ───────────────────────────────────────────


class Bot:
    def __init__(self, watch=False):
        self.watch = watch
        # Mapa en coordenadas de mazmorra (no de pantalla!)
        self.dun_x = 0  # posición real en la mazmorra
        self.dun_y = 0
        self.dmap = {}  # (dun_x, dun_y) -> char del terreno
        self.dseen = set()  # (dun_x, dun_y) visitados (transitables)
        self.path = []  # cola de direcciones a seguir
        self.stuck = 0
        self.stairs_cd = 0
        self.step = 0

    def log(self, msg):
        if self.watch:
            print(f"  🤖 {msg}", flush=True)

    def save_screenshot(self, name, screen):
        with open(f"/tmp/nethack_bot/{name}.txt", "w") as f:
            f.write(screen)

    def update_map(self, surr, moved=False):
        """Actualiza el mapa de mazmorra. surr: dict dir->char.
        Convierte direcciones a coordenadas de mazmorra relativas a (dun_x, dun_y).
        """
        # El jugador está en (dun_x, dun_y)
        self.dmap[(self.dun_x, self.dun_y)] = "@"
        self.dseen.add((self.dun_x, self.dun_y))
        # Casillas adyacentes en coordenadas de mazmorra
        for key, ch in (surr or {}).items():
            dx, dy = DIR_VEC.get(key, (0, 0))
            wx, wy = self.dun_x + dx, self.dun_y + dy
            self.dmap[(wx, wy)] = ch
            if ch in WALKABLE:
                self.dseen.add((wx, wy))

    def bfs_to_unvisited(self, px, py, max_dist=30):
        """BFS desde (px,py) buscando la casilla sin visitar más cercana.
        CAMINA HACIA LO DESCONOCIDO: trata '?' como transitable.
        Devuelve: (target_x, target_y, [direcciones])
        """
        visited = set()
        q = deque()
        q.append((px, py, []))
        while q:
            x, y, path = q.popleft()
            if len(path) > max_dist:
                continue
            if (x, y) in visited:
                continue
            visited.add((x, y))
            # ¿Destino NO visitado (desconocido)?
            if (x, y) != (px, py) and (x, y) not in self.dseen:
                ch = self.dmap.get((x, y), "?")
                if ch in WALKABLE or ch == "?" or ch == " ":
                    return (x, y), path
            # Vecinos (incluir desconocidos '?' como transitables)
            for dk in ["l", "j", "h", "k"]:
                dx, dy = DIR_VEC[dk]
                nx, ny = x + dx, y + dy
                nch = self.dmap.get((nx, ny), "?")
                if nch in WALKABLE or nch == "@" or nch == "?" or nch == " ":
                    q.append((nx, ny, path + [dk]))
        return None, []

    def next_move(self, px, py, surr):
        """Decide la siguiente acción basada en el mapa interno."""

        # 1. Si tenemos ruta, seguirla
        if self.path:
            d = self.path.pop(0)
            # Verificar que la dirección siga siendo válida
            if surr and surr.get(d, " ") in WALKABLE | {STAIR_DOWN, STAIR_UP, "+", "^"}:
                return d
            else:
                self.path = []  # ruta inválida, recalcular

        # 2. Escaleras cercanas (radio 5)
        if self.stairs_cd <= 0:
            for (ex, ey), ch in self.dmap.items():
                if ch in (STAIR_DOWN, STAIR_UP):
                    dist = abs(ex - px) + abs(ey - py)
                    if dist <= 5 and dist > 0:
                        # Pathfind hasta la escalera
                        _, path = self.bfs_to_unvisited(px, py, max_dist=6)
                        # También intentar ir directo
                        for dk, (ddx, ddy) in DIR_VEC.items():
                            if (ex - px, ey - py) == (ddx, ddy) and surr.get(
                                dk, " "
                            ) in WALKABLE:
                                self.stairs_cd = 10
                                return dk
                        if path:
                            self.path = path
                            return self.path.pop(0)

        # 3. Buscar zona sin explorar con BFS
        target, path = self.bfs_to_unvisited(px, py, max_dist=25)
        if target and path:
            first = path[0]
            # VERIFICAR contra el mapa actual antes de moverse
            if not surr or surr.get(first, " ") not in FLOOR | OBJECT | {
                STAIR_DOWN,
                STAIR_UP,
                "+",
                "^",
            }:
                # Pared/obstáculo en el primer paso! Recalcular
                self.path = []
            else:
                self.target = target
                self.path = path[1:]
                return first

        # 4. Nada nuevo: moverse a cualquier casilla transitable no visitada
        for dk in ["l", "j", "h", "k", "u", "n", "b", "y"]:
            ch = surr.get(dk, " ")
            if ch in FLOOR | OBJECT | {STAIR_DOWN, STAIR_UP, "+", "^"}:
                dx, dy = DIR_VEC[dk]
                if (px + dx, py + dy) not in self.dseen:
                    return dk

        # 5. Todo visitado: seguir cualquier dirección transitable
        for dk in ["l", "j", "h", "k", "u", "n", "b", "y"]:
            ch = surr.get(dk, " ")
            if ch in FLOOR | OBJECT | {STAIR_DOWN, STAIR_UP, "+", "^"}:
                return dk

        return None  # completamente atascado

    def detect_english(self, text):
        words = set(re.findall(r"\b[a-zA-Z]{3,}\b", text.lower()))
        from word_lists import GAME_TERMS, SPANISH_WORDS, ENGLISH_WORDS

        gt = {t.lower() for t in GAME_TERMS}
        eng = []
        for w in sorted(words):
            if (
                w in ENGLISH_WORDS
                and w not in SPANISH_WORDS
                and w not in gt
                and w not in ALLOWED_ENGLISH
            ):
                eng.append(w)
        return eng

    def play(self, max_steps=500):
        os.makedirs("/tmp/nethack_bot", exist_ok=True)
        screen = create_character()
        self.save_screenshot("000_inicio", screen)

        all_eng = set()
        bad = 0
        total = 0

        for self.step in range(1, max_steps + 1):
            # 1. Prompts
            answer_prompts()

            # 2. Capturar
            screen = capture()

            # 3. Analizar mapa (en coordenadas de mazmorra)
            px, py, surr, map_lines = parse_surroundings(screen)
            if px is not None and py is not None:
                self.update_map(surr)
                # Registrar casillas del mapa visible en coords de mazmorra
                if map_lines:
                    map_top = max(0, py - 8)
                    for y_off, line in enumerate(map_lines):
                        scr_y = map_top + y_off
                        for scr_x, ch in enumerate(line):
                            # Convertir pantalla -> mazmorra
                            dx, dy = scr_x - px, scr_y - py
                            wx, wy = self.dun_x + dx, self.dun_y + dy
                            if ch in WALKABLE and ch not in (" ", "@"):
                                self.dmap.setdefault((wx, wy), ch)
                                if ch in FLOOR | OBJECT | {
                                    STAIR_DOWN,
                                    STAIR_UP,
                                    "+",
                                    "^",
                                }:
                                    self.dseen.add((wx, wy))

            # 4. Inglés
            if self.step % 5 == 0:
                self.save_screenshot(f"{self.step:04d}", screen)
                total += 1
                eng = self.detect_english(screen)
                if eng:
                    bad += 1
                    all_eng.update(eng)

            # 5. Muerte
            if is_dead(screen):
                self.log(f"💀 Muerto en paso {self.step}")
                self.save_screenshot(f"dead_{self.step:04d}", screen)
                break

            # 6. Estado y minimapa
            hp, max_hp = get_hp(screen)
            if self.step % 10 == 0 or self.step == 1:
                pos = f"({px},{py})" if px is not None else "(?,?)"
                viz = len(self.dseen)
                mm = render_minimap(surr)
                self.log(
                    f"📍 Paso {self.step} | HP:{hp}/{max_hp} | {pos} | Conocidas: {viz}"
                )
                if mm:
                    for r in mm.split("\n"):
                        self.log(f"   {r}")

            # 7. Escaleras (usar comando directo)
            if self.stairs_cd > 0:
                self.stairs_cd -= 1
            if px is not None and surr:
                for dk, ch in surr.items():
                    if ch in (STAIR_DOWN, STAIR_UP) and self.stairs_cd <= 0:
                        cmd = ">" if ch == STAIR_DOWN else "<"
                        self.log(f"🪜 Escalera en {DIR_NAMES.get(dk, dk)}!")
                        send(cmd)
                        time.sleep(0.5)
                        clear_more()
                        self.stairs_cd = 20
                        ns = capture()
                        if (
                            "staircase" not in ns.lower()
                            and "escalera" not in ns.lower()
                        ):
                            self.log("  ✅ Bajada!")
                        break

            # 8. Curación
            if hp and max_hp and hp < max_hp * 0.35:
                self.log(f"❤️‍🩹 Curando (HP {hp}/{max_hp})...")
                send("q")
                time.sleep(0.4)
                s2 = capture()
                if "what" in s2.lower() or "qué" in s2.lower():
                    send("a")
                    time.sleep(0.2)
                    send("Enter")
                    time.sleep(0.2)
                clear_more()
                continue

            # 9. Comida
            if px is not None:
                # Verificar mensaje de hambre
                lines = screen.strip().split("\n")
                for line in lines[-5:]:
                    low = line.lower()
                    if any(w in low for w in ["hungry", "hambri", "weak", "débil"]):
                        self.log("🍽️  Comiendo...")
                        send("e")
                        time.sleep(0.4)
                        s2 = capture()
                        if "what" in s2.lower() or "qué" in s2.lower():
                            send("a")
                            time.sleep(0.2)
                        clear_more()
                        break

            # 10. Recoger objetos (usar m, para menú automático)
            if self.step % 8 == 0:
                answer_prompts()
                # Usar m, para menú de recoger sin prompt
                send("m,")
                time.sleep(0.5)
                s2 = capture()
                if "pick up" in s2.lower() or "recoger" in s2.lower() or "[yn]" in s2:
                    send("a")  # seleccionar todo
                    time.sleep(0.2)
                    send("Enter")  # confirmar
                    time.sleep(0.2)
                clear_more()
            # Buscar
            if self.step % 15 == 0:
                answer_prompts()
                send("s")
                time.sleep(0.5)
                clear_more()
            # Abrir puertas en TODAS las direcciones donde haya '+'
            if self.step % 10 == 0 and surr:
                for dk in ["l", "j", "h", "k"]:
                    if surr.get(dk, " ") == "+":
                        self.log(f"🚪 Abriendo puerta al {DIR_NAMES[dk]}")
                        send("o")
                        time.sleep(0.2)
                        send(dk)
                        time.sleep(0.3)
                clear_more()
            # Inventario
            if self.step % 35 == 0:
                answer_prompts()
                send("i")
                time.sleep(0.5)
                self.save_screenshot(f"inv_{self.step:04d}", capture())
                clear_more()
                send("Escape")
                time.sleep(0.2)

            # 11. MOVIMIENTO CON PATHFINDING
            if px is not None and surr:
                d = self.next_move(px, py, surr)

                # Detectar bucle: si llevamos muchos pasos en el mismo sitio
                # Comprobar si la mayoría de direcciones están bloqueadas
                blocked_dirs = sum(1 for ch in surr.values() if ch in WALL or ch == " ")
                if blocked_dirs >= 5:  # rodeado de paredes
                    self.stuck += 1
                else:
                    self.stuck = max(0, self.stuck - 1)

                if d:
                    dname = DIR_NAMES.get(d, d)
                    ch = surr.get(d, " ")
                    self.log(
                        f"🚶 {dname} [{ch}]  (expl: {len(self.dseen)}, atascado: {self.stuck})"
                    )
                    # Si es una puerta, abrirla primero
                    if ch == "+":
                        self.log(f"🚪 Abriendo puerta al {dname}")
                        send("o")
                        time.sleep(0.2)
                        send(d)
                        time.sleep(0.3)
                    send(d)
                    time.sleep(0.25)
                else:
                    self.stuck += 3
                    self.log(f"💤 Sin ruta! (atascado: {self.stuck})")

                # Si muy atascado: burst de direcciones
                if self.stuck > 8:
                    self.log("🔥 Burst de exploración!")
                    for dk in ["l", "j", "h", "k", "u", "n", "b", "y"]:
                        send(dk)
                        time.sleep(0.08)
                    self.stuck = 4
            else:
                send("l")
                time.sleep(0.2)

        return all_eng, bad, total


# ─── Main ────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description="Bot con mapa NetHack-es")
    parser.add_argument("--max-steps", type=int, default=500)
    parser.add_argument("--watch", action="store_true")
    args = parser.parse_args()

    print("=" * 60)
    print("  🤖  BOT NET-HACK-ES (con mapa interno)")
    print("  Valkyrie real - pathfinding BFS")
    print("=" * 60)
    print()
    log(f"Sesión tmux: {SESSION}")

    if args.watch:
        print()
        print("╔════════════════════════════════════════════════════════╗")
        print("║  Para VER el bot, abre OTRA TERMINAL y ejecuta:     ║")
        print(f"║    tmux attach -t {SESSION}                  ║")
        print("║  Ctrl+C aquí para salir.                             ║")
        print("╚════════════════════════════════════════════════════════╝")
        print()
        log("  Esperando 5s para que te conectes...")
        time.sleep(5)

    # Limpiar sesiones previas
    subprocess.run(["tmux", "kill-session", "-t", SESSION], capture_output=True)
    subprocess.run(["rm", "-f", f"{PLAYGROUND}/save/*"], capture_output=True)

    def cleanup():
        log(f"\n  ✅ Sesión tmux '{SESSION}' dejada activa.")
        log(f"  Conéctate con: tmux attach -t {SESSION}")

    atexit.register(cleanup)
    signal.signal(signal.SIGINT, lambda s, f: (cleanup(), sys.exit(0)))
    signal.signal(signal.SIGTERM, lambda s, f: (cleanup(), sys.exit(0)))

    try:
        bot = Bot(watch=args.watch)
        eng, bad, total = bot.play(args.max_steps)

        print()
        print("=" * 60)
        print(f"  Pasos:               {bot.step}")
        print(f"  Zonas exploradas:    {len(bot.dseen)}")
        print(f"  Pantallas:           {total} ({bad} con inglés)")
        print(f"  Palabras inglés:     {len(eng)}")
        if eng:
            print(f"  Palabras: {sorted(eng)}")
        if not eng:
            print("  ✅ Sin inglés!")
        print()
        print("  Mapa explorado:")
        # Mostrar mapa pequeño
        if hasattr(bot, "dmap") and bot.dmap:
            xs = [p[0] for p in bot.dmap]
            ys = [p[1] for p in bot.dmap]
            for y in range(min(ys), max(ys) + 1):
                row = ""
                for x in range(min(xs), max(xs) + 1):
                    ch = bot.dmap.get((x, y), " ")
                    row += ch
                print(f"    {row}")
            print()
    except Exception as e:
        log(f"Error: {e}")
        raise


def log(msg):
    print(msg, flush=True)


if __name__ == "__main__":
    main()
