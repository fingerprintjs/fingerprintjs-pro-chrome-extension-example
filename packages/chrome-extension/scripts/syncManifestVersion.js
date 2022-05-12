const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

const manifestPaths = [path.resolve(__dirname, '../manifest.json')];

manifestPaths.forEach(manifestPath => {
  if (!fs.existsSync(manifestPath)) {
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

  const { version, versionName } = parseVersion(packageJson.version);

  manifest.version = version;
  manifest.version_name = versionName;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
});

function parseVersion(version) {
  const safeVersion = version.split('-')[0];

  return {
    version: safeVersion,
    versionName: version,
  };
}
