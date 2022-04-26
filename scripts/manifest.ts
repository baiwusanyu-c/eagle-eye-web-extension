import fs from 'fs-extra'
import pkg from '../package.json'
import { r } from './util'
import type { Manifest } from 'webextension-polyfill'

function getManifest(): Manifest.WebExtensionManifest {
  // update this file to update this manifest.json
  // can also be conditional based on your need
  return {
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: './ui/favicon.ico',
      default_popup: './ui/popup.html',
    },
    options_ui: {
      page: './ui/options.html',
      open_in_tab: true,
    },
    background: {
      service_worker: './scripts/background/background.umd.js',
    },
    content_scripts: [
      {
        css: ['/scripts/content/style.css'],
        matches: ['http://*/*', 'https://*/*'],
        js: ['./scripts/content/content.umd.js'],
      },
    ],
    commands: {
      _execute_action: {
        suggested_key: {
          default: 'Ctrl+Shift+F',
          mac: 'MacCtrl+Shift+F',
        },
        description: 'Opens hello.html',
      },
    },
    host_permissions: ['http://*/', 'https://*/', 'chrome://', 'edge://'],
    permissions: ['tabs', 'storage', 'activeTab', 'scripting'],
  }
}

export async function writeManifest() {
  if (!fs.existsSync(r('./dist'))) {
    await fs.mkdirSync(r('./dist'))
  }
  await fs.writeJSON(r('./dist/manifest.json'), await getManifest(), { spaces: 2 })
}

writeManifest()
