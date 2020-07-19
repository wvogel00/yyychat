const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

function createWindow () {
  // ブラウザウインドウの作成
  win = new BrowserWindow(
    {
        width: 400,
        height: 620,
        webPreferences: {nodeIntegration: false}
    })

  win.loadURL('http://localhost:3000/');
  //win.webContents.openDevTools() // for open the Developer Tool
}

app.on('ready', createWindow)
