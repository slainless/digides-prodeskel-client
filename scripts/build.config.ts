import type { BuildOptions } from 'esbuild'
import typia from '@ryoppippi/unplugin-typia/esbuild'

export const browser = {
  plugins: [typia()],
  entryPoints: ["./src/browser/**/*.ts"],
  outdir: "./dist/browser",
  target: 'es2020',
  logLevel: "info",
  platform: "browser",
} satisfies BuildOptions

export const core = {
  entryPoints: ["./src/core/**/*.ts"],
  outdir: "./dist/core",
  plugins: [typia()],
  target: 'es2020',
  logLevel: "info",
  platform: "neutral",
} satisfies BuildOptions

export const schema = {
  entryPoints: ["./src/schema/**/*.ts"],
  outdir: "./dist/schema",
  plugins: [typia()],
  target: 'es2020',
  logLevel: "info",
  platform: "neutral",
} satisfies BuildOptions

export const esm = {
  format: "esm",
  outExtension: {
    ".js": ".mjs"
  }
} satisfies BuildOptions

export const cjs = {
  format: "cjs",
  outExtension: {
    ".js": ".cjs"
  }
} satisfies BuildOptions