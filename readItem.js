// modules
const { BrowserWindow } = require("electron");

// declare offScreenWindow

let offScreenWindow;

// exports
module.exports = (url, callback) => {
  // create the offScreenWindow
  offScreenWindow = new BrowserWindow({
    height: 500,
    width: 500,
    show: false,
    webPreferences: {
      offscreen: true,
      nodeIntegration: false,
    },
  });

  // load url
  offScreenWindow.loadURL(url);

  // wait for finish load
  offScreenWindow.webContents.on("did-finish-load", async (e) => {
    // get the title
    let title = offScreenWindow.getTitle();

    // get the screenshot
    let screenshot = await offScreenWindow.webContents
      .capturePage()
      .then((image) => {
        return image.toDataURL();
      });

    callback({ title, screenshot, url });

    offScreenWindow.close();
    offScreenWindow = null;
  });
};
