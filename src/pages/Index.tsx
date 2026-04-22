import { PageLayout } from "@/components/PageLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { RankBadge } from "@/components/RankBadge";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroRealm from "@/assets/hero-realm.jpg";
import iconBagua from "@/assets/icon-bagua.png";
import { realms, techniques } from "@/data/cultivation";
import { Treasure3D, type TreasureKind } from "@/components/three/Treasure3D";
import { DharmaAura } from "@/components/three/DharmaAura";

const features: Array<{
  kind: TreasureKind | "dharma";
  color: string;
  name: string;
  cn: string;
  desc: string;
  to: string;
}> = [
  { kind: "bagua", color: "#34d399", name: "Cảnh Giới", cn: "境界", desc: "Chín cảnh giới tu tiên, từ Luyện Khí đến Độ Kiếp.", to: "/canh-gioi" },
  { kind: "scroll", color: "#fcd34d", name: "Công Pháp", cn: "功法", desc: "Bí kíp tâm pháp lưu truyền vạn cổ.", to: "/cong-phap" },
  { kind: "sword", color: "#34d399", name: "Pháp Bảo", cn: "法寶", desc: "Thần binh lợi khí, vạn pháp đồng nguyên.", to: "/phap-bao" },
  { kind: "beast", color: "#a7f3d0", name: "Linh Thú", cn: "靈獸", desc: "Thượng cổ thần thú, đồng hành tu sĩ.", to: "/phap-bao" },
  { kind: "pill", color: "#fbbf24", name: "Đan Dược", cn: "丹藥", desc: "Tiên đan luyện hoá, cải mệnh đoạt thiên.", to: "/phap-bao" },
  { kind: "dharma", color: "#34d399", name: "Pháp Tướng", cn: "法相", desc: "Pháp tướng thiên địa, hiện thế kinh nhân.", to: "/tu-si" },
];

const Index = () => (
  <PageLayout>
    {/* HERO */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroRealm}
          alt="Cõi tu tiên"
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </div>

      <div className="container py-20 md:py-32 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs tracking-[0.3em] text-primary-deep font-display mb-8 animate-rise">
          <Sparkles size={14} className="text-accent-gold" />
          <span>CỬU TRÙNG TIÊN CẢNH</span>
          <Sparkles size={14} className="text-accent-gold" />
        </div>

        <h1 className="font-script text-7xl md:text-9xl text-jade-aura mb-4 animate-rise">
          仙路行
        </h1>
        <p className="font-display text-lg md:text-xl text-primary-deep tracking-[0.5em] mb-8 animate-rise">
          TIÊN LỘ HÀNH
        </p>

        <p className="max-w-xl mx-auto text-base md:text-lg text-foreground/70 leading-relaxed mb-10 animate-rise">
          Đạo pháp tự nhiên, vạn vật quy nhất. Bước chân vào cõi tu tiên huyền diệu —
          nơi cảnh giới phân chín tầng, công pháp truyền vạn thế, pháp bảo định càn khôn.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-rise">
          <Link
            to="/canh-gioi"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-jade text-primary-foreground rounded-full shadow-jade hover:shadow-aura transition-all"
          >
            <span className="font-display tracking-widest text-sm">KHỞI HÀNH</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/tu-si"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-primary/30 text-primary-deep rounded-full hover:bg-primary/5 transition-all"
          >
            <span className="font-display tracking-widest text-sm">XEM TU SĨ</span>
          </Link>
        </div>

        {/* Floating ornaments */}
        <img
          src={iconBagua}
          alt=""
          aria-hidden
          className="hidden md:block absolute top-12 left-8 w-24 opacity-40 animate-rotate-slow"
        />
        <img
          src={iconBagua}
          alt=""
          aria-hidden
          className="hidden md:block absolute bottom-12 right-8 w-20 opacity-30 animate-rotate-reverse"
        />
      </div>
    </section>

    {/* FEATURES */}
    <section className="container py-20">
      <SectionHeading
        eyebrow="LỤC ĐẠO TU HÀNH"
        cn="六道"
        title="Sáu cõi tu hành"
        description="Mỗi cõi một huyền cơ, mỗi đạo một sinh mệnh. Tự mình lựa chọn lối đi."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Link
            key={f.name}
            to={f.to}
            className="group relative jade-frame rounded-2xl p-6 hover:shadow-jade hover:-translate-y-1 transition-all duration-500 overflow-hidden"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-aura opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative">
              <div className="h-44 mb-3 -mx-2">
                {f.kind === "dharma" ? (
                  <DharmaAura variant="jade" showCore={false} className="w-full h-full" />
                ) : (
                  <Treasure3D kind={f.kind} color={f.color} className="w-full h-full" />
                )}
              </div>
              <div className="text-center">
                <div className="font-script text-2xl text-primary mb-1">{f.cn}</div>
                <h3 className="font-display text-xl text-primary-deep mb-2 tracking-wide">{f.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* REALMS PREVIEW */}
    <section className="relative py-20 bg-gradient-mist border-y border-primary/10">
      <div className="container">
        <SectionHeading
          eyebrow="CỬU TRÙNG CẢNH GIỚI"
          cn="九重境"
          title="Đường tu chín bậc"
          description="Từ một phàm phu tục tử đến đạp vỡ hư không phi thăng tiên giới."
        />

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
          <div className="space-y-6">
            {realms.map((r, i) => (
              <div
                key={r.id}
                className={`relative grid md:grid-cols-2 gap-6 items-center ${
                  i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <div className={`jade-frame rounded-xl p-6 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                  <div className={`flex items-center gap-3 mb-2 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                    <span className="font-display text-xs text-muted-foreground tracking-widest">
                      ĐỆ {r.level} CẢNH
                    </span>
                    <RankBadge rank={r.rank} />
                  </div>
                  <div className="font-script text-3xl text-jade-aura mb-1">{r.name}</div>
                  <h4 className="font-display text-xl text-primary-deep mb-2">{r.vietName}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                </div>
                <div className="hidden md:flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-jade shadow-aura ring-4 ring-background" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* TECHNIQUES PREVIEW */}
    <section className="container py-20">
      <SectionHeading
        eyebrow="BÍ KÍP TRUYỀN ĐỜI"
        cn="功法"
        title="Tâm pháp danh môn"
        description="Sáu bộ công pháp chính tông, mỗi bộ một thiên cơ."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techniques.slice(0, 6).map((t) => (
          <article key={t.id} className="gold-frame rounded-xl p-6 hover:shadow-gold transition-all hover:-translate-y-0.5">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-accent-gold-deep font-display tracking-widest">{t.attribute}</span>
              <RankBadge rank={t.rank} />
            </div>
            <div className="font-script text-2xl text-primary mb-1">{t.name}</div>
            <h3 className="font-display text-lg text-primary-deep mb-2">{t.vietName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.description}</p>
            <div className="text-xs text-muted-foreground/80 italic">— {t.origin}</div>
          </article>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/cong-phap" className="inline-flex items-center gap-2 text-primary-deep font-display tracking-widest text-sm hover:gap-3 transition-all">
          XEM TẤT CẢ CÔNG PHÁP <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  </PageLayout>
);

export default Index;
