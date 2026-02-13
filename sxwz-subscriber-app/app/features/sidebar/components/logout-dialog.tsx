
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { DropdownMenuItem } from "~/components/ui/dropdown-menu"
import { Label } from "~/components/ui/label"

import { LogOutIcon } from "lucide-react"

import { type UserInfo } from "../model/user-info"
import { useContext } from "react"
import { UserDispatchContext } from "../hooks/UserContext"


export function LogoutDialog() {

    const userDispatch = useContext(UserDispatchContext);
    function onLogout() {
        userDispatch({ type: "CLEAR_USER" });
    }
    // const qrcode = await invoke<QRData>("get_login_qrcode");

    // const dataUrl = await QRCode.toDataURL(qrcode.url, { width: 240, margin: 1 });

    return (
        <DropdownMenuItem onClick={() => onLogout()}>
            <LogOutIcon /> 注销
        </DropdownMenuItem>
    )
}