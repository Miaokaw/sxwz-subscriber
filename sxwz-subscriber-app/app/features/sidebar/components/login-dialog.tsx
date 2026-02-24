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

import { invoke } from "@tauri-apps/api/core";
import { fetch } from "@tauri-apps/plugin-http"
import { error, info } from "@tauri-apps/plugin-log"

import { LogInIcon } from "lucide-react"

import { useState, useEffect, useRef, useContext } from "react"

import type { LoginQRCodeRes, LoginQRCodeStatusRes, UserInfoRes, UserInfo } from "../model/login";
import { LoginStatus, statusMap } from "../model/login"
import { biliHeader, getBiliLoginedHeader } from "~/lib/utils";
import { useUserStore } from "~/hooks/use-user-store";


export function LoginDialog() {
    const [qrCode, setQrCode] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<LoginStatus>(LoginStatus.Loading);
    const [open, setOpen] = useState(false);

    const setUser = useUserStore((state) => state.setUser);
    const saveCookie = useUserStore((state) => state.saveCookie);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const qrcodeKey = useRef<string>("");

    async function getQRCodeURL() {
        const response = await fetch("https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
            {
                method: "GET",
                headers: biliHeader,
            });
        if (response.status !== 200) {
            error(`Failed to fetch QR code URL, status: ${response.status}`);
            throw (new Error(`Failed to fetch QR code URL, status: ${response.status}`));
        }

        const res: LoginQRCodeRes = await response.json();
        if (res.code !== 0) {
            error(`Failed to fetch QR code URL, code: ${res.code}, message: ${res.message}`);
            throw (new Error(`Failed to fetch QR code URL, code: ${res.code}, message: ${res.message}`));
        }

        info("Fetched QR code successfully");
        info(`QR code URL: ${res.data.url}, QR code key: ${res.data.qrcode_key}`)

        const qrCodeDataUrl = await QRCode.toDataURL(res.data.url, { width: 200, margin: 1 });
        setQrCode(qrCodeDataUrl);
        qrcodeKey.current = res.data.qrcode_key;
    }

    async function getQRCodeStatus() {
        const response = await
            fetch(`https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${qrcodeKey.current}`, {
                method: "GET",
                headers: biliHeader,
            });

        if (response.status !== 200) {
            error(`Failed to fetch QR code status, status: ${response.status}`);
            return -1;
        }

        const res: LoginQRCodeStatusRes = await response.json();
        if (res.code !== 0) {
            error(`Failed to fetch QR code status, code: ${res.code}, message: ${res.message}`);
            return -1;
        }

        info("Fetched QR code status successfully");
        info(`QR code status; message: ${res.data.message}, code: ${res.data.code}`);
        if (res.data.code === 0) {
            try {
                const url = new URL(res.data.url);
                const params = url.searchParams;
                const sessData = params.get("SESSDATA");

                if (!sessData) {
                    error(`SESSDATA not found in URL: ${res.data.url}`);
                    return 86038;
                }
                saveCookie(sessData);
            } catch {
                error(`Failed to save SESSDATA from URL: ${res.data.url}`);
                return 86038;
            }
        }

        return res.data.code;
    }

    async function onRefresh() {

        const refresh = async () => {
            await getQRCodeURL();
        }

        setStatus(LoginStatus.Loading);

        try {
            await refresh();
        } catch (e) {
            return;
        }
        setStatus(LoginStatus.WaitingForScan);
    }

    async function getUserInfo() {
        const biliSessData = useUserStore.getState().SESSDATA;
        if (!biliSessData) {
            error("No SESSDATA found in localStorage");
            throw new Error("No SESSDATA found");
        }

        const response = await fetch("https://api.bilibili.com/x/space/myinfo", {
            method: "GET",
            headers: getBiliLoginedHeader(biliSessData),
        });

        if (response.status !== 200) {
            error(`Failed to fetch user info, status: ${response.status}`);
            throw new Error(`Failed to fetch user info, status: ${response.status}`);
        }

        const res: UserInfoRes = await response.json();
        if (res.code !== 0) {
            error(`Failed to fetch user info, code: ${res.code}, message: ${res.message}`);
            throw new Error(`Failed to fetch user info, code: ${res.code}, message: ${res.message}`);
        }

        info("Fetched user info successfully");
        info(`User info: mid: ${res.data.mid}, name: ${res.data.name}, face: ${res.data.face}`);

        return {
            mid: res.data.mid,
            name: res.data.name,
            face: res.data.face,
        } as UserInfo;
    }

    useEffect(() => {
        if (status === LoginStatus.Loading && open && qrcodeKey) return;

        const poll = async () => {
            const code = await getQRCodeStatus();

            if (code === 0) {
                setStatus(LoginStatus.Success);

                const userInfo = await getUserInfo();

                setUser(userInfo);
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = null;
                return;
            }

            if (code === 86090) {
                setStatus(LoginStatus.WaitingForConfirm);
                return;
            }

            if (code === 86038) {
                setStatus(LoginStatus.Outdated);
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = null;
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
