const assetBase = import.meta.env.BASE_URL ?? "/";

const dharmaGifMap = {
  jade: `${assetBase}assets/img_0.gif`,
  gold: `${assetBase}assets/img_1.gif`,
  crimson: `${assetBase}assets/img_2.gif`,
} as const;

export interface DharmaAuraProps {
  variant?: keyof typeof dharmaGifMap;
  showCore?: boolean;
  className?: string;
}

export const DharmaAura = ({ variant = "jade", className }: DharmaAuraProps) => (
  <div className={`relative overflow-hidden ${className ?? ""}`}>
    <img
      src={dharmaGifMap[variant]}
      alt={`Pháp tướng ${variant}`}
      className="w-full h-full object-contain"
    />
  </div>
);
