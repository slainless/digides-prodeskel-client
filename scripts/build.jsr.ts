import { build } from 'esbuild'
import { browser, core, esm } from './build.config'

await Promise.all([
	build({ ...browser, ...esm, outExtension: undefined }),
	build({ ...core, ...esm, outExtension: undefined }),
])