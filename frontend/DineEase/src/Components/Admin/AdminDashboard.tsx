import React, { PropsWithChildren } from "react"
import { Sidebar } from "./SideBar"
import { MainScreenHome } from "./MainScreenHome"
import { Routes,Route } from "react-router-dom"
import { MainScreenMenu } from "./MainScreenMenu"
export const AdminDashboard=({children}:PropsWithChildren)=>{
    return (
        <div className="grid grid-cols-6 w-screen h-screen ">
            <div className="col-span-1 ">
                <Sidebar></Sidebar>
            </div>
            <div className="col-span-5 ">
                {children}
           </div>
        </div>
    )
}