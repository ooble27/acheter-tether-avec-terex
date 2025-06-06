
import { CreditCard, Wallet, History, User, Headphones, Building, BookOpen, FileCheck, Send } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const menuItems = [
    { id: "home", title: "Accueil", icon: Building },
    { id: "buy", title: "Acheter USDT", icon: CreditCard },
    { id: "sell", title: "Vendre USDT", icon: Wallet },
    { id: "transfer", title: "Transfert International", icon: Send },
    { id: "terex-pay", title: "Terex Pay", icon: CreditCard },
    { id: "history", title: "Historique", icon: History },
    { id: "kyc", title: "Vérification KYC", icon: FileCheck },
    { id: "profile", title: "Profil", icon: User },
    { id: "faq", title: "FAQ", icon: BookOpen },
    { id: "support", title: "Support", icon: Headphones },
  ]

  return (
    <Sidebar className="bg-gray-900 border-r border-gray-800">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 px-2 py-2">
            Terex Exchange
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 ${
                      activeTab === item.id ? 'bg-terex-orange text-white' : ''
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Terex Exchange
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
