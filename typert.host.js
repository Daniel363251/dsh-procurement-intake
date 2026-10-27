import { $remote } from './dist/remote-def.js'

export const TYPERT = {
  package: '@hilda-biz/dsh-procurement-intake',
  face: 'host',
  schemas: [],
  get invocations() {
    return $remote.descriptors
  },
  model: {
    services: [{ key: 'procurement', exportName: 'ProcurementService', tags: [], members: [], types: [] }],
    events: [],
    objects: [],
  },
}
