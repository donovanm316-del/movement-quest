import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/dashboard', label: 'Home', icon: '🏠' },
  { to: '/quests', label: 'Quests', icon: '⚔️' },
  { to: '/progress', label: 'Progress', icon: '📊' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-md justify-around">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-3 text-xs ${
                isActive ? 'text-primary' : 'text-text-dim'
              }`
            }
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
