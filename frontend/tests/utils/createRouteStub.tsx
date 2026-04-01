import React from "react";
import {
  createRoutesStub,
  type LoaderFunction,
  type ActionFunction,
} from "react-router";

type StubRouteArray = Parameters<typeof createRoutesStub>[0];
type StubRouteObject = StubRouteArray extends Array<infer T> ? T : never;

/**
 * Single-route stub helper for unit testing React Router components.
 *
 * @example
 *   const Stub = createRouteStubTest("/upload", UploadPage, { action });
 *   render(renderRouteStub(Stub, ["/upload"]));
 */
export function createRouteStubTest(
  path: string,
  Component: React.ComponentType,
  options?: { loader?: LoaderFunction; action?: ActionFunction }
) {
  return createRoutesStub([
    { path, Component, loader: options?.loader, action: options?.action } as StubRouteObject,
  ]);
}

/**
 * Multi-route stub for navigation/redirect testing.
 */
export function createMultiRouteStub(routes: StubRouteObject[]) {
  return createRoutesStub(routes);
}

/**
 * Render a stub with initial entries.
 */
export function renderRouteStub(
  Stub: ReturnType<typeof createRoutesStub>,
  initialEntries: string[] = ["/"]
) {
  return <Stub initialEntries={initialEntries} />;
}

/**
 * Mock useOutletContext for components that depend on parent context.
 * Call this BEFORE rendering the component under test.
 *
 * Use with `afterEach(() => vi.restoreAllMocks())` in vitest.setup.ts.
 *
 * @example
 *   mockOutletContext({ user: mockUser, cvs: [] });
 *   render(<SettingsForm />);
 */
export function mockOutletContext<T = unknown>(value: T) {
  const { vi } = require("vitest");
  vi.mocked(require("react-router").useOutletContext).mockReturnValue(value);
}

export { createRoutesStub } from "react-router";
