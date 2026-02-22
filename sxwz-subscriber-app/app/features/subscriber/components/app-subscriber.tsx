import { type SubInfo } from "../model/sub-info";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { SubTabsContent } from "./sub-tabs-content";
import { SubAdder } from "./sub-adder";
import { invoke } from "@tauri-apps/api/core";


export function AppSubscriber() {
    const allSubs: SubInfo[] = [
        {
            name: "BLGKnight",
            roomId: "31934797",
            title: "打会组排",
            cover: "https://i0.hdslb.com/bfs/live/new_room_cover/51bfb78f002dc6919e477f056c3dc39a41713ac6.jpg",
            popularity: 93121,
            users: 1312,
            maxUsers: 1455,
            fans: 1000,
            captains: 50,
            isTop: true,
            isLive: false,
        },
        {
            name: "AnotherStreamer",
            roomId: "31934798",
            title: "另一个直播间",
            cover: "https://i0.hdslb.com/bfs/live/new_room_cover/51bfb78f002dc6919e477f056c3dc39a41713ac6.jpg",
            popularity: 85000,
            users: 1200,
            maxUsers: 1400,
            fans: 950,
            captains: 45,
            isTop: false,
            isLive: false,
        },
        {
            name: "ThirdStreamer",
            roomId: "31934799",
            title: "第三个直播间",
            cover: "https://i0.hdslb.com/bfs/live/new_room_cover/51bfb78f002dc6919e477f056c3dc39a41713ac6.jpg",
            popularity: 75000,
            users: 1100,
            maxUsers: 1300,
            fans: 850,
            captains: 40,
            isTop: true,
            isLive: false,
        },
        {
            name: "LiveStreamer",
            roomId: "31934800",
            title: "正在直播",
            cover: "https://i0.hdslb.com/bfs/live/new_room_cover/51bfb78f002dc6919e477f056c3dc39a41713ac6.jpg",
            popularity: 120000,
            users: 1500,
            maxUsers: 1600,
            fans: 1200,
            captains: 60,
            isTop: true,
            isLive: true,
        }
    ]
    const offLivingSubs = allSubs.filter(sub => !sub.isLive);
    const onLivingSubs = allSubs.filter(sub => sub.isLive);

    function extractRoomId(url: string): string | null {
        try {
            const parsedUrl = new URL(url);
            const pathSegments = parsedUrl.pathname.split("/").filter(Boolean); // 分割路径并过滤空段
            const roomId = pathSegments[0]; // 取第一个路径段
            return /^\d+$/.test(roomId) ? roomId : null; // 确保是数字
        } catch (e) {
            console.error("Invalid URL:", e);
            return null;
        }
    }

    const onAdd = (query: string) => {
        console.log(`Adding new subscriber with query: ${query}`);
        const roomId = extractRoomId(query);
        console.log(`Extracted room ID: ${roomId}`);
        if (roomId) {
            const subInfo = invoke<SubInfo>("get_sub_info", { roomId: roomId });

            // TODO
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