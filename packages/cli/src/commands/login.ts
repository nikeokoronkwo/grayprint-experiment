import * as p from '@clack/prompts';
import { deviceAuthLogin, getApiUrl, ui } from '@grayprint/cli-core';

export async function login() {
  p.intro(ui.brand() + '  sign-in');
  const apiUrl = getApiUrl();

  const spinner = p.spinner();
  spinner.start('Requesting device code…');

  try {
    const result = await deviceAuthLogin({
      apiUrl,
      onCode: ({ userCode, verificationUri }) => {
        spinner.stop('Device code issued.');
        p.log.info(
          `Visit ${ui.c.cyan(verificationUri)} and enter the code:\n\n      ${ui.c.bold(
            ui.c.green(userCode),
          )}\n`,
        );
        p.log.message('Waiting for approval…');
        spinner.start('Polling…');
      },
    });
    spinner.stop('Authenticated.');
    p.outro(ui.ok(`Signed in as ${ui.c.bold(result.account.email)}`));
  } catch (err) {
    spinner.stop('Failed.');
    p.cancel(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}
