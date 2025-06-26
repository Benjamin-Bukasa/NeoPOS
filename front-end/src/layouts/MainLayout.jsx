import React from "react";

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Rightbar from './../components/Rightbar';
import Navbar from "../components/Navbar";


function MainLayout (){

    return(
        <div className="main-layout md:flex md:h-screen md:overflow-hidden">
            <Sidebar/>
            <main className="md:flex-1 md:overflow-y-auto scrollbar-hide bg-gray-100/50 h-full">
                <Navbar/>
                <Outlet/>
            </main>
            <Rightbar/>
        </div>
    )
}

export default MainLayout