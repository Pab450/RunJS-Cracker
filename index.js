import asar from 'asar';
import path from 'path';
import fs from 'fs';
import os from 'os';

let resourcesPath;

switch (os.platform()) {
    case 'darwin':
        resourcesPath = '/Applications/RunJS.app/Contents/Resources';
        break;

    case 'win32':
        resourcesPath = path.join(os.homedir(), 'Appdata\\Local\\Programs\\runjs\\resources');
        break;

    // Add support for other platforms here
    case 'linux':
    resourcesPath = '/opt/RunJS/resources';
    break;
    
    default:
        console.error('Unsupported platform, RunJS has not been cracked.');
        process.exit(1);
}

const asarFile = path.join(resourcesPath, 'app.asar');
const tmpPath = path.join(resourcesPath, 'tmp');
const entryBundlePath = path.join(tmpPath, 'entry-bundle.js');

const matches = JSON.parse(fs.readFileSync('matches.json'));

asar.extractAll(asarFile, tmpPath);

const entryBundleContent = fs.readFileSync(entryBundlePath, 'utf8');

const entryBundleModifiedContent = entryBundleContent.replace(new RegExp(Object.keys(matches).join('|'), 'g'), (matched) => {
    return matches[matched];
}) + '#pablooo';

fs.writeFileSync(entryBundlePath, entryBundleModifiedContent);

(async () => {
    await asar.createPackage(tmpPath, asarFile);

    fs.rmSync(tmpPath, { recursive: true, force: true });

    console.log('RunJS has been cracked.');
})();