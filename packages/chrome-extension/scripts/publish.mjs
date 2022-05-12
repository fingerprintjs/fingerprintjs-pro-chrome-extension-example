import uploadToStore from 'chrome-webstore-upload';
import path from 'path';
import fs from 'fs';

const dirname = import.meta.url.replace(/^file:\/\//, '');

async function main() {
  const store = uploadToStore({
    extensionId: process.env.EXTENSION_ID,
    clientId: process.env.CLIENT_ID,
    refreshToken: process.env.REFRESH_TOKEN,
    clientSecret: process.env.CLIENT_SECRET,
  });

  const zipPath = path.resolve(dirname, '../../build.zip');

  if (!fs.existsSync(zipPath)) {
    throw new Error('No build.zip found');
  }

  const readStream = fs.createReadStream(zipPath);

  const token = await store.fetchToken();

  const uploadResponse = await store.uploadExisting(readStream, token);

  console.log('Upload result:', uploadResponse);

  const publishResponse = await store.publish(token);

  console.log('Publish result:', publishResponse);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
