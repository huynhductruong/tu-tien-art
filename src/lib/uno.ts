// Uno-style "Tiên Hiệp" card engine
export type Element = "kim" | "moc" | "thuy" | "hoa";
export type CardKind = "num" | "skip" | "reverse" | "draw2" | "wild" | "wild4";

export interface Card {
  id: string;
  el: Element | "wild";
  kind: CardKind;
  n?: number; // 0-9 for num
}

export const elementMeta: Record<Element, { name: string; cn: string; color: string; bg: string }> = {
  kim: { name: "Kim", cn: "金", color: "#d4a418", bg: "from-amber-300 to-yellow-600" },
  moc: { name: "Mộc", cn: "木", color: "#2f9e6c", bg: "from-emerald-300 to-green-700" },
  thuy: { name: "Thủy", cn: "水", color: "#2b8fb8", bg: "from-sky-300 to-cyan-700" },
  hoa: { name: "Hỏa", cn: "火", color: "#c0392b", bg: "from-rose-300 to-red-700" },
};

export const kindLabel: Record<CardKind, string> = {
  num: "",
  skip: "禁",
  reverse: "逆",
  draw2: "+2",
  wild: "混",
  wild4: "+4",
};

export const kindName: Record<CardKind, string> = {
  num: "Số",
  skip: "Cấm Chế",
  reverse: "Đảo Thiên",
  draw2: "Hấp Linh +2",
  wild: "Hỗn Nguyên",
  wild4: "Thiên Kiếp +4",
};

let cid = 0;
const nid = () => `c${Date.now().toString(36)}${(cid++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function createDeck(): Card[] {
  const els: Element[] = ["kim", "moc", "thuy", "hoa"];
  const d: Card[] = [];
  for (const el of els) {
    d.push({ id: nid(), el, kind: "num", n: 0 });
    for (let n = 1; n <= 9; n++) {
      d.push({ id: nid(), el, kind: "num", n });
      d.push({ id: nid(), el, kind: "num", n });
    }
    for (const k of ["skip", "reverse", "draw2"] as CardKind[]) {
      d.push({ id: nid(), el, kind: k });
      d.push({ id: nid(), el, kind: k });
    }
  }
  for (let i = 0; i < 4; i++) {
    d.push({ id: nid(), el: "wild", kind: "wild" });
    d.push({ id: nid(), el: "wild", kind: "wild4" });
  }
  return shuffle(d);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface Player {
  id: string;
  nickname: string;
  hand: Card[];
  isHost?: boolean;
}

export interface GameState {
  phase: "lobby" | "playing" | "finished";
  players: Player[];
  deck: Card[];
  discard: Card[]; // top = last
  currentEl: Element | null; // active color (after wild)
  turn: number; // player index
  dir: 1 | -1;
  pendingDraw: number; // accumulated from draw2/+4 if chained, simplified: just count
  log: string[];
  winnerId?: string;
  hostId: string;
}

export function newLobby(hostId: string, hostNick: string): GameState {
  return {
    phase: "lobby",
    players: [{ id: hostId, nickname: hostNick, hand: [], isHost: true }],
    deck: [], discard: [], currentEl: null, turn: 0, dir: 1, pendingDraw: 0,
    log: [`${hostNick} mở phòng`],
    hostId,
  };
}

export function startGame(s: GameState): GameState {
  if (s.players.length < 2) return s;
  let deck = createDeck();
  const players = s.players.map((p) => {
    const hand = deck.slice(0, 7);
    deck = deck.slice(7);
    return { ...p, hand };
  });
  // first card: ensure it's a number
  let topIdx = deck.findIndex((c) => c.kind === "num");
  if (topIdx < 0) topIdx = 0;
  const top = deck[topIdx];
  deck = deck.filter((_, i) => i !== topIdx);
  return {
    ...s,
    phase: "playing",
    players,
    deck,
    discard: [top],
    currentEl: top.el === "wild" ? "kim" : (top.el as Element),
    turn: 0,
    dir: 1,
    pendingDraw: 0,
    log: [...s.log, "Khai cuộc!"],
    winnerId: undefined,
  };
}

export function top(s: GameState): Card | undefined { return s.discard[s.discard.length - 1]; }

export function canPlay(card: Card, s: GameState): boolean {
  const t = top(s); if (!t) return true;
  if (s.pendingDraw > 0) {
    // must stack draw2/+4
    return card.kind === "draw2" || card.kind === "wild4";
  }
  if (card.el === "wild") return true;
  if (s.currentEl && card.el === s.currentEl) return true;
  if (t.kind === "num" && card.kind === "num" && card.n === t.n) return true;
  if (t.kind !== "num" && card.kind === t.kind) return true;
  return false;
}

function advance(s: GameState, step = 1): number {
  const n = s.players.length;
  return ((s.turn + step * s.dir) % n + n) % n;
}

function reshuffleIfEmpty(s: GameState): GameState {
  if (s.deck.length > 0) return s;
  if (s.discard.length <= 1) return s;
  const t = s.discard[s.discard.length - 1];
  const rest = s.discard.slice(0, -1);
  return { ...s, deck: shuffle(rest), discard: [t] };
}

export function drawN(s: GameState, playerId: string, n: number): GameState {
  let state = { ...s };
  const idx = state.players.findIndex((p) => p.id === playerId);
  if (idx < 0) return state;
  const drawn: Card[] = [];
  for (let i = 0; i < n; i++) {
    state = reshuffleIfEmpty(state);
    if (state.deck.length === 0) break;
    drawn.push(state.deck[0]);
    state = { ...state, deck: state.deck.slice(1) };
  }
  const players = state.players.map((p, i) => i === idx ? { ...p, hand: [...p.hand, ...drawn] } : p);
  return { ...state, players };
}

export function actionDraw(s: GameState, playerId: string): GameState {
  if (s.phase !== "playing") return s;
  const cur = s.players[s.turn];
  if (cur.id !== playerId) return s;
  const n = s.pendingDraw > 0 ? s.pendingDraw : 1;
  let state = drawN(s, playerId, n);
  state = {
    ...state,
    pendingDraw: 0,
    turn: advance(state, 1),
    log: [...state.log, `${cur.nickname} bốc ${n} lá${s.pendingDraw > 0 ? " (chịu phạt)" : ""}`],
  };
  return state;
}

export function actionPlay(s: GameState, playerId: string, cardId: string, chosenEl?: Element): GameState {
  if (s.phase !== "playing") return s;
  const cur = s.players[s.turn];
  if (cur.id !== playerId) return s;
  const card = cur.hand.find((c) => c.id === cardId);
  if (!card) return s;
  if (!canPlay(card, s)) return s;

  const newHand = cur.hand.filter((c) => c.id !== cardId);
  let players = s.players.map((p, i) => i === s.turn ? { ...p, hand: newHand } : p);
  let state: GameState = {
    ...s,
    players,
    discard: [...s.discard, card],
    currentEl: card.el === "wild" ? (chosenEl ?? "kim") : (card.el as Element),
    log: [...s.log, `${cur.nickname} đánh ${describe(card)}${card.el === "wild" ? ` → ${elementMeta[chosenEl ?? "kim"].name}` : ""}`],
  };

  // win check
  if (newHand.length === 0) {
    return { ...state, phase: "finished", winnerId: cur.id, log: [...state.log, `🏆 ${cur.nickname} thắng!`] };
  }

  // effects
  let skip = 0;
  let pending = state.pendingDraw;
  if (card.kind === "skip") skip = 1;
  if (card.kind === "reverse") {
    state = { ...state, dir: (state.dir * -1) as 1 | -1 };
    if (state.players.length === 2) skip = 1;
  }
  if (card.kind === "draw2") pending += 2;
  if (card.kind === "wild4") pending += 4;
  state = { ...state, pendingDraw: pending };

  state = { ...state, turn: advance(state, 1 + skip) };
  return state;
}

export function describe(c: Card): string {
  if (c.el === "wild") return kindName[c.kind];
  const el = elementMeta[c.el as Element].name;
  if (c.kind === "num") return `${el} ${c.n}`;
  return `${el} ${kindName[c.kind]}`;
}

export function genCode(): string {
  const ch = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += ch[Math.floor(Math.random() * ch.length)];
  return s;
}

export function getClientId(): string {
  let id = localStorage.getItem("uno-client-id");
  if (!id) {
    id = "p_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("uno-client-id", id);
  }
  return id;
}
export function getNickname(): string { return localStorage.getItem("uno-nick") || ""; }
export function setNickname(n: string) { localStorage.setItem("uno-nick", n); }
