import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { IdCardIcon } from "lucide-react";
import { useState, useEffect } from "react";

import { type UserInfo } from "../model/user-info"

import { loadImage } from "~/lib/utils"

export function User({ user }: { user: UserInfo | null }) {
    const safeUser = user || { name: "未登录", uid: "N/A", avatar: "" };

    const [avatarBlobUrl, setAvatarBlobUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!safeUser.avatar) {
            setAvatarBlobUrl(undefined);
            return;
        }
        loadImage(safeUser.avatar).then(setAvatarBlobUrl);
    }, [safeUser.avatar]);

    return (
        <div className="flex items-center gap-2 text-left text-sm py-2 mx-1">
            < Avatar className={`h-8 w-8 rounded-full ${user ? "" : "grayscale opacity-70"}`} >
                <AvatarImage src={avatarBlobUrl} alt={safeUser.name} />
                <AvatarFallback className="rounded-lg">U</AvatarFallback>
            </Avatar >
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{safeUser.name}</span>
                <span className="text-muted-foreground truncate text-xs flex gap-0.5">
                    <IdCardIcon size={16} />{safeUser.uid}
                </span>
            </div>
        </div >
    );
}