import { SidebarInset } from "~/components/ui/sidebar"
import { Outlet } from "react-router"

import { SidebarProvider } from "~/components/ui/sidebar"
import { AppSidebar } from "~/features/sidebar"
import { AppHeader } from "~/features/header"



export default function Layout() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 48)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}