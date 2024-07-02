import { build } from 'esbuild'
import { browser, core, esm, schema } from './build.config'

await Promise.all([
	build({ ...browser, ...esm, outExtension: undefined }),
	build({ ...core, ...esm, outExtension: undefined }),
	build({ ...schema, ...esm, outExtension: undefined }),
])