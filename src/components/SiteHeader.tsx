import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import iconBagua from "@/assets/icon-bagua.png";

const links = [
  { to: "/", label: "Tiên Lộ" },
  { to: "/canh-gioi", label: "Cảnh Giới" },
  { to: "/cong-phap", label: "Công Pháp" },
  { to: "/phap-bao", label: "Pháp Bảo" },
  { to: "/bang-xep-hang", label: "Bảng Xếp Hạng" },
  { to: "/tu-si", label: "Tu Sĩ" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-primary/10">
      <div className="container flex items-center justify-between h-20">
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            src={iconBagua}
            alt="Tiên Lộ Hành"
            width={48}
            height={48}
            className="w-12 h-12 animate-rotate-slow group-hover:animate-aura-pulse"
          />
          <div className="flex flex-col leading-none">
            <span className="font-script text-2xl text-jade-aura">仙路行</span>
            <span className="font-display text-xs tracking-[0.3em] text-primary-deep">TIÊN LỘ HÀNH</span>
          </div>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium tracking-wide rounded-md transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary-deep shadow-soft"
                    : "text-foreground/70 hover:text-primary-deep hover:bg-primary/5"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="lg:hidden p-2 text-primary-deep"
          onClick={() => setOpen(!open)}
          aria-label="Mở menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-primary/10 bg-background/95 backdrop-blur-md">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-md text-sm font-medium ${
                    isActive ? "bg-primary/10 text-primary-deep" : "text-foreground/70"
                  }`
                }
                end={l.to === "/"}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
