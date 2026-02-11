
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

export function LogoutDialog() {


    // const qrcode = await invoke<QRData>("get_login_qrcode");

    // const dataUrl = await QRCode.toDataURL(qrcode.url, { width: 240, margin: 1 });

    return (
        <DropdownMenuItem>
            <LogOutIcon /> 注销
        </DropdownMenuItem>

    )
}