import { Separator, } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";


export function AppHeader() {
    return (
        <header className="flex h-16 items-center">
            <div className="flex items-center gap-2 pl-2">
                <SidebarTrigger />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-8"
                />
            </div>
        </header>
    );
}