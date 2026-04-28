## Styling

## Never use SHADOW

## Component Style

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
