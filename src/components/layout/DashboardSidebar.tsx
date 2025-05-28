
<<<<<<< HEAD
import { LayoutDashboard, ChartNoAxesCombined, Cable, Moon, Sun, ChevronLeft, ChevronRight, Database, Filter, FolderSync } from "lucide-react";
=======
import { LayoutDashboard, Table, SquareTerminal, Building2, KeyRound, Moon, Sun, ChevronLeft, ChevronRight, Database, Filter } from "lucide-react";
>>>>>>> 82912c6 (update admin)
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/dark-mode/ThemeProvider";

const menuItems = [
  {
    title: "Bảng giám sát",
    icon: LayoutDashboard,
    path: "/",
  },
  {
<<<<<<< HEAD
    title: "Phân khúc vi mô",
    icon: ChartNoAxesCombined,
    path: "/micro-segmentation",
  },
  {
    title: "Tạo phân khúc",
    icon: Filter,
    path: "/create-segmentation",
  },
  {
    title: "Chuẩn hoá dữ liệu",
    icon: Database,
    path: "/data-modeling",
  },
  {
    title: "Kết nối dữ liệu",
    icon: Cable,
    path: "/connect-data",
=======
    title: "Table Data",
    icon: Table,
    path: "/table",
  },
  {
    title: "Authentication",
    icon: KeyRound,
    path: "/authentication",
>>>>>>> 82912c6 (update admin)
  },
  {
    title: "Cấu hình đồng bộ",
    icon: FolderSync,
    path: "/sync-config",
  },
];

const DashboardSidebar = ({ isCollapsed, updateCollapsedStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar className={`border-r border-border/50 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[240px]'}`}>
      <SidebarContent>
        <div className="flex items-center justify-between p-6">
          <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
            <h1 className="text-2xl font-semibold text-primary">RetailSight Management</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateCollapsedStatus(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <SidebarGroup>
<<<<<<< HEAD
          <SidebarGroupLabel>{!isCollapsed && "Phân tích"}</SidebarGroupLabel>
=======
          <SidebarGroupLabel>{!isCollapsed && "Management"}</SidebarGroupLabel>
>>>>>>> 82912c6 (update admin)
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem
                    key={item.path}
                    className="hover:bg-primary hover:text-white hover:rounded-md cursor-pointer"
                  >
                    <SidebarMenuButton
                      tooltip={isCollapsed ? item.title : undefined}
                      onClick={() => navigate(item.path)}
                      data-active={isActive}
                      className={`
          data-[active=true]:bg-primary-light 
          data-[active=true]:text-primary 
          data-[active=false]:text-card-foreground
          flex items-center gap-2
        `}
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`w-full flex items-center justify-center gap-2 ${theme === 'dark' && 'text-card-foreground'}`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" />
<<<<<<< HEAD
              {!isCollapsed && <span>Chế độ sáng</span>}
=======
              {!isCollapsed && <span className="text-card-foreground">Light Mode</span>}
>>>>>>> 82912c6 (update admin)
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              {!isCollapsed && <span>Chế độ tối</span>}
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
