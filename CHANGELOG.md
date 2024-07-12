# Changelog

---
## [0.1.19](https://github.com/slainless/prodeskel-ws/compare/v0.1.18..0.1.19) - 2024-07-12

### Features

- added close connection shortcut - ([e74918c](https://github.com/slainless/prodeskel-ws/commit/e74918c5365625eb64b3da49d32f5a0ae58abfd3)) - Aiman Fauzy

### Refactoring

-  [**breaking**]renamed UnprefixedEventName to EventName; EventName to PrefixedEventName - ([f7083e5](https://github.com/slainless/prodeskel-ws/commit/f7083e50091de8a1820c565c095f0e634b204a73)) - Aiman Fauzy

---
## [0.1.18](https://github.com/slainless/prodeskel-ws/compare/v0.1.17..0.1.18) - 2024-07-09

### Bug Fixes

- set state to syncing on auth:ok and sync_task - ([a28c291](https://github.com/slainless/prodeskel-ws/commit/a28c2917b91e89347eeab57fe053d346cec1ec4e)) - Aiman Fauzy

---
## [0.1.17](https://github.com/slainless/prodeskel-ws/compare/v0.1.16..0.1.17) - 2024-07-09

### Features

- added sync_progress event and typed SyncTaskProgress - ([efc9d96](https://github.com/slainless/prodeskel-ws/commit/efc9d96988b77d63b4b5261abbebe9f41028b604)) - Aiman Fauzy

---
## [0.1.16](https://github.com/slainless/prodeskel-ws/compare/v0.1.15..0.1.16) - 2024-07-08

### Bug Fixes

- missing state guard on start onStop listener - ([dd705eb](https://github.com/slainless/prodeskel-ws/commit/dd705eb2dc1c6260250e48c951051efc1b734dba)) - Aiman Fauzy
- added inherent sync status listener - ([bf8b221](https://github.com/slainless/prodeskel-ws/commit/bf8b221930ab0cd204592cbf6ea69883ac8df0b5)) - Aiman Fauzy

### Build

- added isolatedModules, stripInternal to tsconfig; tag some private symbols as @internal - ([bd9927e](https://github.com/slainless/prodeskel-ws/commit/bd9927e2add1c90cf05d2e7edf11dbb1ce52d320)) - Aiman Fauzy

---
## [0.1.14](https://github.com/slainless/prodeskel-ws/compare/v0.1.13..0.1.14) - 2024-07-04

### Build

- added import map - ([0538b05](https://github.com/slainless/prodeskel-ws/commit/0538b0538e63c2f3aaf4da71cbce55a7a0fa98a1)) - Aiman Fauzy

---
## [0.1.13](https://github.com/slainless/prodeskel-ws/compare/v0.1.12..0.1.13) - 2024-07-04

### Build

- added post_build script to prepend reference directive to generated js - ([e09438b](https://github.com/slainless/prodeskel-ws/commit/e09438be9ee79965b9d07e8d87b03827138749a7)) - Aiman Fauzy

---
## [0.1.12](https://github.com/slainless/prodeskel-ws/compare/v0.1.11..0.1.12) - 2024-07-04

### Bug Fixes

- always send logic packet - ([1edf31b](https://github.com/slainless/prodeskel-ws/commit/1edf31b473f2e942db2e70c75386b82ad2b667a0)) - Aiman Fauzy
- added handling for error/close post-connected, also added new State: CLOSED - ([dc36835](https://github.com/slainless/prodeskel-ws/commit/dc368357ea3e7d3a1b1d256f72962fa9667f40ca)) - Aiman Fauzy

---
## [0.1.11](https://github.com/slainless/prodeskel-ws/compare/v0.1.10..0.1.11) - 2024-07-03

### Documentation

- added CHANGELOG - ([87a63a6](https://github.com/slainless/prodeskel-ws/commit/87a63a6219250fe008e2b1a4c92a8edd3736cb21)) - Aiman Fauzy
- trim changelog - ([17245cf](https://github.com/slainless/prodeskel-ws/commit/17245cf4af0c42201650988b36c5a9e9fac9a8a7)) - Aiman Fauzy

### Build

- added publish script - ([3de1957](https://github.com/slainless/prodeskel-ws/commit/3de1957fbf8440a2794780d4ecbee9323de88e8d)) - Aiman Fauzy
- fix publish script - ([1e952bb](https://github.com/slainless/prodeskel-ws/commit/1e952bbc2d1d8839303925dcf79dac55f6ce5d6a)) - Aiman Fauzy

---
## [0.1.10](https://github.com/slainless/prodeskel-ws/compare/v0.1.9..v0.1.10) - 2024-07-03

### Bug Fixes

- identify yourself command format - ([3e3ddf0](https://github.com/slainless/prodeskel-ws/commit/3e3ddf00c7ab8989e6d1e84c60e2a1ec9377202d)) - Aiman Fauzy

### Build

- added git-cliff - ([5931eb5](https://github.com/slainless/prodeskel-ws/commit/5931eb5d5bbac4045924fe25ca4d7e0d0817c07c)) - Aiman Fauzy

---
## [0.1.9](https://github.com/slainless/prodeskel-ws/compare/v0.1.1..v0.1.9) - 2024-07-03

### Bug Fixes

- broken import resolving when using package.json resolver - ([f3fa584](https://github.com/slainless/prodeskel-ws/commit/f3fa5842fa4a9e1b7c29b0e484a5d34957417a28)) - Aiman Fauzy
- another fix ffff - ([e631b12](https://github.com/slainless/prodeskel-ws/commit/e631b12f61ed1a233d0dfacc8ffca0b28c2af658)) - Aiman Fauzy
- what the hell esbuild + jsr... - ([fd5fc93](https://github.com/slainless/prodeskel-ws/commit/fd5fc933178ba7d1b41e809f85fbe77e72596442)) - Aiman Fauzy
- wrong type used in getListener - ([1a970bf](https://github.com/slainless/prodeskel-ws/commit/1a970bf39b42f0aa9fd5935b289b6e731b85da68)) - Aiman Fauzy

### Features

- added state_change event - ([0502a1e](https://github.com/slainless/prodeskel-ws/commit/0502a1ebdae0e9d53928ca2c90421e396bab0e02)) - Aiman Fauzy

### Build

- simplified build logic & separate build process for npm and jsr - ([83d9983](https://github.com/slainless/prodeskel-ws/commit/83d9983cd5b6f7625b0bd18047292a8575b66443)) - Aiman Fauzy
- fix missing typia types - ([1b13ba7](https://github.com/slainless/prodeskel-ws/commit/1b13ba7cb642ca4e35956b72cdf87812397843da)) - Aiman Fauzy
- switched to tsc - ([baccd00](https://github.com/slainless/prodeskel-ws/commit/baccd006d39ffe26b07c0bd3c67d6a180c4f778b)) - Aiman Fauzy
- facepalming - ([bda363c](https://github.com/slainless/prodeskel-ws/commit/bda363c4d428bbace9f599dcdbb86e36f5402114)) - Aiman Fauzy

### Ci

- missing install - ([b6f7326](https://github.com/slainless/prodeskel-ws/commit/b6f732667c0627e5734c1becf03100e8efec799e)) - Aiman Fauzy
- fix jsr import - ([78b8f45](https://github.com/slainless/prodeskel-ws/commit/78b8f45dea7d02187eb6903bf3acb07a3d487e9e)) - Aiman Fauzy
- another fix - ([e05bf9a](https://github.com/slainless/prodeskel-ws/commit/e05bf9af6c48a2c0b791137ec227da32cd0eb638)) - Aiman Fauzy
- push dirty directory - ([11f21ce](https://github.com/slainless/prodeskel-ws/commit/11f21ce9bfd604f3bc8d51f1e4a80e7093da41c0)) - Aiman Fauzy
- jsr build adjustment - ([5228ef3](https://github.com/slainless/prodeskel-ws/commit/5228ef38ce03287d57ccc2876996f4b91a34a8e8)) - Aiman Fauzy
- fix wrong exports targeting - ([6cdf13e](https://github.com/slainless/prodeskel-ws/commit/6cdf13e58a71f82352d0dac329e61cd3318cfe28)) - Aiman Fauzy
- another jsr fix ...... - ([6da9684](https://github.com/slainless/prodeskel-ws/commit/6da9684d74a985c7458c8e50bcfd0aafcbc7bed5)) - Aiman Fauzy
- emit empty files for schema - ([939ea56](https://github.com/slainless/prodeskel-ws/commit/939ea562bb9bde5f84e5ba5968e1908ea1fa22d4)) - Aiman Fauzy
- update jsr workflow - ([3b9b4a1](https://github.com/slainless/prodeskel-ws/commit/3b9b4a1910e04565a74a1480ca98111708c09b08)) - Aiman Fauzy
- run only on tags push - ([fe58ada](https://github.com/slainless/prodeskel-ws/commit/fe58adabdcf8d2c278fa195f6d091a5b65bedd15)) - Aiman Fauzy

---
## [0.1.1](https://github.com/slainless/prodeskel-ws/compare/v0.1.0..v0.1.1) - 2024-07-02

### Miscellaneous Chores

- added ignore entry and added rimraf to build:browser - ([f3ef0d2](https://github.com/slainless/prodeskel-ws/commit/f3ef0d2eb5b640433ed6ad20e60c52cee3a3bdeb)) - Aiman Fauzy
- ignore vscode - ([3a284ce](https://github.com/slainless/prodeskel-ws/commit/3a284ceb42300d5512afb5e228a1c71823a38f7c)) - Aiman Fauzy

### Build

- adjusted repository for jsr publishing - ([2d94cee](https://github.com/slainless/prodeskel-ws/commit/2d94cee77635cfb77f622bf0ce714f56a461a08d)) - Aiman Fauzy
- fix jsr package name - ([de52249](https://github.com/slainless/prodeskel-ws/commit/de52249c8ffa1b4bdc2f3a30f0acf09f038df586)) - Aiman Fauzy

### Ci

- added github action for jsr publishing - ([0d7b41c](https://github.com/slainless/prodeskel-ws/commit/0d7b41cab5dc4edde0c1d1d7be533570de3c933a)) - Aiman Fauzy

---
## [0.1.0] - 2024-07-02

### Bug Fixes

- remove unnecessary mutation - ([00d442a](https://github.com/slainless/prodeskel-ws/commit/00d442a72f3732d45c928dd4a6d9864afc19f466)) - Aiman Fauzy

### Documentation

- added README - ([8e9ad00](https://github.com/slainless/prodeskel-ws/commit/8e9ad00344489fe5481d8daf58fc654e95b5c829)) - Aiman Fauzy
- update README - ([3510eb3](https://github.com/slainless/prodeskel-ws/commit/3510eb38f2b23a8daa4ec4655037064118391ba4)) - Aiman Fauzy

### Features

- base communication protocol schema - ([646f4cf](https://github.com/slainless/prodeskel-ws/commit/646f4cfd56238f31968ee206dfc509d73db44fe9)) - Aiman Fauzy
- added once shortcut and expose getEventName - ([3fccde1](https://github.com/slainless/prodeskel-ws/commit/3fccde1b35c0298c10e48304f5ae9d17605da510)) - Aiman Fauzy
- added start and stop - ([e743c54](https://github.com/slainless/prodeskel-ws/commit/e743c5463257b7c322001f235996495ca58eff6f)) - Aiman Fauzy

### Build

- fix dependencies - ([aa443fd](https://github.com/slainless/prodeskel-ws/commit/aa443fde4defd530fd8989be61cb4e5cc4d01ba1)) - Aiman Fauzy


