import { PageLayout } from "@/components/PageLayout";
import { RankBadge } from "@/components/RankBadge";
import { cultivators, treasures, techniques } from "@/data/cultivation";
import cultivatorImg from "@/assets/cultivator-profile.jpg";
import iconSword from "@/assets/icon-sword.png";
import iconCauldron from "@/assets/icon-cauldron.png";
import iconBeast from "@/assets/icon-beast.png";
import iconBagua from "@/assets/icon-bagua.png";
import iconScroll from "@/assets/icon-scroll.png";

const c = cultivators[0];
const equipment = [
  { icon: iconSword, name: "Thanh Phong Kiếm", slot: "Thần binh" },
  { icon: iconBagua, name: "Thái Cực Đồ", slot: "Phòng ngự" },
  { icon: iconCauldron, name: "Cửu Chuyển Đan Lô", slot: "Luyện đan" },
  { icon: iconBeast, name: "Cửu Vĩ Linh Hồ", slot: "Linh thú" },
];

const Profile = () => (
  <PageLayout>
    <section className="relative overflow-hidden">
      <div className="container py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 animate-rise">
          <div className="text-xs tracking-[0.4em] text-primary font-display uppercase mb-2">
            ĐẠI THỪA TIÊN NHÂN
          </div>
          <div className="font-script text-6xl md:text-7xl text-jade-aura mb-2">{c.name}</div>
          <div className="font-display text-sm text-muted-foreground tracking-widest">
            {c.sect.toUpperCase()} · {c.realm.toUpperCase()}
          </div>
        </div>

        {/* Central composition: cultivator with surrounding equipment */}
        <div className="relative max-w-5xl mx-auto">
          {/* Aura background */}
          <div className="absolute inset-0 bg-gradient-aura animate-aura-pulse" />
          
          <div className="relative grid grid-cols-3 md:grid-cols-5 gap-4 items-center min-h-[600px]">
            {/* Left equipment */}
            <div className="col-span-1 space-y-6 hidden md:block">
              {equipment.slice(0, 2).map((e, i) => (
                <div key={i} className="jade-frame rounded-xl p-4 text-center animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  <img src={e.icon} alt={e.name} className="w-16 h-16 mx-auto mb-2 object-contain" />
                  <div className="text-[10px] text-muted-foreground tracking-widest font-display">{e.slot.toUpperCase()}</div>
                  <div className="font-script text-primary text-sm">{e.name}</div>
                </div>
              ))}
            </div>

            {/* Center: cultivator portrait */}
            <div className="col-span-3 relative">
              <div className="absolute inset-0 -z-10">
                <img
                  src={iconBagua}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-contain opacity-20 animate-rotate-slow"
                />
              </div>
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-2xl" />
                <img
                  src={cultivatorImg}
                  alt={c.name}
                  width={1024}
                  height={1024}
                  className="relative w-full h-full object-contain"
                />
                {/* Dharma label */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-background/80 backdrop-blur border border-primary/30 shadow-soft">
                  <span className="font-script text-primary text-sm">{c.dharma}</span>
                </div>
              </div>
            </div>

            {/* Right equipment */}
            <div className="col-span-1 space-y-6 hidden md:block">
              {equipment.slice(2).map((e, i) => (
                <div key={i} className="jade-frame rounded-xl p-4 text-center animate-float" style={{ animationDelay: `${(i + 2) * 0.5}s` }}>
                  <img src={e.icon} alt={e.name} className="w-16 h-16 mx-auto mb-2 object-contain" />
                  <div className="text-[10px] text-muted-foreground tracking-widest font-display">{e.slot.toUpperCase()}</div>
                  <div className="font-script text-primary text-sm">{e.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile equipment grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden mt-6">
            {equipment.map((e, i) => (
              <div key={i} className="jade-frame rounded-xl p-3 text-center">
                <img src={e.icon} alt={e.name} className="w-12 h-12 mx-auto mb-1 object-contain" />
                <div className="text-[9px] text-muted-foreground tracking-widest font-display">{e.slot.toUpperCase()}</div>
                <div className="font-script text-primary text-xs">{e.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-16">
          {[
            { label: "TU VI", value: c.power.toLocaleString(), sub: "linh lực" },
            { label: "THỌ NGUYÊN", value: "9,999", sub: "năm" },
            { label: "ĐẠO HÀNH", value: "Đệ Nhất", sub: "thiên hạ" },
          ].map((s) => (
            <div key={s.label} className="jade-frame rounded-xl p-6 text-center">
              <div className="text-xs text-muted-foreground tracking-widest font-display mb-2">{s.label}</div>
              <div className="font-display text-3xl text-jade-aura mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Mastered techniques */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="font-display text-xl text-primary-deep tracking-widest text-center mb-6">
            CÔNG PHÁP TINH THÔNG
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {techniques.slice(0, 3).map((t) => (
              <div key={t.id} className="gold-frame rounded-xl p-5 flex items-center gap-3">
                <img src={iconScroll} alt="" className="w-12 h-12 object-contain" />
                <div className="flex-1 min-w-0">
                  <div className="font-script text-primary truncate">{t.name}</div>
                  <div className="font-display text-sm text-primary-deep truncate">{t.vietName}</div>
                  <RankBadge rank={t.rank} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treasures showcase */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="font-display text-xl text-primary-deep tracking-widest text-center mb-6">
            CHÍ BẢO TUỲ THÂN
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {treasures.slice(0, 4).map((t) => (
              <div key={t.id} className="jade-frame rounded-xl p-4 text-center">
                <div className="font-script text-primary">{t.name}</div>
                <div className="font-display text-xs text-primary-deep mb-2">{t.vietName}</div>
                <RankBadge rank={t.rank} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Profile;
