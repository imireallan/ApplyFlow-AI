import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./mocks/server";
import matchMedia from "./mocks/matchMedia";

// MSW server setup for API mocking
beforeAll(() => {
  server.listen({
    onUnhandledRequest: "warn", // or 'error' in CI
  });
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
  vi.restoreAllMocks();
});

// Mock matchMedia for responsive testing
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: matchMedia,
});

// Extend expect with jest-dom matchers
import "@testing-library/jest-dom";
