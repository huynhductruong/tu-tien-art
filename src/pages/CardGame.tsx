import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  type Card, type Element, type GameState,
  actionDraw, actionPlay, canPlay, describe, elementMeta, genCode,
  getClientId, getNickname, kindLabel, newLobby, setNickname, startGame, top,
} from "@/lib/uno";
import { cn } from "@/lib/utils";

const CardView = ({ c, onClick, disabled, small }: { c: Card; onClick?: () => void; disabled?: boolean; small?: boolean }) => {
  const isWild = c.el === "wild";
  const bg = isWild ? "from-violet-400 via-fuchsia-500 to-amber-400" : elementMeta[c.el as Element].bg;
  const label = c.kind === "num" ? String(c.n) : kindLabel[c.kind];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative rounded-xl border-2 border-white/40 shadow-lg shrink-0 select-none transition-transform",
        small ? "w-12 h-16 text-base" : "w-20 h-28 text-3xl hover:-translate-y-2",
        disabled && "opacity-50 grayscale cursor-not-allowed",
        `bg-gradient-to-br ${bg}`
      )}
    >
      <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/40" />
      <span className="absolute top-1 left-1.5 text-xs font-bold text-white/90 drop-shadow">{label || (isWild ? "✦" : "")}</span>
      <span className="absolute bottom-1 right-1.5 text-xs font-bold text-white/90 drop-shadow rotate-180">{label || (isWild ? "✦" : "")}</span>
      <span className="absolute inset-0 flex items-center justify-center font-black text-white drop-shadow-lg">
        {isWild ? "✦" : label || c.n}
      </span>
    </button>
  );
};

const Back = ({ small }: { small?: boolean }) => (
  <div className={cn(
    "rounded-xl border-2 border-white/40 shadow-lg shrink-0 bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900 flex items-center justify-center",
    small ? "w-12 h-16" : "w-20 h-28"
  )}>
    <span className="font-script text-amber-300 text-2xl">仙</span>
  </div>
);

const CardGame = () => {
  const { code: routeCode } = useParams();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const clientId = useMemo(() => getClientId(), []);
  const [nick, setNick] = useState(getNickname());
  const [code, setCode] = useState(routeCode?.toUpperCase() || params.get("code")?.toUpperCase() || "");
  const [rooms, setRooms] = useState<{ code: string; state: GameState }[]>([]);
  const [state, setState] = useState<GameState | null>(null);
  const [pickColorFor, setPickColorFor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const channelRef = useRef<any>(null);

  // Load lobby list
  useEffect(() => {
    if (routeCode) return;
    let alive = true;
    const fetchRooms = async () => {
      const { data } = await supabase
        .from("card_rooms")
        .select("code, state")
        .eq("status", "waiting")
        .order("created_at", { ascending: false })
        .limit(20);
      if (alive && data) setRooms(data as any);
    };
    fetchRooms();
    const ch = supabase
      .channel("card_rooms_list")
      .on("postgres_changes", { event: "*", schema: "public", table: "card_rooms" }, fetchRooms)
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [routeCode]);

  // Join + subscribe to a room
  useEffect(() => {
    if (!routeCode) return;
    const c = routeCode.toUpperCase();
    let alive = true;
    const load = async () => {
      const { data } = await supabase.from("card_rooms").select("state").eq("code", c).maybeSingle();
      if (alive && data) setState(data.state as unknown as GameState);
    };
    load();
    const ch = supabase
      .channel(`room_${c}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "card_rooms", filter: `code=eq.${c}` },
        (payload: any) => { if (payload.new?.state) setState(payload.new.state); })
      .subscribe();
    channelRef.current = ch;
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [routeCode]);

  const saveState = async (next: GameState, status?: string) => {
    if (!routeCode) return;
    setBusy(true);
    await supabase
      .from("card_rooms")
      .update({ state: next as any, ...(status ? { status } : {}) })
      .eq("code", routeCode.toUpperCase());
    setState(next);
    setBusy(false);
  };

  const createRoom = async () => {
    if (!nick.trim()) return alert("Nhập đạo hiệu trước!");
    setNickname(nick.trim());
    const newCode = genCode();
    const initial = newLobby(clientId, nick.trim());
    const { error } = await supabase.from("card_rooms").insert({ code: newCode, status: "waiting", state: initial as any });
    if (error) return alert(error.message);
    nav(`/cards/${newCode}`);
  };

  const joinRoom = async (joinCode: string) => {
    if (!nick.trim()) return alert("Nhập đạo hiệu trước!");
    setNickname(nick.trim());
    const c = joinCode.trim().toUpperCase();
    const { data } = await supabase.from("card_rooms").select("state, status").eq("code", c).maybeSingle();
    if (!data) return alert("Không tìm thấy phòng!");
    const s = data.state as unknown as GameState;
    if (s.phase !== "lobby") return alert("Phòng đã bắt đầu!");
    if (s.players.length >= 6) return alert("Phòng đã đầy!");
    if (!s.players.some((p) => p.id === clientId)) {
      const next: GameState = { ...s, players: [...s.players, { id: clientId, nickname: nick.trim(), hand: [] }], log: [...s.log, `${nick.trim()} gia nhập`] };
      await supabase.from("card_rooms").update({ state: next as any }).eq("code", c);
    }
    nav(`/cards/${c}`);
  };

  // ====== Lobby list view ======
  if (!routeCode) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-primary/20 bg-background/70 backdrop-blur">
          <div className="container py-4 flex items-center justify-between">
            <Link to="/" className="font-script text-2xl text-jade-aura">仙 Tiên Lộ</Link>
            <div className="text-xs tracking-[0.3em] text-primary-deep">ĐẤU PHÁP ĐƯỜNG · CARD ROOMS</div>
          </div>
        </header>
        <main className="container py-8 max-w-3xl space-y-6">
          <div className="jade-frame rounded-2xl p-6 space-y-4">
            <h2 className="font-script text-3xl text-jade-aura text-center">道号 · Đạo Hiệu</h2>
            <input
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder="Nhập tên tu sĩ..."
              maxLength={16}
              className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-primary/30 focus:border-primary outline-none text-center font-display tracking-widest"
            />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={createRoom} className="py-3 rounded-lg bg-gradient-jade text-primary-foreground font-display tracking-widest shadow-jade">
                ⚜ TẠO PHÒNG MỚI
              </button>
              <form onSubmit={(e) => { e.preventDefault(); if (code) joinRoom(code); }} className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="MÃ PHÒNG" maxLength={6} className="flex-1 px-3 rounded-lg bg-secondary/50 border border-primary/30 text-center font-mono uppercase tracking-widest" />
                <button className="px-4 rounded-lg bg-accent-gold text-white font-display">VÀO</button>
              </form>
            </div>
          </div>

          <div>
            <div className="font-display text-xs tracking-[0.3em] text-primary-deep mb-3">PHÒNG ĐANG CHỜ</div>
            {rooms.length === 0 ? (
              <div className="jade-frame rounded-xl p-8 text-center text-muted-foreground text-sm">Chưa có phòng nào. Tạo phòng mới để bắt đầu.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {rooms.map((r) => (
                  <button key={r.code} onClick={() => joinRoom(r.code)} className="jade-frame rounded-xl p-4 text-left hover:shadow-jade transition-shadow">
                    <div className="flex justify-between items-center">
                      <div className="font-mono text-xl tracking-widest text-accent-gold-deep">{r.code}</div>
                      <div className="text-xs text-muted-foreground">{r.state.players?.length || 0}/6</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {r.state.players?.map((p) => p.nickname).join(" · ")}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary">← Về tu luyện</Link>
          </div>
        </main>
      </div>
    );
  }

  // ====== Room view ======
  if (!state) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Đang vào phòng {routeCode}...</div>;
  }

  const me = state.players.find((p) => p.id === clientId);
  const isHost = state.hostId === clientId;
  const t = top(state);
  const myTurn = state.phase === "playing" && state.players[state.turn]?.id === clientId;

  const handlePlay = async (card: Card) => {
    if (!myTurn || busy) return;
    if (!canPlay(card, state)) return;
    if (card.el === "wild") {
      setPickColorFor(card.id);
      return;
    }
    await saveState(actionPlay(state, clientId, card.id));
  };

  const confirmColor = async (el: Element) => {
    if (!pickColorFor) return;
    const cid = pickColorFor; setPickColorFor(null);
    await saveState(actionPlay(state, clientId, cid, el));
  };

  const handleDraw = async () => {
    if (!myTurn || busy) return;
    await saveState(actionDraw(state, clientId));
  };

  const handleStart = async () => {
    if (!isHost) return;
    if (state.players.length < 2) return alert("Cần ít nhất 2 người chơi!");
    await saveState(startGame(state), "playing");
  };

  const handleLeave = async () => {
    const next: GameState = {
      ...state,
      players: state.players.filter((p) => p.id !== clientId),
      log: [...state.log, `${me?.nickname || "Một người"} rời phòng`],
    };
    if (next.players.length === 0) {
      await supabase.from("card_rooms").delete().eq("code", routeCode!.toUpperCase());
    } else {
      if (state.hostId === clientId) next.hostId = next.players[0].id;
      await saveState(next);
    }
    nav("/cards");
  };

  const handleRestart = async () => {
    if (!isHost) return;
    const reset: GameState = { ...state, phase: "lobby", players: state.players.map((p) => ({ ...p, hand: [] })), deck: [], discard: [], winnerId: undefined, log: ["Ván mới!"] };
    await saveState(reset, "waiting");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.2),transparent_60%)] bg-background text-foreground">
      <header className="border-b border-primary/20 bg-background/70 backdrop-blur sticky top-0 z-20">
        <div className="container py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link to="/cards" className="font-script text-2xl text-jade-aura">仙</Link>
            <div>
              <div className="text-xs tracking-[0.3em] text-primary-deep">PHÒNG</div>
              <div className="font-mono text-lg tracking-widest text-accent-gold-deep">{routeCode}</div>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); }} className="text-xs px-2 py-1 rounded bg-secondary hover:bg-primary/20">Copy link</button>
          </div>
          <button onClick={handleLeave} className="text-xs text-muted-foreground hover:text-destructive">Rời phòng</button>
        </div>
      </header>

      <main className="container py-6 grid lg:grid-cols-[1fr_280px] gap-6">
        <section className="space-y-6">
          {/* Players bar */}
          <div className="flex flex-wrap gap-2">
            {state.players.map((p, i) => (
              <div key={p.id} className={cn(
                "px-3 py-2 rounded-lg text-sm flex items-center gap-2 border",
                state.phase === "playing" && state.turn === i ? "border-accent-gold bg-accent-gold/10 shadow-gold" : "border-primary/20 bg-secondary/50"
              )}>
                <span className="font-display">{p.nickname}</span>
                {p.isHost && <span className="text-[10px] text-accent-gold-deep">★HOST</span>}
                {p.id === clientId && <span className="text-[10px] text-jade-aura">(bạn)</span>}
                {state.phase === "playing" && <span className="text-xs text-muted-foreground">· {p.hand.length} lá</span>}
              </div>
            ))}
          </div>

          {state.phase === "lobby" && (
            <div className="jade-frame rounded-2xl p-8 text-center space-y-4">
              <div className="font-script text-4xl text-jade-aura">候 · Đang Chờ</div>
              <p className="text-sm text-muted-foreground">Chia sẻ mã phòng <span className="font-mono text-accent-gold-deep">{routeCode}</span> cho bạn bè (tối đa 6 người).</p>
              {isHost ? (
                <button onClick={handleStart} disabled={state.players.length < 2} className="px-8 py-3 rounded-lg bg-gradient-jade text-primary-foreground font-display tracking-[0.3em] shadow-jade disabled:opacity-40">
                  ⚔ KHAI CUỘC
                </button>
              ) : (
                <div className="text-sm text-muted-foreground">Chờ chủ phòng bắt đầu...</div>
              )}
            </div>
          )}

          {state.phase !== "lobby" && (
            <>
              {/* Table */}
              <div className="jade-frame rounded-2xl p-8 relative">
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <button onClick={handleDraw} disabled={!myTurn || busy} className="disabled:opacity-50">
                      <Back />
                    </button>
                    <div className="text-xs text-muted-foreground mt-2">Bốc bài ({state.deck.length})</div>
                  </div>
                  <div className="text-center">
                    {t ? <CardView c={t} /> : <Back />}
                    <div className="text-xs mt-2">
                      <span style={{ color: state.currentEl ? elementMeta[state.currentEl].color : undefined }}>
                        {state.currentEl ? `${elementMeta[state.currentEl].cn} ${elementMeta[state.currentEl].name}` : "—"}
                      </span>
                      {state.pendingDraw > 0 && <span className="text-destructive ml-2">+{state.pendingDraw}!</span>}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Lượt</div>
                    <div className="font-script text-2xl text-jade-aura">{state.players[state.turn]?.nickname}</div>
                    <div className="text-[10px] text-muted-foreground">{state.dir === 1 ? "→ thuận" : "← nghịch"}</div>
                  </div>
                </div>

                {state.phase === "finished" && (
                  <div className="mt-6 text-center space-y-3">
                    <div className="font-script text-4xl text-accent-gold-deep">🏆 {state.players.find((p) => p.id === state.winnerId)?.nickname} thắng!</div>
                    {isHost && <button onClick={handleRestart} className="px-6 py-2 rounded-lg bg-gradient-jade text-primary-foreground font-display tracking-widest">Ván mới</button>}
                  </div>
                )}
              </div>

              {/* My hand */}
              <div className="jade-frame rounded-2xl p-4">
                <div className="text-xs font-display tracking-[0.3em] text-primary-deep mb-3">
                  BÀI CỦA BẠN ({me?.hand.length || 0}) {myTurn && <span className="text-accent-gold-deep ml-2">▸ Đến lượt!</span>}
                </div>
                <div className="flex gap-2 flex-wrap justify-center min-h-[7rem]">
                  {me?.hand.map((c) => (
                    <CardView key={c.id} c={c} onClick={() => handlePlay(c)} disabled={!myTurn || !canPlay(c, state)} />
                  ))}
                  {(me?.hand.length || 0) === 0 && <div className="text-muted-foreground text-sm italic self-center">Không còn lá nào</div>}
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="jade-frame rounded-xl p-4 h-fit max-h-[70vh] overflow-y-auto sticky top-24">
          <div className="font-display text-xs tracking-[0.3em] text-primary-deep mb-3">CHIẾN BÁO</div>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {[...state.log].slice(-30).reverse().map((l, i) => (
              <li key={i} className="leading-snug">› {l}</li>
            ))}
          </ul>
        </aside>
      </main>

      {/* Color picker for wild */}
      {pickColorFor && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur z-50 flex items-center justify-center p-6" onClick={() => setPickColorFor(null)}>
          <div className="jade-frame rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="font-script text-2xl text-jade-aura text-center">Chọn thuộc tính</div>
            <div className="grid grid-cols-2 gap-3">
              {(["kim", "moc", "thuy", "hoa"] as Element[]).map((el) => (
                <button key={el} onClick={() => confirmColor(el)}
                  className={cn("w-32 h-20 rounded-xl text-white font-display tracking-widest text-lg shadow-lg bg-gradient-to-br", elementMeta[el].bg)}>
                  {elementMeta[el].cn} {elementMeta[el].name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGame;
