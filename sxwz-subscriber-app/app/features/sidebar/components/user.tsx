import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { IdCardIcon } from "lucide-react";
import { useState, useEffect } from "react";

import { loadImageCached } from "~/lib/utils"
import type { UserInfoData } from "../model/login";

export function User({ user }: { user: UserInfoData | null }) {
    const safeUser = user || { name: "未登录", mid: 0, face: "" } as UserInfoData;

    const [avatarBlobUrl, setAvatarBlobUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!safeUser.face) {
            setAvatarBlobUrl(undefined);
            return;
        }
        loadImageCached(safeUser.face).then(setAvatarBlobUrl);
    }, [safeUser.face]);

    return (
        <div className="flex items-center gap-2 text-left text-sm py-2 mx-1 ">
            < Avatar className={`h-8 w-8 rounded-full ${user ? "" : "grayscale opacity-70"}`} >
                <AvatarImage src={avatarBlobUrl} alt={safeUser.name} />
                <AvatarFallback className="rounded-lg">U</AvatarFallback>
            </Avatar >
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{safeUser.name}</span>
                <span className="text-muted-foreground truncate text-xs flex gap-0.5">
                    <IdCardIcon size={16} />{safeUser.mid}
                </span>
            </div>
        </div >
    );
}