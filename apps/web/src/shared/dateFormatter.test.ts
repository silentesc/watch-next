import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime } from "./dateFormatter";

describe("date formatters", () => {
    it("returns a stable invalid-date value instead of throwing", () => {
        expect(formatDate("not-a-date")).toBe("Invalid Date");
        expect(formatDateTime("not-a-date")).toBe("Invalid Date");
    });

    it("honors the requested locale and time zone", () => {
        expect(formatDate("2024-01-02T23:30:00Z", "short", { locale: "en-US", timeZone: "UTC" })).toBe("1/2/24");
        expect(formatDateTime("2024-01-02T23:30:00Z", "short", "short", { locale: "en-US", timeZone: "UTC" })).toContain("1/2/24");
    });
});
