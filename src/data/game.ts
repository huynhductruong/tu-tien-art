// Game data — pulls from /assets/img_*.gif (49 files, 0-48)

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

export const rarityWeight: Record<Rarity, number> = {
  common: 55,
  rare: 25,
  epic: 12,
  legend: 6,
  myth: 2,
};

export interface Realm {
  name: string;
  vietName: string;
  cn: string;
  qiNeeded: number;
  power: number;
}

export const realms: Realm[] = [
  { name: "Luyện Khí", vietName: "Luyện Khí", cn: "練氣", qiNeeded: 100, power: 10 },
  { name: "Trúc Cơ", vietName: "Trúc Cơ", cn: "築基", qiNeeded: 500, power: 30 },
  { name: "Kim Đan", vietName: "Kim Đan", cn: "金丹", qiNeeded: 2_500, power: 80 },
  { name: "Nguyên Anh", vietName: "Nguyên Anh", cn: "元嬰", qiNeeded: 12_000, power: 200 },
  { name: "Hoá Thần", vietName: "Hoá Thần", cn: "化神", qiNeeded: 60_000, power: 500 },
  { name: "Luyện Hư", vietName: "Luyện Hư", cn: "煉虛", qiNeeded: 300_000, power: 1_200 },
  { name: "Hợp Thể", vietName: "Hợp Thể", cn: "合體", qiNeeded: 1_500_000, power: 3_000 },
  { name: "Đại Thừa", vietName: "Đại Thừa", cn: "大乘", qiNeeded: 8_000_000, power: 8_000 },
  { name: "Độ Kiếp", vietName: "Độ Kiếp", cn: "渡劫", qiNeeded: 40_000_000, power: 20_000 },
  { name: "Tiên Nhân", vietName: "Tiên Nhân", cn: "仙人", qiNeeded: Infinity, power: 50_000 },
];

const namePool = [
  "Thanh Phong Kiếm", "Cửu Vĩ Linh Hồ", "Hoả Long Trảo", "Bích Hải Châu",
  "Huyền Thiên Ấn", "Phá Thiên Phủ", "Tử Vi Đan", "Bạch Hạc Linh",
  "Lôi Đình Phù", "Thái Hư Kính", "Càn Khôn Đại", "Tru Tiên Kiếm",
  "Phượng Hoàng Vũ", "Băng Tâm Quyết", "Vạn Pháp Đỉnh", "Linh Long Châu",
  "Cự Khuyết Phủ", "Tịnh Thế Bạch Liên", "Hỗn Nguyên Tán", "Đông Hoàng Chung",
  "Phán Quan Bút", "Sinh Tử Bộ", "Lạc Hồn Chung", "Hồn Phách Linh",
  "Thái Cực Đồ", "Bát Quái Lò", "Hỗn Độn Châu", "Thiên Ma Cầm",
  "Linh Hồn Đăng", "Cửu Long Định", "Phi Vũ Kiếm Hoàn", "Tử Kim Bát",
  "Ngọc Tịnh Bình", "Lưỡng Nghi Trần", "Tam Tài Ấn", "Tứ Tượng Phù",
  "Ngũ Hành Châu", "Lục Đạo Luân", "Thất Tinh Kiếm", "Bát Hoang Phiến",
  "Cửu U Phán", "Thập Phương Ấn", "Phong Hoả Luân", "Càn Khôn Quyển",
  "Kim Cang Trử", "Phục Ma Trượng", "Trảm Tiên Phi Đao", "Tru Long Cung", "Phá Quân Mâu",
];

function pickRarity(seed: number): Rarity {
  const r = ((seed * 9301 + 49297) % 233280) / 233280;
  const total = Object.values(rarityWeight).reduce((a, b) => a + b, 0);
  let acc = 0;
  for (const [k, w] of Object.entries(rarityWeight) as [Rarity, number][]) {
    acc += w / total;
    if (r < acc) return k;
  }
  return "common";
}

const rarityPower: Record<Rarity, number> = {
  common: 5, rare: 25, epic: 100, legend: 400, myth: 1500,
};

export interface Treasure {
  id: number;
  gif: string;
  name: string;
  rarity: Rarity;
  power: number;
}

export const allTreasures: Treasure[] = Array.from({ length: 49 }, (_, i) => {
  const rarity = pickRarity(i + 1);
  return {
    id: i,
    gif: `/assets/img_${i}.gif`,
    name: namePool[i % namePool.length],
    rarity,
    power: rarityPower[rarity] + (i % 5) * 3,
  };
});

export interface Boss {
  id: string;
  name: string;
  cn: string;
  hp: number;
  reward: number;
  gif: string;
}

export const bosses: Boss[] = [
  { id: "b1", name: "Hắc Vụ Yêu Tướng", cn: "黑霧妖將", hp: 150, reward: 80, gif: "/assets/img_12.gif" },
  { id: "b2", name: "Huyết Lang Vương", cn: "血狼王", hp: 600, reward: 300, gif: "/assets/img_18.gif" },
  { id: "b3", name: "Cốt Long Thượng Cổ", cn: "骨龍上古", hp: 2_500, reward: 1_200, gif: "/assets/img_24.gif" },
  { id: "b4", name: "Thiên Ma Tôn", cn: "天魔尊", hp: 12_000, reward: 5_000, gif: "/assets/img_30.gif" },
  { id: "b5", name: "Hỗn Độn Cự Thú", cn: "混沌巨獸", hp: 60_000, reward: 22_000, gif: "/assets/img_36.gif" },
  { id: "b6", name: "Cửu U Diêm Quân", cn: "九幽閻君", hp: 300_000, reward: 100_000, gif: "/assets/img_42.gif" },
  { id: "b7", name: "Thiên Đạo Kiếp Lôi", cn: "天道劫雷", hp: 1_500_000, reward: 500_000, gif: "/assets/img_48.gif" },
];
