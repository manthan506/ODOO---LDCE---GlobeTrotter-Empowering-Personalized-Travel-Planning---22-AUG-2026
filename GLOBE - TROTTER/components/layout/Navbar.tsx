'use client';

import {
  Compass,
  LogOut,
  MapPin,
  Plus,
  Search,
  Users as UsersIcon,
  User as UserIcon,
  Globe2,
  Home,
  Calendar,
  Layers,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // If on login/signup or landing page, don't show full nav
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) return null;

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/trips', label: 'Trips', icon: Compass },
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/community', label: 'Community', icon: Globe2 },
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <>
      {/* Desktop Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Compass size={20} strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                GlobeTrotter
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Travel Planner</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Profile */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/notifications"
                  className="relative grid h-9 w-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 transition"
                  title="Notifications"
                >
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600" />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                      {(user.name || user.email || 'U')[0].toUpperCase()}
                    </span>
                    <span className="hidden text-xs font-bold text-slate-700 md:block">
                      {user.name || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        <UserIcon size={14} /> Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar matching Screen 3, 5, 12 */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-2 py-2">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <item.icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
