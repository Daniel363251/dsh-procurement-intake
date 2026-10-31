import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        // ── shadcn 基础变体 ──────────────────────────────────
        default:     "bg-primary text-primary-foreground",
        secondary:   "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-white",
        outline:     "border-border text-foreground",

        // ── WMS 语义状态色 ───────────────────────────────────
        // 启用 / 完成 / 通过 / 生效 → 绿
        approved:    "bg-status-approved/15 text-status-approved border-status-approved/30",
        effective:   "bg-status-effective/15 text-status-effective border-status-effective/30",
        // 停用 / 非活跃 → 中性灰（不传达对错）
        muted:       "bg-muted text-muted-foreground border-border",
        // 待处理 / 待审核 → 橙黄
        pending:     "bg-status-pending/15 text-status-pending border-status-pending/30",
        // 驳回 / 错误 / 删除 → 红
        rejected:    "bg-status-rejected/15 text-status-rejected border-status-rejected/30",
        // 数量变化
        increase:    "bg-qty-increase/15 text-qty-increase border-qty-increase/30",
        decrease:    "bg-qty-decrease/15 text-qty-decrease border-qty-decrease/30",

        // ── 分类标签软色系（用于类型、来源等无语义含义的标签）──
        // 蓝  — PC来源 / 普通商品 / 货架库位
        blue:        "bg-blue-50 text-blue-700 border-blue-200",
        // 紫  — 存储区 / 周转箱 / 冷藏
        purple:      "bg-purple-50 text-purple-700 border-purple-200",
        // 青  — 收货区 / 拣选区 / 料盒
        teal:        "bg-teal-50 text-teal-700 border-teal-200",
        // 橙  — PDA来源 / 称重商品 / 发货区
        orange:      "bg-orange-50 text-orange-700 border-orange-200",
        // 粉  — 退货区 / 购物车
        rose:        "bg-rose-50 text-rose-700 border-rose-200",
        // 靛  — 暂存区 / 托盘
        indigo:      "bg-indigo-50 text-indigo-700 border-indigo-200",
        // 翠  — 发货区 / 笼车
        emerald:     "bg-emerald-50 text-emerald-700 border-emerald-200",
        // 琥珀 — 冷冻 / 托盘箱
        amber:       "bg-amber-50 text-amber-700 border-amber-200",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
