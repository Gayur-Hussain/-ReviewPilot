import { SidebarProvider } from "@/context/SidebarContext";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import MobileNavbar from "@/components/shared/MobileNavbar";
import DashboardContent from "@/components/shared/DashboardContent";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Fixed sidebar panel */}
        <DashboardSidebar />

        {/* Adjusts spacing based on sidebar collapse */}
        <DashboardContent>
          {/* Mobile top bar */}
          <MobileNavbar />

          {/* Page content */}
          <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </DashboardContent>
        <Toaster position="top-right" theme="light" />
      </div>
    </SidebarProvider>
  );
}
