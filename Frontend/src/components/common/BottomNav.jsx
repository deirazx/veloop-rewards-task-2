import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Gift, Plus, BookOpen, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home',       icon: Home,     path: '/' },
  { label: 'Giveaways',  icon: Gift,     path: '/giveaways' },
  { label: null,         icon: null,     path: null },          /* Center + button */
  { label: 'My Entries', icon: BookOpen, path: '/entries' },
  { label: 'Profile',    icon: User,     path: '/profile' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#13131a] border-t border-white/10 safe-area-inset-bottom">
      <div className="flex items-end justify-around px-2 py-2 max-w-md mx-auto relative">

        {NAV_ITEMS.map((item, i) => {
          /* ── Centre floating + button ── */
          if (item.path === null) {
            return (
              <div key="center" className="flex flex-col items-center relative" style={{ marginBottom: '8px' }}>
                <button
                  onClick={() => {
                    navigate('/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6366F1] to-[#a855f7]
                    shadow-[0_0_24px_rgba(168,85,247,0.6)]
                    flex items-center justify-center
                    -translate-y-4
                    active:scale-90 transition-transform duration-150 cursor-pointer"
                  aria-label="Explore Giveaways"
                  title="Explore Giveaways"
                >
                  <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
                </button>
              </div>
            );
          }

          const Icon    = item.icon;
          const isActive = pathname === item.path || (item.path === '/' && pathname === '/');

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-[52px]"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#a855f7]' : 'text-slate-500'
                }`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-[#a855f7]' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
