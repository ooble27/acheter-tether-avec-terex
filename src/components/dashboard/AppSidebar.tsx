import { useState } from "react"
import {
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Package,
  Settings,
  Shield,
  User,
  Users,
  HelpCircle,
  ArrowUpDown,
  History,
  ShoppingCart
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { supabase } from '@/integrations/supabase/client'
import { useUserRole } from '@/hooks/useUserRole'

interface AppSidebarProps {
  user: { email: string; name: string }
  activeSection: string
  onSectionChange: (section: string) => void
}

export function AppSidebar({ user, activeSection, onSectionChange }: AppSidebarProps) {
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const { isAdmin, isKYCReviewer } = useUserRole()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Accueil",
        url: "#",
        icon: Home,
        onClick: () => onSectionChange('home'),
        isActive: activeSection === 'home'
      },
      {
        title: "Acheter USDT",
        url: "#",
        icon: CreditCard,
        onClick: () => onSectionChange('buy'),
        isActive: activeSection === 'buy'
      },
      {
        title: "Vendre USDT",
        url: "#",
        icon: ArrowUpDown,
        onClick: () => onSectionChange('sell'),
        isActive: activeSection === 'sell'
      },
      {
        title: "Virement international",
        url: "#",
        icon: Package,
        onClick: () => onSectionChange('transfer'),
        isActive: activeSection === 'transfer'
      },
      {
        title: "Historique",
        url: "#",
        icon: History,
        onClick: () => onSectionChange('history'),
        isActive: activeSection === 'history'
      },
      {
        title: "KYC",
        url: "#",
        icon: Shield,
        onClick: () => onSectionChange('kyc'),
        isActive: activeSection === 'kyc'
      },
      {
        title: "Profil",
        url: "#",
        icon: User,
        onClick: () => onSectionChange('profile'),
        isActive: activeSection === 'profile'
      },
      {
        title: "FAQ",
        url: "#",
        icon: HelpCircle,
        onClick: () => onSectionChange('faq'),
        isActive: activeSection === 'faq'
      },
    ],
    adminItems: [
      {
        title: "Vérification KYC",
        icon: Users,
        onClick: () => onSectionChange('admin-kyc'),
        isActive: activeSection === 'admin-kyc'
      },
      {
        title: "Gestion des commandes",
        icon: ShoppingCart,
        onClick: () => onSectionChange('admin-orders'),
        isActive: activeSection === 'admin-orders'
      }
    ]
  }

  return (
    <Sidebar variant="inset" className="bg-terex-darker border-r border-terex-gray">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg bg-terex-accent text-white">
                      {data.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-white">{data.user.name}</span>
                    <span className="truncate text-xs text-gray-400">{data.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-gray-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-terex-card border-terex-border"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg bg-terex-accent text-white">
                        {data.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-white">{data.user.name}</span>
                      <span className="truncate text-xs text-gray-400">{data.user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-terex-border" />
                <DropdownMenuItem className="text-gray-300 hover:bg-terex-gray focus:bg-terex-gray">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-terex-gray focus:bg-terex-gray">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-terex-border" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-terex-gray focus:bg-terex-gray"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={item.onClick}
                  className={`text-gray-300 hover:bg-terex-gray hover:text-white ${
                    item.isActive ? 'bg-terex-accent text-white' : ''
                  }`}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {(isAdmin || isKYCReviewer) && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">Administration</SidebarGroupLabel>
            <SidebarMenu>
              <Collapsible
                open={isAdminOpen}
                onOpenChange={setIsAdminOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip="Administration"
                      className="text-gray-300 hover:bg-terex-gray hover:text-white"
                    >
                      <Shield />
                      <span>Administration</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {data.adminItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild
                            onClick={subItem.onClick}
                            className={`text-gray-300 hover:bg-terex-gray hover:text-white ${
                              subItem.isActive ? 'bg-terex-accent text-white' : ''
                            }`}
                          >
                            <div className="flex items-center cursor-pointer">
                              <subItem.icon className="mr-2 h-4 w-4" />
                              <span>{subItem.title}</span>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  )
}
