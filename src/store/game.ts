import { create } from "zustand";
import { persist } from "zustand/middleware";
import { realms, bosses, allTreasures, type Treasure } from "@/data/game";

interface GameState {
  qi: number;
  spiritStones: number; // currency for gacha
  realmIdx: number;
  clickPower: number;
  autoQi: number; // per second
  ownedTreasureIds: number[];
  equippedIds: number[]; // up to 3
  bossIdx: number;
  bossHp: number;
  totalClicks: number;
  totalRolls: number;

  click: () => void;
  gainQi: (amount: number) => void;
  tick: () => void;
  breakthrough: () => boolean;
  attackBoss: () => { dmg: number; killed: boolean };
  rollGacha: (n: number) => Treasure[];
  equip: (id: number) => void;
  unequip: (id: number) => void;
  reset: () => void;
}

const baseInit = {
  qi: 0,
  spiritStones: 50,
  realmIdx: 0,
  clickPower: 1,
  autoQi: 0,
  ownedTreasureIds: [] as number[],
  equippedIds: [] as number[],
  bossIdx: 0,
  bossHp: bosses[0].hp,
  totalClicks: 0,
  totalRolls: 0,
};

function totalAttack(state: GameState): number {
  const realmAtk = realms[state.realmIdx].power;
  const treasureAtk = state.equippedIds.reduce((sum, id) => {
    const t = allTreasures.find((x) => x.id === id);
    return sum + (t?.power ?? 0);
  }, 0);
  return realmAtk + treasureAtk + state.clickPower;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      ...baseInit,

      click: () => {
        const s = get();
        const gain = s.clickPower + Math.floor(realms[s.realmIdx].power / 5);
        set({ qi: s.qi + gain, totalClicks: s.totalClicks + 1 });
      },

      gainQi: (amount) => set({ qi: get().qi + amount }),


      tick: () => {
        const s = get();
        if (s.autoQi > 0) set({ qi: s.qi + s.autoQi });
      },

      breakthrough: () => {
        const s = get();
        const need = realms[s.realmIdx].qiNeeded;
        if (s.qi < need || s.realmIdx >= realms.length - 1) return false;
        set({
          qi: s.qi - need,
          realmIdx: s.realmIdx + 1,
          autoQi: s.autoQi + Math.max(1, Math.floor(realms[s.realmIdx].power / 4)),
          clickPower: s.clickPower + Math.max(1, Math.floor(realms[s.realmIdx].power / 8)),
          spiritStones: s.spiritStones + 50,
        });
        return true;
      },

      attackBoss: () => {
        const s = get();
        const dmg = totalAttack(s);
        const newHp = s.bossHp - dmg;
        if (newHp <= 0) {
          const boss = bosses[s.bossIdx];
          const nextIdx = Math.min(s.bossIdx + 1, bosses.length - 1);
          set({
            bossIdx: nextIdx,
            bossHp: bosses[nextIdx].hp,
            spiritStones: s.spiritStones + boss.reward,
            qi: s.qi + boss.reward * 5,
          });
          return { dmg, killed: true };
        }
        set({ bossHp: newHp });
        return { dmg, killed: false };
      },

      rollGacha: (n) => {
        const s = get();
        const cost = n * 30;
        if (s.spiritStones < cost) return [];
        const results: Treasure[] = [];
        for (let i = 0; i < n; i++) {
          const t = allTreasures[Math.floor(Math.random() * allTreasures.length)];
          results.push(t);
        }
        const newOwned = [...s.ownedTreasureIds];
        results.forEach((t) => {
          if (!newOwned.includes(t.id)) newOwned.push(t.id);
        });
        set({
          spiritStones: s.spiritStones - cost,
          ownedTreasureIds: newOwned,
          totalRolls: s.totalRolls + n,
        });
        return results;
      },

      equip: (id) => {
        const s = get();
        if (s.equippedIds.includes(id)) return;
        const next = [...s.equippedIds, id].slice(-3);
        set({ equippedIds: next });
      },

      unequip: (id) => {
        set({ equippedIds: get().equippedIds.filter((x) => x !== id) });
      },

      reset: () => set({ ...baseInit }),
    }),
    { name: "tien-lo-game" }
  )
);
