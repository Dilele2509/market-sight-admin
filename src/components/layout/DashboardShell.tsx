
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { useState } from "react";
import AvatarConfig from "../blocks/avatarState/avatarConfig";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-background`}>
        <div className={`duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[240px]'}`}>
          <DashboardSidebar isCollapsed={isCollapsed} updateCollapsedStatus={setIsCollapsed} />
        </div>
        <div className="flex-1 p-6 overflow-auto">
          <header className="flex mb-4">
            <div className="flex-1"></div> 
            <AvatarConfig className="ml-auto w-9 h-9" />  
          </header>
          <main>{children}</main>
        </div>

      </div>
    </SidebarProvider>
  );
}
