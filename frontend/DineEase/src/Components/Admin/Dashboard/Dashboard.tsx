import { SidePanel } from "./SidePanel"
import { Outlet } from "react-router-dom"


export function Dashboard(){
    return (
        
        <div className="w-full min-h-screen flex bg-brand-cream overflow-x-hidden">
            <SidePanel></SidePanel>
            {/* min-w-0 lets this flex column shrink below its content width so a
                wide child (table/grid) can't push the page past the viewport and
                make mobile browsers zoom out. */}
            <div className="flex-1 min-w-0 w-full overflow-x-hidden bg-brand-cream">
                <Outlet></Outlet>
            </div>

        </div>
    )
}