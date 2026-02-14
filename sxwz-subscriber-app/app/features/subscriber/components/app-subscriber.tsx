import { SubCard } from "./sub-card";
import { type SubInfo } from "../model/sub-info";


export function AppSubscriber() {
    const subs: SubInfo[] = [
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
        }
    ]

    return (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] px-4">
            <SubCard info={subs[0]} />
            <SubCard info={subs[0]} />
            <SubCard info={subs[0]} />
            <SubCard info={subs[0]} />
        </div>
    );
}