"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

/**
 * Wraps dashboard content and shifts it right based on sidebar state.
 * - Desktop collapsed: 72px left padding
 * - Desktop expanded: 240px left padding
 * - Mobile/tablet: no left padding (sidebar is a drawer overlay)
 */
export default function DashboardContent({ children }) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen transition-[padding-left] duration-300 ease-in-out bg-slate-50",
        isCollapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
      )}
    >
      {children}
    </div>
  );
}
