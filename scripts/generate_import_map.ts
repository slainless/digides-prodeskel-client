import { dependencies } from '../package.json'

await Bun.write('./import_map.json', JSON.stringify({
  imports: Object.fromEntries(
    Object.entries(dependencies).map(
      ([k, v]) => {
        if (/\w+:.+/.test(v))
          return [k, v]
        return [k, `npm:${k}@${v}`]
      }
    )),
}))