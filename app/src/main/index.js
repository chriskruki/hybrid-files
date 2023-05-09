import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, extname } from 'path'
// import { os } from 'os'
import { readdir, readdirSync, statSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { sqlBridge } from './sqlBridge'
import icon from '../../resources/icon.png?asset'


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')
  // Windows specific - load React Dev Tools
  // if (is.dev) {
  //   const reactDevToolsPath = join(process.env.USERPROFILE, '\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.27.6_0');
  //   await session.defaultSession.loadExtension(reactDevToolsPath)
  // }


  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle('dialog', async (e, params) => {
    const resPromise = dialog.showOpenDialogSync(params)
    return resPromise
  })

  ipcMain.handle('readdir', async (e, dir, recursive) => {
    var res = {
      success: false,
      errMsg: '',
      data: []
    }
    return new Promise((resolve) => {
      const deepFileList = listFiles(dir, true)
      res.success = true
      res.data = deepFileList
      resolve(res)
      // readdir(dir, (err, foundFNames) => {
      //   if (!err) {
      //     const masterList = []
      //     foundFNames.forEach((fName) => {
      //       const fullPath = join(dir, fName)
      //       const fStats = statSync(fullPath)
      //       // If file, push to masterList
      //       if (fStats.isFile()) {
      //         masterList.push({
      //           fileFullPath: fullPath,
      //           fileDirName: dir,
      //           fName: fName,
      //           fileExtName: extname(fName),
      //           isFile: fStats.isFile(),
      //           accessTime: fStats.atime,
      //           changeTime: fStats.ctime,
      //           modifiedTime: fStats.mtime,
      //           createdTime: fStats.birthtime
      //         })
      //       }
      //       else if (recursive && fStats.isDirectory()) {
      //         // Else, rcursively add children
      //         const subDirFiles = listFiles(fullPath, true)
      //       }
      //     })
      //     res.success = true
      //     res.data = masterList
      //     resolve(res)
      //   } else {
      //     res.errMsg = err.message
      //     resolve(res)
      //   }
      // })
    })
  })

  ipcMain.handle('sqlBridge', async (e, command, payload) => {
    return sqlBridge[command](payload)
  })
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function listFiles(directory, recursive = false) {
  const files = []

  const filesInDirectory = readdirSync(directory)
  for (const fName of filesInDirectory) {
    const fullPath = join(directory, fName)
    const fStats = statSync(fullPath)
    if (fStats.isDirectory() && recursive) {
      files.push(...listFiles(fullPath, recursive))
    } else {
      files.push({
        fileFullPath: fullPath,
        fileDirName: directory,
        fName: fName,
        fileExtName: extname(fName),
        isFile: fStats.isFile(),
        accessTime: fStats.atime,
        changeTime: fStats.ctime,
        modifiedTime: fStats.mtime,
        createdTime: fStats.birthtime
      })
    }
  }

  return files
}