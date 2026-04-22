import { PageLayout } from "@/components/PageLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { RankBadge } from "@/components/RankBadge";
import { realms } from "@/data/cultivation";
import iconBagua from "@/assets/icon-bagua.png";

const Realms = () => (
  <PageLayout>
    <section className="container py-16">
      <SectionHeading
        eyebrow="ĐẠI ĐẠO CHI HÀNH"
        cn="九重天"
        title="Cửu Trùng Tiên Cảnh"
        description="Chín cảnh giới tu tiên, từ phàm thân yếu ớt đến đạp phá hư không phi thăng."
      />

      <div className="space-y-4 max-w-4xl mx-auto">
        {realms.map((r, i) => (
          <div
            key={r.id}
            className="group relative jade-frame rounded-xl p-6 md:p-8 hover:shadow-jade transition-all"
          >
            <div className="flex items-start gap-6">
              <div className="hidden md:block relative">
                <img src={iconBagua} alt="" className="w-20 h-20 opacity-80 group-hover:animate-rotate-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-2xl text-primary-deep">{r.level}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-display text-xs text-muted-foreground tracking-widest">
                    ĐỆ {r.level} CẢNH GIỚI
                  </span>
                  <RankBadge rank={r.rank} />
                </div>
                <div className="flex flex-wrap items-baseline gap-4 mb-3">
                  <span className="font-script text-4xl text-jade-aura">{r.name}</span>
                  <h3 className="font-display text-2xl text-primary-deep">{r.vietName}</h3>
                </div>
                <p className="text-foreground/75 leading-relaxed">{r.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </PageLayout>
);

export default Realms;
