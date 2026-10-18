import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const buttonVariants = cva("cn-button", {
  variants: {
    variant: {
      primary: "cn-button-variant-default",
      secondary: "cn-button-variant-secondary",
      outline: "cn-button-variant-outline",
      ghost: "cn-button-variant-ghost",
      danger: "cn-button-variant-destructive",
    },
    size: {
      sm: "cn-button-size-sm",
      md: "cn-button-size-default",
      lg: "cn-button-size-lg",
      icon: "cn-button-size-icon",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;
export type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size }), className)} type={type} {...props} />;
}
