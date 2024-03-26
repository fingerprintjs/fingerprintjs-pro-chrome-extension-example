import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'
import AdmZip from 'adm-zip'

const extensionsPath = path.resolve(__dirname, '../thirdPartyExtensions')

async function crxToZip(data: ArrayBuffer) {
  const buf = new Uint8Array(data)
  let publicKeyLength, signatureLength, header, zipStartOffset

  if (buf[4] === 2) {
    header = 16
    publicKeyLength = 0 + buf[8] + (buf[9] << 8) + (buf[10] << 16) + (buf[11] << 24)
    signatureLength = 0 + buf[12] + (buf[13] << 8) + (buf[14] << 16) + (buf[15] << 24)
    zipStartOffset = header + publicKeyLength + signatureLength
  } else {
    publicKeyLength = 0 + buf[8] + (buf[9] << 8) + (buf[10] << 16) + ((buf[11] << 24) >>> 0)
    zipStartOffset = 12 + publicKeyLength
  }
  // 16 = Magic number (4), CRX format version (4), lengths (2x4)

  return Buffer.from(data, zipStartOffset, data.byteLength - zipStartOffset)
}

export async function downloadExtension(extensionId: string) {
  if (!fs.existsSync(extensionsPath)) {
    fs.mkdirSync(extensionsPath)
  }

  const { arch, chromeVersion } = await getBrowserInfo()

  const downloadUrl = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${chromeVersion}&x=id%3D${extensionId}%26installsource%3Dondemand%26uc&nacl_arch=${arch}&acceptformat=crx2,crx3`

  const response = await fetch(downloadUrl)
  const buffer = await crxToZip(await response.arrayBuffer())

  const extractPath = path.resolve(extensionsPath, `${extensionId}`)

  const zip = new AdmZip(buffer)

  zip.extractAllTo(extractPath, true)

  return extractPath
}

async function getBrowserInfo() {
  const browser = await chromium.launch({
    headless: true,
  })

  const page = await browser.newPage()

  const result = await page.evaluate(() => {
    const getArch = () => {
      let arch = 'arm'

      if (navigator.userAgent.includes('x86')) {
        arch = 'x86-32'
      } else if (navigator.userAgent.includes('x64')) {
        arch = 'x86-64'
      }

      return arch
    }

    return {
      arch: getArch(),
    }
  })

  const chromeVersion = browser.version()

  await browser.close()

  return {
    ...result,
    chromeVersion,
  }
}
