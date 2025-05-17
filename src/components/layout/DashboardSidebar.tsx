
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  Calendar,
  Bot,
  BarChart,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Tasks",
      path: "/dashboard/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      name: "Journal",
      path: "/dashboard/journal",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Planning",
      path: "/dashboard/planning",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "AI Assistant",
      path: "/dashboard/ai",
      icon: <Bot className="h-5 w-5" />,
    },
    {
      name: "Statistics",
      path: "/dashboard/stats",
      icon: <BarChart className="h-5 w-5" />,
    },
  ];
  
  const footerItems = [
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Help",
      path: "/dashboard/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <div className="text-xl font-bold text-primary">LifePilot</div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>
      </div>

      <div className={`flex items-center gap-2 px-4 py-2 ${isCollapsed ? "justify-center" : ""}`}>
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div>
            <p className="text-sm font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <nav className="grid gap-1 px-2">
        {navigationItems.map((item) => (
          <NavLink
            to={item.path}
            className={({ isActive }) => navLinkClass(isActive)}
            key={item.path}
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <Separator className="my-4" />
        <nav className="grid gap-1 px-2">
          {footerItems.map((item) => (
            <NavLink
              to={item.path}
              className={({ isActive }) => navLinkClass(isActive)}
              key={item.path}
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
          <Button
            variant="ghost"
            className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground justify-${
              isCollapsed ? "center" : "start"
            }`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </nav>
      </div>
    </>
  );

  const mobileMenuButton = (
    <Button
      variant="outline"
      size="icon"
      className="lg:hidden fixed top-4 left-4 z-50"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );

  const mobileSidebar = (
    <>
      {mobileMenuButton}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );

  const desktopSidebar = (
    <div
      className={`hidden lg:flex flex-col h-screen bg-sidebar border-r ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-200 ease-in-out`}
    >
      {sidebarContent}
    </div>
  );

  return (
    <>
      {isMobile ? mobileSidebar : desktopSidebar}
    </>
  );
}
