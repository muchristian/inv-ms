import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";
const isDev = require("electron-is-dev");
const url = require("url");
const server = require("../../api/server");
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 768,
    minHeight: 600,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // if (chrome.scripting?.registerContentScripts) {
  //   chrome.scripting.registerContentScripts(details)
  // } else if (browser?.contentScripts?.register) {
  //   browser.contentScripts.register(details)
  // } else {
  //   throw new Error('Tough luck')
  // }
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : url.format({
          pathname: path.join(__dirname, "../index.html"),
          protocol: "file:",
          slashes: true,
        })
  );
  // if (isDev) {
  //   win.loadURL("http://localhost:3000");

  //   win.webContents.closeDevTools();

  //   // Hot Reloading on 'node_modules/.bin/electronPath'
  //   require("electron-reload")(__dirname, {
  //     electron: path.join(
  //       __dirname,
  //       "..",
  //       "..",
  //       "node_modules",
  //       ".bin",
  //       "electron" + (process.platform === "win32" ? ".cmd" : "")
  //     ),
  //     forceHardReset: true,
  //     hardResetMethod: "exit",
  //   });
  // } else {
  //   // 'build/index.html'
  //   win.loadURL(
  //     url.format({
  //       pathname: path.join(__dirname, "../index.html"),
  //       protocol: "file:",
  //       slashes: true,
  //     })
  //   );
  //   win.webContents.openDevTools();
  // }
}

const isMac = process.platform === "darwin";

const menuTemplate = [
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://mucyochris.com");
        },
      },
    ],
  },
];
const menu = Menu.buildFromTemplate(menuTemplate as any);
Menu.setApplicationMenu(menu);
app.whenReady().then(() => {
  // DevTools
  installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});
