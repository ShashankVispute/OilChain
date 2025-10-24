import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  TrendingUp,
  Cpu,
  FileText,
  Globe,
  Settings,
  Leaf,
} from "lucide-react";
import { Link, useLocation } from "wouter";
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
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: ShoppingCart,
  },
  {
    title: "My Listings",
    url: "/my-listings",
    icon: Package,
  },
  {
    title: "AI Analytics",
    url: "/analytics",
    icon: TrendingUp,
  },
  {
    title: "IoT Devices",
    url: "/iot-devices",
    icon: Cpu,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: FileText,
  },
  {
    title: "Export Opportunities",
    url: "/export",
    icon: Globe,
  },
  {
    title: "Carbon Credits",
    url: "/carbon",
    icon: Leaf,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2" data-testid="link-logo">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-sidebar-foreground">OILCHAIN360</h1>
            <p className="text-xs text-muted-foreground">Smart Marketplace</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
