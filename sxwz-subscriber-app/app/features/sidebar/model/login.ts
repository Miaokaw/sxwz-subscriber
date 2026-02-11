
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
    [LoginStatus.WaitingForConfirm]: { status: "扫码成功，等待确认", color: "text-green-500" },
    [LoginStatus.Success]: { status: "登录成功", color: "text-green-500" },
    [LoginStatus.Outdated]: { status: "二维码过期", color: "text-red-500" },
} as const satisfies Record<LoginStatus, { status: string; color: string }>;

export interface QRData {
    qrcode_key: string,
    url: string,

}

export interface LoginResp {
    status: number;
    message: string;
    cookies?: string;
}