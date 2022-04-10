import * as esbuild from 'esbuild'
import * as process from 'process'
import * as terser from 'terser'
import * as fsPromises from 'fs/promises'
import * as path from 'path';
import { BuildOptions, Format } from 'esbuild'

const fast = process.argv.includes('--fast')

interface Options extends Omit<BuildOptions, 'format'> {
  format?: Format | 'umd';
}

async function build(options: Options) {
  const { outfile, format, globalName, ...rest } = options
  const buildResult = await esbuild.build({
    bundle: true,
    minify: true,
    write: false,
    ...rest,
    format: format === 'umd' ? 'esm' : format,
    globalName: format === 'umd' ? undefined : globalName
  })

  let code = buildResult.outputFiles?.[0].text

  if (!code) return;

  if (format === 'umd') {
    // HACK: convert to UMD - only supports cjs and global var
    const varName = '__EXPORTS__'
    // Imports (not used atm)
    // code = code.replace(
    //   /import\s+(\w+)\s+from\s*"([^"]+)"/g,
    //   'var $1 = require("$2")'
    // );
    code = code.replace(/export\s*\{([^{}]+)\}/, (_, inner) => {
      const defaultExport = inner.match(/^([\w$]+) as default$/)
      return defaultExport != null
        ? `var ${varName}=${defaultExport[1]}`
        : `var ${varName}={${inner.replace(/([\w$]+) as ([\w$]+)/g, '$2:$1')}}`
    })
    code = `(()=>{${code};typeof module!=='undefined'?module.exports=${varName}:self.${globalName}=${varName}})()`
  }

  if (!fast) {
    code = (await terser.minify(code)).code
  }

  if (code) {
    const pathJoinArray = outfile ? outfile.split('/') : ['dist', 'index.js'];
    await fsPromises.writeFile(
      path.join(...pathJoinArray),
      code
    )
  }
}

// outfile 格式建议 xxx/xxx/xxx.js, 以 / 连接
build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  format: 'umd',
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  globalName: 'ESBuildDemo',
}).catch(error => {
  console.error(error)
  process.exit(0)
})