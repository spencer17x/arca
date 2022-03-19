import type { Options as ExecaOptions } from 'execa';
// @ts-ignore
import execa from 'execa'

// https://github.com/vitejs/vite/blob/main/scripts/releaseUtils.ts#L68-L74
export async function run(
  bin: string,
  args: string[],
  opts: ExecaOptions<string> = {}
) {
  return execa(bin, args, { stdio: 'inherit', ...opts });
}
