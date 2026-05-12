import cac from 'cac';
import pc from 'picocolors';
import { login } from './commands/login.js';
import { logout } from './commands/logout.js';
import { whoami } from './commands/whoami.js';
import { init } from './commands/init.js';
import { publish } from './commands/publish.js';
import { templates } from './commands/templates.js';
import { agents } from './commands/agents.js';
import { mcp } from './commands/mcp.js';

const cli = cac('grayprint');

cli.command('login', 'Sign in to Grayprint with the device flow').action(login);
cli.command('logout', 'Clear local credentials').action(logout);
cli.command('whoami', 'Show the active account').action(whoami);

cli.command('init', 'Initialise a grayprint.json in the current project').action(init);
cli
  .command('publish', 'Publish the current project to the registry')
  .option('--version <semver>', 'Override the version to publish')
  .option('--message <text>', 'Changelog entry')
  .action(publish);

cli.command('templates list', 'List templates').option('-q, --query <q>', 'Search query').action(templates.list);
cli.command('templates get <slug>', 'Show a template').action(templates.get);

cli.command('agents create <name>', 'Create an agent API key').action(agents.create);
cli.command('agents list', 'List your agent API keys').action(agents.list);
cli.command('agents revoke <id>', 'Revoke an agent API key').action(agents.revoke);

cli.command('mcp', 'Run the Grayprint MCP server over stdio').action(mcp);

cli.help();
cli.version('0.0.0');

try {
  cli.parse();
  if (!cli.matchedCommand && cli.args.length === 0) {
    cli.outputHelp();
  }
} catch (err) {
  console.error(pc.red('✗'), err instanceof Error ? err.message : String(err));
  process.exit(1);
}
