import { PageLayout } from "@/components/PageLayout";
import { RankBadge } from "@/components/RankBadge";
import { cultivators, treasures, techniques } from "@/data/cultivation";
import { Cultivator3D } from "@/components/three/Cultivator3D";
import { Treasure3D } from "@/components/three/Treasure3D";

const c = cultivators[0];

const Profile = () => (
  <PageLayout>
    <section className="relative overflow-hidden">
      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 animate-rise">
          <div className="text-xs tracking-[0.4em] text-primary font-display uppercase mb-2">
            ĐẠI THỪA TIÊN NHÂN
          </div>
          <div className="font-script text-6xl md:text-7xl text-jade-aura mb-2">{c.name}</div>
          <div className="font-display text-sm text-muted-foreground tracking-widest">
            {c.sect.toUpperCase()} · {c.realm.toUpperCase()}
          </div>
        </div>

        {/* CENTRAL 3D STAGE — Cultivator with dharma aura behind */}
        <div className="relative w-full max-w-4xl mx-auto h-[600px] md:h-[700px] mb-12">
          <Cultivator3D className="w-full h-full" />

          {/* Dharma name label floating at bottom */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-background/85 backdrop-blur-md border border-primary/30 shadow-jade z-10">
            <span className="font-script text-primary text-lg">{c.dharma}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
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

        {/* Mastered techniques with 3D scroll */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h3 className="font-display text-xl text-primary-deep tracking-widest text-center mb-6">
            CÔNG PHÁP TINH THÔNG
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {techniques.slice(0, 3).map((t) => (
              <div key={t.id} className="gold-frame rounded-xl overflow-hidden">
                <div className="h-40 bg-gradient-to-b from-primary/5 to-accent/10">
                  <Treasure3D kind="scroll" color="#34d399" className="w-full h-full" />
                </div>
                <div className="p-4 text-center">
                  <div className="font-script text-primary">{t.name}</div>
                  <div className="font-display text-sm text-primary-deep">{t.vietName}</div>
                  <RankBadge rank={t.rank} className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treasures showcase with 3D */}
        <div className="max-w-5xl mx-auto">
          <h3 className="font-display text-xl text-primary-deep tracking-widest text-center mb-6">
            CHÍ BẢO TUỲ THÂN
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { ...treasures[0], kind: "sword" as const },
              { ...treasures[1], kind: "beast" as const },
              { ...treasures[2], kind: "pill" as const },
              { ...treasures[3], kind: "bagua" as const },
            ].map((t) => (
              <div key={t.id} className="jade-frame rounded-xl overflow-hidden">
                <div className="h-40 bg-gradient-to-b from-primary/10 to-accent/10">
                  <Treasure3D kind={t.kind} color="#34d399" className="w-full h-full" />
                </div>
                <div className="p-3 text-center">
                  <div className="font-script text-primary text-sm">{t.name}</div>
                  <div className="font-display text-xs text-primary-deep mb-1">{t.vietName}</div>
                  <RankBadge rank={t.rank} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Profile;
