import { type RoomInfo, type RoomInfoRes, type Sub } from "../model/sub-info";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { SubTabsContent } from "./sub-tabs-content";
import { SubAdder } from "./sub-adder";
import { error, info } from "@tauri-apps/plugin-log";
import { Store } from "@tauri-apps/plugin-store";
import { fetch } from "@tauri-apps/plugin-http"

import { useEffect, useState } from "react";

import { biliHeader } from "~/lib/utils";
import { useSubsStore } from "~/hooks/use-subs-store";

export function AppSubscriber() {
    const allSubs = useSubsStore(state => state.subs);
    const setAllSubs = useSubsStore(state => state.setSubs);
    const saveAllSubs = useSubsStore(state => state.saveSubs);
    const [offLivingSubs, setOffLivingSubs] = useState<Sub[]>([]);
    const [onLivingSubs, setOnLivingSubs] = useState<Sub[]>([]);

    async function getRoomInfo(roomId: string): Promise<RoomInfo> {
        const response = await fetch(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomId}`, {
            method: "GET",
            headers: biliHeader,
        });

        if (response.status !== 200) {
            error(`Failed to fetch room info for room ID: ${roomId}, status: ${response.status}`);
            throw new Error(`Failed to fetch room info for room ID: ${roomId}, status: ${response.status}`);
        }

        const res: RoomInfoRes = await response.json();
        if (res.code !== 0) {
            error(`Failed to fetch QR code URL, code: ${res.code}, message: ${res.message}`);
            throw (new Error(`Failed to fetch QR code URL, code: ${res.code}, message: ${res.message}`));
        }
        info(`Fetched room info successfully for room ID: ${roomId}`);

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

    useEffect(() => {
        const onLiving = allSubs.filter(sub => sub.isLive);
        const offLiving = allSubs.filter(sub => !sub.isLive);

        setOnLivingSubs(onLiving);
        setOffLivingSubs(offLiving);
    }, [allSubs]);

    useEffect(() => {
        Store.load("subs.bin").then(store => {
            store.get("subs").then(subs => {
                setAllSubs(subs as Sub[] || []);
            })
        });
    }, [])

    function extractRoomId(url: string): string | null {
        try {
            if (/^\d+$/.test(url))
                return url;

            if (!url.startsWith("https://live.bilibili.com/"))
                return null;

            const parsedUrl = new URL(url);
            const pathSegments = parsedUrl.pathname.split("/").filter(Boolean); // 分割路径并过滤空段
            const roomId = /^\d+$/.test(pathSegments[0]) ? pathSegments[0] : null; // 取第一个路径段
            return roomId;
        } catch (e) {
            error(`Failed to parse URL: ${url}, error: ${e}`);
            return null;
        }
    }

    const onAdd = async (query: string) => {
        const roomId = extractRoomId(query);
        if (roomId) {
            info(`Extracted room ID: ${roomId} from query: ${query}`);
            Store.load("subs.bin").then(store => {
            });
            const roomInfo = await getRoomInfo(roomId);
            if (allSubs.some(sub => sub.roomId === roomInfo.roomId)) {
                info(`Room ID: ${roomInfo.roomId} already exists in subs, skipping add`);
                return;
            }
            const sub = {
                roomId: roomInfo.roomId,
                uid: roomInfo.uid,
                isTop: false,
                isLive: false,
            }
            const newSubs = [...allSubs, sub];
            setAllSubs(newSubs);
            info(`Added new room info for room ID: ${roomInfo.roomId}, name: ${roomInfo.name}`);
            saveAllSubs();
        }
        else {
            // TODO! 弹窗提醒输入错误
        }
    }


    return (
        <Tabs defaultValue="all" className="w-full px-4">
            <div className="flex ">
                <TabsList className="bg-background">
                    <TabsTrigger value="onLiving">直播中</TabsTrigger>
                    <TabsTrigger value="offLiving">未开播</TabsTrigger>
                    <TabsTrigger value="all">全部</TabsTrigger>
                </TabsList>
                <SubAdder onAdd={onAdd} />
            </div>
            <SubTabsContent subs={allSubs} value="all" />
            <SubTabsContent subs={offLivingSubs} value="offLiving" />
            <SubTabsContent subs={onLivingSubs} value="onLiving" />
        </Tabs>
    );
}