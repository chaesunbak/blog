import { type VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const inputGroupAddonVariants = cva(
  'text-muted-foreground flex shrink-0 items-center gap-1',
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-3',
        'inline-end': 'order-last pr-2',
        'block-start': 'order-first basis-full border-b px-3 py-2',
        'block-end': 'order-last basis-full border-t px-3 py-2',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

function InputGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        'focus-within:ring-ring flex w-full flex-wrap items-center rounded-lg border border-input bg-transparent ring-offset-1 transition-all focus-within:ring-[2px]',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupAddon({
  className,
  align,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn(inputGroupAddonVariants({ align }), className)}
      {...props}
    />
  );
}

function InputGroupButton({
  className,
  size = 'xs',
  variant = 'ghost',
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="input-group-button"
      size={size}
      variant={variant}
      className={cn(className)}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'order-2 h-full min-w-0 flex-1 basis-0 border-0 bg-transparent px-0 py-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupText({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="input-group-text"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
};
