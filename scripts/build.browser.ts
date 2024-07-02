#!/usr/bin/env -S bun run

import typia from '@ryoppippi/unplugin-typia/esbuild'
import { build, type BuildOptions } from 'esbuild'
import { buildCommon, cjsExtension, mjsExtension } from './build.common'

const browserConfig = {
	plugins: [typia()],
	entryPoints: ["./src/browser/**/*.ts"],
	outdir: "./dist/browser",
	target: 'es2020',
	logLevel: "info",
	platform: "browser",
} satisfies BuildOptions

await Promise.all([
	buildCommon(),
	build({
		...browserConfig,
		format: "esm",
		outExtension: mjsExtension
	}),
	build({
		...browserConfig,
		format: "cjs",
		outExtension: cjsExtension
	}),
	build({
		...browserConfig,
		entryPoints: ["./src/browser/index.ts"],
		outdir: undefined,
		outfile: "./dist/browser/index.js",
		format: 'iife',
		minify: true,
		bundle: true,
		globalName: "digitaldesa.prodeskel",
		external: [],
	}),
])