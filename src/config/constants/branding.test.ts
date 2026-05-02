import fs from 'fs'
import path from 'path'
import manifest from '../../../public/manifest.json'
import { DEFAULT_META } from './meta'

describe('OpenCoin branding', () => {
  it('uses OpenCoin browser metadata', () => {
    const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'public/index.html'), 'utf8')

    expect(indexHtml).toContain('<title>OpenCoin</title>')
    expect(manifest.name).toBe('OpenCoin')
    expect(manifest.short_name).toBe('OpenCoin')
    expect(DEFAULT_META.title).toBe('OpenCoin')
  })

  it('does not expose PancakeSwap or HiveSwap metadata', () => {
    const metadata = JSON.stringify({
      indexHtml: fs.readFileSync(path.resolve(process.cwd(), 'public/index.html'), 'utf8'),
      manifest,
      defaultMeta: DEFAULT_META,
    })

    expect(metadata).not.toMatch(/PancakeSwap|HiveSwap|Hiveswap/i)
  })

  it('does not expose legacy swap branding in user-facing copy', () => {
    const userFacingFiles = [
      'src/config/constants/meta.ts',
      'src/config/constants/tokens.ts',
      'src/config/index.ts',
      'src/hooks/useGetDocumentTitlePrice.ts',
      'src/components/Menu/GlobalSettings/SettingsModal.tsx',
      'src/components/PositionCard/index.tsx',
      'src/config/localization/translations.json',
      'public/locales/en-US.json',
      'public/locales/zh-CN.json',
    ]

    const copy = userFacingFiles
      .map((filePath) => fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8'))
      .map((source) =>
        source
          .split('\n')
          .filter((line) => !line.includes('@pancakeswap/'))
          .join('\n'),
      )
      .join('\n')

    expect(copy).not.toMatch(/PancakeSwap|HiveSwap|Hiveswap|pancake-flipping|pancake-icon|https:\/\/pancakeswap/i)
  })
})
