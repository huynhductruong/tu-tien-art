import { PageLayout } from "@/components/PageLayout";
import { RankBadge } from "@/components/RankBadge";
import { cultivators, treasures, techniques } from "@/data/cultivation";
import { Cultivator3D } from "@/components/three/Cultivator3D";
import { Treasure3D } from "@/components/three/Treasure3D";

const c = cultivators[0];

const selectedArtifacts = [
  { ...treasures[0], kind: "sword" as const },
  { ...treasures[1], kind: "beast" as const },
  { ...treasures[3], kind: "bagua" as const },
  { ...treasures[4], kind: "sword" as const },
];

const Profile = () => (
  <PageLayout>
    <section className="relative overflow-hidden">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative rounded-[2rem] border border-white/10 bg-white/80 shadow-soft backdrop-blur-xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),transparent_45%)] pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div>
                <div className="text-xs tracking-[0.35em] uppercase text-primary font-display mb-2">
                  Đại Thừa Tiên Nhân
                </div>
                <div className="font-script text-5xl md:text-6xl text-jade-aura leading-tight">{c.name}</div>
                <div className="text-sm text-muted-foreground tracking-widest mt-2">
                  {c.sect.toUpperCase()} · {c.realm.toUpperCase()}
                </div>
              </div>
              <div className="h-[620px] rounded-[2rem] overflow-hidden border border-primary/10 bg-[#f8fdf9]/80 shadow-jade">
                <Cultivator3D className="w-full h-full" />
              </div>
              <div className="inline-flex items-center gap-4 rounded-full border border-primary/20 bg-background/90 px-5 py-3 shadow-soft">
                <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Pháp Tướng</span>
                <span className="font-script text-lg text-primary-deep">{c.dharma}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="jade-frame rounded-[2rem] p-6">
              <div className="text-xs tracking-[0.35em] uppercase text-primary font-display mb-4">
                Pháp Tướng
              </div>
              <h3 className="font-display text-3xl text-primary-deep mb-3">Linh pháp hộ thân</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ngự pháp pháp tướng, triệu hồi linh khí hộ thân và duy trì linh lực xuyên suốt trận chiến.
              </p>
              <div className="mt-6 grid gap-3">
                {techniques.slice(0, 3).map((t) => (
                  <div key={t.id} className="group gold-frame rounded-3xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-gold">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-script text-lg text-primary">{t.name}</div>
                        <div className="font-display text-sm text-primary-deep">{t.vietName}</div>
                      </div>
                      <RankBadge rank={t.rank} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="jade-frame rounded-[2rem] p-6">
              <div className="text-xs tracking-[0.35em] uppercase text-primary font-display mb-4">
                Pháp Bảo
              </div>
              <h3 className="font-display text-3xl text-jade-aura mb-3">Hộ thân chí bảo</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Trang bị pháp bảo tối thượng giúp pháp tướng tăng mạnh sức mạnh, linh lực và độ bền trận mạc.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {selectedArtifacts.map((t) => (
                  <div key={t.id} className="rounded-3xl overflow-hidden border border-white/10 bg-background/80 shadow-soft">
                    <div className="h-28 bg-gradient-to-b from-primary/10 via-transparent to-accent/10">
                      <Treasure3D kind={t.kind} color="#34d399" className="w-full h-full" />
                    </div>
                    <div className="p-3 text-center">
                      <div className="font-script text-sm text-primary">{t.name}</div>
                      <div className="font-display text-xs text-primary-deep mb-1">{t.vietName}</div>
                      <div className="flex items-center justify-center gap-2">
                        <RankBadge rank={t.rank} className="text-[10px] px-2" />
                        <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Cấp {t.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              label: "Tu vi",
              value: c.power.toLocaleString(),
              sub: "Linh lực tổng",
            },
            {
              label: "Xếp hạng",
              value: "Nhất thiên hạ",
              sub: "Khí phách uy nghi",
            },
            {
              label: "Điểm đạo",
              value: "+130",
              sub: "Vận hành pháp tắc",
            },
          ].map((s) => (
            <div key={s.label} className="jade-frame rounded-3xl p-5 text-center">
              <div className="text-xs text-muted-foreground tracking-widest font-display mb-2">{s.label}</div>
              <div className="font-display text-3xl text-jade-aura mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Profile;
