"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function NavTooltip({ label, badge }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute left-[calc(100%+12px)] top-1/2 z-[70] -translate-y-1/2",
        "pointer-events-none select-none",
        "flex items-center gap-2 whitespace-nowrap rounded-lg border-l-2 border-blue-600",
        "bg-white text-slate-900 border border-slate-200 px-3.5 py-2 text-[13px] font-semibold tracking-wide",
        "shadow-2xl shadow-black/50",
        "opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 ease-out",
      )}
    >
      {label}
      {badge && (
        <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">
          {badge}
        </span>
      )}
    </span>
  );
}

export default function NavItem({ link, onNavigate, collapsed = false }) {
  const pathname = usePathname();

  const isActive = link.exact
    ? pathname === link.href
    : pathname === link.href || (!link.disabled && pathname?.startsWith(link.href + "/"));

  const itemBase = cn(
    "group relative flex items-center rounded-lg text-sm font-medium",
    "transition-all duration-200 outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring",
    collapsed ? "mx-auto h-10 w-10 justify-center" : "w-full gap-3 px-3 py-2.5",
  );

  if (link.disabled) {
    return (
      <div aria-disabled="true" className={cn(itemBase, "cursor-not-allowed select-none text-slate-600")}>
        {link.icon && <link.icon className="h-5 w-5 shrink-0" />}
        {!collapsed && (
          <>
            <span className="flex-1">{link.label}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50">Soon</span>
          </>
        )}
        {collapsed && <NavTooltip label={link.label} badge="Soon" />}
      </div>
    );
  }

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={cn(
        itemBase,
        isActive
          ? "bg-blue-600/15 text-blue-400 font-semibold"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && !collapsed && <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-blue-500" />}
      {isActive && collapsed && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-white bg-blue-500" />}
      {link.icon && (
        <link.icon
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
            isActive ? "text-blue-400" : "text-slate-500",
          )}
        />
      )}
      {!collapsed && <span>{link.label}</span>}
      {collapsed && <NavTooltip label={link.label} />}
    </Link>
  );
}
