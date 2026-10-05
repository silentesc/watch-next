import { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import { Loading } from "../../components/ui/Loading";
import { Info } from "../../components/ui/Info";
import { Error } from "../../components/ui/Error";
import { Link, useNavigate } from "@tanstack/react-router";
import { InputPassword } from "../../components/ui/InputPassword";
import { Logo } from "../../components/ui/Logo";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data: { username: string, password: string }) => login(data.username, data.password),
        onSuccess: () => navigate({ to: "/" }),
    });

    // Login
    const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutation.mutate({ username, password });
    }

    return (
        <>
            {mutation.isPending ? <Loading /> : null}
            {mutation.isSuccess ? <Info message="Logged in successfully" /> : null}
            {mutation.isError ? <Error message={mutation.error.message} /> : null}

            <section className="mt-5 flex flex-col items-center justify-center">
                <Logo />
                <h1 className="mt-4 text-3xl font-bold">Watch Next</h1>
                <p className="mt-2 text-foreground-secondary">Log in to your account</p>
            </section>

            <form onSubmit={onSubmit} className="mt-10 flex justify-center">
                <div className="w-120 p-7 bg-background-primary shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
                    <div className="mb-5">
                        <p className="text-lg">Username</p>
                        <Input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Username" autoFocus />
                    </div>
                    <div className="mb-5">
                        <p className="text-lg">Password</p>
                        <InputPassword value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                    </div>
                    <div>
                        <Button value="Login" type="submit" />
                    </div>
                    <p className="mt-5 text-center text-foreground-secondary">
                        Don't have an account? <Link to="/register" className="text-foreground underline">Register</Link>
                    </p>
                </div>
            </form>
        </>
    )
}
