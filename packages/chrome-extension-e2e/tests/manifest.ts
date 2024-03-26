import * as fs from 'fs'
import * as path from 'path'
import { getExtensionPath } from './paths'

let manifest: chrome.runtime.ManifestV3

export const readManifest = async () => {
  if (manifest) {
    return manifest
  }

  const manifestPath = path.join(getExtensionPath(), 'manifest.json')

  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest not found, perhaps extension is not built?')
  }

  manifest = JSON.parse(fs.readFileSync(manifestPath).toString()) as chrome.runtime.ManifestV3

  return manifest
}
