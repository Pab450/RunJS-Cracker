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

    case 'linux':
        resourcesPath = '/opt/RunJS/resources';
        break;

    // Add support for other platforms here
    
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

const entryBundleModifiedContent = Object.entries(matches).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(key, 'g'), (matched, ...groups) => {
        const replacementValue = value.replace(/\\?\$(\d+)/g, (_, index) => groups[index] || '');

        console.log(`Replacing ${matched} with ${replacementValue}`);

        return replacementValue;
    });
}, entryBundleContent);

fs.writeFileSync(entryBundlePath, entryBundleModifiedContent);

(async () => {
    await asar.createPackage(tmpPath, asarFile);

    fs.rmSync(tmpPath, { recursive: true, force: true });

    console.log('\nRunJS has been cracked. Launch the application once, close it and launch it again to access all RunJS features without restrictions.');
})();
