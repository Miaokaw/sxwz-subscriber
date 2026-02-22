import { TabsContent } from "~/components/ui/tabs"
import { SubCard } from "./sub-card"

import { type SubInfo } from "../model/sub-info"


export function SubTabsContent({ subs, value }: { subs: SubInfo[], value: string }) {
    return (
        <TabsContent value={value} className="mt-4 transition-all duration-300 ease-in-out">
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                {subs.map((sub, index) => (
                    <SubCard key={`on-${sub.roomId}-${index}`} info={sub} />
                ))}
            </div>
        </TabsContent>
    )
}