## Architecture

### Server Components First

Pages are Server Components. They fetch data and validate sessions server-side. Client components receive props, not promises.

GOOD: Server Component fetches and validates

```tsx
export default async function DashboardPage() {
  const session = await requireSession(); // Redirects if invalid
  const data = await fetchUserData(session.uid);
  return <DashboardClient data={data} user={session.user} />;
}
```

BAD: Client component fetches in useEffect

```tsx
'use client';
export default function DashboardPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  if (!data) return <Loading />; // Flash of loading, unauthorized content risk
  return <Dashboard data={data} />;
}
```

No loading states for auth. No flash of unauthorized content. The client component receives validated, typed props.

What Goes Where

Server Components (page.tsx):

- Data fetching
- Session validation
- Redirects
- Database queries
- API calls with secrets

Client Components ("use client"):

- Interactive forms
- Event handlers
- Browser APIs
- Real-time updates (tanstack-query)

#### useEffect is for Side Effects, Not Data

Legitimate useEffect:

- Event listeners (resize, click outside)
- Third-party library setup
- Timers/intervals
- DOM measurements

Not legitimate:

- Fetching data → use RSC or tanstack-query
- Auth checks → use RSC with redirect
- Derived state → just compute it

### No Server Actions — Use Hono RPC

Server Actions are elegant in demos. In practice, FormData is a nightmare to type, error handling is implicit, and debugging is harder than explicit fetch calls.

Instead, a single catch-all route with Hono:

```tsx
// app/api/[...path]/route.ts
import app from '@/lib/api/server';
import { handle } from 'hono/vercel';

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
```

Define routes with Zod validation:

```tsx
// lib/api/server.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

const app = new Hono().basePath('/api');

const routes = app
  .post('/auth/session', zValidator('json', SessionSchema), async (c) => {
    const { idToken } = c.req.valid('json');
    return c.json({ success: true });
  })
  .get('/user/profile', async (c) => {
    const user = await getUser();
    return c.json(user);
  });

export type AppType = typeof routes;
export default app;
```

Typed client:

```ts
// lib/api/client.ts
import { hc } from "hono/client";
import type { AppType } from "./server";

export const api = hc<AppType>("/");
Every call is fully typed—no Zod on the client:

Copyconst res = await api.api.auth.session.$post({ json: { idToken } });
const data = await res.json(); // typed!
```

Mini-tRPC without the tRPC complexity. See Hono RPC docs.

### URL State Over Component State

State that should survive refresh or be shareable belongs in the URL—tabs, filters, form steps, modals, search queries:

GOOD: Step in URL

```tsx
const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(1));
```

BAD: Lost on refresh

```ts
const [step, setStep] = useState(1);
Refreshing Server Component Data
When a client mutation changes data rendered by a parent RSC, call router.refresh():

Copyfunction ProfileForm({ member }: { member: Member }) {
const router = useRouter();

const mutation = useMutation({
mutationFn: updateMember,
onSuccess: () => router.refresh(), // Re-runs RSC, gets fresh data
});
```

## Styling

### Never use SHADOW

## React

### No render helper function

Do not create render helper functions. Prefer declaring small components instead.

### Props

Don't

```tsx
interface ComponentProps {
...
}

const Component = ({}: ComponentProps) => {
..
};
```

Do

```tsx
const Component = ({}: {...}) => {
  ...
};
```

define props interface only if necessary.

## TypeScript

### Prefer Utility Types over New Types

Whenever possible, avoid defining new types. Instead, use TypeScript utility types like `Pick`, `Omit`, `Partial`, etc., to derive types from existing ones.

**Do:**

```ts
interface User {
  id: string;
  ...
  role: string;
}

// Deriving the type using Pick
type UserProfileProps = Pick<User, 'id' | 'name'>;
```
