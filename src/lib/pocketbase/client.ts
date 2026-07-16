import PocketBase from 'pocketbase'

const pbUrl =
  import.meta.env.VITE_POCKETBASE_URL ||
  'https://gerador-de-documentos-react-85e34.shrd00.internal.goskip.dev'

const pb = new PocketBase(pbUrl)
pb.autoCancellation(false)

export default pb
