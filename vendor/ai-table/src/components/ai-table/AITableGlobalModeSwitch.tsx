import { AITableModeSwitchControl } from './AITableModeSwitch'
import { useAITableShell } from './AITableShellContext'

/**
 * AppLayout 级列表页入口。页面只需挂载 AITableProvider 即完成注册，
 * 没有接入 AI Table 的页面不会显示入口。
 */
export function AITableGlobalModeSwitch() {
  const registration = useAITableShell()?.registration
  if (!registration) return null

  return (
    <AITableModeSwitchControl
      mode={registration.mode}
      modeTransition={registration.modeTransition}
      dirty={registration.dirty}
      setMode={registration.setMode}
      cancelDraft={registration.cancelDraft}
    />
  )
}
