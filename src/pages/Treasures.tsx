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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {treasures.map((t) => (
          <article
            key={t.id}
            className="group jade-frame rounded-2xl overflow-hidden hover:shadow-aura hover:-translate-y-1 transition-all"
          >
            <div className="relative h-64 bg-gradient-to-b from-primary/10 via-transparent to-accent/10">
              <Treasure3D kind={typeKind[t.type]} color={rankColor[t.rank]} className="absolute inset-0" />
              <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded bg-background/70 backdrop-blur text-primary-deep font-display tracking-widest">
                {t.type.toUpperCase()}
              </div>
              <div className="absolute top-3 right-3">
                <RankBadge rank={t.rank} />
              </div>
            </div>
            <div className="p-5 text-center">
              <div className="font-script text-2xl text-jade-aura mb-1">{t.name}</div>
              <h3 className="font-display text-lg text-primary-deep mb-2">{t.vietName}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  </PageLayout>
);

export default Treasures;
