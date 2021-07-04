import * as boxen from 'boxen';
import * as chalk from 'chalk';
import latestVersion from 'latest-version';
import * as Spinnies from 'spinnies';
import { yo } from 'yoo-hoo';
import { upToDate } from '../utils/semver';
const { version } = require('../../package.json');

// Global
let welcomeShown = false;
let updatesChecked = false;

export function welcomeScreen() {
  if (welcomeShown) {
    return;
  }
  welcomeShown = true;
  yo('CARNAGE', { color: 'cyan' });
  console.log('\n\n');
}

export async function checkUpdates(spinnies: Spinnies) {
  // Check for updates if needed
  if (!updatesChecked) {
    updatesChecked = true;
    spinnies.add('carnage-version-spinner', {
      text: 'Checking for updates',
    });
    return await checkcarnageVersion(spinnies);
  }
}

/**
 * Checs for a new versoin of carnage and logs
 */
async function checkcarnageVersion(spinnies: Spinnies) {
  spinnies.update('carnage-version-spinner', { text: 'Checking for updates...' });
  try {
    await latestVersion('carnage-bot').then((latest) => {
      if (upToDate(version, latest)) {
        spinnies.succeed('carnage-version-spinner', {
          text: "You're up to date",
        });
      } else {
        spinnies.succeed('carnage-version-spinner', {
          text: 'There is a new version available',
        });
        logUpdateAvailable(version, latest);
      }
    });
  } catch {
    spinnies.fail('carnage-version-spinner', {
      text: 'Unable to access: "https://www.npmjs.com", check your internet',
    });
    return false;
  }
}

/**
 * Logs a boxen of instructions to update
 * @param current
 * @param latest
 */
function logUpdateAvailable(current: string, latest: string) {
  // prettier-ignore
  const newVersionLog =
    `There is a new version of ${chalk.bold(`carnage`)} ${chalk.gray(current)} ➜  ${chalk.bold.green(latest)}\n` +
    `Update your package by running:\n\n` +
    `${chalk.bold('\>')} ${chalk.blueBright('npm update carnage-bot')}`;

  console.log(boxen(newVersionLog, { padding: 1 }));
  console.log(
    `For more info visit: ${chalk.underline(
      'https://github.com/themens/carnage/blob/master/Update.md'
    )}\n`
  );
}
