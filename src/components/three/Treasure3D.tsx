const assetBase = import.meta.env.BASE_URL ?? "/";

export type TreasureKind = "sword" | "pill" | "bagua" | "scroll" | "beast";

const treasureGifMap: Record<TreasureKind, string> = {
  sword: `${assetBase}assets/img_4.gif`,
  pill: `${assetBase}assets/img_5.gif`,
  bagua: `${assetBase}assets/img_6.gif`,
  scroll: `${assetBase}assets/img_7.gif`,
  beast: `${assetBase}assets/img_8.gif`,
};

interface Treasure3DProps {
  kind: TreasureKind;
  color?: string;
  className?: string;
}

export const Treasure3D = ({ kind, className }: Treasure3DProps) => (
  <div className={`relative overflow-hidden ${className ?? ""}`}>
    <img
      src={treasureGifMap[kind]}
      alt={`Pháp bảo ${kind}`}
      className="w-full h-full object-contain"
    />
  </div>
);
