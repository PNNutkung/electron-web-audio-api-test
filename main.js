const { app, ipcMain, BrowserWindow} = require('electron')
const json2csv = require('json2csv')
// Module to control application life.
// Module to create native browser window.

const path = require('path')
const url = require('url')
const fs = require('fs')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', () => {
    readFiles(mainWindow)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const mm = require('music-metadata')
const util = require('util')

async function readFiles(browserWindow) {
  console.log('Reading temp location')
  let tempLocation = 'D:/minna no nihongo/book 1/disc 1'
  let metadata
  try {
    metadata = await mm.parseFile(`${tempLocation}/cd0track03.mp3`, { native: true })
    // normalize
    tempLocation = path.win32.normalize(tempLocation)
    // console.log(tempLocation)
    fs.readdir(tempLocation, 'utf8', (err, data) => {
      if (err) throw err;
      let filePath = path.join(tempLocation, data[2])
      console.log(filePath)
      fs.readFile(filePath, (err, data) => {
        if (err) throw err;
  
        // let audioCtx = new (Window.AudioContext || Window.webkitAudioContext)()
        // console.log(data)
        // console.log(data.buffer)
        // console.log(new Float32Array(data))
  
        // browserWindow.webContents.send('read-audio-file-reply', data)
        browserWindow.webContents.send('read-audio-file-reply', { data, duration: metadata.format.duration})
      })
    })
  } catch (err) {
    console.log(err)
  }

  return null
}
ipcMain.on('song:signal', (event, signals) => {
  //console.log(signals)
  try {
    //Object.values(signals[1]).forEach(value => channel2.push(value))
    let csv = 'channel0,channel1,channel2,channel3,channel4,channel5,channel6,channel7,channel8,channel9,channel10,channel11,channel12\r\n'
    // signals.melFilterBank.map(value => {
    //   csv+=`${value}\r\n`
    // })
    signals.map(signal => {
      csv+=`${signal.join(',')}\r\n`
    })

    fs.writeFileSync('test2.csv', csv, (err) => {
      if (err) console.log(err)
      console.log('saved successfully.')
    })
  } catch (err) {
    console.log(err)
  } 
})

// electron.ipcMain.on('read-audio-file', (event, arg) => {
//   console.log(arg)
//   event.sender.send('read-audio-file-reply', audioData)
// })
