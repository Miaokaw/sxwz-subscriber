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

import type { RoomInfo, Sub, RoomInfoRes } from "../model/sub-info"
import { ExternalLinkIcon, EyeIcon, FlameIcon, HeartIcon, Loader2Icon, ShipIcon, StarIcon, ThumbsUpIcon, TrashIcon, UserIcon, UsersIcon, UserStarIcon } from "lucide-react"

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { biliHeader, loadImageCached } from "~/lib/utils";
import { error, info } from "@tauri-apps/plugin-log";
import { fetch } from "@tauri-apps/plugin-http"
import { useSubsStore } from "~/hooks/use-subs-store";
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

export function SubCard({ sub }: { sub: Sub }) {

    const [coverBlobUrl, setCoverBlobUrl] = useState<string | null>(null);
    const [liveTime, setLiveTime] = useState<string>("00:00:00");
    const [roomInfo, setRoomInfo] = useState<RoomInfo>({} as RoomInfo);



    const setSubs = useSubsStore(state => state.setSubs);
    const saveSubs = useSubsStore(state => state.saveSubs);

    const onClickDelete = (roomId: number) => {
        const prevSubs = useSubsStore.getState().subs;
        const newSubs = prevSubs.filter(s => s.roomId !== roomId);
        setSubs(newSubs);
        saveSubs();
    }

    const onClickStar = (roomId: number) => {
        const prevSubs = useSubsStore.getState().subs;
        const newSubs = prevSubs.map(s => s.roomId === roomId ? { ...s, isTop: !s.isTop } : s);
        setSubs(newSubs);
    }

    function getNumberStr(num: number): string {
        if (num > 10000) {
            return `${(num / 10000).toFixed(1)}万`;
        }
        return `${num}`;
    }


    useEffect(() => {
        async function getRoomInfo(roomId: string): Promise<RoomInfo> {
            const response = await fetch(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomId}`, {
                method: "GET",
                headers: biliHeader,
            });


            if (response.status !== 200) {
                error(`Failed to fetch room info for room ID: ${roomId}, status: ${response.status}`);
                return {} as RoomInfo;
            }

            const res: RoomInfoRes = await response.json();
            if (res.code !== 0) {
                error(`Failed to fetch room info, code: ${res.code}, message: ${res.message}`);
                return {} as RoomInfo;
            }
            const isLive = res.data.room_info.live_status === 1;
            if (isLive !== sub.isLive) {
                info(`Live status changed for room ID: ${roomId}, was: ${sub.isLive}, now: ${isLive}`);
                const prevSubs = useSubsStore.getState().subs;
                const newSubs = prevSubs.map(s => s.roomId === parseInt(roomId) ? { ...s, isLive } : s);
                useSubsStore.getState().setSubs(newSubs);

                let permissionGranted = await isPermissionGranted();
                if (!permissionGranted) {
                    info("Notification permission not granted, requesting permission...");
                    const permission = await requestPermission();
                    permissionGranted = permission === 'granted';
                }
                if (permissionGranted) {
                    info(`Sending notification for room ID: ${roomId}, live status: ${isLive}`);
                    sendNotification({
                        title: res.data.room_info.title,
                        body: `${res.data.anchor_info.base_info.uname} ${isLive ? "开播了！" : `下播了！直播时长 ${liveTime}`}`,
                    });
                }
            }

            const roomInfo = {
                name: res.data.anchor_info.base_info.uname,
                roomId: res.data.room_info.room_id,
                uid: res.data.room_info.uid,
                title: res.data.room_info.title,
                liveStartTime: res.data.room_info.live_start_time,
                cover: res.data.room_info.cover,
                keyframe: res.data.room_info.keyframe,
                popularity: res.data.popularity.popularity,
                users: res.data.room_rank_info.user_rank_entry.user_contribution_rank_entry.count,
                watched: res.data.watched_show.num,
                fansclub: res.data.anchor_info.medal_info.fansclub,
                likes: res.data.like_info_v3.total_likes,
                attention: res.data.anchor_info.relation_info.attention,
                captains: res.data.guard_info.count,
            } as RoomInfo;
            return roomInfo;
        }

        async function fetchRoomInfo(roomId: number) {
            const roomInfo = await getRoomInfo(roomId.toString());
            setRoomInfo(roomInfo);
        }
        let intervalId: NodeJS.Timeout;

        fetchRoomInfo(sub.roomId);

        // 根据直播状态设置定时器
        if (sub.isLive) {
            intervalId = setInterval(() => {
                fetchRoomInfo(sub.roomId);
            }, 5000); // 每 5 秒刷新一次
        } else {
            intervalId = setInterval(() => {
                fetchRoomInfo(sub.roomId);
            }, 20000); // 每 20 秒刷新一次
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [sub.isLive])

    useEffect(() => {
        const formatDuration = (seconds: number) => {
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }

        let interval: NodeJS.Timeout;

        if (sub.isLive) {
            interval = setInterval(() => {
                const newLiveDuration = Math.floor(Date.now() / 1000) - roomInfo.liveStartTime;
                setLiveTime(formatDuration(newLiveDuration));
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [sub.isLive, roomInfo.liveStartTime]);

    useEffect(() => {
        let cancelled = false;

        loadImageCached(roomInfo.cover)
            .then((u) => {
                if (!cancelled) setCoverBlobUrl(u);
            })
            .catch(() => {
                if (!cancelled) setCoverBlobUrl(null);
            });

        return () => {
            cancelled = true;
        };
    }, [roomInfo.cover]);



    return (
        <Card onDoubleClick={() => open(`https://live.bilibili.com/${sub.roomId}`)}
            className="relative mx-auto w-full max-w-xs max-h-sm pt-0 rounded-lg my-1 transition-all duration-300 ease-in-out shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-105">
            <div className="absolute right-2 top-2 z-40">
                <Badge
                    className={
                        (sub.isLive ? "bg-green-500" : "bg-gray-500")
                    }
                >
                    {sub.isLive ? `直播中 ${liveTime}` : "未开播"}
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
                <CardTitle>{roomInfo.title}</CardTitle>
                <CardDescription className="flex flex-col gap-1">
                    <span className="flex items-center gap-2">
                        <UserIcon size={16} className="text-muted-foreground" />{roomInfo.name}
                        <p className="text-gray-400 text-sm">({sub.roomId})</p>
                    </span>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <FlameIcon size={16} className="text-red-500 fill-red-500" />
                            {getNumberStr(roomInfo.popularity)}
                        </span>
                        <span className="flex items-center gap-2">
                            <EyeIcon size={16} className="text-muted-foreground" />
                            {getNumberStr(roomInfo.watched)}
                        </span>
                        <span className="flex items-center gap-2">
                            <UsersIcon size={16} className="text-blue-500" />
                            {roomInfo.users}
                            {roomInfo.users === 9999 ? "+" : ""}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                            <ThumbsUpIcon size={16} className="text-yellow-500" />
                            {getNumberStr(roomInfo.likes)}
                        </span>
                        <span className="flex items-center gap-2">
                            <UserStarIcon size={16} className="text-blue-500" />
                            {roomInfo.fansclub}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                            <HeartIcon size={16} className="text-pink-500" />
                            {getNumberStr(roomInfo.attention)}
                        </span>
                        <span className="flex items-center gap-2">
                            <ShipIcon size={16} className="text-blue-500" />
                            {roomInfo.captains}
                        </span>
                    </div>
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardFooter onDoubleClickCapture={(e) => e.stopPropagation()}
                className="flex items-center justify-between h-0 px-1"
            >
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onClickDelete(sub.roomId)}
                >
                    <TrashIcon size={16} className="text-red-500" />
                </Button >

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onClickStar(sub.roomId)}
                    >
                        <StarIcon size={16} className={`${sub.isTop ? "text-yellow-300 fill-yellow-300" : "text-yellow-300"}`} />
                    </Button >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => open(`https://live.bilibili.com/${sub.roomId}`)}
                    >
                        <ExternalLinkIcon size={16} className="text-blue-500" />
                    </Button >
                </div>
            </CardFooter>
        </Card >
    )
}
