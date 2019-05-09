const customTitlebar = require('custom-electron-titlebar')
const {
  app,
  process,
  ipcRenderer
} = require('electron').remote
const iconPath = '../../static/icons/icon.ico'

if (process.platform !== 'darwin') {
  const mainTitlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#ffffff'),
    icon: iconPath,
    itemBackgroundColor: customTitlebar.Color.fromHex('#ffffff')
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
