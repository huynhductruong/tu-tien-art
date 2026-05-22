import { useEffect, useRef, useState, useCallback } from "react";
import { useGame } from "@/store/game";
import { dharmaPool, realms } from "@/data/game";
import { cn } from "@/lib/utils";

const WORLD_W = 800;
const WORLD_H = 500;
const PLAYER_R = 28;
const NODE_R = 22;
const ALTAR_R = 44;
const SPEED = 220; // px/s

interface Node {
  id: number;
  x: number;
  y: number;
  qi: number;
  alive: boolean;
  cooldown: number;
  gif: string;
}

interface Floater {
  id: number;
  text: string;
  x: number;
  y: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

const spawnNodes = (realmIdx: number): Node[] => {
  const base = realms[realmIdx].power;
  return Array.from({ length: 7 }, (_, i) => ({
    id: i,
    x: rand(60, WORLD_W - 60),
    y: rand(60, WORLD_H - 60),
    qi: Math.max(3, Math.floor(base / 2)) + Math.floor(rand(0, base)),
    alive: true,
    cooldown: 0,
    gif: dharmaPool[(realmIdx * 17 + i * 41) % dharmaPool.length],
  }));
};

export const CultivationWorld = () => {
  const g = useGame();
  const realm = realms[g.realmIdx];
  const [pos, setPos] = useState({ x: WORLD_W / 2, y: WORLD_H / 2 });
  const posRef = useRef(pos);
  const [facing, setFacing] = useState(1); // 1 right, -1 left
  const [nodes, setNodes] = useState<Node[]>(() => spawnNodes(g.realmIdx));
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [nearAltar, setNearAltar] = useState(false);
  const keys = useRef<Record<string, boolean>>({});
  const target = useRef<{ x: number; y: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // refresh nodes when realm changes
  useEffect(() => {
    setNodes(spawnNodes(g.realmIdx));
  }, [g.realmIdx]);

  posRef.current = pos;

  // input
  useEffect(() => {
    const dn = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);

  const pushFloater = useCallback((text: string, x: number, y: number) => {
    const id = Date.now() + Math.random();
    setFloaters((f) => [...f, { id, text, x, y }]);
    setTimeout(() => setFloaters((f) => f.filter((p) => p.id !== id)), 900);
  }, []);

  // game loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      // movement
      let dx = 0, dy = 0;
      const k = keys.current;
      if (k["arrowleft"] || k["a"]) dx -= 1;
      if (k["arrowright"] || k["d"]) dx += 1;
      if (k["arrowup"] || k["w"]) dy -= 1;
      if (k["arrowdown"] || k["s"]) dy += 1;

      const cur = posRef.current;
      let nx = cur.x, ny = cur.y;

      if (dx || dy) {
        target.current = null;
        const len = Math.hypot(dx, dy);
        nx += (dx / len) * SPEED * dt;
        ny += (dy / len) * SPEED * dt;
        if (dx !== 0) setFacing(dx > 0 ? 1 : -1);
      } else if (target.current) {
        const tx = target.current.x - cur.x;
        const ty = target.current.y - cur.y;
        const d = Math.hypot(tx, ty);
        if (d < 4) target.current = null;
        else {
          nx += (tx / d) * SPEED * dt;
          ny += (ty / d) * SPEED * dt;
          if (Math.abs(tx) > 2) setFacing(tx > 0 ? 1 : -1);
        }
      }

      nx = Math.max(PLAYER_R, Math.min(WORLD_W - PLAYER_R, nx));
      ny = Math.max(PLAYER_R, Math.min(WORLD_H - PLAYER_R, ny));

      if (nx !== cur.x || ny !== cur.y) {
        setPos({ x: nx, y: ny });
      }

      // node collisions + respawn
      setNodes((prev) => {
        let changed = false;
        const next = prev.map((n) => {
          if (n.alive) {
            if (Math.hypot(n.x - nx, n.y - ny) < PLAYER_R + NODE_R) {
              useGame.getState().gainQi(n.qi);
              pushFloater(`+${n.qi} 灵`, n.x, n.y);
              changed = true;
              return { ...n, alive: false, cooldown: 3 };
            }
          } else {
            const cd = n.cooldown - dt;
            if (cd <= 0) {
              changed = true;
              return {
                ...n,
                alive: true,
                cooldown: 0,
                x: rand(60, WORLD_W - 60),
                y: rand(60, WORLD_H - 60),
                qi: Math.max(3, Math.floor(realms[useGame.getState().realmIdx].power / 2)) +
                  Math.floor(rand(0, realms[useGame.getState().realmIdx].power)),
              };
            }
            changed = true;
            return { ...n, cooldown: cd };
          }
          return n;
        });
        return changed ? next : prev;
      });

      // altar
      const altarX = WORLD_W / 2;
      const altarY = 70;
      setNearAltar(Math.hypot(nx - altarX, ny - altarY) < PLAYER_R + ALTAR_R);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pushFloater]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    const scaleX = WORLD_W / rect.width;
    const scaleY = WORLD_H / rect.height;
    target.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const nextNeed = realm.qiNeeded;
  const progress = Math.min(100, (g.qi / nextNeed) * 100);
  const canBreak = g.qi >= nextNeed && g.realmIdx < realms.length - 1;

  return (
    <div className="jade-frame rounded-2xl p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="font-display tracking-widest text-primary-deep">
          {realm.cn} · {realm.vietName.toUpperCase()}
        </div>
        <div className="text-muted-foreground">
          WASD / ⬆⬇⬅➡ hoặc bấm để di chuyển · chạm linh mạch để hấp thu
        </div>
      </div>

      <div
        ref={wrapRef}
        onClick={handleTap}
        className="relative w-full rounded-xl overflow-hidden cursor-crosshair select-none border border-primary/30"
        style={{
          aspectRatio: `${WORLD_W} / ${WORLD_H}`,
          background:
            "radial-gradient(ellipse at 50% 20%, hsl(var(--primary)/0.25), transparent 60%), radial-gradient(ellipse at 30% 80%, hsl(var(--accent-gold)/0.15), transparent 60%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--secondary)))",
        }}
      >
        {/* SVG overlay scaled to world */}
        <svg
          viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary)/0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={WORLD_W} height={WORLD_H} fill="url(#grid)" />
        </svg>

        {/* Altar */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(WORLD_W / 2 / WORLD_W) * 100}%`,
            top: `${(70 / WORLD_H) * 100}%`,
            width: `${(ALTAR_R * 2 / WORLD_W) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative" style={{ aspectRatio: "1" }}>
            <div className={cn(
              "absolute inset-0 rounded-full border-2",
              canBreak ? "border-accent-gold animate-pulse" : "border-primary/40"
            )} style={{
              background: "radial-gradient(circle, hsl(var(--accent-gold)/0.3), transparent 70%)",
            }} />
            <img
              src={dharmaPool[(g.realmIdx * 89) % dharmaPool.length]}
              alt="Đàn đột phá"
              className="absolute inset-0 w-full h-full object-contain opacity-90"
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-display tracking-widest text-accent-gold-deep whitespace-nowrap">
            渡劫坛
          </div>
        </div>

        {/* Spirit nodes */}
        {nodes.map((n) => n.alive && (
          <div
            key={n.id}
            className="absolute pointer-events-none"
            style={{
              left: `${(n.x / WORLD_W) * 100}%`,
              top: `${(n.y / WORLD_H) * 100}%`,
              width: `${(NODE_R * 2 / WORLD_W) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative animate-aura-pulse" style={{ aspectRatio: "1" }}>
              <div className="absolute inset-0 rounded-full bg-jade-aura/30 blur-md" />
              <img src={n.gif} alt="" className="relative w-full h-full object-contain" />
            </div>
          </div>
        ))}

        {/* Player */}
        <div
          className="absolute pointer-events-none transition-none"
          style={{
            left: `${(pos.x / WORLD_W) * 100}%`,
            top: `${(pos.y / WORLD_H) * 100}%`,
            width: `${(PLAYER_R * 2.4 / WORLD_W) * 100}%`,
            transform: `translate(-50%, -55%) scaleX(${facing})`,
          }}
        >
          <div className="relative" style={{ aspectRatio: "1" }}>
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg" />
            <img
              src={dharmaPool[(g.realmIdx * 37 + 13) % dharmaPool.length]}
              alt="Tu sĩ"
              className="relative w-full h-full object-contain drop-shadow-[0_4px_12px_hsl(var(--primary)/0.6)]"
            />
          </div>
        </div>

        {/* Floaters */}
        {floaters.map((f) => (
          <span
            key={f.id}
            className="absolute pointer-events-none font-display text-accent-gold-deep text-sm animate-rise"
            style={{
              left: `${(f.x / WORLD_W) * 100}%`,
              top: `${(f.y / WORLD_H) * 100}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            {f.text}
          </span>
        ))}

        {/* Altar prompt */}
        {nearAltar && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 border border-accent-gold text-xs font-display tracking-widest text-accent-gold-deep animate-pulse">
            {canBreak ? "Bấm ĐỘT PHÁ ↓" : `Cần ${Math.max(0, Math.ceil(nextNeed - g.qi))} linh khí`}
          </div>
        )}
      </div>

      {/* Progress + breakthrough */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-display mb-1">
          <span className="text-primary-deep">
            {realm.vietName} → {realms[Math.min(g.realmIdx + 1, realms.length - 1)].vietName}
          </span>
          <span className="text-muted-foreground tabular-nums">
            {Math.floor(g.qi)} / {nextNeed === Infinity ? "∞" : nextNeed}
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden border border-primary/20">
          <div className="h-full bg-gradient-jade transition-all" style={{ width: `${progress}%` }} />
        </div>
        <button
          disabled={!canBreak || !nearAltar}
          onClick={() => g.breakthrough()}
          className="w-full mt-3 py-3 rounded-lg bg-gradient-to-r from-accent-gold to-accent-gold-deep text-white font-display tracking-[0.3em] text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-gold transition-all"
        >
          {nearAltar ? "渡劫 · ĐỘT PHÁ CẢNH GIỚI" : "Đến 渡劫坛 (đỉnh bản đồ) để đột phá"}
        </button>
      </div>
    </div>
  );
};
