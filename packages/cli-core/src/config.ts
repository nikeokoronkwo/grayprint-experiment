import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';

const CONFIG_DIR = join(homedir(), '.grayprint');
const CONFIG_PATH = join(CONFIG_DIR, 'config.json');

export type StoredAccount = {
  userId: string;
  email: string;
  handle?: string;
  token: string;
  createdAt: string;
};

export type CliConfig = {
  defaultApiUrl: string;
  active?: { host: string; userId: string };
  accounts: Record<string /* host */, Record<string /* userId */, StoredAccount>>;
};

const DEFAULTS: CliConfig = {
  defaultApiUrl: process.env.GRAYPRINT_API_URL ?? 'https://grayprint.dev',
  accounts: {},
};

export function readConfig(): CliConfig {
  if (!existsSync(CONFIG_PATH)) return DEFAULTS;
  try {
    const raw = readFileSync(CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<CliConfig>;
    return { ...DEFAULTS, ...parsed, accounts: parsed.accounts ?? {} };
  } catch {
    return DEFAULTS;
  }
}

export function writeConfig(cfg: CliConfig) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), { mode: 0o600 });
  try {
    chmodSync(CONFIG_PATH, 0o600);
  } catch {
    // best effort on Windows
  }
}

export function getActiveAccount(): { host: string; account: StoredAccount } | null {
  const cfg = readConfig();
  if (!cfg.active) return null;
  const account = cfg.accounts[cfg.active.host]?.[cfg.active.userId];
  if (!account) return null;
  return { host: cfg.active.host, account };
}

export function setActiveAccount(host: string, account: StoredAccount) {
  const cfg = readConfig();
  cfg.active = { host, userId: account.userId };
  cfg.accounts[host] ??= {};
  cfg.accounts[host][account.userId] = account;
  writeConfig(cfg);
}

export function clearActiveAccount() {
  const cfg = readConfig();
  if (!cfg.active) return;
  const { host, userId } = cfg.active;
  delete cfg.accounts[host]?.[userId];
  delete cfg.active;
  writeConfig(cfg);
}

export function getApiUrl(): string {
  const cfg = readConfig();
  return cfg.active?.host ?? cfg.defaultApiUrl;
}
