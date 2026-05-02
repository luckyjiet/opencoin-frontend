const PANCAKE_EXTENDED = 'https://ipfs.hiveswap.io/ipns/QmX9kuqNRG15Wvuwwoou5FCSCmabjkt5bQgS99EiXjKgtG/Hiveswap_Default_List_BSC_Testnet.json'
const PANCAKE_TOP100 = 'https://ipfs.hiveswap.io/ipns/QmX9kuqNRG15Wvuwwoou5FCSCmabjkt5bQgS99EiXjKgtG/Hiveswap_Default_List_BSC_Testnet.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  PANCAKE_TOP100,
  PANCAKE_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
