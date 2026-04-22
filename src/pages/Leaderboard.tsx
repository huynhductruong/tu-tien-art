import { PageLayout } from "@/components/PageLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { cultivators } from "@/data/cultivation";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";
import { DharmaAura } from "@/components/three/DharmaAura";

const variants = ["gold", "jade", "crimson"] as const;
const rankAura = ["from-rank-myth/30", "from-rank-legend/30", "from-rank-epic/30"];

const Leaderboard = () => (
  <PageLayout>
    <section className="container py-16">
      <SectionHeading
        eyebrow="PHONG VÂN BẢNG"
        cn="風雲榜"
        title="Bảng Xếp Hạng Tu Sĩ"
        description="Những tu sĩ kinh thiên động địa của thiên hạ, mỗi cái tên chấn động bát phương."
      />

      {/* Top 3 podium */}
      <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
        {[1, 0, 2].map((idx, displayIdx) => {
          const c = cultivators[idx];
          const isFirst = idx === 0;
          return (
            <Link
              key={c.id}
              to="/tu-si"
              className={`relative jade-frame rounded-2xl p-6 text-center transition-all hover:-translate-y-2 ${
                isFirst ? "md:-mt-6 shadow-aura" : ""
              }`}
            >
              <div className={`absolute inset-x-0 -top-px h-1 rounded-t-2xl bg-gradient-to-r ${rankAura[displayIdx]} via-transparent to-transparent`} />
              <div className="flex justify-center mb-3">
                {isFirst ? (
                  <Crown className="w-8 h-8 text-accent-gold animate-aura-pulse" />
                ) : (
                  <span className="font-display text-3xl text-primary-deep">#{idx + 1}</span>
                )}
              </div>
              <img src={iconDharma} alt="" className="w-24 h-24 mx-auto mb-3 opacity-80 animate-float" />
              <h3 className={`font-display ${isFirst ? "text-2xl text-jade-aura" : "text-xl text-primary-deep"} mb-1`}>
                {c.name}
              </h3>
              <div className="text-xs text-muted-foreground tracking-widest mb-2 font-display">
                {c.sect.toUpperCase()}
              </div>
              <div className="font-script text-primary text-lg">{c.dharma}</div>
              <div className="mt-3 pt-3 border-t border-primary/10">
                <span className="font-display text-2xl text-accent-gold-deep">{c.power.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground ml-1">tu vi</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Rest */}
      <div className="max-w-4xl mx-auto jade-frame rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary/5 border-b border-primary/10">
            <tr className="text-xs font-display tracking-widest text-primary-deep">
              <th className="text-left px-5 py-4">HẠNG</th>
              <th className="text-left px-5 py-4">TU SĨ</th>
              <th className="text-left px-5 py-4 hidden md:table-cell">TÔNG MÔN</th>
              <th className="text-left px-5 py-4 hidden md:table-cell">CẢNH GIỚI</th>
              <th className="text-right px-5 py-4">TU VI</th>
            </tr>
          </thead>
          <tbody>
            {cultivators.slice(3).map((c, i) => (
              <tr
                key={c.id}
                className="border-b border-primary/5 last:border-0 hover:bg-primary/5 transition-colors"
              >
                <td className="px-5 py-4 font-display text-primary-deep">#{i + 4}</td>
                <td className="px-5 py-4">
                  <div className="font-display text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground md:hidden">{c.sect}</div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">{c.sect}</td>
                <td className="px-5 py-4 text-sm hidden md:table-cell">
                  <span className="font-script text-primary">{c.realm}</span>
                </td>
                <td className="px-5 py-4 text-right font-display text-accent-gold-deep">
                  {c.power.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </PageLayout>
);

export default Leaderboard;
