import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { useOverlayHideGuard } from "../../lib/overlay-hide-guard"

// ⚠️ 底层从 vaul 换成 Radix Dialog：
// vaul(Drawer) 会给 body 设 pointer-events:none 并自管指针事件，与盖在 Sheet
// 之上的 Radix AlertDialog（如 useDirtyGuard 的放弃编辑确认）冲突，导致确认框
// 按钮点不动（vaul#245）。改用 Radix Dialog 后，两者共享同一套 DismissableLayer
// 栈，嵌套弹层的指针事件天然协调。对外 API（Sheet/SheetContent 的 direction、
// size、children 布局）保持不变。

type SheetDirection = "right" | "left" | "top" | "bottom"

const SheetDirectionContext = React.createContext<SheetDirection>("right")

function Sheet({
  direction = "right",
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root> & {
  direction?: SheetDirection
}) {
  // 页签失活时关闭打开中的 Sheet，防止 Activity 保留 open state 切回后
  // 残留隐形遮罩拦截页面点击（见 useOverlayHideGuard 注释）
  useOverlayHideGuard(props.open, props.onOpenChange)
  return (
    <SheetDirectionContext.Provider value={direction}>
      <SheetPrimitive.Root data-slot="sheet" {...props}>
        {children}
      </SheetPrimitive.Root>
    </SheetDirectionContext.Provider>
  )
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    />
  )
}

const sheetContentVariants = cva(
  cn(
    "group/sheet-content fixed z-50 flex flex-col bg-card shadow-lg transition ease-in-out",
    "data-[state=open]:animate-in data-[state=open]:duration-500",
    "data-[state=closed]:animate-out data-[state=closed]:duration-300",
  ),
  {
    variants: {
      direction: {
        right:
          "inset-y-0 right-0 h-full border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
        left:
          "inset-y-0 left-0 h-full border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
        top:
          "inset-x-0 top-0 w-full border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
        bottom:
          "inset-x-0 bottom-0 w-full border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        xl: "",
        "2xl": "",
        full: "",
      },
    },
    // 宽度仅对左右方向生效（上下方向由 w-full 接管）
    compoundVariants: [
      { direction: ["right", "left"], size: "sm", className: "w-80" },
      { direction: ["right", "left"], size: "md", className: "w-[480px]" },
      { direction: ["right", "left"], size: "lg", className: "w-[640px]" },
      { direction: ["right", "left"], size: "xl", className: "w-[800px]" },
      { direction: ["right", "left"], size: "2xl", className: "w-[960px]" },
      { direction: ["right", "left"], size: "full", className: "w-screen" },
    ],
    defaultVariants: { direction: "right", size: "lg" },
  },
)

function SheetContent({
  className,
  size,
  direction: directionProp,
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> &
  VariantProps<typeof sheetContentVariants>) {
  const ctxDirection = React.useContext(SheetDirectionContext)
  const direction = directionProp ?? ctxDirection

  return (
    <SheetPortal><div className="ai-table-plugin">
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(sheetContentVariants({ direction, size }), className)}
        {...props}
      >
        <SheetPrimitive.Close
          data-slot="sheet-close-button"
          className="absolute top-4 right-4 z-10 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          <XIcon />
          <span className="sr-only">关闭</span>
        </SheetPrimitive.Close>
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </SheetPrimitive.Content>
    </div></SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-0.5 p-6 pb-0", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-6 pt-0", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet, SheetClose, SheetContent, SheetDescription,
  SheetFooter, SheetHeader, SheetOverlay, SheetPortal,
  SheetTitle, SheetTrigger,
}
