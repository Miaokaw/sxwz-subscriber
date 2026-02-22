import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"

import { Separator } from "~/components/ui/separator"

import { Badge } from "~/components/ui/badge";

import { open } from "@tauri-apps/plugin-shell";

import { type SubInfo } from "../model/sub-info"
import { ChartColumnIcon, ExternalLinkIcon, FlameIcon, HeartIcon, Loader2Icon, ShipIcon, StarIcon, TrashIcon, UserIcon, UsersIcon } from "lucide-react"

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { loadImageCached } from "~/lib/utils";

export function SubCard({ info }: { info: SubInfo }) {

    const [coverBlobUrl, setCoverBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        loadImageCached(info.cover)
            .then((u) => {
                if (!cancelled) setCoverBlobUrl(u);
            })
            .catch(() => {
                if (!cancelled) setCoverBlobUrl(null);
            });

        return () => {
            cancelled = true;
        };
    }, [info.cover]);

    return (
        <Card onDoubleClick={() => open(`https://live.bilibili.com/${info.roomId}`)}
            className="relative mx-auto w-full max-w-xs max-h-sm pt-0 rounded-lg my-1 transition-all duration-300 ease-in-out shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-105">
            <div className="absolute right-2 top-2 z-40">
                <Badge
                    className={
                        (info.isLive ? "bg-green-500" : "bg-gray-500")
                    }
                >
                    {info.isLive ? "直播中" : "未开播"}
                </ Badge>
            </div>
            <div className="absolute inset-0 z-30 aspect-video" />
            {coverBlobUrl ? (
                <img
                    src={coverBlobUrl}
                    className="relative z-20 aspect-video w-full object-cover rounded-t-lg"
                />) :
                (<div className="relative aspect-video w-full bg-muted">
                    <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
                )
            }
            <CardHeader >
                <CardTitle>{info.title}</CardTitle>
                <CardDescription className="flex flex-col gap-1">
                    <span className="flex items-center gap-2">
                        <UserIcon size={16} className="text-muted-foreground" />{info.name}
                        <p className="text-gray-400 text-sm">({info.roomId})</p>
                    </span>
                    <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                            <FlameIcon size={16} className="text-red-500 fill-red-500" />
                            {info.popularity}
                        </span>
                        <span className="flex items-center gap-2">
                            <UsersIcon size={16} className="text-blue-500" />
                            {info.users}
                        </span>
                    </div>
                    <span className="flex items-center gap-2">
                        <ChartColumnIcon size={16} className="text-muted-foreground" />
                        {info.maxUsers}
                    </span>
                    <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                            <HeartIcon size={16} className="text-pink-500" />
                            {info.fans}
                        </span>
                        <span className="flex items-center gap-2">
                            <ShipIcon size={16} className="text-blue-500" />
                            {info.captains}
                        </span>
                    </div>
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardFooter onDoubleClickCapture={(e) => e.stopPropagation()}
                className="flex items-center justify-between h-0 px-1"
            >
                <Button variant="ghost" size="sm" >
                    <TrashIcon size={16} className="text-red-500" />
                </Button >

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <StarIcon size={16} className={`${info.isTop ? "text-yellow-300 fill-yellow-300" : "text-yellow-300"}`} />
                    </Button >
                    <Button variant="ghost"
                        size="sm"
                        onClick={() => open(`https://live.bilibili.com/${info.roomId}`)}
                    >
                        <ExternalLinkIcon size={16} className="text-blue-500" />
                    </Button >
                </div>
            </CardFooter>
        </Card >
    )
}
