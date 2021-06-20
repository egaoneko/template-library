import 'tsarch/dist/jest';
import { filesOfProject } from 'tsarch';
import fs from 'fs';
import path from 'path';

const base = ['shared', 'config', 'test', 'user'];

describe('architecture', () => {
  jest.setTimeout(60000);

  it('base logic should be cycle free', async () => {
    for (const baseFile of base) {
      const rule = filesOfProject().matchingPattern(`^src/${baseFile}/.*`).should().beFreeOfCycles();

      await expect(rule).toPassAsync();
    }
  });

  it('base logic should not depend on others', async () => {
    await iterateFolder('./', async file => {
      for (const baseFile of base) {
        if (base.indexOf(file) > -1) {
          continue;
        }

        if (file === baseFile) {
          continue;
        }

        const rule = filesOfProject(path.join(__dirname, `../tsconfig.json`))
          .matchingPattern(`^src/${baseFile}/.*`)
          .shouldNot()
          .dependOnFiles()
          .matchingPattern(`^src/${file}/.*`);

        await expect(rule).toPassAsync();
      }
    });
  });

  it('auth logic should not depend on the others', async () => {
    await iterateFolder('./', async file => {
      if (base.indexOf(file) > -1) {
        return;
      }

      if (file === 'auth') {
        return;
      }

      const rule = filesOfProject(path.join(__dirname, `../tsconfig.json`))
        .matchingPattern(`^src/${file}/.*`)
        .shouldNot()
        .dependOnFiles()
        .matchingPattern(`^src/auth/.*`);

      await expect(rule).toPassAsync();
    });
  });
});

async function iterateFolder(folder: string, callback: (file: string) => Promise<void>): Promise<void> {
  const files = fs.readdirSync(path.join(__dirname, folder));

  for (const file of files) {
    if (fs.lstatSync(path.join(__dirname, `./${file}`)).isFile()) {
      continue;
    }

    await callback(file);
  }
}
