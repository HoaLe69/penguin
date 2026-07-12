# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is a Create React App project wrapped by `react-app-rewired` (for path aliasing). Use these instead of plain `react-scripts`:

- `npm start` — run dev server (http://localhost:3000)
- `npm test` — run tests in watch mode (Jest via CRA). To run a single test file: `npm test -- src/path/to/File.test.ts`. To run non-interactively: `CI=true npm test`
- `npm run build` — production build
- `npm run format` — format the whole repo with Prettier (`.prettierrc`: no semicolons, single quotes, no trailing commas, 120 print width)

There is no lint script configured beyond CRA's built-in ESLint (`eslintConfig` in `package.json` extends `react-app`), which runs automatically during `npm start`/`npm run build`.

## Environment

The app reads config from `.env` (gitignored, not present in repo — create one locally). Required variables, referenced via `process.env`:

- `REACT_APP_API_URL` — REST API base URL (used by `src/config/axios.ts`)
- `REACT_APP_SOCKET_URL` — WebSocket/SockJS endpoint (used by `src/hooks/useWebSocket.ts`)
- `REACT_APP_GOOGLE_CLIENT_KEY` — Google OAuth client ID (used by `GoogleOAuthProvider` in `src/App.tsx`)

## Architecture

Penguin is a social-network frontend (posts, comments, following, real-time chat) built with React 18 + Chakra UI + Redux Toolkit.

**Path aliases** (configured in `config-overrides.js` via `react-app-rewire-alias`, not CRA's default `jsconfig.json`): `@components`, `@pages`, `@config`, `@routes`, `@layout`, `@redux` all map to `src/<name>`. Some older files still use relative imports (`../../config/axios`) — both work, but prefer aliases for new code.

**Routing** (`src/routes/index.ts` + `src/App.tsx`): routes are split into `routesPublic` and `routesPrivate` arrays of `{ path, component }`, rendered via `Routes`/`Route` in `App.tsx`. Every private route is wrapped in `RequireAuthentication` (`src/components/require-auth.tsx`), which calls `verifyUser` on mount, redirects to `/login` if `state.auth.authState.isAuthenticated === false`, and injects the global `ChatFloat` widget on every private page except `/chat` itself. Route path strings live centrally in `src/config/route.ts` — add new paths there, not as string literals.

**State (Redux Toolkit)** — `src/redux/store.ts` combines five slices: `auth`, `post`, `user`, `room` (chat rooms/conversations), `comment`. There is no `redux-thunk` middleware/async-thunks pattern in use; instead, **API calls live in `src/redux/api-request/*.ts`** as plain async functions that take `dispatch` (and sometimes `navigate`) as arguments, manually dispatch `xStart`/`xSuccess`/`xFailed` actions around the request, and are called directly from components (not via `dispatch(asyncThunk())`). When adding a new API-backed feature, follow this same "one function per action" pattern colocated with its request file, matched to the slice's Start/Success/Failed reducers.

**HTTP layer** (`src/config/axios.ts`): two axios instances — default export `axiosClient` (used for authenticated requests) and named export `axiosPublic` (for login/register, unauthenticated). Both set `withCredentials: true` (auth is cookie/session based, not bearer-token-in-header) and serialize query params with `query-string`. Both instances unwrap `response.data` in an interceptor, so calling code receives the payload directly, not the full axios response.

**Real-time chat** (`src/hooks/useWebSocket.ts`): STOMP-over-SockJS via `sockjs-client` + `stompjs`, connecting to `REACT_APP_SOCKET_URL`. `useStompClient(topic, id, onMessageReceived)` opens a connection keyed by `id`, subscribes to `` `${topic}/${id}` ``, and reconnects/tears down on `id` change/unmount. Chat UI is split between the always-available floating widget (`src/components/chat-float/`) and the dedicated full page (`src/pages/chat-pc.tsx`), sharing conversation components from `src/components/conversation/`.

**Layouts** (`src/layout/*.tsx`): several layout shells (`layout-full`, `layout-tab`, `layout-only-header`, `layout-not-header`, `layout-without-nav`) wrap page content differently depending on whether a page needs the nav bar, tab bar, header, etc.

**Theming**: Chakra UI theme is customized in `src/config/theme.ts` (light/dark via `initialColorMode: 'system'`), with reusable color-mode-aware tokens exported as `COLOR_THEME` from `src/components/require-auth.tsx` (despite the filename, this file also holds shared theme helpers and base64 hash constants used for email-verify/reset-password links — see `src/constant/index.ts` for related constants).

## TypeScript & Types

All source code in `src/` is strictly TypeScript with `allowJs: false` (see `tsconfig.json`) and `strict: true` mode enabled. This section covers conventions observed throughout the codebase.

**File extensions**: All files under `src/` must be `.ts` (utilities, services, hooks, constants, API functions) or `.tsx` (React components and pages). Do NOT add new `.js` or `.jsx` files. This ensures type safety across the entire codebase.

**Redux hooks**: Use typed Redux hooks from `src/redux/hooks.ts` instead of raw imports from `react-redux`:
- `useAppDispatch` — typed `dispatch` function (replaces `useDispatch`)
- `useAppSelector` — typed selector hook (replaces `useSelector`)
Example: `const dispatch = useAppDispatch(); const user = useAppSelector(state => state.auth.user);`

**Component props**: Define prop interfaces per component:
```typescript
interface MyComponentProps {
  title: string;
  onClose: () => void;
  count?: number;
}

function MyComponent(props: MyComponentProps) {
  const { title, onClose, count = 0 } = props;
  return <div>{title}</div>;
}
```
Do NOT use `React.FC<Props>` — use function signature with typed props parameter. This makes return type inference more explicit and is the preferred pattern throughout the codebase.

**Redux dispatch**: Actions dispatched from Redux slices are automatically typed by Redux Toolkit's `createSlice`. Pass typed slices and action creators directly to `dispatch`:
```typescript
dispatch(authSlice.actions.setUser(userData));
dispatch(postSlice.actions.clearPosts());
```
Redux Toolkit handles action type generation; no need for manual type assertions.

**API request layer**: All async API functions live in `src/redux/api-request/*.ts` and are fully typed with request/response DTOs. These functions take `dispatch` (and optionally `navigate` for redirects) as parameters and manually dispatch `xStart`/`xSuccess`/`xFailed` actions around the HTTP call. Example: `fetchUserProfile(dispatch, userId)` will dispatch `start`, then `success` or `failed` based on the response. Always use these pre-typed functions from components; do not make raw axios calls.

**Hooks**: Custom hooks in `src/hooks/*.ts` are typed with generics where applicable:
- `useDebounce<T>(value: T, delay: number): T` — generic debounce hook
- `useStompClient<T>(topic, id, onMessageReceived)` — WebSocket subscription with typed message payload
- `useAppDispatch()` and `useAppSelector(selector)` — Redux hooks (already covered above)

**Path aliases**: Six path aliases are available (configured in `config-overrides.js`):
- `@components` → `src/components`
- `@pages` → `src/pages`
- `@config` → `src/config`
- `@routes` → `src/routes`
- `@layout` → `src/layout`
- `@redux` → `src/redux`

Prefer aliases in new code: `import Button from '@components/button'` instead of relative paths. This improves readability and makes refactoring easier.

**New components and pages**: When adding new React components or pages, always:
1. Use `.tsx` extension
2. Define a `Props` interface (even if empty: `interface ComponentProps {}`)
3. Type the component function signature: `function Component(props: ComponentProps) { ... }`
4. Export the component as a named export
5. Use typed Redux hooks if accessing state or dispatching actions
6. Reference types from `src/redux/slices/*.ts` for Redux state shapes

**Testing**: All test files are `.test.ts` or `.test.tsx`. Jest configuration is inherited from Create React App's defaults and runs via `npm test`.
