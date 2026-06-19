fx_version 'cerulean'
game 'gta5'
lua54 'yes'
name "krs_hud"
description "React + Mantine"
author "Krs Scripts - karos7804"
version "1.0.0"

shared_scripts {
  '@ox_lib/init.lua',
  'shared/config.lua',
  'shared/theme.lua',
  'bridge/framework.lua'
}

client_scripts {
    'client/status.lua',
    'client/carhud.lua',
    'client/exports.lua'
}

ui_page "web/build/index.html"

files {
  "web/build/index.html",
  "web/build/**/*",
  'web/img/logo.png',
  'locales/*.json'
}