// import path from 'path'
const customTitlebar = require('custom-electron-titlebar')
const {
  app,
  process
} = require('electron').remote
const ipcRenderer = require('electron').ipcRenderer
// const iconName = process.platform === 'win32' ? '/icons/icon.ico' : '/icons/icon.icns'
// const iconPath = path.join(__static, iconName)

if (process.platform !== 'darwin') {
  const mainTitlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#ffffff'),
    // icon: iconPath,
    itemBackgroundColor: customTitlebar.Color.fromHex('#ffffff')
  })

  // Setting title explicitly
  mainTitlebar.updateTitle(`${app.getName()}`)

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
