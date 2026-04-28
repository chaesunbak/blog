## Styling

### Never use SHADOW

## Component Style

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
