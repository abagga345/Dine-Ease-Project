import { SidePanel } from "./SidePanel"
import { Outlet } from "react-router-dom"


export function Dashboard(){
    return (
        
        <div className="w-full h-full flex">
            <SidePanel></SidePanel>
            <Outlet></Outlet>

        </div>
    )
}