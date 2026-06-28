import { SidePanel } from "./SidePanel"
import { Outlet } from "react-router-dom"


export function Dashboard(){
    return (
        
        <div className="w-full min-h-screen flex bg-brand-cream">
            <SidePanel></SidePanel>
            <div className="flex-1 bg-brand-cream">
                <Outlet></Outlet>
            </div>

        </div>
    )
}