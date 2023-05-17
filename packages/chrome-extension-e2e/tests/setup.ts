import { exec } from 'child_process';
import * as path from 'path';

export default async function setup() {
  const proc = exec('yarn website:preview', {
    cwd: path.resolve(__dirname, '../../../'),
  });

  proc.stdout?.pipe(process.stdout);
  proc.stderr?.pipe(process.stderr);
}
