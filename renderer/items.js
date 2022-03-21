// module
const { shell } = require("electron");
const fs = require("fs");

// DOM elements
const items = document.getElementById("items");

exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

// listen to reader js message
window.addEventListener("message", (e) => {
  if (e.data.action === "delete-reader-item") {
    this.delete(e.data.itemIndex);

    e.source.close();
  }
});

// delete the selected item after clicking "Done"
exports.delete = (itemIndex) => {
  // removing form dom
  items.removeChild(items.childNodes[itemIndex]);

  // remove from storage
  this.storage.splice(itemIndex, 1);

  // persist the storage
  this.save();

  // select another item after deleting
  if (this.storage.length) {
    let newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    // select the new item
    document
      .getElementsByClassName("read-item")
      [newSelectedItemIndex].classList.add("selected");
  }
};

// get reader js
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

exports.getSelectedItem = () => {
  let currentItem = document.getElementsByClassName("read-item selected")[0];
  let itemIndex = 0;
  let child = currentItem;

  while ((child = child.previousSibling) != null) {
    itemIndex++;
  }

  return { node: currentItem, index: itemIndex };
};

exports.select = (e) => {
  // remove already selected item
  this.getSelectedItem().node.classList.remove("selected");

  e.currentTarget.classList.add("selected");
};

exports.changeSelection = (direction) => {
  // get currently selected item
  let currentItem = this.getSelectedItem();

  if (direction === "ArrowUp" && currentItem.node.previousSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.previousSibling.classList.add("selected");
  } else if (direction === "ArrowDown" && currentItem.node.nextSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.nextSibling.classList.add("selected");
  }
};

exports.openNative = () => {
  if (!this.storage.length) return;

  let selectedItem = this.getSelectedItem();

  shell.openExternal(selectedItem.node.dataset.url);
};

exports.open = () => {
  if (!this.storage.length) return;

  let selectedItem = this.getSelectedItem();

  let contentUrl = selectedItem.node.dataset.url;

  const readWin = window.open(
    contentUrl,
    "",
    `
  maxWidth=2000,
  maxHeight=2000,
  width=1200,
  height=800,
  backgroundColor=#DEDEDE,
  contextIsolation=1,
  nodeIntegration=0,
  `
  );

  readWin.eval(readerJS.replace("index", selectedItem.index));
};

// add new item
exports.addItem = (item, isNew = false) => {
  // create a new DOM node
  let itemNode = document.createElement("div");

  itemNode.setAttribute("class", "read-item");

  itemNode.setAttribute("data-url", item.url);

  itemNode.innerHTML = `<img src="${item.screenshot}" /><h2>${item.title}</h2>`;

  items.appendChild(itemNode);

  itemNode.addEventListener("click", this.select);
  itemNode.addEventListener("dblclick", this.open);

  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

this.storage.forEach((item) => {
  this.addItem(item);
});
