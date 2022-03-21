// creating DOM element
let readitClose = document.createElement("div");
readitClose.innerText = "Done";

// style
readitClose.style.position = "fixed";
readitClose.style.right = "15px";
readitClose.style.bottom = "15px";
readitClose.style.padding = "5px 10px";
readitClose.style.fontSize = "20px";
readitClose.style.color = "white";
readitClose.style.backgroundColor = "dodgerblue";
readitClose.style.borderRadius = "5px";
readitClose.style.boxShadow = "2px 2px 2px rgba(0,0,0,0.2)";
readitClose.style.cursor = "default";

// click hander
readitClose.onclick = (e) => {
  window.opener.postMessage(
    {
      action: "delete-reader-item",
      itemIndex: "index",
    },
    "*"
  );
};

// appent to the new window
document.getElementsByTagName("body")[0].append(readitClose);
