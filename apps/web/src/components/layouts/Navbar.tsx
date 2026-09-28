import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Logo } from "../ui/Logo";
import { useMe } from "../../hooks/use_me";
import { Loading } from "../ui/Loading";
import { MeDropdown } from "./MeDropdown";
import { CloseIcon, MenuIcon } from "../ui/icons/Icons";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const me = useMe();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const desktopLinksWhenLoggedIn = (
        <>
            <NavLink className="mx-2 text-2xl" to="/discover">Discover</NavLink>
            <NavLink className="mx-2 text-2xl" to="/search">Search</NavLink>
            <NavLink className="mx-2 text-2xl" to="/custom-lists">Lists</NavLink>
        </>
    );
    const mobileLinksWhenLoggedIn = (
        <>
            <NavLink className="mx-2 mb-1 text-2xl" to="/discover">Discover</NavLink>
            <NavLink className="mx-2 mb-1 text-2xl" to="/search">Search</NavLink>
            <NavLink className="mx-2 mb-1 text-2xl" to="/custom-lists">Lists</NavLink>
        </>
    );

    const desktopAuthLinks = (
        <>
            <NavLink className="mx-2 text-2xl p-2.5" to="/login">Login</NavLink>
            <NavLink className="mx-2 text-2xl bg-primary rounded-md p-2.5" to="/register">Register</NavLink>
        </>
    );
    const mobileAuthLinks = (
        <>
            <NavLink className="mx-2 mb-1 text-2xl p-2.5" to="/login">Login</NavLink>
            <NavLink className="mx-2 mb-1 text-2xl bg-primary rounded-md p-2.5" to="/register">Register</NavLink>
        </>
    );

    return (
        <>
            <nav className="p-4 bg-background-primary">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center w-full">
                        <div className="mr-5">
                            <Link to="/">
                                <Logo />
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden sm:flex w-full items-center">
                            {/* Left */}
                            <div>
                                {
                                    me.isEnabled && me.isSuccess ? (
                                        desktopLinksWhenLoggedIn
                                    ) : null
                                }
                            </div>
                            {/* Right */}
                            <div className="ml-auto">
                                {
                                    me.isEnabled ? (
                                        me.isPending ? (
                                            <Loading />
                                        ) : (
                                            me.isSuccess ? (
                                                <MeDropdown me={me.data} />
                                            ) : (
                                                desktopAuthLinks
                                            )
                                        )
                                    ) : (
                                        desktopAuthLinks
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* Mobile (Hamburger Button) */}
                    <div className="flex sm:hidden">
                        <MenuIcon onClick={() => setIsMobileMenuOpen(true)} className="w-6 h-6" />
                    </div>
                </div>
            </nav>
            {/* Mobile (Menu) */}
            <div className={`fixed inset-0 flex flex-col bg-background-secondary z-1000 p-5 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Bar with logo and x button*/}
                <div className="flex justify-between">
                    {/* Logo */}
                    <div className="mb-10">
                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/">
                            <Logo />
                        </Link>
                    </div>
                    {/* x button */}
                    <CloseIcon onClick={() => setIsMobileMenuOpen(false)} className="w-6 h-6" />
                </div>

                {/* Links (top) */}
                <div className="flex flex-col">
                    {
                        me.isEnabled && me.isSuccess ? (
                            mobileLinksWhenLoggedIn
                        ) : null
                    }
                </div>

                {/* Link (bottom) */}
                <div className="flex mt-auto mx-auto">
                    {
                        me.isEnabled ? (
                            me.isPending ? (
                                <Loading />
                            ) : (
                                me.isSuccess ? (
                                    <MeDropdown me={me.data} isMobile />
                                ) : (
                                    mobileAuthLinks
                                )
                            )
                        ) : (
                            mobileAuthLinks
                        )
                    }
                </div>
            </div>
        </>
    )
}
