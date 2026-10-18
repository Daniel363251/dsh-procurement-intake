const React = require('react')

function useWorkspace({ data, t, menu }) {
  const [workspaceSummary, setWorkspaceSummary] = React.useState(null)
  const [workspaceLoading, setWorkspaceLoading] = React.useState(false)
  const [workspaceError, setWorkspaceError] = React.useState('')
  const [workspaceTodoDialogOpen, setWorkspaceTodoDialogOpen] = React.useState(false)
  const [workspaceTodoSaving, setWorkspaceTodoSaving] = React.useState(new Set())

  const loadWorkspaceSummary = React.useCallback(async () => {
    setWorkspaceLoading(true)
    setWorkspaceError('')
    try {
      setWorkspaceSummary(await data.workspaceSummary(30))
    } catch (caught) {
      setWorkspaceError(caught instanceof Error ? caught.message : t('dashboardLoadError'))
    } finally {
      setWorkspaceLoading(false)
    }
  }, [data, t])

  const setWorkspaceTodoRead = React.useCallback(async (todoId, isRead) => {
    setWorkspaceTodoSaving(previous => new Set(previous).add(todoId))
    try {
      await data.setWorkspaceTodosRead([todoId], isRead)
      await loadWorkspaceSummary()
    } catch (caught) {
      setWorkspaceError(caught instanceof Error ? caught.message : t('todoReadUpdateError'))
    } finally {
      setWorkspaceTodoSaving(previous => {
        const next = new Set(previous)
        next.delete(todoId)
        return next
      })
    }
  }, [data, loadWorkspaceSummary, t])

  React.useEffect(() => {
    if (menu === 'workspace') void loadWorkspaceSummary()
  }, [menu, loadWorkspaceSummary])

  return {
    workspaceSummary,
    workspaceLoading,
    workspaceError,
    workspaceTodoDialogOpen,
    workspaceTodoSaving,
    setWorkspaceTodoDialogOpen,
    loadWorkspaceSummary,
    setWorkspaceTodoRead,
  }
}

module.exports = { useWorkspace }
