import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"

import QRCode from "qrcode"

import { invoke } from "@tauri-apps/api/core"

import { LogInIcon } from "lucide-react"

import { useState, useEffect, useRef, useContext } from "react"

import { LoginStatus, statusMap } from "../model/login"
import type { QRData, LoginResp } from "../model/login"
import { UserDispatchContext, UserContext } from "../hooks/UserContext"
import { type UserInfo } from "../model/user-info"


export function LoginDialog() {
    const [qrCode, setQrCode] = useState<string>("");
    const [qrKey, setQrKey] = useState<string>("");
    const [status, setStatus] = useState<LoginStatus>(LoginStatus.Loading);
    const [open, setOpen] = useState(false);

    const user = useContext(UserContext);
    const userDispatch = useContext(UserDispatchContext);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    function onRefresh() {
        const refresh = async () => {
            const qrData = await invoke<QRData>("get_login_qrdata");
            const qrCode = await QRCode.toDataURL(qrData.url, { width: 200, margin: 1 });
            setQrCode(qrCode);
            setQrKey(qrData.qrcode_key);
        }

        setStatus(LoginStatus.Loading);

        refresh().then(() => {
            setStatus(LoginStatus.WaitingForScan);
        });
    }

    useEffect(() => {
        if (status === LoginStatus.Loading && user && open) return;

        const poll = async () => {
            const res = await invoke<LoginResp>("check_login_status", { qrcodeKey: qrKey });
            if (res.status === 0) {
                setStatus(LoginStatus.Success);
                if (res.cookies) localStorage.setItem("cookies", res.cookies);
                const testUser = {
                    name: "1",
                    uid: "132132",
                    avatar: "/asserts/头像.jpg"
                } as UserInfo;
                userDispatch({ type: "SET_USER", payload: testUser });
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = null;
                return;
            }

            if (res.status === 86038) {
                setStatus(LoginStatus.Outdated);
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = null;
                return;
            }

            if (res.status === 86090) {
                setStatus(LoginStatus.WaitingForConfirm);
                return;
            }

            setStatus(LoginStatus.WaitingForScan);
        };

        timerRef.current = setInterval(poll, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [status]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={() => onRefresh()}>
                    <LogInIcon />登录
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm bg-white">
                <DialogHeader className="flex flex-col justify-center items-center ">
                    <DialogTitle className="my-3">哔哩哔哩登录</DialogTitle>
                    <DialogDescription className="text-center">
                        登录状态：<span className={statusMap[status].color}>{statusMap[status].status}</span>
                    </DialogDescription>
                    <img src={qrCode} className="w-[200px]" />

                    <Label className="text-gray-500">请使用哔哩哔哩App扫码登录</Label>
                </DialogHeader>
                <div className="flex justify-center gap-5">
                    <Button variant="outline" onClick={() => onRefresh()}>刷新</Button>
                    <DialogClose asChild>
                        <Button variant="outline">取消</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog >
    )
}
