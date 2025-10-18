import { 
  LayoutDashboard,
  BarChart3, 
  Building2, 
  Settings, 
  Users, 
  FileCheck, 
  BarChart4, 
  Target,
  Bell,
  Calendar,
  UserCog,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Network,
  Home,
  Menu,
  X,
  Building,
  UserPlus,
  Briefcase,
  UserCheck,
  CalendarDays,
  Clock,
  Cog,
  FileText,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Shield,
  Key,
  Eye,
  Mail,
  BarChart,
  Settings2,
  HelpCircle,
  Info,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  disabled?: boolean;
  submenu?: SidebarItem[];
  href?: string;
}

const sidebarItemsAssistantDirector: SidebarItem[] = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    href: "/assistant-director-dashboard"
  },
  { 
    icon: Target, 
    label: "My Appraisal", 
    href: "/assistant-director/appraisal"
  },
  { 
    icon: FileText, 
    label: "Performance Review", 
    href: "/assistant-director/performance-review"
  },
  { 
    icon: Briefcase, 
    label: "Performance Contract", 
    href: "/assistant-director/performance-contract"
  },
  {
    icon: Users, label: "Supervisee", hasSubmenu: true,
    submenu: [
      { icon: Briefcase, label: "Performance Contract", href: "/assistant-director/supervisee/performance-contract" },
      { icon: FileText, label: "Performance Review", href: "/assistant-director/supervisee/performance-review" },
      { icon: FileCheck, label: "Appraisal", href: "/assistant-director/supervisee/appraisal" },
    ]
  },
  { 
    icon: Users, 
    label: "Team Appraisals", 
    href: "/director/team-appraisals"
  },
  { 
    icon: BarChart3, 
    label: "Report", 
    href: "/officer/report"
  }
];

const sidebarItemsHR: SidebarItem[] = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    href: "/dashboard"
  },
  { 
    icon: Building, 
    label: "Organization", 
    hasSubmenu: true,
    submenu: [
      { 
        icon: Network, 
        label: "Organogram",
        href: "/organogram"
      },
      { 
        icon: UserPlus, 
        label: "Manage Officers",
        href: "/manage-officers"
      },
    ]
  },
  { 
    icon: Briefcase, 
    label: "Post Management", 
    hasSubmenu: true,
    submenu: [
      { 
        icon: Target, 
        label: "Manage Posts",
        href: "/manage-posts"
      },
      { 
        icon: UserCheck, 
        label: "Post Occupancy",
        href: "/post-occupancy"
      },
    ]
  },
  { 
    icon: Cog, 
    label: "Appraisal Settings", 
    hasSubmenu: false,
    href: "/appraisal-settings"
  },
  { 
    icon: TrendingUp, 
    label: "KRA Management", 
    hasSubmenu: false,
    href: "/kra-kpi"
  },
  { 
    icon: ShieldCheck, 
    label: "Role Management", 
    hasSubmenu: false,
    href: "/roles-management"
  },
];

// Director-specific sidebar, per requirements
const sidebarItemsDirector: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/director-dashboard" },
  { icon: Target, label: "Department KRA", href: "/director/department-kras" },
  {
    icon: FileCheck, label: "Performance Hub", hasSubmenu: true,
    submenu: [
      { icon: FileCheck, label: "My Appraisal", href: "/director/appraisal" },
      { icon: FileText, label: "Performance Review", href: "/director/performance-review" },
      { icon: Briefcase, label: "Performance Contract", href: "/director/performance-contract" },
    ]
  },
  {
    icon: Users, label: "Supervisee", hasSubmenu: true,
    submenu: [
      { icon: Briefcase, label: "Performance Contract", href: "/director/supervisee/performance-contract" },
      { icon: FileText, label: "Performance Review", href: "/director/supervisee/performance-review" },
      { icon: FileCheck, label: "Appraisal", href: "/director/supervisee/appraisal" },
    ]
  },
  {
    icon: BarChart3, label: "Reports & Analytics", hasSubmenu: true,
    submenu: [
      { icon: BarChart4, label: "Staff Appraisal Reports", href: "/director/reports/staff" },
      { icon: PieChart, label: "Department Summary", href: "/director/reports/department" },
      { icon: TrendingUp, label: "Low-Performing Units", href: "/director/reports/low-performing" },
    ]
  },
];

// Officer-specific sidebar
const sidebarItemsOfficer: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/officer-dashboard" },
  { icon: FileText, label: "Performance Contract", href: "/officer/performance-contract" },
  { icon: FileCheck, label: "Performance Review", href: "/officer/performance-review" },
  { icon: Target, label: "Appraisal", href: "/officer/appraisal" },
  { icon: AlertCircle, label: "PIP (Coming Soon)", href: "#", disabled: true },
  { icon: BarChart3, label: "Report", href: "/officer/report" },
];

const toolsItems: SidebarItem[] = [
  { 
    icon: UserCog, 
    label: "Profile",
    href: "/profile"
  },
  { 
    icon: HelpCircle, 
    label: "Help & Support",
    href: "/help"
  },
];

export const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<(number | string)[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if an item is active
  const isItemActive = (item: SidebarItem): boolean => {
    if (item.href) {
      return location.pathname === item.href;
    }
    if (item.submenu) {
      return item.submenu.some(subItem => subItem.href && location.pathname === subItem.href);
    }
    return false;
  };

  const toggleExpanded = (index: number | string) => {
    setExpandedItems(prev => {
      // If the item is already expanded, close it
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      
      // If the item is not expanded, close all others and open this one
      // Only allow one top-level menu to be expanded at a time
      const isTopLevel = typeof index === 'number';
      if (isTopLevel) {
        // Close all other top-level menus and open this one
        return [index];
      } else {
        // For nested menus, close all other nested menus at the same level
        const parentIndex = typeof index === 'string' ? parseInt(index.split('-')[0]) : -1;
        const otherNestedItems = prev.filter(i => 
          typeof i === 'string' && i.split('-')[0] === parentIndex.toString()
        );
        const otherTopLevelItems = prev.filter(i => typeof i === 'number');
        
        return [...otherTopLevelItems, ...otherNestedItems.filter(i => i !== index), index];
      }
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Fallback to local logout
      try { localStorage.removeItem('auth_user'); } catch {}
      navigate('/login');
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border/50 h-screen flex flex-col transition-all duration-300 flex-shrink-0 shadow-xl`}>
      {/* Logo/Header */}
      <div className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <img 
                src="/pms/tetfund-logo.jpg" 
                alt="TETFund" 
                className={`${isCollapsed ? 'h-12 w-12' : 'h-20 w-20'} object-contain bg-white rounded-lg p-0 dark:bg-gray-800 shadow-sm`} 
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/favicon.ico"; }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sidebar-foreground font-bold text-lg leading-tight">TETFund</span>
                <span className="text-sidebar-foreground/60 text-xs font-medium">PMS</span>
              </div>
            )}
          </div>
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent dark-mode-hover rounded-lg"
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-2 overflow-y-auto overflow-x-hidden dark-scrollbar">
        <nav className="space-y-1 px-2">
          {(user?.role === "DIRECTOR" ? sidebarItemsDirector : user?.role === "ASSISTANT_DIRECTOR" ? sidebarItemsAssistantDirector : user?.role === "OFFICER" ? sidebarItemsOfficer : sidebarItemsHR).map((item, index) => (
            <div key={index}>
              <Button
                variant="ghost"
                disabled={item.disabled}
                className={`w-full justify-start text-left h-12 text-base group relative rounded-xl ${
                  item.disabled
                    ? "text-sidebar-foreground/40 cursor-not-allowed opacity-50"
                    : isItemActive(item)
                    ? "bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 shadow-lg" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:shadow-md hover:scale-[1.02]"
                } transition-all duration-300 mx-1`}
                onClick={() => {
                  if (item.disabled) return;
                  if (item.hasSubmenu) {
                    toggleExpanded(index);
                  } else if (item.href) {
                    navigate(item.href);
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                  isItemActive(item) ? "text-green-600 dark:text-green-400" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                }`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.hasSubmenu && (
                      expandedItems.includes(index) ? 
                        <ChevronDown className="w-4 h-4 transition-transform duration-200" /> : 
                        <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                    )}
                  </>
                )}
              </Button>
              
              {/* Submenu */}
              {!isCollapsed && item.hasSubmenu && expandedItems.includes(index) && item.submenu && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <div key={subIndex}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-10 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 pl-4 group relative transition-all duration-300 hover:shadow-sm hover:scale-[1.01] rounded-lg mx-1"
                        onClick={() => {
                          if (subItem.hasSubmenu) {
                            toggleExpanded(`${index}-${subIndex}`);
                          } else if (subItem.href) {
                            navigate(subItem.href);
                          }
                        }}
                      >
                        <subItem.icon className="w-4 h-4 mr-3 text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors duration-200" />
                        <span className="flex-1 text-left">{subItem.label}</span>
                        {subItem.hasSubmenu && (
                          expandedItems.includes(`${index}-${subIndex}`) ? 
                            <ChevronDown className="w-3 h-3 transition-transform duration-200" /> : 
                            <ChevronRight className="w-3 h-3 transition-transform duration-200" />
                        )}
                      </Button>
                      
                      {/* Nested Submenu */}
                      {subItem.hasSubmenu && expandedItems.includes(`${index}-${subIndex}`) && subItem.submenu && (
                        <div className="ml-4 mt-1 space-y-1">
                          {subItem.submenu.map((nestedItem, nestedIndex) => (
                            <Button
                              key={nestedIndex}
                              variant="ghost"
                              className="w-full justify-start text-left h-8 text-xs text-sidebar-foreground hover:bg-sidebar-accent pl-2"
                              onClick={() => {
                                if (nestedItem.href) {
                                  navigate(nestedItem.href);
                                }
                              }}
                            >
                              <nestedItem.icon className="w-3 h-3 mr-2" />
                              <span>{nestedItem.label}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Tools Section */}
      {!isCollapsed && (
        <div className="px-2 py-2 border-t border-sidebar-border/50">
          <div className="text-xs font-semibold text-sidebar-foreground/60 mb-3 px-2 uppercase tracking-wider">Tools</div>
          <nav className="space-y-1">
            {toolsItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-10 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 group transition-all duration-300 hover:shadow-sm hover:scale-[1.01] rounded-lg mx-1"
                onClick={() => {
                  if (item.href) {
                    navigate(item.href);
                  }
                }}
              >
                <item.icon className="w-4 h-4 mr-3 text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors duration-200" />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      )}

      {/* Footer Section */}
      <div className="mt-auto border-t border-sidebar-border/50">
        {/* Dark Mode Toggle */}
        <div className="px-2 py-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left h-10 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 group transition-all duration-300 hover:shadow-sm hover:scale-[1.01] rounded-lg mx-1"
            onClick={toggleDarkMode}
            title={isCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 mr-3 text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors duration-200" />
            ) : (
              <Moon className="w-4 h-4 mr-3 text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors duration-200" />
            )}
            {!isCollapsed && <span className="flex-1 text-left">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </Button>
        </div>

        {/* Logout */}
        <div className="px-2 py-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left h-10 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group transition-all duration-300 hover:shadow-sm hover:scale-[1.01] rounded-lg mx-1"
            title={isCollapsed ? 'Logout' : undefined}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-3 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200" />
            {!isCollapsed && <span className="flex-1 text-left">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};