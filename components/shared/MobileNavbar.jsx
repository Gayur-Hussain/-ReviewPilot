"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

/**
 * Sticky top navbar shown only on mobile/tablet (<lg).
 * Shows the hamburger button to open the sidebar drawer.
 */
export default function MobileNavbar() {
  const { toggle } = useSidebar();

  return (
    <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center border-b border-slate-200 bg-white/90 backdrop-blur-md px-4">
      <button
        onClick={toggle}
        aria-label="Open navigation menu"
        className="flex items-center justify-center h-9 w-9 rounded-lg cursor-pointer
                   text-slate-600 hover:text-slate-900 hover:bg-slate-100
                   transition-colors focus:outline-none"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  );
}
