
export enum LoginStatus {
    Loading = 0,
    WaitingForScan = 1,
    WaitingForConfirm = 2,
    Success = 3,
    Outdated = 4,
}

export const statusMap = {
    [LoginStatus.Loading]: { status: "加载中", color: "text-gray-500" },
    [LoginStatus.WaitingForScan]: { status: "等待扫码", color: "text-yellow-500" },
    [LoginStatus.WaitingForConfirm]: { status: "扫码成功，等待确认", color: "text-green-300" },
    [LoginStatus.Success]: { status: "登录成功", color: "text-green-500" },
    [LoginStatus.Outdated]: { status: "二维码过期", color: "text-red-500" },
} as const satisfies Record<LoginStatus, { status: string; color: string }>;

interface Res {
    code: number;
    message: string;
    ttl: number;
}

export interface LoginQRCodeRes extends Res {
    data: {
        url: string
        qrcode_key: string;
    }
}

export interface LoginQRCodeStatusRes extends Res {
    data: {
        url: string;
        refresh_token: string,
        timestamp: number,
        code: number,
        message: string,
    }
}


export interface UserInfoRes extends Res {
    data: {
        mid: number;
        name: string;
        face: string
    }
}

export interface UserInfo {
    mid: number;
    name: string;
    face: string;
}

export const biliHeader = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Referer': 'https://www.bilibili.com/',
    'Origin': 'https://www.bilibili.com',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

export function getBiliLoginedHeader(Session: string) {
    return {
        ...biliHeader,
        'Cookie': `SESSDATA=${Session}`,
    }
}