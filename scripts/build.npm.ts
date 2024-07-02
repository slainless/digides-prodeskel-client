#!/usr/bin/env -S bun run

import { build } from 'esbuild'
import { browser, cjs, core, esm, schema } from './build.config'

await Promise.all([
	build({ ...browser, ...esm }),
	build({ ...browser, ...cjs }),
	build({ ...core, ...esm }),
	build({ ...core, ...cjs }),
	build({ ...schema, ...esm }),
	build({ ...schema, ...cjs }),
	build({
		...browser,
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