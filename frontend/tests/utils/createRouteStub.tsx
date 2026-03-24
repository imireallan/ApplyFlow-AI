import React, { type ComponentType } from "react";
import {
  createRoutesStub,
  type LoaderFunction,
  type ActionFunction,
  type RouteObject
} from "react-router";

/**
 * Create a single-route stub (common case)
 */
export function createRouteStubTest(
  path: string,
  Component: ComponentType,
  options?: {
    loader?: LoaderFunction;
    action?: ActionFunction;
  }
) {
  return createRoutesStub([
    {
      path,
      Component,
      loader: options?.loader,
      action: options?.action,
    },
  ]);
}

/**
 * Create multi-route stub (advanced use cases like redirects/navigation)
 */
export function createMultiRouteStub(routes: RouteObject[]) {
  return createRoutesStub(routes);
}

/**
 * Optional helper to render with initial route
 */
export function renderRouteStub(
  Stub: ReturnType<typeof createRoutesStub>,
  initialEntries: string[] = ["/"]
) {
  return <Stub initialEntries={initialEntries} />;
}

/**
 * Re-export for direct usage when needed
 */
export { createRoutesStub } from "react-router";