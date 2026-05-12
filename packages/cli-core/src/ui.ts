import pc from 'picocolors';

export const c = pc;

export function brand() {
  return `${pc.bold(pc.bgBlack(pc.green(' g ')))}${pc.bold(' grayprint')}`;
}

export function header(title: string) {
  return `\n${brand()}  ${pc.dim('·')}  ${pc.bold(title)}\n`;
}

export function ok(msg: string) {
  return `${pc.green('✓')} ${msg}`;
}
export function info(msg: string) {
  return `${pc.cyan('›')} ${msg}`;
}
export function warn(msg: string) {
  return `${pc.yellow('⚠')} ${msg}`;
}
export function err(msg: string) {
  return `${pc.red('✗')} ${msg}`;
}

export function kv(label: string, value: string) {
  return `  ${pc.dim(label.padEnd(14))}${value}`;
}
