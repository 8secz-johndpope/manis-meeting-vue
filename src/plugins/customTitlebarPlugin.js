// import path from 'path'
const customTitlebarPlugin = require('custom-electron-titlebar')
const {
  app,
  process
} = require('electron').remote
const ipcRenderer = require('electron').ipcRenderer
// const iconName = process.platform === 'win32' ? '/icons/icon.ico' : '/icons/icon.icns'
// const iconPath = path.join(__static, iconName)

let appName = app.getName()
let bgColor = '#ffffff'
if (appName.indexOf('scmeeting') > -1) {
  bgColor = '#ffffff'
} else if (appName.indexOf('xiaoqiang') > -1) {
  bgColor = '#ffffff'
}

if (process.platform !== 'darwin') {
  const mainTitlebar = new customTitlebarPlugin.Titlebar({
    backgroundColor: customTitlebarPlugin.Color.fromHex(bgColor),
    // icon: iconPath,
    itemBackgroundColor: customTitlebarPlugin.Color.fromHex(bgColor)
  })

  // Setting title explicitly
  mainTitlebar.updateTitle(`${app.getName()}` + `${app.getVersion()}`)

  ipcRenderer.on('titlebar-asynchronous-reply', (event, arg) => {
    switch (arg.action) {
      case 'update-title':
        mainTitlebar.updateTitle(arg.data)
        break
      case 'update-menu':
        mainTitlebar.updateMenu(arg.data)
        break
      case 'update-icon':
        mainTitlebar.updateIcon(arg.data)
        break
      default:
        mainTitlebar.updateTitle(`${app.getName()}` + `${app.getVersion()}`)
        break
    }
  })
}
