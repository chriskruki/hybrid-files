import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, extname, relative } from 'path'
// import { os } from 'os'
import { readDir, readdirSync, statSync } from 'fs'
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

  ipcMain.handle('readDir', async (e, dir, fileTypes, recursive) => {
    var res = {
      success: false,
      errMsg: '',
      data: []
    }
    return new Promise((resolve) => {
      const deepFileList = listFiles(dir, dir, fileTypes, recursive)
      res.success = true
      res.data = deepFileList
      resolve(res)
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

function listFiles(baseDir, directory, fileTypes, recursive = false) {
  const files = []

  const filesInDirectory = readdirSync(directory)
  for (const fName of filesInDirectory) {
    const fullPath = join(directory, fName)
    const relativePath = relative(baseDir, fullPath)
    const fStats = statSync(fullPath)
    if (fStats.isDirectory() && recursive) {
      files.push(...listFiles(baseDir, fullPath, fileTypes, recursive))
    } else {
      if (fileTypes.includes(extname(fName))) {
        files.push({
          fullPath: fullPath,
          relativePath: relativePath,
          dirName: directory,
          name: fName,
          extName: extname(fName),
          size: fStats.size,
          isFile: fStats.isFile(),
          accessTime: fStats.atime,
          changeTime: fStats.ctime,
          modifiedTime: fStats.mtime,
          createdTime: fStats.birthtime
        })
      }
    }
  }

  return files
}