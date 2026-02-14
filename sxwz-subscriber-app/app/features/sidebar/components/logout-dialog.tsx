
import { DropdownMenuItem } from "~/components/ui/dropdown-menu"

import { LogOutIcon } from "lucide-react"

import { useContext } from "react"
import { invoke } from "@tauri-apps/api/core"

import { UserDispatchContext } from "../hooks/use-user-context"


export function LogoutDialog() {

    const userDispatch = useContext(UserDispatchContext);
    function onLogout() {
        userDispatch({ type: "CLEAR_USER" });
        invoke("logout");
    }

    return (
        <DropdownMenuItem onClick={() => onLogout()}>
            <LogOutIcon /> 注销
        </DropdownMenuItem>
    )
}