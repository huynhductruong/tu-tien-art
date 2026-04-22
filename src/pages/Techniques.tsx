import { PageLayout } from "@/components/PageLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { RankBadge } from "@/components/RankBadge";
import { techniques } from "@/data/cultivation";
import iconScroll from "@/assets/icon-scroll.png";

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
            className="group relative gold-frame rounded-2xl p-6 hover:shadow-gold hover:-translate-y-1 transition-all overflow-hidden"
          >
            <img
              src={iconScroll}
              alt=""
              aria-hidden
              className="absolute -right-6 -bottom-6 w-32 opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all"
            />
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-accent-gold-deep font-display tracking-widest">{t.attribute}</span>
                <RankBadge rank={t.rank} />
              </div>
              <div className="font-script text-3xl text-primary mb-1">{t.name}</div>
              <h3 className="font-display text-xl text-primary-deep mb-3">{t.vietName}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed mb-4">{t.description}</p>
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
