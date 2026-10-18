const React = require('react')

function useMasterData({ data, t, menu, setError, setSuccess }) {
  const [masterDataType, setMasterDataType] = React.useState(null)
  const [masterDataRows, setMasterDataRows] = React.useState([])
  const [masterDataSelected, setMasterDataSelected] = React.useState(new Set())
  const [masterDataLoading, setMasterDataLoading] = React.useState(false)
  const [masterDataOverviewCount, setMasterDataOverviewCount] = React.useState(null)
  const [masterDataOverviewLoading, setMasterDataOverviewLoading] = React.useState(false)
  const [masterDataSaving, setMasterDataSaving] = React.useState(false)
  const [masterDataDraft, setMasterDataDraft] = React.useState(null)
  const refreshMasterData = React.useCallback(async () => {
    setMasterDataLoading(true)
    try {
      const result = await data.listMasterData(masterDataType)
      setMasterDataRows((result.rows || []).filter(row => String(row?.name ?? '').trim()))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
    } finally {
      setMasterDataLoading(false)
    }
  }, [data, masterDataType])
  const refreshMasterDataOverview = React.useCallback(async () => {
    setMasterDataOverviewLoading(true)
    try {
      const lists = await Promise.all(['suppliers', 'materials', 'materialCategories'].map(type => data.listMasterData(type)))
      setMasterDataOverviewCount(lists.reduce((count, result) => count + (result.rows || []).filter(row => String(row?.name ?? '').trim()).length, 0))
    } catch (caught) {
      setMasterDataOverviewCount(-1)
      setError(caught instanceof Error ? caught.message : String(caught))
    } finally {
      setMasterDataOverviewLoading(false)
    }
  }, [data])
  React.useEffect(() => {
    if (menu === 'masterData' && masterDataType) void refreshMasterData()
  }, [masterDataType, menu, refreshMasterData])
  React.useEffect(() => {
    if (menu === 'masterData' && !masterDataType && masterDataOverviewCount === null) void refreshMasterDataOverview()
  }, [masterDataOverviewCount, masterDataType, menu, refreshMasterDataOverview])
  function openMasterDataType(type) {
    setMasterDataType(type)
    setMasterDataRows([])
    setMasterDataLoading(true)
    setMasterDataSelected(new Set())
    setMasterDataDraft(null)
  }
  async function saveMasterRecord() {
    if (!masterDataDraft || masterDataSaving) return
    setMasterDataSaving(true); setError(''); setSuccess('')
    try {
      await data.saveMasterData(masterDataType, masterDataDraft)
      setMasterDataDraft(null)
      setSuccess(t('masterSaved'))
      await refreshMasterData()
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setMasterDataSaving(false) }
  }
  async function changeMasterDataStatus(ids, status) {
    if (!ids.length) return
    setMasterDataLoading(true); setError(''); setSuccess('')
    try {
      const result = await data.setMasterDataStatus(masterDataType, ids, status)
      setMasterDataSelected(new Set())
      setSuccess(t('masterStatusUpdated').replace('{count}', String(result.updatedCount)))
      await refreshMasterData()
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setMasterDataLoading(false) }
  }
  async function deleteMasterRecords(ids) {
    if (!ids.length || !window.confirm(t('masterDeleteConfirm').replace('{count}', String(ids.length)))) return
    setMasterDataLoading(true); setError(''); setSuccess('')
    try {
      const result = await data.deleteMasterData(masterDataType, ids)
      setMasterDataSelected(new Set())
      setSuccess(t('masterDeleted').replace('{count}', String(result.deletedCount)))
      await refreshMasterData()
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setMasterDataLoading(false) }
  }
  return {
    masterDataType, setMasterDataType, masterDataRows, setMasterDataRows,
    masterDataSelected, setMasterDataSelected, masterDataLoading, masterDataOverviewCount,
    setMasterDataOverviewCount, masterDataOverviewLoading, masterDataSaving, masterDataDraft,
    setMasterDataDraft, refreshMasterData, refreshMasterDataOverview, openMasterDataType,
    saveMasterRecord, changeMasterDataStatus, deleteMasterRecords,
  }
}

module.exports = { useMasterData }
