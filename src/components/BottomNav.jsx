import { NavLink } from "react-router-dom";

import { Home, Dumbbell, Play, Users, User } from "lucide-react";

const ITEMS = [
  { to: "/inicio", label: "Início", icon: Home, isImage: true },
  { to: "/treino/1", label: "Treinos", icon: Dumbbell, isImage: true },
  { to: "/novo-treino", label: "Começar", icon: Play, isImage: true },
  { to: "/grupos", label: "Grupos", icon: Users, isImage: true },
  { to: "/perfil", label: "Perfil", icon: User, isImage: true },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-bg-darker border-t border-line flex z-50">
      {ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] font-semibold tracking-wide uppercase transition-colors
              ${isActive ? "text-red" : "text-text-muted"}`
            }
          >
            <span className="text-lg leading-none flex items-center justify-center h-6 w-6">
              <Icon size={20} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
