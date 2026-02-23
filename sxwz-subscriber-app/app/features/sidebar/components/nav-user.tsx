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

import { useContext, useEffect } from "react"

import { info, error } from "@tauri-apps/plugin-log"
import { Store } from "@tauri-apps/plugin-store"

import { User } from "./user"
import { LoginDialog } from "./login-dialog"
import { LogoutDialog } from "./logout-dialog"
import type { UserInfo } from "../model/login"
import { useUserStore } from "../hooks/use-user-store"


export function NavUser() {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        Store.load("user.bin").then((store) => {
            store.get("user").then((userData) => {
                info(`Loaded user from store: ${(userData as UserInfo)?.name} (mid: ${(userData as UserInfo)?.mid})`);
                if (userData === null) {
                    info("No user data found in store.");
                    return;
                }
                setUser(userData as UserInfo);
            });
        }).catch((e) => {
            error(`Failed to load user from store: ${e}`);
        });
    }, []);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-0 font-normal"
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
    )
}