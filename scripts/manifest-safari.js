import fs from 'fs-extra'
import pkg from '../package.json'

function getManifest() {
    // update this file to update this manifest.json
    // can also be conditional based on your need
    return {
        manifest_version: 2,
        "default_locale": "en",
        "name": "__MSG_extension_name__",
        "description": "__MSG_extension_description__",
        version: pkg.version,

        "icons": {
            "16": "dist/ui/favicon_16.png",
            "32": "dist/ui/favicon_32.png",
            "64": "dist/ui/favicon_64.png",
            "126": "dist/ui/favicon_128.png"
        },

        "background": {
            "scripts": ["dist/scripts/background/background.umd.js"]

        },

        "content_scripts": [
            {
                "js": ["dist/scripts/content/content.umd.js"],
                "css": ["dist/scripts/content/style.css"],
                "matches": ["http://*/*", "https://*/*"]
            }
        ],

        "browser_action": {
            "default_popup": "dist/ui/popup.html",
            "default_icon": {
                "16": "dist/ui/favicon_16.png",
                "32": "dist/ui/favicon_32.png",
                "64": "dist/ui/favicon_64.png",
                "126": "dist/ui/favicon_128.png"
            }
        },

        "permissions": ["storage", "activeTab"]
    }



}

export async function writeManifest() {
    if (!fs.existsSync('dist/')) {
        await fs.mkdirSync('dist/')
        await fs.mkdirSync('dist/temp')
    }
    await fs.writeJSON('dist/temp/manifest.json', await getManifest(), { spaces: 2 })
}

writeManifest()
