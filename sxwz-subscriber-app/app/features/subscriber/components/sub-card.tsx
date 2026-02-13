import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"

import { Separator } from "~/components/ui/separator"

import { Badge } from "~/components/ui/badge";

import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-shell";

import { type SubInfo } from "../model/sub-info"
import { ChartColumnIcon, ExternalLinkIcon, FlameIcon, HeartIcon, Loader2Icon, ShipIcon, StarIcon, TrashIcon, User, UserIcon, UsersIcon } from "lucide-react"

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { loadImage } from "~/lib/utils";

export function SubCard({ info }: { info: SubInfo }) {

    const [coverBlobUrl, setCoverBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        loadImage(info.cover).then(setCoverBlobUrl);
    }, [info.cover]);

    return (
        <Card onDoubleClick={() => open(`https://live.bilibili.com/${info.roomId}`)}
            className="relative mx-auto w-full max-w-sm max-h-sm pt-0 rounded-lg my-1 shadow-md hover:shadow-lg ">
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
                    <span className="flex items-center gap-1">
                        <UserIcon size={16} />{info.name}
                        <p className="text-gray-400">({info.roomId})</p>
                    </span>
                    <div className="flex items-center gap-1 justify-between">
                        <span className="flex items-center gap-1">
                            <FlameIcon size={16} color="red" />
                            {info.popularity}
                        </span>
                        <span className="flex items-center gap-1">
                            <UsersIcon size={16} color="blue" />
                            {info.users}
                        </span>
                    </div>
                    <span className="flex items-center gap-1">
                        <ChartColumnIcon size={16} />{info.maxUsers}
                    </span>
                    <div className="flex items-center gap-1 justify-between">
                        <span className="flex items-center gap-1">
                            <HeartIcon size={16} color="pink" />
                            {info.fans}
                        </span>
                        <span className="flex items-center gap-1">
                            <ShipIcon size={16} color="blue" />
                            {info.captains}
                        </span>
                    </div>
                </CardDescription>
                <Separator />
            </CardHeader>
            <CardFooter onDoubleClickCapture={(e) => e.stopPropagation()}
                className="flex items-center gap-1 justify-between">
                <Button variant="ghost" size="icon-sm" className="flex items-center gap-1">
                    <TrashIcon size={16} />
                </Button >

                <div className="flex items-center gap-1 justify-between">
                    <Button variant="ghost" size="icon-sm" className="flex items-center gap-1">
                        <StarIcon size={16} color="#ffb900" fill={info.isTop ? "#ffb900" : "white"} />
                    </Button >
                    <Button variant="ghost"
                        size="icon-sm"
                        className="flex items-center gap-1"
                        onClick={() => open(`https://live.bilibili.com/${info.roomId}`)}
                    >
                        <ExternalLinkIcon size={16} color="blue" />
                    </Button >
                </div>
            </CardFooter>
        </Card >
    )
}
