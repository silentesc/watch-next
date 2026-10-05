import { Link } from "@tanstack/react-router";
import { useMe } from "../../hooks/use_me";
import { Loading } from "../ui/Loading";
import { MeDropdown } from "./MeDropdown";
import { Error } from "../ui/Error";
import { LogoText } from "../ui/LogoText";

export function Navbar() {
    const me = useMe();

    return (
        <nav className="min-h-full flex flex-col gap-6 p-6">
            {/* Logo */}
            <Link to="/" className="w-fit">
                <LogoText width={35} height={35} />
            </Link>
            {/* Discovery Links */}
            <section className="flex flex-col gap-3">
                <h2 className="font-semibold text-foreground-secondary">Discovery</h2>
                <div className="flex flex-col gap-1">
                    <Link className="ml-1 text-2xl" to="/discover">Discover</Link>
                    <Link className="ml-1 text-2xl" to="/search">Search</Link>
                </div>
            </section>
            {/* Library Links */}
            <section className="flex flex-col gap-3">
                <h2 className="font-semibold text-foreground-secondary">Library</h2>
                <div className="flex flex-col gap-1">
                    <Link className="ml-1 text-2xl" to="/custom-lists">Lists</Link>
                </div>
            </section>
            {/* Auth & Account */}
            <section className="mt-auto flex flex-col items-center justify-center">
                {
                    me.isEnabled ? (
                        me.isPending ? (
                            <Loading />
                        ) : (
                            me.isSuccess ? (
                                <MeDropdown me={me.data} />
                            ) : (
                                <Error message={`Account retrieval failed: ${me.error?.message}`} />
                            )
                        )
                    ) : (
                        <Error message="Account retrieval not enabled" />
                    )
                }
            </section>
        </nav>
    );
}
