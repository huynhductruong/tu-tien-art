import { PageLayout } from "@/components/PageLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { RankBadge } from "@/components/RankBadge";
import { treasures } from "@/data/cultivation";
import iconSword from "@/assets/icon-sword.png";
import iconBeast from "@/assets/icon-beast.png";
import iconCauldron from "@/assets/icon-cauldron.png";
import iconBagua from "@/assets/icon-bagua.png";

const typeIcon: Record<string, string> = {
  "Pháp Bảo": iconSword,
  "Linh Thú": iconBeast,
  "Đan Dược": iconCauldron,
  "Pháp Khí": iconBagua,
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
            className="group jade-frame rounded-2xl p-6 text-center hover:shadow-aura hover:-translate-y-1 transition-all"
          >
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-aura animate-aura-pulse rounded-full" />
              <img
                src={typeIcon[t.type]}
                alt={t.vietName}
                width={128}
                height={128}
                loading="lazy"
                className="relative w-full h-full object-contain animate-float"
              />
            </div>
            <div className="flex justify-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-sm bg-primary/10 text-primary-deep font-display tracking-widest">
                {t.type.toUpperCase()}
              </span>
              <RankBadge rank={t.rank} />
            </div>
            <div className="font-script text-2xl text-jade-aura mb-1">{t.name}</div>
            <h3 className="font-display text-lg text-primary-deep mb-2">{t.vietName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
          </article>
        ))}
      </div>
    </section>
  </PageLayout>
);

export default Treasures;
