// require remote module
const { remote, shell } = require("electron");

// menu template
const template = [
  {
    label: "Items",
    submenu: [
      {
        label: "Add New",
        click: window.newItem,
        accelerator: "CmdOrCtrl+O",
      },
      {
        label: "Read Item",
        click: window.openItem,
        accelerator: "CmdOrCtrl+Enter",
      },
      {
        label: "Delete Item",
        click: window.deleteItem,
        accelerator: "CmdOrCtrl+Backspace",
      },
      {
        label: "Open in Browser",
        click: window.openNative,
        accelerator: "CmdOrCtrl+Shift+O",
      },
      {
        label: "Search Items",
        click: window.searchItems,
        accelerator: "CmdOrCtrl+S",
      },
    ],
  },
  {
    role: "editMenu",
  },
  {
    role: "windowMenu",
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: () => {
          shell.openExternal(
            "https://github.com/stackacademytv/master-electron"
          );
        },
      },
    ],
  },
];

const menu = remote.Menu.buildFromTemplate(template);

// set the menu
remote.Menu.setApplicationMenu(menu);
