const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
let win;
function createWindow() {
    win = new BrowserWindow({
        width: 1290,
        height: 780,
        frame: true,
        transparent: false,
        icon: 'favicon.ico',
        title: 'IPIS',
        autoHideMenuBar: true,
        radii: [150, 150, 150, 150],
        minWidth:1290,
        minHeight:700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            
            //devTools: false,
        },
    })
    initNodeRequire();
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
}

function initNodeRequire() {
    win.nodeRequire = require;
    delete win.require;
    delete win.exports;
    delete win.module;
}

app.on('ready', createWindow)
