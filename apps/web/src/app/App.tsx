import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Navbar } from "../components/layouts/Navbar";
import { ChevronLeftIcon, ChevronRightIcon } from "../components/ui/icons/Icons";
import { LogoText } from "../components/ui/LogoText";
import { useAuthStore } from "../stores/useAuthStore";

const isScreenBig = () => {
    return window.matchMedia("(min-width: 768px)").matches;
}

export function App() {
    const location = useLocation();
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const [isNavbarOpen, setIsNavbarOpen] = useState(() => isLoggedIn ? isScreenBig() : false);

    useEffect(() => {
        if (isLoggedIn) {
            setIsNavbarOpen(isScreenBig());
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isNavbarOpen && !isScreenBig()) {
            setIsNavbarOpen(false);
        }
    }, [location]);

    return (
        <div>
            {
                isLoggedIn ? (
                    <>
                        <aside className={`${isNavbarOpen ? "block" : "hidden"} fixed left-0 top-0 z-40 w-75 h-screen bg-background-primary`}>
                            <Navbar />
                        </aside>
                        <div className={`${isNavbarOpen && isLoggedIn ? "left-60 md:left-75" : "left-0"} fixed right-0 top-0 z-50 h-16 flex items-center gap-3 bg-background-primary p-4`}>
                            <div className="w-fit p-2 cursor-pointer" onClick={() => setIsNavbarOpen(!isNavbarOpen)}>
                                {isNavbarOpen ? <ChevronLeftIcon className="w-5" /> : <ChevronRightIcon className="w-5" />}
                            </div>
                            {!isNavbarOpen ? <Link to="/" className="w-fit"><LogoText width={35} height={35} /></Link> : null}
                        </div>
                    </>
                ) : (
                    null
                )
            }
            <main className={`${isNavbarOpen && isLoggedIn ? "md:ml-75 h-screen md:min-h-screen overflow-hidden md:overflow-auto pointer-events-none md:pointer-events-auto opacity-50 md:opacity-100" : ""} p-6 pt-22`}>
                <Outlet />
            </main>
        </div>
    )
}
