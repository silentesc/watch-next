import { useEffect, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Navbar } from "../components/layouts/Navbar";
import { MenuIcon } from "../components/ui/icons/Icons";
import { LogoText } from "../components/ui/LogoText";
import { useAuthStore } from "../stores/useAuthStore";

export const isScreenBig = () => {
    return window.matchMedia("(min-width: 768px)").matches;
}

export function App() {
    const pathname = useRouterState({ select: state => state.location.pathname });
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const [isNavbarOpen, setIsNavbarOpen] = useState(() => isLoggedIn ? isScreenBig() : false);

    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 768px)");
        const syncNavbar = () => setIsNavbarOpen(isLoggedIn && desktop.matches);

        syncNavbar();
        desktop.addEventListener("change", syncNavbar);
        return () => desktop.removeEventListener("change", syncNavbar);
    }, [isLoggedIn]);

    useEffect(() => {
        if (isNavbarOpen && !isScreenBig()) {
            setIsNavbarOpen(false);
        }
    }, [pathname]);

    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 768px)");
        const previousOverflow = document.body.style.overflow;
        const syncScrollLock = () => {
            document.body.style.overflow = isNavbarOpen && isLoggedIn && !desktop.matches
                ? "hidden"
                : previousOverflow;
        };

        syncScrollLock();
        desktop.addEventListener("change", syncScrollLock);

        return () => {
            desktop.removeEventListener("change", syncScrollLock);
            document.body.style.overflow = previousOverflow;
        };
    }, [isNavbarOpen, isLoggedIn]);

    return (
        <div>
            {
                isLoggedIn ? (
                    <>
                        <div
                            className={`md:hidden fixed inset-0 z-30 bg-background-secondary/50 transition-opacity duration-300 ${isNavbarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                            onClick={() => setIsNavbarOpen(false)}
                        />
                        <aside
                            inert={!isNavbarOpen}
                            className={`fixed inset-y-0 left-0 z-40 w-75 overflow-y-auto bg-background-primary transition-transform duration-300 ${isNavbarOpen ? "translate-x-0" : "-translate-x-full"}`}
                        >
                            <Navbar />
                        </aside>
                        <header className={`${isNavbarOpen && isLoggedIn ? "left-60 md:left-75" : "left-0"} fixed right-0 top-0 z-50 h-16 flex items-center gap-3 bg-background-primary p-4 transition-[left] duration-300`}>
                            <button className="w-fit p-1 cursor-pointer" onClick={() => setIsNavbarOpen(open => !open)}>
                                <MenuIcon className="w-5" />
                            </button>
                            {!isNavbarOpen ? <Link to="/" className="w-fit"><LogoText width={35} height={35} /></Link> : null}
                        </header>
                    </>
                ) : (
                    null
                )
            }
            <main
                inert={isNavbarOpen && isLoggedIn && !isScreenBig()}
                className={`${isNavbarOpen && isLoggedIn ? "md:ml-75" : ""} p-6 ${isLoggedIn ? "pt-22" : "pt-6"}`}
            >
                <Outlet />
            </main>
        </div>
    )
}
