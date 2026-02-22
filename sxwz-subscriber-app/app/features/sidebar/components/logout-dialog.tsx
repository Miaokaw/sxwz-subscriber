
import { DropdownMenuItem } from "~/components/ui/dropdown-menu"

import { LogOutIcon } from "lucide-react"

import { useContext } from "react"

import { UserDispatchContext } from "../hooks/use-user-context"


export function LogoutDialog() {

    const userDispatch = useContext(UserDispatchContext);
    function onLogout() {
        userDispatch({ type: "CLEAR_USER" });
    }

    return (
        <DropdownMenuItem onClick={() => onLogout()}>
            <LogOutIcon /> 注销
        </DropdownMenuItem>
    )
}