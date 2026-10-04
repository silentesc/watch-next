import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./client";
import { login, logout, register } from "./auth";

const { setIsLoggedIn } = vi.hoisted(() => ({
    setIsLoggedIn: vi.fn(),
}));

vi.mock("../stores/useAuthStore", () => ({
    useAuthStore: {
        getState: () => ({ setIsLoggedIn }),
    },
}));

vi.mock("./client", () => ({
    api: {
        post: vi.fn(),
    },
}));

describe("auth API", () => {
    beforeEach(() => {
        vi.mocked(api.post).mockReset();
        setIsLoggedIn.mockReset();
        vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("logs in and updates the auth store", async () => {
        vi.mocked(api.post).mockResolvedValue({});

        await login("alice", "password");

        expect(api.post).toHaveBeenCalledWith("/auth/login", { username: "alice", password: "password" });
        expect(setIsLoggedIn).toHaveBeenCalledWith(true);
    });

    it("logs out and clears the auth store", async () => {
        vi.mocked(api.post).mockResolvedValue({});

        await logout();

        expect(api.post).toHaveBeenCalledWith("/auth/logout");
        expect(setIsLoggedIn).toHaveBeenCalledWith(false);
    });

    it("does not change auth state when login fails", async () => {
        vi.mocked(api.post).mockRejectedValue(new Error("request failed"));

        await expect(login("alice", "wrong")).rejects.toThrow("An unexpected error occured");
        expect(setIsLoggedIn).not.toHaveBeenCalled();
    });

    it("registers without changing auth state", async () => {
        vi.mocked(api.post).mockResolvedValue({});

        await register("alice", "password");

        expect(api.post).toHaveBeenCalledWith("/auth/register", { username: "alice", password: "password" });
        expect(setIsLoggedIn).not.toHaveBeenCalled();
    });
});
