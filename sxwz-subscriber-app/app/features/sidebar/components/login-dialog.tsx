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

import { LoginStatus, statusMap, type LoginStatusPostData, type QRCodeData, type UserInfoData } from "../model/login"
import { UserDispatchContext } from "../hooks/use-user-context"


export function LoginDialog() {
    const [qrCode, setQrCode] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<LoginStatus>(LoginStatus.Loading);
    const [open, setOpen] = useState(false);

    const userDispatch = useContext(UserDispatchContext);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const qrcodeKey = useRef<string>("");

    function onRefresh() {
        const refresh = async () => {
            const data = await invoke<QRCodeData>("get_qrcode_url");
            const qrCode = await QRCode.toDataURL(data.url, { width: 200, margin: 1 });
            setQrCode(qrCode);
            qrcodeKey.current = data.qrcode_key;
        }

        setStatus(LoginStatus.Loading);

        refresh().then(() => {
            setStatus(LoginStatus.WaitingForScan);
        });
    }

    useEffect(() => {
        if (status === LoginStatus.Loading && open && qrcodeKey) return;

        const poll = async () => {


            try {
                const data = await invoke<LoginStatusPostData>("get_qrcode_status", { qrcodeKey: qrcodeKey });

                if (data.code === 0) {
                    setStatus(LoginStatus.Success);

                    const userData = await invoke<UserInfoData>("get_user_info", { sessData: data.sess_data });

                    userDispatch({ type: "SET_USER", payload: userData });
                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = null;
                    return;
                }

                if (data.code === 86090) {
                    setStatus(LoginStatus.WaitingForConfirm);
                    return;
                }

                if (data.code === 86038) {
                    setStatus(LoginStatus.Outdated);
                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = null;
                    return;
                }

                setStatus(LoginStatus.WaitingForScan);
            }
            catch (e) {
                console.log("Error polling QR code status:", e);
            }
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
