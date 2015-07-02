function gText() {
    var text = "default";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    alert(text);
}

var button = document.createElement("button");
button.innerHTML = "Wector It!"
button.onmousedown = gText;
button.setAttribute("unselectable","on");
button.style.position = "fixed";
button.style.bottom = "0";
button.style.right = "0";
button.style.padding = "5px";
button.style.color = "white";
button.style.background = "black";
button.style.cursor = "pointer";
button.style.font="menu";
button.style.fontSize = "16px";
button.style.border="0";
button.style.borderRadius="10px 0 0 0 ";
document.body.appendChild(button);