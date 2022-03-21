const { ipcRenderer } = require("electron");
const items = require("./items");

let showModal = document.getElementById("show-modal"),
  closeModal = document.getElementById("close-modal"),
  modal = document.getElementById("modal"),
  addItem = document.getElementById("add-item"),
  itemURL = document.getElementById("url");
search = document.getElementById("search");

window.newItem = () => {
  showModal.click();
};

window.openItem = items.open;

window.deleteItem = () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
};

window.searchItems = () => {
  search.focus();
};

window.openNative = items.openNative;

search.addEventListener("keyup", () => {
  Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
    let hasMatched = item.innerText.toLowerCase().includes(search.value);

    item.style.display = hasMatched ? "flex" : "none";
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    items.changeSelection(e.key);
  }
});

const toggleModalButtons = () => {
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add Item";
    closeModal.style.display = "inline";
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding...";
    closeModal.style.display = "none";
  }
};

showModal.addEventListener("click", () => {
  modal.style.display = "flex";
  itemURL.focus();
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

addItem.addEventListener("click", () => {
  if (itemURL.value) {
    ipcRenderer.send("new-item", itemURL.value);

    // disable buttons
    toggleModalButtons();
  }
});

ipcRenderer.on("new-item-success", (e, newItem) => {
  // add new item to "items" node
  items.addItem(newItem, true);

  // enable buttons
  toggleModalButtons();
  modal.style.display = "none";
  itemURL.value = "";
});

itemURL.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addItem.click();
  }
});
