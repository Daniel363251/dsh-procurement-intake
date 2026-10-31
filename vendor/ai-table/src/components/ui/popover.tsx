import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"

let lastPopoverTrigger: HTMLElement | null = null

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  onClick,
  onPointerDown,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  function rememberTrigger(event: React.SyntheticEvent<HTMLElement>) {
    lastPopoverTrigger = event.currentTarget
  }

  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      {...props}
      onPointerDown={(event) => {
        rememberTrigger(event)
        onPointerDown?.(event)
      }}
      onClick={(event) => {
        rememberTrigger(event)
        onClick?.(event)
      }}
      onKeyDown={(event) => {
        rememberTrigger(event)
        onKeyDown?.(event)
      }}
    />
  )
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  style,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = React.useState<{ top: number; left: number; availableHeight: number } | null>(null)
  const side = props.side ?? "bottom"

  React.useLayoutEffect(() => {
    const updatePosition = () => {
      const trigger = lastPopoverTrigger
      const content = contentRef.current
      if (!trigger || !content) return

      const anchor = trigger.getBoundingClientRect()
      const panel = content.getBoundingClientRect()
      const gap = sideOffset
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const pad = 8
      const availableBelow = Math.max(120, viewportHeight - anchor.bottom - gap - pad)
      const availableAbove = Math.max(120, anchor.top - gap - pad)
      const useBelow = side === "bottom" && (
        availableBelow >= Math.min(content.scrollHeight, 320) || availableBelow >= availableAbove
      )
      const availableHeight = useBelow ? availableBelow : availableAbove
      const top = useBelow ? anchor.bottom + gap : anchor.top - Math.min(content.scrollHeight, availableHeight) - gap
      const desiredLeft = align === "end"
        ? anchor.right - panel.width
        : align === "center"
          ? anchor.left + (anchor.width - panel.width) / 2
          : anchor.left
      const left = Math.min(Math.max(pad, desiredLeft), Math.max(pad, viewportWidth - panel.width - pad))
      setPosition({ top: Math.max(pad, Math.min(top, viewportHeight - Math.min(panel.height, availableHeight) - pad)), left, availableHeight })
    }

    updatePosition()
    const observer = contentRef.current ? new ResizeObserver(updatePosition) : null
    if (contentRef.current) observer?.observe(contentRef.current)
    const onScroll = (event: Event) => {
      // 忽略弹窗内部自身滚动，避免滚动时反复重算位置造成抖动漂移。
      const target = event.target
      if (target instanceof Node && contentRef.current?.contains(target)) return
      updatePosition()
    }
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", onScroll, true)
    return () => {
      observer?.disconnect()
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [align, side, sideOffset])

  const anchor = lastPopoverTrigger?.getBoundingClientRect()
  const initialPosition = anchor
    ? { top: anchor.bottom + sideOffset, left: anchor.left, availableHeight: Math.max(120, window.innerHeight - anchor.bottom - sideOffset - 8) }
    : { top: 120, left: 80, availableHeight: Math.max(120, typeof window === "undefined" ? 680 : window.innerHeight - 128) }
  return (
    <PopoverPrimitive.Portal container={typeof document === "undefined" ? undefined : document.body}>
      <div
        className="ai-table-plugin"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2147483000,
          pointerEvents: "none",
        }}
      >
      <PopoverPrimitive.Content
        ref={contentRef}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        style={{
          ...style,
          position: "fixed",
          top: position?.top ?? initialPosition.top,
          left: position?.left ?? initialPosition.left,
          maxHeight: position?.availableHeight ?? initialPosition.availableHeight,
          "--radix-popover-content-available-height": `${position?.availableHeight ?? initialPosition.availableHeight}px`,
          transform: "none",
          zIndex: 2147483000,
          pointerEvents: "auto",
        }}
        className={cn(
          "z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
      </div>
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
