import { SettingsIcon, UserCircleIcon } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar"

import { useContext, useState } from "react"

import { User } from "./user"
import { LoginDialog } from "./login-dialog"
import { LogoutDialog } from "./logout-dialog"

import { UserContext, UserProvider } from "../hooks/UserContext"



export function NavUser() {
    const user = useContext(UserContext);
    return (
        <UserProvider>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <User user={user} />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-36 rounded-lg"
                            side="right"
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <User user={user} />
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="ml-0.5">
                                    <UserCircleIcon />主页
                                </DropdownMenuItem>
                                <DropdownMenuItem className="ml-0.5">
                                    <SettingsIcon />设置
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            {user ? <LogoutDialog /> : <LoginDialog />}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu >
        </UserProvider>
    )
}