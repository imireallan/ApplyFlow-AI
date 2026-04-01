
import {
  createRoutesStub,
  type LoaderFunction,
  type ActionFunction,
  type RouteComponentType,
  type StubRouteObject,
} from "react-router";

export function createRouteStubTest(
  path: string,
  Component: RouteComponentType,
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
    } as StubRouteObject,
  ]);
}

export function createMultiRouteStub(routes: StubRouteObject[]) {
  return createRoutesStub(routes);
}

export function renderRouteStub(
  Stub: ReturnType<typeof createRoutesStub>,
  initialEntries: string[] = ["/"]
) {
  return <Stub initialEntries={initialEntries} />;
}

export { createRoutesStub } from "react-router";
