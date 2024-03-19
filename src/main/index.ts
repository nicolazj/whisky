import { app, shell, BrowserWindow, ipcMain, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { crud } from './db/crud'
import { queue } from './db/queue'
import path = require('path')
import settings from './settings'
app.commandLine.appendSwitch("enable-features", "SharedArrayBuffer");

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth:800,
    show: false,
    // frame:false,
    titleBarStyle: 'hidden',
    // roundedCorners: false,
    // resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  mainWindow.webContents.openDevTools()
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: "whisky",
//     privileges: {
//       standard: true,
//       secure: true,
//       bypassCSP: true,
//       allowServiceWorkers: true,
//       supportFetchAPI: true,
//       stream: true,
//       codeCache: true,
//       corsEnabled: true,
//     },
//   },
// ]);
protocol.registerSchemesAsPrivileged([
  {
    scheme: "whisky",
    privileges: {
      standard: true,
      secure: true,
      bypassCSP: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      stream: true,
      codeCache: true,
      corsEnabled: true,
    },
  },
]);


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // protocol.handle('whisky', async(request) =>{

  //   let r = await net.fetch('file://' + request.url.slice('whisky://'.length))
  //   console.log({r})
  //   return  r
  // })
   
  protocol.handle("whisky", async (request) => {
    // let url = request.url.replace("enjoy://", "");
    // // if (url.match(/library\/(audios|videos|recordings|speeches)/g)) {
    // //   url = url.replace("library/", "");
    // //   url = path.join(settings.userDataPath(), url);
    // // } else if (url.startsWith("library")) {
    // //   url = url.replace("library/", "");
    // //   url = path.join(settings.libraryPath(), url);
    // // }

    // console.log({url})

    // return await net.fetch(`file:///${url}`);

    let path = 'file:///' + request.url.slice('whisky://'.length)
    console.log({path})
    return  net.fetch(path)
  });
  

  crud.init()
  queue.init()



  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
