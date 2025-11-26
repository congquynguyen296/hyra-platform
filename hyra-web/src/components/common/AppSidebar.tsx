import { Home, FolderOpen, BookOpen, Brain, ChevronRight, LogOut, User } from 'lucide-react';
import { NavLink } from '@/components/common/NavLink';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router';
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
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import userService from '@/services/user.service';
import subjectService, { SubjectStatsDTO } from '@/services/subject.service';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Subjects', url: '/subjects', icon: FolderOpen },
  { title: 'My Summaries', url: '/summaries', icon: BookOpen },
  { title: 'Quiz History', url: '/quizzes', icon: Brain },
];

export function AppSidebar() {
  const {user } = useAppStore();
  const navigate = useNavigate();
  const { data, setData } = useAuthStore();
  const logout = () => setData(null)

  //setData({...data, accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTE4MmM1MjA4ZDYyOTgyOTNmYmVlZDEiLCJ0b2tlblR5cGUiOiIxNW0iLCJpYXQiOjE3NjMxOTM5MzYsImV4cCI6MTc3MDk2OTkzNn0.Pi5c6LKz_wHlv6jTNf-N1IOAkjONyuDMzhwEsGfU7Bc'})

  const [subjects, setSubjects] = useState<SubjectStatsDTO[]>([]);
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await userService.getUserProfile();
  //       if (response && response.code === 200 && response.result) {
  //         setData(response.result);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch user data:', error);
  //     }
  //   }
    
  // }, [data]);

  const fetchSubjects = async () => {
        const data = await subjectService.getAllSubjectByUser()
        if (data && data.code && data.code === 200)
          setSubjects(data.result)
      }
    useEffect(() => {
      fetchSubjects()
    },[])
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-sidebar-primary" />
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Smart Knowledge</h2>
            <p className="text-xs text-sidebar-foreground/70">Summarizer & Quiz</p>
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
                          onClick={() => navigate('/subjects')}
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
            <img src={data?.avatarUrl || ''} alt="User Avatar" className="h-10 w-10 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {data?.name || 'User'}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {data?.email || 'user@example.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              logout();
              navigate('/login');
              toast.success('Logged out successfully');
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
