const React = require('react')

function useModelSettings({ data, t, setError, setSuccess }) {
  const [modelOptions, setModelOptions] = React.useState({ models: [], reasoningEfforts: [] })
  const [modelSettings, setModelSettings] = React.useState({ model: 'deepseek-flash', reasoningEffort: 'off' })
  const loadModelSettings = React.useCallback(async () => {
    try {
      const [options, settings] = await Promise.all([data.listModelOptions(), data.getModelSettings()])
      setModelOptions(options)
      setModelSettings(settings)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
    }
  }, [data])
  React.useEffect(() => { void loadModelSettings() }, [loadModelSettings])
  async function saveModelSettings() {
    try {
      await data.updateModelSettings(modelSettings.model, modelSettings.reasoningEffort)
      setSuccess(t('settingsSaved'))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
    }
  }
  return { modelOptions, modelSettings, setModelSettings, saveModelSettings }
}

module.exports = { useModelSettings }
