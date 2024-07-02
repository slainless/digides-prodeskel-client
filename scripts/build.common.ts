import typia from '@ryoppippi/unplugin-typia/esbuild'
import { build, type BuildOptions } from 'esbuild'

export const mjsExtension = {
	".js": ".mjs"
}

export const cjsExtension = {
	".js": ".cjs"
}

const browserConfig = {
	entryPoints: ["./src/core/**/*.ts"],
	outdir: "./dist/core",
	plugins: [typia()],
	target: 'es2020',
	logLevel: "info",
	platform: "neutral",
} satisfies BuildOptions

export const buildCommon = () => Promise.all([
	build({
		...browserConfig,
		format: "esm",
		outExtension: mjsExtension
	}),
	build({
		...browserConfig,
		format: "cjs",
		outExtension: cjsExtension
	})
])