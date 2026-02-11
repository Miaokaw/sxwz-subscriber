import { navItems } from "../model/nav-items"
import { useEffect, useState } from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "~/components/ui/sidebar"

import { NavUser } from "./nav-user"
import { type UserInfo } from "../model/user-info"

import { NavLink } from "react-router"

export function AppSidebar() {
    const [activeItem, setActiveItem] = useState<typeof navItems.items[0] | undefined>(undefined);

    useEffect(() => {
        setActiveItem(navItems.items.find((item) => item.title === navItems.homeTitle))
    }, [])

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <NavUser />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.title === activeItem?.title}
                                        onClick={() => setActiveItem(item)}
                                    >
                                        <NavLink to={item.url} >
                                            <item.icon />
                                            {item.title}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
