import { useEffect, useMemo, useState } from "react";
import { useGame } from "@/store/game";
import { allTreasures, bosses, dharmaPool, realms, rarityColor, rarityLabel, type Treasure } from "@/data/game";
import { cn } from "@/lib/utils";

const fmt = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return Math.floor(n).toString();
};

type Tab = "tu-luyen" | "battle" | "gacha" | "kho";

interface Floater {
  id: number;
  text: string;
  x: number;
  y: number;
}

const Game = () => {
  const g = useGame();
  const [tab, setTab] = useState<Tab>("tu-luyen");
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [rollResults, setRollResults] = useState<Treasure[]>([]);
  const [bossFlash, setBossFlash] = useState(false);

  // Auto qi tick
  useEffect(() => {
    const id = setInterval(() => g.tick(), 1000);
    return () => clearInterval(id);
  }, [g]);

  const realm = realms[g.realmIdx];
  const nextNeed = realm.qiNeeded;
  const progress = Math.min(100, (g.qi / nextNeed) * 100);
  const boss = bosses[g.bossIdx];
  const bossPct = Math.max(0, (g.bossHp / boss.hp) * 100);

  const equipped = useMemo(
    () => g.equippedIds.map((id) => allTreasures.find((t) => t.id === id)!).filter(Boolean),
    [g.equippedIds]
  );
  const owned = useMemo(
    () => g.ownedTreasureIds.map((id) => allTreasures.find((t) => t.id === id)!).filter(Boolean),
    [g.ownedTreasureIds]
  );

  const handleClick = (e: React.MouseEvent) => {
    g.click();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now() + Math.random();
    setFloaters((f) => [
      ...f,
      { id, text: `+${fmt(g.clickPower + Math.floor(realm.power / 5))} 灵`, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 900);
  };

  const handleAttack = () => {
    const r = g.attackBoss();
    setBossFlash(true);
    setTimeout(() => setBossFlash(false), 200);
    if (r.killed) {
      const id = Date.now();
      setFloaters((f) => [...f, { id, text: `KILLED! +${fmt(boss.reward)} 石`, x: 200, y: 100 }]);
      setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1500);
    }
  };

  const handleRoll = (n: number) => {
    const res = g.rollGacha(n);
    if (res.length) setRollResults(res);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%),radial-gradient(ellipse_at_bottom,hsl(var(--accent-gold)/0.1),transparent_60%)] bg-background text-foreground">
      {/* HUD */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-primary/20">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <div className="font-script text-3xl text-jade-aura leading-none">仙</div>
            <div>
              <div className="font-display text-sm tracking-[0.3em] text-primary-deep">TIÊN LỘ</div>
              <div className="text-xs text-muted-foreground">{realm.cn} · {realm.vietName}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Stat label="灵气" value={fmt(g.qi)} accent="jade" />
            <Stat label="灵石" value={fmt(g.spiritStones)} accent="gold" />
            <Stat label="战力" value={fmt(realm.power + equipped.reduce((s, t) => s + t.power, 0))} accent="jade" />
          </div>
        </div>
        <nav className="container flex gap-1 pb-2 overflow-x-auto">
          {([
            ["tu-luyen", "修炼 Tu Luyện"],
            ["battle", "斗法 Đấu Pháp"],
            ["gacha", "召唤 Triệu Hồi"],
            ["kho", "宝库 Bảo Khố"],
          ] as [Tab, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-display tracking-wider transition-all whitespace-nowrap",
                tab === k
                  ? "bg-gradient-jade text-primary-foreground shadow-jade"
                  : "text-primary-deep hover:bg-primary/10"
              )}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="container py-6">
        {tab === "tu-luyen" && (
          <section className="grid lg:grid-cols-3 gap-6">
            {/* Click area */}
            <div className="lg:col-span-2 jade-frame rounded-2xl p-6 relative overflow-hidden">
              <div className="text-center mb-4">
                <div className="font-script text-5xl text-jade-aura">{realm.cn}</div>
                <div className="font-display tracking-[0.3em] text-primary-deep mt-1">{realm.vietName.toUpperCase()}</div>
              </div>

              <div
                onClick={handleClick}
                className="relative mx-auto w-72 h-72 rounded-full cursor-pointer select-none active:scale-95 transition-transform"
                style={{
                  background: `radial-gradient(circle, hsl(var(--primary)/0.4), transparent 70%)`,
                }}
              >
                <img
                  src={dharmaPool[(g.realmIdx * 37) % dharmaPool.length]}
                  alt="Pháp tướng"
                  className="absolute inset-0 w-full h-full object-contain animate-aura-pulse pointer-events-none"
                />
                <img
                  src={dharmaPool[(g.realmIdx * 37 + 13) % dharmaPool.length]}
                  alt="Tu sĩ"
                  className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] object-contain pointer-events-none mix-blend-screen"
                />
                {floaters.map((f) => (
                  <span
                    key={f.id}
                    className="absolute pointer-events-none font-display text-accent-gold-deep text-lg animate-rise"
                    style={{ left: f.x, top: f.y }}
                  >
                    {f.text}
                  </span>
                ))}
              </div>

              <div className="text-center text-xs text-muted-foreground mt-4">
                Bấm để hấp thu linh khí · +{fmt(g.clickPower + Math.floor(realm.power / 5))}/click · auto +{fmt(g.autoQi)}/s
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-display mb-1">
                  <span className="text-primary-deep">{realm.vietName} → {realms[Math.min(g.realmIdx + 1, realms.length - 1)].vietName}</span>
                  <span className="text-muted-foreground">{fmt(g.qi)} / {fmt(nextNeed)}</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden border border-primary/20">
                  <div
                    className="h-full bg-gradient-jade transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <button
                  disabled={g.qi < nextNeed || g.realmIdx >= realms.length - 1}
                  onClick={() => g.breakthrough()}
                  className="w-full mt-3 py-3 rounded-lg bg-gradient-to-r from-accent-gold to-accent-gold-deep text-white font-display tracking-[0.3em] text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-gold transition-all"
                >
                  渡劫 · ĐỘT PHÁ CẢNH GIỚI
                </button>
              </div>
            </div>

            {/* Equipped sidebar */}
            <aside className="space-y-4">
              <div className="jade-frame rounded-xl p-4">
                <div className="font-display text-xs tracking-[0.3em] text-primary-deep mb-3">PHÁP BẢO TRANG BỊ ({equipped.length}/3)</div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((i) => {
                    const t = equipped[i];
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-lg border border-primary/30 bg-secondary/50 flex items-center justify-center overflow-hidden relative"
                        style={t ? { borderColor: rarityColor[t.rarity] } : {}}
                      >
                        {t ? (
                          <>
                            <img src={t.src} alt={t.name} className="w-full h-full object-contain" />
                            <button
                              onClick={() => g.unequip(t.id)}
                              className="absolute top-0.5 right-0.5 text-xs bg-background/80 rounded px-1"
                            >×</button>
                          </>
                        ) : (
                          <span className="text-2xl text-muted-foreground/40">+</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="jade-frame rounded-xl p-4 space-y-2 text-sm">
                <div className="font-display text-xs tracking-[0.3em] text-primary-deep mb-2">THỐNG KÊ</div>
                <Row label="Cảnh giới" value={`${realm.vietName} (Lv.${g.realmIdx + 1})`} />
                <Row label="Linh khí/click" value={fmt(g.clickPower + Math.floor(realm.power / 5))} />
                <Row label="Tự động/s" value={fmt(g.autoQi)} />
                <Row label="Pháp bảo sở hữu" value={`${owned.length}/${allTreasures.length}`} />
                <Row label="Tổng click" value={fmt(g.totalClicks)} />
              </div>

              <button
                onClick={() => { if (confirm("Reset toàn bộ tiến trình?")) g.reset(); }}
                className="w-full text-xs text-muted-foreground hover:text-destructive py-2"
              >
                ↻ Bắt đầu lại
              </button>
            </aside>
          </section>
        )}

        {tab === "battle" && (
          <section className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 jade-frame rounded-2xl p-6 relative">
              <div className="text-center">
                <div className="font-script text-4xl text-destructive">{boss.cn}</div>
                <div className="font-display tracking-widest text-primary-deep mt-1">{boss.name}</div>
                <div className="text-xs text-muted-foreground mt-1">Boss {g.bossIdx + 1}/{bosses.length} · Thưởng {fmt(boss.reward)} linh thạch</div>
              </div>

              <div className={cn("relative mx-auto mt-6 w-80 h-80 transition-transform", bossFlash && "scale-105")}>
                <div className="absolute inset-0 rounded-full bg-destructive/10 blur-2xl" />
                <img
                  src={boss.src}
                  alt={boss.name}
                  className={cn("relative w-full h-full object-contain", bossFlash && "brightness-200")}
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-display mb-1">
                  <span className="text-destructive">HP</span>
                  <span>{fmt(g.bossHp)} / {fmt(boss.hp)}</span>
                </div>
                <div className="h-4 rounded-full bg-muted overflow-hidden border border-destructive/30">
                  <div className="h-full bg-gradient-to-r from-destructive to-accent-gold transition-all" style={{ width: `${bossPct}%` }} />
                </div>
              </div>

              <button
                onClick={handleAttack}
                className="w-full mt-4 py-4 rounded-lg bg-gradient-to-r from-destructive to-accent-gold-deep text-white font-display tracking-[0.4em] text-sm hover:shadow-aura transition-all active:scale-95"
              >
                ⚔ XUẤT KIẾM · {fmt(realm.power + equipped.reduce((s, t) => s + t.power, 0) + g.clickPower)} ATK
              </button>
            </div>

            <aside className="jade-frame rounded-xl p-4">
              <div className="font-display text-xs tracking-[0.3em] text-primary-deep mb-3">CÔNG PHÁP / PHÁP BẢO XUẤT TRẬN</div>
              <div className="space-y-2">
                {equipped.length === 0 && (
                  <div className="text-xs text-muted-foreground italic">Chưa trang bị pháp bảo. Vào Bảo Khố để trang bị.</div>
                )}
                {equipped.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50" style={{ borderLeft: `3px solid ${rarityColor[t.rarity]}` }}>
                    <img src={t.src} alt={t.name} className="w-12 h-12 object-contain" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-display truncate">{t.name}</div>
                      <div className="text-xs" style={{ color: rarityColor[t.rarity] }}>{rarityLabel[t.rarity]} · +{t.power} ATK</div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        )}

        {tab === "gacha" && (
          <section className="max-w-4xl mx-auto">
            <div className="jade-frame rounded-2xl p-8 text-center relative overflow-hidden">
              <img src={dharmaPool[200]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
              <div className="relative">
                <div className="font-script text-5xl text-jade-aura">召唤阵</div>
                <div className="font-display tracking-[0.3em] text-primary-deep mt-2">TRIỆU HỒI PHÁP BẢO</div>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Dùng linh thạch khai mở càn khôn đại, triệu hồi pháp bảo từ cửu trùng thiên.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => handleRoll(1)}
                    disabled={g.spiritStones < 30}
                    className="px-6 py-3 rounded-lg bg-gradient-jade text-primary-foreground font-display tracking-widest text-sm shadow-jade disabled:opacity-30"
                  >
                    Triệu × 1 — 30 石
                  </button>
                  <button
                    onClick={() => handleRoll(10)}
                    disabled={g.spiritStones < 300}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent-gold to-accent-gold-deep text-white font-display tracking-widest text-sm shadow-gold disabled:opacity-30"
                  >
                    Triệu × 10 — 300 石
                  </button>
                </div>

                {rollResults.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {rollResults.map((t, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg border-2 p-2 bg-secondary/50 animate-rise relative"
                        style={{ borderColor: rarityColor[t.rarity], animationDelay: `${i * 50}ms` }}
                      >
                        <img src={t.src} alt={t.name} className="w-full h-full object-contain" />
                        <div className="absolute bottom-0 inset-x-0 text-[10px] font-display text-center py-0.5 backdrop-blur bg-background/70">
                          <div className="truncate px-1">{t.name}</div>
                          <div style={{ color: rarityColor[t.rarity] }}>{rarityLabel[t.rarity]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-center text-muted-foreground mt-4">
              Tổng triệu hồi: {g.totalRolls} · Sở hữu {owned.length}/{allTreasures.length}
            </div>
          </section>
        )}

        {tab === "kho" && (
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="font-script text-3xl text-jade-aura">宝库</div>
                <div className="font-display tracking-[0.3em] text-primary-deep">BẢO KHỐ — {owned.length}/{allTreasures.length}</div>
              </div>
              <div className="text-xs text-muted-foreground">Bấm để trang bị (tối đa 3)</div>
            </div>
            {owned.length === 0 ? (
              <div className="jade-frame rounded-xl p-12 text-center text-muted-foreground">
                Bảo khố trống. Vào Triệu Hồi để mở pháp bảo.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {owned.map((t) => {
                  const isEq = g.equippedIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => (isEq ? g.unequip(t.id) : g.equip(t.id))}
                      className={cn(
                        "rounded-lg border-2 p-2 bg-secondary/40 hover:scale-105 transition-transform relative",
                        isEq && "ring-2 ring-accent-gold"
                      )}
                      style={{ borderColor: rarityColor[t.rarity] }}
                    >
                      <div className="aspect-square">
                        <img src={t.src} alt={t.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs font-display mt-1 truncate">{t.name}</div>
                      <div className="text-[10px]" style={{ color: rarityColor[t.rarity] }}>
                        {rarityLabel[t.rarity]} · +{t.power}
                      </div>
                      {isEq && <div className="absolute top-1 right-1 text-[10px] bg-accent-gold text-white px-1 rounded">EQ</div>}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: string; accent: "jade" | "gold" }) => (
  <div className="text-right">
    <div className="text-[10px] text-muted-foreground tracking-widest">{label}</div>
    <div className={cn("font-display tabular-nums", accent === "gold" ? "text-accent-gold-deep" : "text-primary-deep")}>{value}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-xs">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-display tabular-nums">{value}</span>
  </div>
);

export default Game;
