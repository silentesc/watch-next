import { useState } from "react";
import { Outlet } from "react-router";
import { Navbar } from "../components/layouts/Navbar";
import { ChevronLeftIcon, ChevronRightIcon } from "../components/ui/icons/Icons";
import { LogoText } from "../components/ui/LogoText";

export function App() {
    const [isNavbarOpen, setIsNavbarOpen] = useState(() => window.matchMedia("(min-width: 768px)").matches);

    return (
        <div>
            <aside className={`${isNavbarOpen ? "block" : "hidden"} fixed left-0 top-0 z-40 w-75 h-screen bg-background-primary`}>
                <Navbar />
            </aside>
            <div className={`${isNavbarOpen ? "left-60 md:left-75" : "left-0"} fixed right-0 top-0 z-50 h-16 flex items-center gap-3 bg-background-primary p-4`}>
                <div className="w-fit p-2 cursor-pointer" onClick={() => setIsNavbarOpen(!isNavbarOpen)}>
                    {isNavbarOpen ? <ChevronLeftIcon className="w-5" /> : <ChevronRightIcon className="w-5" />}
                </div>
                {!isNavbarOpen ? <LogoText width={35} height={35} /> : null}
            </div>
            <main className={`${isNavbarOpen ? "md:ml-75 h-screen md:min-h-screen overflow-hidden md:overflow-auto pointer-events-none md:pointer-events-auto opacity-50 md:opacity-100" : ""} p-6 pt-22`}>
                <Outlet />
            </main>
        </div>
    )
}
