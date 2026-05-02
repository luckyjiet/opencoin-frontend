# OpenCoin DEX Migration Design

Date: 2026-05-02

## Goal

Create `opencoin-frontend` as an independent OpenCoin DEX frontend by migrating the HiveSwap swap, pool discovery, add liquidity, and remove liquidity surfaces while dropping unrelated farming, staking, home, IFO, NFT, and rewards features.

## Scope

The first migration ships these routes:

- `/swap`
- `/swap/:outputCurrency`
- `/liquidity`
- `/pool` redirecting to `/liquidity`
- `/find`
- `/add`
- `/add/:currencyIdA`
- `/add/:currencyIdA/:currencyIdB`
- `/remove/:currencyIdA/:currencyIdB`

The first migration does not include farm staking, syrup pools, vaults, lottery, IFO, NFT profile, analytics dashboards, marketing home pages, or admin pages.

## Recommended Approach

Use a focused DEX migration instead of copying the entire HiveSwap application. The target app should keep the existing CRA React 17, Redux Toolkit, web3-react, ethers v5, Pancake UI, and Pancake SDK based implementation because HiveSwap already has working swap, liquidity, token search, approvals, transaction tracking, and multicall flows.

The migration must introduce an OpenCoin configuration boundary so protocol-specific values are not scattered across the UI. At minimum it must centralize:

- OpenCoin factory address
- OpenCoin router address
- wrapped native token address
- multicall address
- pair init code hash
- default token list and suggested bases
- chain RPC and block explorer URLs

OpenCoin BSC testnet addresses currently available from `opencoin-contract/contractInfo.json`:

- `OpenCoinFactory`: `0xeF7290f5dC0E6752724d3605875d59AF5a2eE55c`
- `OpenCoinRouter`: `0x036f2081ac476492FdF4b94877a608E72bf4826E`

The wrapped native token address for BSC testnet should remain `0xae13d989dac2f0debff460ac112a837c89baa7cd` unless deployment config changes.

## Architecture

`opencoin-frontend` will be bootstrapped from the HiveSwap source tree, then reduced to the DEX dependency graph. The app shell remains React Router based and wraps the DEX routes in web3, redux, theme, localization, modal, toast, refresh, and multicall providers.

The Redux store should keep only state slices used by the DEX:

- `application`
- `block`
- `burn`
- `lists`
- `mint`
- `multicall`
- `swap`
- `transactions`
- `user`

The app should remove farm and staking reducers, hooks, polling, config, and views unless a retained DEX component directly requires a small utility. Any retained utility must be moved or kept only if it supports swap or liquidity behavior.

## Pair Address Calculation

The existing HiveSwap code imports `Pair.getAddress` and related routing behavior from `@pancakeswap/sdk`. That SDK embeds PancakeSwap factory and init code hash constants. OpenCoin pools will be queried incorrectly unless this is adapted.

The migration should add a local SDK patch or wrapper that makes pair address calculation use OpenCoin factory and init code hash. The preferred implementation is to patch the installed `@pancakeswap/sdk` package with `patch-package` because the existing DEX code already depends on SDK `Pair`, `Trade`, `Route`, and token math types. The patch must set:

- `FACTORY_ADDRESS` to the OpenCoin factory address
- `INIT_CODE_HASH` to the OpenCoin pair init code hash

The init code hash should be taken from `OpenCoinFactory.INIT_CODE_PAIR_HASH()` or the contract build output, never reused from Pancake values.

## Components

The retained UI should include:

- App shell and DEX menu
- Swap view and confirmation modals
- Pool list, pool finder, position cards
- Add liquidity and remove liquidity views
- Currency input, token search, import token/list modals
- Transaction confirmation and transaction updater
- Wallet connect button and web3 connection hooks
- Toasts, loaders, layout primitives, logos, and modal helpers required by these pages

The app should not expose unrelated menu items or routes. Unknown routes redirect to `/swap`.

## Data Flow

On app start, providers initialize web3-react, redux, theme, localization, modal, toast, and refresh contexts. Updaters load token lists, block number, transactions, application state, and multicall cache. The user chooses currencies and amounts on swap or liquidity screens. Hooks compute wrapped currencies, candidate pairs, trades, slippage bounds, approvals, and router call parameters. Transactions are submitted through the OpenCoin router and tracked in the transactions slice until confirmed.

## Error Handling

Existing DEX handling should be retained for:

- unsupported network
- missing wallet
- invalid token address
- insufficient balance
- missing pair
- price impact warnings
- slippage tolerance
- transaction rejection
- failed transaction receipt

OpenCoin-specific config errors should fail visibly during development. Invalid router, factory, multicall, or wrapped native token addresses should not be silently ignored.

## Testing

Use test-first changes where practical around the migration risks:

- a pair address utility test proves OpenCoin factory and init code hash are used
- a route test or render smoke test proves `/swap`, `/liquidity`, `/add`, and `/remove` resolve
- existing reducer tests should still pass after store reduction

Verification should include:

- `npm install` or dependency restoration in `opencoin-frontend`
- targeted Jest tests for migrated utilities/state
- `npm run build`
- local dev server smoke test for DEX routes

## Acceptance Criteria

- `opencoin-frontend` contains a standalone frontend project.
- The first screen redirects to `/swap`.
- Swap, liquidity list, add liquidity, and remove liquidity pages render.
- Router contract calls use `0x036f2081ac476492FdF4b94877a608E72bf4826E`.
- Pair address calculation uses the OpenCoin factory and OpenCoin init code hash.
- Unrelated HiveSwap farming, staking, and marketing surfaces are not present in routing or menu navigation.
- The project builds successfully.
