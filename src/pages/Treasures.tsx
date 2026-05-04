import { PageLayout } from "@/components/PageLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { RankBadge } from "@/components/RankBadge";
import { treasures, type RealmRank } from "@/data/cultivation";
import { Treasure3D, type TreasureKind } from "@/components/three/Treasure3D";

const typeKind: Record<string, TreasureKind> = {
  "Pháp Bảo": "sword",
  "Linh Thú": "beast",
  "Đan Dược": "pill",
  "Pháp Khí": "bagua",
};

const rankColor: Record<RealmRank, string> = {
  common: "#94a3b8",
  uncommon: "#4ade80",
  rare: "#38bdf8",
  epic: "#c084fc",
  legend: "#fbbf24",
  myth: "#f87171",
};

const Treasures = () => (
  <PageLayout>
    <section className="container py-16">
      <SectionHeading
        eyebrow="CHÍ BẢO CÀN KHÔN"
        cn="法寶"
        title="Pháp Bảo & Linh Thú"
        description="Thần binh lợi khí, linh thú thượng cổ — bạn đồng hành trên đường tu hành."
      />
      <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="grid sm:grid-cols-2 gap-6">
          {treasures.map((t) => (
            <article
              key={t.id}
              className="group rounded-[2rem] overflow-hidden border border-white/10 bg-white/70 shadow-soft backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-aura"
            >
              <div className="relative h-64 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.28))]">
                <Treasure3D kind={typeKind[t.type]} color={rankColor[t.rank]} className="absolute inset-0" />
                <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary-deep bg-background/80 backdrop-blur rounded-full px-3 py-1">
                    {t.type}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.24em] text-foreground/70 bg-background/80 backdrop-blur rounded-full px-2 py-1">
                    Cấp {t.level}
                  </span>
                </div>
              </div>
              <div className="p-5 text-center">
                <div className="text-jade-aura font-script text-2xl tracking-tight mb-1">{t.name}</div>
                <h3 className="font-display text-lg text-primary-deep mb-2">{t.vietName}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.description}</p>
                <RankBadge rank={t.rank} className="mx-auto" />
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="gold-frame rounded-[2rem] p-6">
            <div className="text-xs tracking-[0.35em] uppercase text-accent-gold-deep font-display mb-4">
              Bí pháp pháp bảo
            </div>
            <h3 className="font-display text-3xl text-primary-deep mb-3">Chọn lựa pháp bảo phù hợp</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mỗi pháp bảo và linh thú đều có thuộc tính riêng. Hãy phối hợp pháp bảo phù hợp với tu trình để thúc tiến tu vi.
            </p>
            <div className="mt-6 grid gap-3">
              {Object.entries(typeKind).map(([type, kind]) => (
                <div key={type} className="flex items-center gap-3 rounded-3xl border border-accent-gold/20 bg-background/80 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-gold/15 text-accent-gold-deep">
                    {type[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary-deep">{type}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-[0.3em]">{kind === "sword" ? "Kiếm" : kind === "beast" ? "Linh thú" : kind === "pill" ? "Đan" : "Pháp khí"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="jade-frame rounded-[2rem] p-6">
            <div className="text-xs tracking-[0.35em] uppercase text-primary-deep font-display mb-4">
              Mảnh đạo linh khí
            </div>
            <h3 className="font-display text-3xl text-jade-aura mb-3">Bản đồ pháp bảo</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pháp bảo mạnh nhất sẽ gia tăng linh khí và sát thương. Thu thập, thăng cấp và tuỳ chỉnh theo mục tiêu chiến đấu.
            </p>
          </div>
        </aside>
      </div>
    </section>
  </PageLayout>
);

export default Treasures;
