
import { DropdownMenuItem } from "~/components/ui/dropdown-menu"

import { LogOutIcon } from "lucide-react"

import { useUserStore } from "../../../hooks/use-user-store";

export function LogoutDialog() {
    const clearUser = useUserStore((state) => state.clearUser);
    const deleteCookie = useUserStore((state) => state.deleteCookie);

    function onLogout() {
        clearUser();
        deleteCookie();
    }

    return (
        <DropdownMenuItem onClick={() => onLogout()}>
            <LogOutIcon /> 注销
        </DropdownMenuItem>
    )
}