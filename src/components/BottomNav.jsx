import { NavLink } from 'react-router-dom';

const ITEMS = [
  { to: '/inicio',      label: 'Início',  icon: '🏠' },
  { to: '/novo-treino', label: 'Começar', icon: '▶️' },
  { to: '/treino/1',    label: 'Treinos', icon: '🏋️' },
  { to: '/grupos',      label: 'Grupos',  icon: '👥' },
  { to: '/perfil',      label: 'Perfil',  icon: '👤' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-bg-darker border-t border-line flex z-50">
      {ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] font-semibold tracking-wide uppercase transition-colors
            ${isActive ? 'text-red' : 'text-text-muted'}`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
