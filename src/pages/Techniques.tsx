import { PageLayout } from "@/components/PageLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { RankBadge } from "@/components/RankBadge";
import { techniques, type RealmRank } from "@/data/cultivation";
import { Treasure3D } from "@/components/three/Treasure3D";

const rankColor: Record<RealmRank, string> = {
  common: "#94a3b8",
  uncommon: "#4ade80",
  rare: "#38bdf8",
  epic: "#c084fc",
  legend: "#fbbf24",
  myth: "#f87171",
};

const Techniques = () => (
  <PageLayout>
    <section className="container py-16">
      <SectionHeading
        eyebrow="TÂM PHÁP CHÂN KINH"
        cn="功法"
        title="Công Pháp Bí Kíp"
        description="Vạn cuốn chân kinh truyền thừa, mỗi bộ công pháp đều ẩn chứa thiên cơ."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techniques.map((t) => (
          <article
            key={t.id}
            className="group relative gold-frame rounded-2xl overflow-hidden hover:shadow-gold hover:-translate-y-1 transition-all"
          >
            {/* 3D scroll preview */}
            <div className="relative h-56 bg-gradient-to-b from-primary/5 to-accent/10">
              <Treasure3D kind="scroll" color={rankColor[t.rank]} className="absolute inset-0" />
              <div className="absolute top-3 right-3">
                <RankBadge rank={t.rank} />
              </div>
              <div className="absolute top-3 left-3 text-xs text-accent-gold-deep font-display tracking-widest bg-background/70 backdrop-blur px-2 py-1 rounded">
                {t.attribute}
              </div>
            </div>

            <div className="p-5">
              <div className="font-script text-3xl text-primary mb-1">{t.name}</div>
              <h3 className="font-display text-xl text-primary-deep mb-2">{t.vietName}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed mb-3">{t.description}</p>
              <div className="pt-3 border-t border-accent-gold/20 text-xs text-muted-foreground italic">
                Truyền từ — {t.origin}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  </PageLayout>
);

export default Techniques;
