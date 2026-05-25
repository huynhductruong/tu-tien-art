import { useEffect, useRef, useState, useCallback } from "react";
import { useGame } from "@/store/game";
import { dharmaPool, realms } from "@/data/game";
import { cn } from "@/lib/utils";

const WORLD_W = 900;
const WORLD_H = 560;
const PLAYER_R = 28;
const NODE_R = 20;
const MOB_R = 26;
const ALTAR_R = 44;
const SPEED = 240;
const ATTACK_RANGE = 80;
const ATTACK_CD = 0.7;
const MOB_AGGRO = 160;
const MOB_SPEED = 70;

type Vec = { x: number; y: number };

interface Mob {
  id: number;
  x: number; y: number;
  hp: number; maxHp: number;
  atk: number;
  level: number;
  alive: boolean;
  respawn: number;
  hurtT: number;
  attackCd: number;
  spawnX: number; spawnY: number;
  gif: string;
  name: string;
}

interface Node {
  id: number;
  x: number; y: number;
  qi: number;
  alive: boolean;
  cooldown: number;
  gif: string;
}

interface Floater {
  id: number;
  text: string;
  x: number; y: number;
  color: string;
}

interface SkillFx {
  id: number;
  x: number; y: number;
  kind: "slash" | "blast" | "heal";
  t: number;
}

const MOB_NAMES = ["Yêu Lang", "Hắc Vụ Tiểu Quỷ", "Cốt Binh", "Huyết Mãng", "Âm Hồn", "Ma Hổ", "Thiết Giáp Vệ"];
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

const makeMob = (id: number, realmIdx: number): Mob => {
  const lvl = Math.max(1, realmIdx + 1 + Math.floor(rand(0, 2)));
  const base = realms[realmIdx].power;
  const maxHp = Math.floor(20 + base * 1.2 + lvl * 8);
  const x = rand(80, WORLD_W - 80);
  const y = rand(160, WORLD_H - 60);
  return {
    id, x, y, spawnX: x, spawnY: y,
    hp: maxHp, maxHp,
    atk: Math.max(2, Math.floor(base / 6) + lvl),
    level: lvl,
    alive: true,
    respawn: 0,
    hurtT: 0,
    attackCd: 0,
    gif: dharmaPool[(id * 53 + realmIdx * 19) % dharmaPool.length],
    name: MOB_NAMES[id % MOB_NAMES.length],
  };
};

const spawnMobs = (realmIdx: number): Mob[] =>
  Array.from({ length: 6 }, (_, i) => makeMob(i, realmIdx));

const spawnNodes = (realmIdx: number): Node[] => {
  const base = realms[realmIdx].power;
  return Array.from({ length: 4 }, (_, i) => ({
    id: i,
    x: rand(60, WORLD_W - 60),
    y: rand(60, WORLD_H - 60),
    qi: Math.max(3, Math.floor(base / 2)) + Math.floor(rand(0, base)),
    alive: true,
    cooldown: 0,
    gif: dharmaPool[(realmIdx * 17 + i * 41 + 200) % dharmaPool.length],
  }));
};

export const CultivationWorld = () => {
  const g = useGame();
  const realm = realms[g.realmIdx];

  const [pos, setPos] = useState({ x: WORLD_W / 2, y: WORLD_H / 2 });
  const posRef = useRef(pos);
  const [facing, setFacing] = useState(1);

  // Player combat stats (session-scoped, not persisted)
  const playerMaxHp = 100 + g.realmIdx * 80;
  const playerAtk = 10 + realm.power + g.clickPower * 2;
  const [hp, setHp] = useState(playerMaxHp);
  const hpRef = useRef(hp);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const xpForLvl = (lv: number) => 30 + lv * 25;

  const [mobs, setMobs] = useState<Mob[]>(() => spawnMobs(g.realmIdx));
  const [nodes, setNodes] = useState<Node[]>(() => spawnNodes(g.realmIdx));
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [fx, setFx] = useState<SkillFx[]>([]);
  const [nearAltar, setNearAltar] = useState(false);
  const [targetMobId, setTargetMobId] = useState<number | null>(null);
  const targetRef = useRef<number | null>(null);

  const keys = useRef<Record<string, boolean>>({});
  const moveTarget = useRef<Vec | null>(null);
  const attackCdRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const skillCdRef = useRef<{ q: number; e: number; r: number }>({ q: 0, e: 0, r: 0 });
  const [skillCd, setSkillCd] = useState({ q: 0, e: 0, r: 0 });

  useEffect(() => { setMobs(spawnMobs(g.realmIdx)); setNodes(spawnNodes(g.realmIdx)); }, [g.realmIdx]);

  posRef.current = pos;
  hpRef.current = hp;
  targetRef.current = targetMobId;

  const pushFloater = useCallback((text: string, x: number, y: number, color = "hsl(var(--accent-gold-deep))") => {
    const id = Date.now() + Math.random();
    setFloaters((f) => [...f, { id, text, x, y, color }]);
    setTimeout(() => setFloaters((f) => f.filter((p) => p.id !== id)), 900);
  }, []);

  const pushFx = useCallback((x: number, y: number, kind: SkillFx["kind"]) => {
    const id = Date.now() + Math.random();
    setFx((s) => [...s, { id, x, y, kind, t: 0 }]);
    setTimeout(() => setFx((s) => s.filter((p) => p.id !== id)), 500);
  }, []);

  const gainXp = useCallback((amount: number) => {
    setXp((cur) => {
      let v = cur + amount;
      let lv = level;
      while (v >= xpForLvl(lv)) {
        v -= xpForLvl(lv);
        lv += 1;
        pushFloater("LEVEL UP!", posRef.current.x, posRef.current.y - 30, "hsl(var(--accent-gold))");
      }
      if (lv !== level) setLevel(lv);
      return v;
    });
  }, [level, pushFloater]);

  // input
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === " ") { e.preventDefault(); }
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);

  // skills
  const castSkill = useCallback((key: "q" | "e" | "r") => {
    if (skillCdRef.current[key] > 0) return;
    const p = posRef.current;
    if (key === "q") {
      // AoE slash
      skillCdRef.current.q = 4;
      pushFx(p.x, p.y, "slash");
      setMobs((prev) => prev.map((m) => {
        if (!m.alive) return m;
        if (dist(m, p) < 120) {
          const dmg = Math.floor(playerAtk * 2.2);
          const newHp = m.hp - dmg;
          pushFloater(`-${dmg}`, m.x, m.y - 10, "hsl(var(--rank-myth))");
          if (newHp <= 0) {
            gainXp(m.level * 12);
            useGame.getState().gainQi(m.level * 8);
            return { ...m, hp: 0, alive: false, respawn: 5 };
          }
          return { ...m, hp: newHp, hurtT: 0.2 };
        }
        return m;
      }));
    } else if (key === "e") {
      // Blast on target
      skillCdRef.current.e = 6;
      setMobs((prev) => prev.map((m) => {
        if (!m.alive || m.id !== targetRef.current) return m;
        pushFx(m.x, m.y, "blast");
        const dmg = Math.floor(playerAtk * 3.5);
        const newHp = m.hp - dmg;
        pushFloater(`-${dmg}`, m.x, m.y - 10, "hsl(var(--rank-legend))");
        if (newHp <= 0) {
          gainXp(m.level * 12);
          useGame.getState().gainQi(m.level * 8);
          return { ...m, hp: 0, alive: false, respawn: 5 };
        }
        return { ...m, hp: newHp, hurtT: 0.2 };
      }));
    } else if (key === "r") {
      // Heal
      skillCdRef.current.r = 12;
      pushFx(p.x, p.y, "heal");
      const heal = Math.floor(playerMaxHp * 0.5);
      setHp((cur) => Math.min(playerMaxHp, cur + heal));
      pushFloater(`+${heal}`, p.x, p.y - 20, "hsl(var(--jade-aura))");
    }
    setSkillCd({ ...skillCdRef.current });
  }, [playerAtk, playerMaxHp, gainXp, pushFloater, pushFx]);

  // game loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      // skill cds
      let cdChanged = false;
      (["q", "e", "r"] as const).forEach((k) => {
        if (skillCdRef.current[k] > 0) {
          skillCdRef.current[k] = Math.max(0, skillCdRef.current[k] - dt);
          cdChanged = true;
        }
      });
      if (cdChanged) setSkillCd({ ...skillCdRef.current });

      // keyboard skill triggers
      if (keys.current["q"]) { castSkill("q"); keys.current["q"] = false; }
      if (keys.current["e"]) { castSkill("e"); keys.current["e"] = false; }
      if (keys.current["r"]) { castSkill("r"); keys.current["r"] = false; }

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
        moveTarget.current = null;
        const len = Math.hypot(dx, dy);
        nx += (dx / len) * SPEED * dt;
        ny += (dy / len) * SPEED * dt;
        if (dx !== 0) setFacing(dx > 0 ? 1 : -1);
      } else if (moveTarget.current) {
        const tx = moveTarget.current.x - cur.x;
        const ty = moveTarget.current.y - cur.y;
        const d = Math.hypot(tx, ty);
        if (d < 4) moveTarget.current = null;
        else {
          nx += (tx / d) * SPEED * dt;
          ny += (ty / d) * SPEED * dt;
          if (Math.abs(tx) > 2) setFacing(tx > 0 ? 1 : -1);
        }
      }

      nx = Math.max(PLAYER_R, Math.min(WORLD_W - PLAYER_R, nx));
      ny = Math.max(PLAYER_R, Math.min(WORLD_H - PLAYER_R, ny));
      if (nx !== cur.x || ny !== cur.y) setPos({ x: nx, y: ny });

      // attack cd
      if (attackCdRef.current > 0) attackCdRef.current = Math.max(0, attackCdRef.current - dt);

      // mobs AI & combat
      let dmgToPlayer = 0;
      setMobs((prev) => {
        const next = prev.map((m) => {
          if (!m.alive) {
            const r = m.respawn - dt;
            if (r <= 0) {
              return makeMob(m.id, useGame.getState().realmIdx);
            }
            return { ...m, respawn: r };
          }
          let mx = m.x, my = m.y;
          const toPlayer = { x: nx - mx, y: ny - my };
          const dPlayer = Math.hypot(toPlayer.x, toPlayer.y);

          // aggro chase if player near OR mob is target
          if (dPlayer < MOB_AGGRO || targetRef.current === m.id) {
            if (dPlayer > MOB_R + PLAYER_R - 4) {
              mx += (toPlayer.x / dPlayer) * MOB_SPEED * dt;
              my += (toPlayer.y / dPlayer) * MOB_SPEED * dt;
            } else {
              // attack
              if (m.attackCd <= 0) {
                dmgToPlayer += m.atk;
                pushFloater(`-${m.atk}`, nx, ny - 20, "hsl(var(--destructive))");
                return { ...m, x: mx, y: my, attackCd: 1.2, hurtT: Math.max(0, m.hurtT - dt) };
              }
            }
          } else {
            // wander back to spawn
            const ts = { x: m.spawnX - mx, y: m.spawnY - my };
            const ds = Math.hypot(ts.x, ts.y);
            if (ds > 6) {
              mx += (ts.x / ds) * MOB_SPEED * 0.5 * dt;
              my += (ts.y / ds) * MOB_SPEED * 0.5 * dt;
            }
          }

          // auto-attack the targeted mob
          if (targetRef.current === m.id && dPlayer < ATTACK_RANGE && attackCdRef.current <= 0) {
            attackCdRef.current = ATTACK_CD;
            const dmg = playerAtk + Math.floor(rand(0, playerAtk * 0.3));
            const newHp = m.hp - dmg;
            pushFloater(`-${dmg}`, m.x, m.y - 10, "hsl(var(--accent-gold))");
            if (newHp <= 0) {
              gainXp(m.level * 12);
              useGame.getState().gainQi(m.level * 8);
              if (Math.random() < 0.15) {
                // drop spirit stone
                pushFloater("+2 灵石", m.x, m.y, "hsl(var(--rank-legend))");
              }
              return { ...m, x: mx, y: my, hp: 0, alive: false, respawn: 5 };
            }
            return { ...m, x: mx, y: my, hp: newHp, hurtT: 0.18, attackCd: Math.max(0, m.attackCd - dt) };
          }

          return {
            ...m,
            x: mx, y: my,
            attackCd: Math.max(0, m.attackCd - dt),
            hurtT: Math.max(0, m.hurtT - dt),
          };
        });
        return next;
      });

      if (dmgToPlayer > 0) {
        const nh = Math.max(0, hpRef.current - dmgToPlayer);
        setHp(nh);
        if (nh === 0) {
          // respawn at center
          setTimeout(() => {
            setPos({ x: WORLD_W / 2, y: WORLD_H / 2 });
            setHp(playerMaxHp);
            setTargetMobId(null);
            pushFloater("Hồi sinh", WORLD_W / 2, WORLD_H / 2, "hsl(var(--jade-aura))");
          }, 600);
        }
      }

      // node pickup
      setNodes((prev) => {
        let changed = false;
        const next = prev.map((n) => {
          if (n.alive) {
            if (Math.hypot(n.x - nx, n.y - ny) < PLAYER_R + NODE_R) {
              useGame.getState().gainQi(n.qi);
              pushFloater(`+${n.qi} 灵`, n.x, n.y);
              changed = true;
              return { ...n, alive: false, cooldown: 4 };
            }
          } else {
            const cd = n.cooldown - dt;
            if (cd <= 0) {
              changed = true;
              return {
                ...n, alive: true, cooldown: 0,
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
      setNearAltar(Math.hypot(nx - WORLD_W / 2, ny - 70) < PLAYER_R + ALTAR_R);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [castSkill, gainXp, playerAtk, playerMaxHp, pushFloater]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    const sx = WORLD_W / rect.width;
    const sy = WORLD_H / rect.height;
    const cx = (e.clientX - rect.left) * sx;
    const cy = (e.clientY - rect.top) * sy;
    // click on a mob = target
    const m = mobs.find((mm) => mm.alive && Math.hypot(mm.x - cx, mm.y - cy) < MOB_R + 6);
    if (m) {
      setTargetMobId(m.id);
      moveTarget.current = { x: m.x, y: m.y };
      return;
    }
    setTargetMobId(null);
    moveTarget.current = { x: cx, y: cy };
  };

  const nextNeed = realm.qiNeeded;
  const progress = Math.min(100, (g.qi / nextNeed) * 100);
  const canBreak = g.qi >= nextNeed && g.realmIdx < realms.length - 1;
  const xpPct = (xp / xpForLvl(level)) * 100;
  const hpPct = (hp / playerMaxHp) * 100;

  const SkillBtn = ({ k, label, cd, max }: { k: "q" | "e" | "r"; label: string; cd: number; max: number }) => (
    <button
      onClick={() => castSkill(k)}
      disabled={cd > 0}
      className="relative w-14 h-14 rounded-lg border border-accent-gold/40 bg-background/70 font-display text-xs text-accent-gold-deep disabled:opacity-50 overflow-hidden"
    >
      <div className="absolute top-0.5 left-1 text-[9px] opacity-60">{k.toUpperCase()}</div>
      <div className="leading-tight">{label}</div>
      {cd > 0 && (
        <>
          <div className="absolute inset-0 bg-background/70" style={{ clipPath: `inset(0 0 ${100 - (cd / max) * 100}% 0)` }} />
          <div className="absolute inset-0 grid place-items-center text-sm tabular-nums">{cd.toFixed(1)}</div>
        </>
      )}
    </button>
  );

  return (
    <div className="jade-frame rounded-2xl p-4 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <div className="font-display tracking-widest text-primary-deep">
          {realm.cn} · {realm.vietName.toUpperCase()} · Lv.{level}
        </div>
        <div className="text-muted-foreground hidden md:block">
          WASD/⬆⬇⬅➡ di chuyển · Click vào quái để khoá mục tiêu · Q/E/R kỹ năng
        </div>
      </div>

      <div
        ref={wrapRef}
        onClick={handleClick}
        className="relative w-full rounded-xl overflow-hidden cursor-crosshair select-none border border-primary/30"
        style={{
          aspectRatio: `${WORLD_W} / ${WORLD_H}`,
          background:
            "radial-gradient(ellipse at 50% 20%, hsl(var(--primary)/0.25), transparent 60%), radial-gradient(ellipse at 30% 80%, hsl(var(--accent-gold)/0.15), transparent 60%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--secondary)))",
        }}
      >
        <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
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
            width: `${((ALTAR_R * 2) / WORLD_W) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative" style={{ aspectRatio: "1" }}>
            <div
              className={cn("absolute inset-0 rounded-full border-2", canBreak ? "border-accent-gold animate-pulse" : "border-primary/40")}
              style={{ background: "radial-gradient(circle, hsl(var(--accent-gold)/0.3), transparent 70%)" }}
            />
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
          <div key={`n${n.id}`} className="absolute pointer-events-none"
            style={{
              left: `${(n.x / WORLD_W) * 100}%`, top: `${(n.y / WORLD_H) * 100}%`,
              width: `${((NODE_R * 2) / WORLD_W) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}>
            <div className="relative animate-aura-pulse" style={{ aspectRatio: "1" }}>
              <div className="absolute inset-0 rounded-full bg-jade-aura/30 blur-md" />
              <img src={n.gif} alt="" className="relative w-full h-full object-contain" />
            </div>
          </div>
        ))}

        {/* Mobs */}
        {mobs.map((m) => m.alive && (
          <div key={`m${m.id}`} className="absolute"
            style={{
              left: `${(m.x / WORLD_W) * 100}%`, top: `${(m.y / WORLD_H) * 100}%`,
              width: `${((MOB_R * 2.2) / WORLD_W) * 100}%`,
              transform: "translate(-50%, -55%)",
            }}>
            <div className="relative" style={{ aspectRatio: "1" }}>
              <div className={cn(
                "absolute inset-0 rounded-full blur-md transition-colors",
                targetMobId === m.id ? "bg-destructive/40" : "bg-foreground/20",
                m.hurtT > 0 && "bg-destructive/70"
              )} />
              <img src={m.gif} alt={m.name}
                className={cn("relative w-full h-full object-contain drop-shadow-lg", m.hurtT > 0 && "animate-pulse")} />
            </div>
            {/* nameplate */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-display tracking-wider whitespace-nowrap text-foreground/80">
              {m.name} Lv.{m.level}
            </div>
            {/* HP bar */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-background/60 border border-destructive/40 overflow-hidden">
              <div className="h-full bg-destructive transition-all" style={{ width: `${(m.hp / m.maxHp) * 100}%` }} />
            </div>
          </div>
        ))}

        {/* Skill FX */}
        {fx.map((f) => (
          <div key={f.id} className="absolute pointer-events-none"
            style={{
              left: `${(f.x / WORLD_W) * 100}%`, top: `${(f.y / WORLD_H) * 100}%`,
              width: f.kind === "slash" ? "26%" : "14%",
              transform: "translate(-50%, -50%)",
            }}>
            <div className="relative" style={{ aspectRatio: "1" }}>
              {f.kind === "slash" && <div className="absolute inset-0 rounded-full border-4 border-accent-gold animate-ping" />}
              {f.kind === "blast" && <div className="absolute inset-0 rounded-full bg-rank-legend/60 blur-md animate-ping" />}
              {f.kind === "heal" && <div className="absolute inset-0 rounded-full border-4 border-jade-aura animate-ping" />}
            </div>
          </div>
        ))}

        {/* Player */}
        <div className="absolute pointer-events-none"
          style={{
            left: `${(pos.x / WORLD_W) * 100}%`, top: `${(pos.y / WORLD_H) * 100}%`,
            width: `${((PLAYER_R * 2.4) / WORLD_W) * 100}%`,
            transform: `translate(-50%, -55%) scaleX(${facing})`,
          }}>
          <div className="relative" style={{ aspectRatio: "1" }}>
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg" />
            <img src={dharmaPool[(g.realmIdx * 37 + 13) % dharmaPool.length]} alt="Tu sĩ"
              className="relative w-full h-full object-contain drop-shadow-[0_4px_12px_hsl(var(--primary)/0.6)]" />
          </div>
          {/* HP bar above player */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full bg-background/60 border border-primary/50 overflow-hidden">
            <div className="h-full bg-jade-aura transition-all" style={{ width: `${hpPct}%` }} />
          </div>
        </div>

        {/* Floaters */}
        {floaters.map((f) => (
          <span key={f.id} className="absolute pointer-events-none font-display text-sm animate-rise tabular-nums"
            style={{
              left: `${(f.x / WORLD_W) * 100}%`, top: `${(f.y / WORLD_H) * 100}%`,
              transform: "translate(-50%, -100%)", color: f.color,
            }}>
            {f.text}
          </span>
        ))}

        {/* Top-left HUD */}
        <div className="absolute top-2 left-2 space-y-1 pointer-events-none">
          <div className="px-2 py-1 rounded bg-background/70 border border-primary/30 text-[10px] font-display">
            HP {Math.ceil(hp)}/{playerMaxHp}
          </div>
          <div className="w-32 h-2 rounded-full bg-background/60 border border-destructive/40 overflow-hidden">
            <div className="h-full bg-destructive transition-all" style={{ width: `${hpPct}%` }} />
          </div>
          <div className="w-32 h-1.5 rounded-full bg-background/60 border border-accent-gold/40 overflow-hidden">
            <div className="h-full bg-accent-gold transition-all" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="text-[9px] text-muted-foreground">Lv.{level} · XP {xp}/{xpForLvl(level)}</div>
        </div>

        {/* Altar prompt */}
        {nearAltar && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 border border-accent-gold text-xs font-display tracking-widest text-accent-gold-deep animate-pulse">
            {canBreak ? "Bấm ĐỘT PHÁ ↓" : `Cần ${Math.max(0, Math.ceil(nextNeed - g.qi))} linh khí`}
          </div>
        )}

        {/* Skill bar bottom */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2"
          onClick={(e) => e.stopPropagation()}>
          <SkillBtn k="q" label="Loạn Kiếm" cd={skillCd.q} max={4} />
          <SkillBtn k="e" label="Lôi Trảm" cd={skillCd.e} max={6} />
          <SkillBtn k="r" label="Hồi Phục" cd={skillCd.r} max={12} />
        </div>
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
