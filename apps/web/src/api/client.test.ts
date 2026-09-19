import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios, { type AxiosAdapter } from "axios";

const { logout } = vi.hoisted(() => ({
    logout: vi.fn(),
}));

vi.mock("./auth", () => ({ logout }));

import { api } from "./client";

describe("API 401 interceptor", () => {
    const originalWindow = globalThis.window;
    const originalAdapter = api.defaults.adapter;

    const rejectWithStatus = (status: number): AxiosAdapter =>
        ((config) =>
            Promise.reject(
                new axios.AxiosError(
                    status === 401 ? "Unauthorized" : "Request failed",
                    "ERR_BAD_REQUEST",
                    config,
                    undefined,
                    {
                        status,
                        statusText: status === 401 ? "Unauthorized" : "Request failed",
                        headers: {},
                        config,
                        data: {},
                    },
                ),
            )) as AxiosAdapter;

    beforeEach(() => {
        logout.mockReset().mockResolvedValue(undefined);

        globalThis.window = {
            location: {
                pathname: "/movie/42",
                href: "",
            },
        } as Window & typeof globalThis;

        api.defaults.adapter = rejectWithStatus(401);
    });

    afterEach(() => {
        globalThis.window = originalWindow;
        api.defaults.adapter = originalAdapter;
    });

    it("logs out and redirects to login for a protected route", async () => {
        await expect(api.get("/me")).rejects.toMatchObject({
            response: { status: 401 },
        });

        expect(logout).toHaveBeenCalledOnce();
        expect(window.location.href).toBe("/login");
    });

    it.each(["/login", "/register"])(
        "does not redirect from %s",
        async (pathname) => {
            window.location.pathname = pathname;

            await expect(api.get("/me")).rejects.toMatchObject({
                response: { status: 401 },
            });

            expect(logout).toHaveBeenCalledOnce();
            expect(window.location.href).toBe("");
        },
    );

    it.each([403, 404, 500])(
        "does not log out or redirect for a %s response",
        async (status) => {
            api.defaults.adapter = rejectWithStatus(status);

            await expect(api.get("/me")).rejects.toMatchObject({
                response: { status },
            });

            expect(logout).not.toHaveBeenCalled();
            expect(window.location.href).toBe("");
        },
    );

    it("does not log out or redirect for an error without a response", async () => {
        api.defaults.adapter = ((config) =>
            Promise.reject(
                new axios.AxiosError(
                    "Network error",
                    "ERR_NETWORK",
                    config,
                ),
            )) as AxiosAdapter;

        await expect(api.get("/me")).rejects.toMatchObject({
            code: "ERR_NETWORK",
        });

        expect(logout).not.toHaveBeenCalled();
        expect(window.location.href).toBe("");
    });
});
