import asar from 'asar';
import path from 'path';
import fs from 'fs';

const resourcesPath = '/Applications/RunJS.app/Contents/Resources/';

const asarFile = path.join(resourcesPath, 'app.asar');
const tmpPath = path.join(resourcesPath, 'tmp');
const entryBundlePath = path.join(tmpPath, 'entry-bundle.js');

const matches = JSON.parse(fs.readFileSync('matches.json'));

asar.extractAll(asarFile, tmpPath);

const entryBundleContent = fs.readFileSync(entryBundlePath, "utf8");

const entryBundleModifiedContent = entryBundleContent.replace(new RegExp(Object.keys(matches).join('|'), 'g'), (matched) => {
    return matches[matched];
}) + "#pablooo";

fs.writeFileSync(entryBundlePath, entryBundleModifiedContent);

(async () => {
    await asar.createPackage(tmpPath, asarFile);

    fs.rmSync(tmpPath, { recursive: true, force: true });
})();