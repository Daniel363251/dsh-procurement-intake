import { useEffect, useRef } from 'react'

/**
 * useOverlayHideGuard — 工作区页签失活时自动关闭打开中的受控浮层
 *
 * 背景：工作区页签用 React <Activity> 缓存页面实例（state 保留、隐藏时销毁 effects）。
 * 若在 Sheet/Dialog 打开状态下切走页签，open=true 的 state 被保留，切回时浮层重新
 * 挂载，但入场动画在 Activity 生命周期下不会重放——形成「全屏透明遮罩
 * （pointer-events:auto）+ 视口外面板」的隐形拦截层，吃掉页面全部点击（表现为列表页
 * 查询/重置按钮点击不生效），且控制台无任何报错。
 *
 * 实现：Activity 隐藏时销毁全部 effects，effect cleanup 是失活瞬间唯一保证执行的
 * 时机；在此调用 onOpenChange(false) 让页面复位 open。hidden 树的 setState 会延迟到
 * 重新可见时应用，因此切回时浮层已关闭、无残留。组件卸载时 cleanup 同样触发，对已
 * 卸载组件 setState 是 no-op，安全。
 *
 * 延迟武装：StrictMode dev 下 effect 双调用（setup→cleanup→setup），首段 cleanup
 * 会在挂载瞬间同步执行；若不区分，「条件挂载即 open」的浮层（如 {detail && <Sheet
 * open>}）会被立即误关。cleanup 仅在挂载后一帧才武装（armed），模拟卸载时 clearTimeout
 * 且不触发。
 *
 * 仅覆盖受控用法（显式传 open + onOpenChange）；非受控浮层（defaultOpen/Trigger
 * 驱动）的 open state 在 Radix 内部，不在此保护范围内。
 */
export function useOverlayHideGuard(
  isOpen: boolean | undefined,
  onOpenChange?: (open: boolean) => void,
): void {
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen
  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange

  useEffect(() => {
    let armed = false
    const timer = window.setTimeout(() => { armed = true }, 0)
    return () => {
      window.clearTimeout(timer)
      if (armed && isOpenRef.current) onOpenChangeRef.current?.(false)
    }
  }, [])
}
