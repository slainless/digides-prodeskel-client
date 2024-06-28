#!/usr/bin/env -S bun run

import UnpluginTypia from '@ryoppippi/unplugin-typia/bun'
 
await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	plugins: [UnpluginTypia(/* options */)]
});