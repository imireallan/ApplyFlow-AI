# Test Utils

## Primary: `createRoutesStub` (Recommended)

```ts
import { createRoutesStub } from 'react-router';
const Stub = createRoutesStub([{
  path: '/upload',
  Component: UploadRoute.default,
  action() { return { error: 'test' }; }
}]);
render(<Stub />);
```

## Legacy: MemoryRouter (if needed)

```ts
import { SimpleRouterWrapper } from "./createRouteStub";
```

**Use createRoutesStub for loader/action testing - it's the official React Router V7 way!**
