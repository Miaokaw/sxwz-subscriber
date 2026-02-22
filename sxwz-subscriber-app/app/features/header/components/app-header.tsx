import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import SmartSearch from "./smart-search";


export function AppHeader() {

    const handleSearch = (query: string, context: string) => {
        console.log(`Searching for "${query}" in ${context} context`);
    };

    return (
        <header className="flex h-16 items-center justify-start px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator
                    orientation="vertical"
                    className="h-8 data-[orientation=vertical]:h-8"
                />
            </div>
            <div className="flex-1 mx-4 w-full max-w-lg">
                <SmartSearch onSearch={handleSearch} />
            </div>

        </header >
    );
}