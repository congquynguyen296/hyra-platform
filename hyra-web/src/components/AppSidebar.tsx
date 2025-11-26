import {
  Home,
  FolderOpen,
  Upload,
  Settings,
  BookOpen,
  Brain,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { NavLink } from "@/components/common/NavLink";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";
import { toast } from "sonner";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Subjects", url: "/subjects", icon: FolderOpen },
  { title: "Upload File", url: "/upload", icon: Upload },
  { title: "My Summaries", url: "/summaries", icon: BookOpen },
  { title: "My Quizzes", url: "/quizzes", icon: Brain },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { subjects, user } = useAppStore();
  const navigate = useNavigate();
  const logout = useAppStore((state) => state.logout);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="Logo" className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Smart Knowledge
            </h2>
            <p className="text-xs text-sidebar-foreground/70">
              Summarizer & Quiz
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {subjects.length > 0 && (
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <span>My Subjects</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {subjects.slice(0, 5).map((subject) => (
                      <SidebarMenuItem key={subject.id}>
                        <SidebarMenuButton
                          onClick={() => navigate(`/subject/${subject.id}`)}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <span className="truncate">{subject.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    {subjects.length > 5 && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => navigate("/subjects")}
                          className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground cursor-pointer"
                        >
                          View all {subjects.length} subjects →
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 p-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              logout();
              navigate("/login");
              toast.success("Logged out successfully");
            }}
            className="hover:bg-red-50 hover:text-red-600"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
