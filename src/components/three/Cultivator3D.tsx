const assetBase = import.meta.env.BASE_URL ?? "/";

export const Cultivator3D = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className ?? ""}`}>
    <img
      src={`${assetBase}assets/img_3.gif`}
      alt="Tu sĩ tu tiên"
      className="w-full h-full object-contain"
    />
  </div>
);
