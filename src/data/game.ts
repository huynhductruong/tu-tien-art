import treasureFilesRaw from "./treasure-files.json";

export type Rarity = "common" | "rare" | "epic" | "legend" | "myth";

export const rarityColor: Record<Rarity, string> = {
  common: "hsl(var(--rank-common))",
  rare: "hsl(var(--rank-rare))",
  epic: "hsl(var(--rank-epic))",
  legend: "hsl(var(--rank-legend))",
  myth: "hsl(var(--rank-myth))",
};

export const rarityLabel: Record<Rarity, string> = {
  common: "Phàm Phẩm",
  rare: "Huyền Phẩm",
  epic: "Địa Phẩm",
  legend: "Thiên Phẩm",
  myth: "Tiên Phẩm",
};

const rarityWeight: Record<Rarity, number> = {
  common: 50, rare: 27, epic: 14, legend: 7, myth: 2,
};

export interface Realm {
  vietName: string;
  cn: string;
  qiNeeded: number;
  power: number;
}

export const realms: Realm[] = [
  { vietName: "Luyện Khí", cn: "練氣", qiNeeded: 100, power: 10 },
  { vietName: "Trúc Cơ", cn: "築基", qiNeeded: 500, power: 30 },
  { vietName: "Kim Đan", cn: "金丹", qiNeeded: 2_500, power: 80 },
  { vietName: "Nguyên Anh", cn: "元嬰", qiNeeded: 12_000, power: 200 },
  { vietName: "Hoá Thần", cn: "化神", qiNeeded: 60_000, power: 500 },
  { vietName: "Luyện Hư", cn: "煉虛", qiNeeded: 300_000, power: 1_200 },
  { vietName: "Hợp Thể", cn: "合體", qiNeeded: 1_500_000, power: 3_000 },
  { vietName: "Đại Thừa", cn: "大乘", qiNeeded: 8_000_000, power: 8_000 },
  { vietName: "Độ Kiếp", cn: "渡劫", qiNeeded: 40_000_000, power: 20_000 },
  { vietName: "Tiên Nhân", cn: "仙人", qiNeeded: Infinity, power: 50_000 },
];

function seedRand(n: number): number {
  return ((n * 9301 + 49297) % 233280) / 233280;
}
function pickRarity(seed: number): Rarity {
  const r = seedRand(seed);
  const total = Object.values(rarityWeight).reduce((a, b) => a + b, 0);
  let acc = 0;
  for (const [k, w] of Object.entries(rarityWeight) as [Rarity, number][]) {
    acc += w / total;
    if (r < acc) return k;
  }
  return "common";
}
const rarityPower: Record<Rarity, number> = {
  common: 8, rare: 35, epic: 140, legend: 500, myth: 1800,
};

const treasureFiles = treasureFilesRaw as { file: string; name: string }[];

export interface Treasure {
  id: number;
  src: string;
  name: string;
  rarity: Rarity;
  power: number;
}

export const allTreasures: Treasure[] = treasureFiles.map((t, i) => {
  const rarity = pickRarity(i + 7);
  return {
    id: i,
    src: `/assets2/${t.file}`,
    name: t.name,
    rarity,
    power: rarityPower[rarity] + (i % 7) * 4,
  };
});

// Dharma manifestations (background pháp tướng) — pick from assets1 (huge gif pool)
// Use a curated subset for variety per realm
export const dharmaPool: string[] = Array.from({ length: 358 }, (_, i) => `/assets1/img_${i}.gif`);

// Boss list — use specific assets1 gifs for thematic feel
export interface Boss {
  id: string;
  name: string;
  cn: string;
  hp: number;
  reward: number;
  src: string;
}

const bossPicks = [12, 45, 88, 130, 175, 220, 270, 310, 340];
export const bosses: Boss[] = [
  { id: "b1", name: "Hắc Vụ Yêu Tướng", cn: "黑霧妖將", hp: 200, reward: 100 },
  { id: "b2", name: "Huyết Lang Vương", cn: "血狼王", hp: 800, reward: 350 },
  { id: "b3", name: "Cốt Long Thượng Cổ", cn: "骨龍上古", hp: 3_500, reward: 1_400 },
  { id: "b4", name: "Thiên Ma Tôn", cn: "天魔尊", hp: 16_000, reward: 6_000 },
  { id: "b5", name: "Hỗn Độn Cự Thú", cn: "混沌巨獸", hp: 80_000, reward: 25_000 },
  { id: "b6", name: "Cửu U Diêm Quân", cn: "九幽閻君", hp: 400_000, reward: 120_000 },
  { id: "b7", name: "Thiên Đạo Kiếp Lôi", cn: "天道劫雷", hp: 2_000_000, reward: 600_000 },
  { id: "b8", name: "Hồng Hoang Tổ Long", cn: "洪荒祖龍", hp: 10_000_000, reward: 3_000_000 },
  { id: "b9", name: "Tiên Đế Vong Linh", cn: "仙帝亡靈", hp: 50_000_000, reward: 15_000_000 },
].map((b, i) => ({ ...b, src: `/assets1/img_${bossPicks[i] ?? 350}.gif` }));
