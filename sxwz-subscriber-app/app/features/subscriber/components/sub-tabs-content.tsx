import { TabsContent } from "~/components/ui/tabs"
import { SubCard } from "./sub-card"

import { type Sub } from "../model/sub-info"


export function SubTabsContent({ subs, value }: { subs: Sub[], value: string }) {

    const sortedSubs = [...subs].sort((a, b) => {
        // 1. 按 isTop 排序（true 在前）
        if (a.isTop !== b.isTop) {
            return a.isTop ? -1 : 1;
        }

        // 2. 按 isLive 排序（true 在前）
        if (a.isLive !== b.isLive) {
            return a.isLive ? -1 : 1;
        }

        // 3. 如果 isTop 和 isLive 相同，按 roomId 升序排序
        return a.roomId - b.roomId;
    })
    return (
        <TabsContent value={value} className="mt-4 transition-all duration-300 ease-in-out">
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                {sortedSubs.map((sub, index) => (
                    <SubCard key={`on-${sub.roomId}-${index}`} sub={sub} />
                ))}
            </div>
        </TabsContent>
    )
}