"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, QrCode, Settings, X, LogOut,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import NavItem from "@/components/shared/NavItem";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { label: "Dashboard",       href: "/dashboard",            exact: true, icon: LayoutDashboard },
  { label: "Low Ratings",     href: "/dashboard/feedback",                icon: MessageSquare },
  { label: "QR Poster",       href: "/dashboard/poster",                  icon: QrCode },
  { label: "Settings",        href: "/dashboard/settings",                icon: Settings },
];

const W_EXPANDED  = "w-[240px]";
const W_COLLAPSED = "w-[72px]";

function LogoutButton({ collapsed }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {
      // ignore
    }
    router.push('/sign-in');
  }

  if (collapsed) {
    return (
      <button
        onClick={handleLogout}
        aria-label="Sign out"
        title="Sign out"
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-lg shrink-0 cursor-pointer",
          "text-slate-500 hover:text-red-600 hover:bg-slate-50",
          "transition-colors focus:outline-none"
        )}
      >
        <LogOut className="h-4.5 w-4.5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "flex items-center gap-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 cursor-pointer",
        "text-sm font-medium text-slate-600",
        "hover:bg-red-50 hover:text-red-600 hover:border-red-200",
        "transition-colors focus:outline-none"
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      <span>Sign out</span>
    </button>
  );
}

export default function DashboardSidebar() {
  const { isOpen, close, isCollapsed, toggleCollapsed } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const collapsed = isCollapsed && !isMobile;

  const handleItemClick = () => {
    close();
  };

  return (
    <>
      {/* Backdrop: mobile/tablet only */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar panel */}
      <aside
        aria-label="Sidebar navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "bg-white text-slate-900 border-r border-slate-200 shadow-sm",
          "transition-[width,transform] duration-300 ease-in-out",
          "lg:translate-x-0",
          "overflow-visible",
          collapsed ? W_COLLAPSED : W_EXPANDED,
          !isOpen && "max-lg:-translate-x-full",
          "max-lg:w-64"
        )}
      >
        {/* Desktop floating collapse toggle */}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "hidden lg:flex absolute top-5 -right-3 z-[60] h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm",
            "text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer",
            "transition-all duration-200 focus:outline-none"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Logo / header */}
        <div className={cn(
          "flex h-16 shrink-0 items-center border-b border-slate-200",
          collapsed ? "justify-center px-3" : "justify-between px-5"
        )}>
          <Link
            href="/dashboard"
            onClick={handleItemClick}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus:outline-none"
          >
            <div
              className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-lg bg-blue-600 text-white shadow-md shadow-blue-500/20"
            >
              R
            </div>
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight text-slate-900">
                ReviewPilot
              </span>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            onClick={close}
            aria-label="Close sidebar"
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-md
                       text-slate-500 hover:text-slate-900 hover:bg-slate-100
                       transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav
          className={cn(
            "flex-1 py-5 flex flex-col gap-1",
            collapsed
              ? "overflow-visible px-1 items-center"
              : "overflow-y-auto overflow-x-hidden px-3"
          )}
        >
          {NAV_LINKS.map((link) => (
            <NavItem
              key={link.label}
              link={link}
              onNavigate={handleItemClick}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Bottom logout */}
        <div className={cn(
          "shrink-0 border-t border-slate-200 p-4 flex flex-col gap-2",
          collapsed ? "items-center" : "px-4 py-3"
        )}>
          <LogoutButton collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}
