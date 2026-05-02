# OpenCoin DEX Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `opencoin-frontend` DEX by migrating HiveSwap swap and liquidity pages and adapting router, factory, init code hash, and LP permit domain to OpenCoin.

**Architecture:** Bootstrap the target from HiveSwap's CRA React application, keep the active DEX route graph, and centralize OpenCoin protocol constants in the existing config layer. Use `patch-package` to persist `@pancakeswap/sdk` runtime/type changes so deployments reproduce the OpenCoin factory, init code hash, and wrapped native token configuration after install.

**Tech Stack:** React 17, Create React App, TypeScript, Redux Toolkit, web3-react, ethers v5, Pancake UI, `@pancakeswap/sdk`, `patch-package`, Jest.

---

## File Structure

- `package.json`: rename app and add `postinstall` plus `patch-package`.
- `package-lock.json`: npm-managed dependency lock after adding `patch-package`.
- `src/config/constants/index.ts`: set OpenCoin router address and DEX trade bases.
- `src/config/constants/tokens.ts`: keep BSC testnet wrapped native token and default token config aligned with OpenCoin.
- `src/App.tsx`: keep DEX-only routes and remove farm polling.
- `src/state/index.ts`: keep the existing reducers during the initial migration to avoid typecheck churn, then remove unused slices after build is stable.
- `src/views/RemoveLiquidity/index.tsx`: set EIP-712 LP domain name to the OpenCoin pair ERC20 `name()` value, `OpenCoin LPs`.
- `patches/@pancakeswap+sdk+2.3.2.patch`: persist SDK changes for factory, init code hash, and WBNB testnet address.
- `src/config/constants/opencoin.test.ts`: test OpenCoin router config.
- `src/config/constants/sdkPatch.test.ts`: test that patched SDK constants and pair address calculation use OpenCoin values.

## Constants

- Router: `0x036f2081ac476492FdF4b94877a608E72bf4826E`
- Factory: `0xeF7290f5dC0E6752724d3605875d59AF5a2eE55c`
- Init code hash: `0x981e49342e5cea6c3697d4e2e5a10c749866dd92695b4626dc7148c82e87d102`
- BSC testnet WBNB: `0xae13d989dac2f0debff460ac112a837c89baa7cd`
- LP permit domain name: `OpenCoin LPs`

### Task 1: Bootstrap Target App

**Files:**
- Copy from: `HiveSwap/`
- Modify: `opencoin-frontend/package.json`
- Modify: `opencoin-frontend/src/App.tsx`

- [ ] **Step 1: Copy HiveSwap application files**

Run:

```bash
rsync -a --exclude .git --exclude node_modules --exclude build HiveSwap/ opencoin-frontend/
```

Expected: `opencoin-frontend` contains `src`, `public`, `package.json`, lockfiles, and the previously committed `docs` directory.

- [ ] **Step 2: Rename package and add patch-package scripts**

Edit `opencoin-frontend/package.json`:

```json
{
  "name": "opencoin-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "analyze": "source-map-explorer 'build/static/js/*.js'",
    "start": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start",
    "build": "NODE_OPTIONS=--openssl-legacy-provider react-scripts build",
    "test": "NODE_OPTIONS=--openssl-legacy-provider react-scripts test",
    "postinstall": "patch-package"
  }
}
```

Keep the remaining existing scripts and dependencies unchanged.

- [ ] **Step 3: Remove farm polling from the active app shell**

In `opencoin-frontend/src/App.tsx`, remove:

```ts
import { usePollCoreFarmData } from 'state/farms/hooks'
```

and remove:

```ts
usePollCoreFarmData()
```

Expected: active routes remain `/swap`, `/liquidity`, `/find`, `/add`, and `/remove`.

- [ ] **Step 4: Commit bootstrap**

Run:

```bash
git add .
git commit -m "chore: bootstrap opencoin frontend from hiveswap"
```

### Task 2: Add OpenCoin Config Tests

**Files:**
- Create: `opencoin-frontend/src/config/constants/opencoin.test.ts`
- Create: `opencoin-frontend/src/config/constants/sdkPatch.test.ts`

- [ ] **Step 1: Write failing router config test**

Create `src/config/constants/opencoin.test.ts`:

```ts
import { ROUTER_ADDRESS } from './index'

describe('OpenCoin constants', () => {
  it('uses the OpenCoin router address', () => {
    expect(ROUTER_ADDRESS).toBe('0x036f2081ac476492FdF4b94877a608E72bf4826E')
  })
})
```

- [ ] **Step 2: Write failing SDK patch test**

Create `src/config/constants/sdkPatch.test.ts`:

```ts
import { ChainId, FACTORY_ADDRESS, INIT_CODE_HASH, Token, Pair, WETH } from '@pancakeswap/sdk'

describe('patched Pancake SDK constants', () => {
  it('uses OpenCoin factory and init code hash', () => {
    expect(FACTORY_ADDRESS).toBe('0xeF7290f5dC0E6752724d3605875d59AF5a2eE55c')
    expect(INIT_CODE_HASH).toBe('0x981e49342e5cea6c3697d4e2e5a10c749866dd92695b4626dc7148c82e87d102')
  })

  it('uses the BSC testnet wrapped native token', () => {
    expect(WETH[ChainId.TESTNET].address).toBe('0xae13d989dac2f0debff460ac112a837c89baa7cd')
  })

  it('calculates OpenCoin pair addresses from the patched factory', () => {
    const tokenA = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000001', 18, 'A', 'Token A')
    const tokenB = new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000002', 18, 'B', 'Token B')

    expect(Pair.getAddress(tokenA, tokenB)).toBe('0xf6Ea39113B009337F28b81C6997b6dF7cFA9fd7E')
  })
})
```

- [ ] **Step 3: Run tests and verify red**

Run:

```bash
npm test -- --runInBand src/config/constants/opencoin.test.ts src/config/constants/sdkPatch.test.ts
```

Expected: `opencoin.test.ts` fails because the router is still the HiveSwap value, and `sdkPatch.test.ts` fails because SDK constants still use Pancake values.

### Task 3: Apply OpenCoin Constants And SDK Patch

**Files:**
- Modify: `opencoin-frontend/src/config/constants/index.ts`
- Modify: `opencoin-frontend/node_modules/@pancakeswap/sdk/dist/constants.d.ts`
- Modify: `opencoin-frontend/node_modules/@pancakeswap/sdk/dist/sdk.cjs.development.js`
- Modify: `opencoin-frontend/node_modules/@pancakeswap/sdk/dist/sdk.esm.js`
- Modify: `opencoin-frontend/node_modules/@pancakeswap/sdk/dist/sdk.cjs.production.min.js`
- Create: `opencoin-frontend/patches/@pancakeswap+sdk+2.3.2.patch`

- [ ] **Step 1: Install dependencies and patch-package**

Run:

```bash
npm install
npm install patch-package --save-dev
```

Expected: `node_modules` exists, `patch-package` is in `devDependencies`, and `package-lock.json` is updated.

- [ ] **Step 2: Change router address**

In `src/config/constants/index.ts`, set:

```ts
export const ROUTER_ADDRESS = '0x036f2081ac476492FdF4b94877a608E72bf4826E'
```

- [ ] **Step 3: Patch SDK constants in node_modules**

Set every runtime/type occurrence of:

```ts
FACTORY_ADDRESS = '0xeF7290f5dC0E6752724d3605875d59AF5a2eE55c'
INIT_CODE_HASH = '0x981e49342e5cea6c3697d4e2e5a10c749866dd92695b4626dc7148c82e87d102'
WETH[ChainId.TESTNET] = '0xae13d989dac2f0debff460ac112a837c89baa7cd'
```

Expected changed files:

```text
node_modules/@pancakeswap/sdk/dist/constants.d.ts
node_modules/@pancakeswap/sdk/dist/sdk.cjs.development.js
node_modules/@pancakeswap/sdk/dist/sdk.esm.js
node_modules/@pancakeswap/sdk/dist/sdk.cjs.production.min.js
```

- [ ] **Step 4: Generate patch-package patch**

Run:

```bash
npx patch-package @pancakeswap/sdk
```

Expected: `patches/@pancakeswap+sdk+2.3.2.patch` exists and includes factory, init code hash, and WBNB testnet changes.

- [ ] **Step 5: Run tests and verify green**

Run:

```bash
npm test -- --runInBand src/config/constants/opencoin.test.ts src/config/constants/sdkPatch.test.ts
```

Expected: both test files pass.

- [ ] **Step 6: Commit config and patch**

Run:

```bash
git add package.json package-lock.json patches src/config/constants
git commit -m "fix: configure dex for opencoin contracts"
```

### Task 4: Set Remove Liquidity Permit Domain

**Files:**
- Modify: `opencoin-frontend/src/views/RemoveLiquidity/index.tsx`

- [ ] **Step 1: Confirm pair ERC20 name**

Read `opencoin-contract/contracts/swap-core/OpenCoinERC20.sol` and confirm:

```solidity
string public constant name = 'OpenCoin LPs';
```

- [ ] **Step 2: Update the EIP-712 domain name**

In `src/views/RemoveLiquidity/index.tsx`, set:

```ts
const domain = {
  name: 'OpenCoin LPs',
  version: '1',
  chainId,
  verifyingContract: pair.liquidityToken.address,
}
```

- [ ] **Step 3: Commit permit domain change**

Run:

```bash
git add src/views/RemoveLiquidity/index.tsx
git commit -m "fix: use opencoin lp permit domain"
```

### Task 5: Verify Build And Routes

**Files:**
- Read: `opencoin-frontend/src/App.tsx`
- Read: `opencoin-frontend/src/components/Menu/config.ts`

- [ ] **Step 1: Run tests**

Run:

```bash
npm test -- --runInBand src/config/constants/opencoin.test.ts src/config/constants/sdkPatch.test.ts
```

Expected: tests pass.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: CRA creates `build/` successfully.

- [ ] **Step 3: Start dev server**

Run:

```bash
npm start
```

Expected: local server starts and serves the app, typically at `http://localhost:3000`.

- [ ] **Step 4: Commit final verification fixes if needed**

Run only if build fixes were required:

```bash
git add src package.json package-lock.json patches
git commit -m "fix: stabilize opencoin dex build"
```
