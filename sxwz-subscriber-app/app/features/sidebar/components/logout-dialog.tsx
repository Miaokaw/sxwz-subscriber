
import { DropdownMenuItem } from "~/components/ui/dropdown-menu"

import { LogOutIcon } from "lucide-react"

import { useContext } from "react"

import { useUserStore } from "../hooks/use-user-store";

export function LogoutDialog() {
    const clearUser = useUserStore((state) => state.clearUser);

    function onLogout() {
        clearUser();
    }

    return (
        <DropdownMenuItem onClick={() => onLogout()}>
            <LogOutIcon /> 注销
        </DropdownMenuItem>
    )
}