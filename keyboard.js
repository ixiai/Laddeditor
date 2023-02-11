function onkeydown(e) {
    console.log(e.key);
    placingNewWire = false;
    if (typingNewName !== false) {
        if (e.key.length == 1) {
            typingNewName += e.key;
        } else switch (e.key) {
            case "Backspace":
            case "Delete":
                if (typingNewName.length) {
                    typingNewName = typingNewName.slice(0, -1);
                }
                break;
            case "Escape":
                placingNewItem = null;
                typingNewName = false;
                break;
            case "ArrowUp":
                placingNewItem.nameTag.position = "top";
                break;
            case "ArrowDown":
                placingNewItem.nameTag.position = "bottom";
                break;
            case "ArrowLeft":
                placingNewItem.nameTag.position = "left";
                break;
            case "ArrowRight":
                placingNewItem.nameTag.position = "right";
                break;
            case "PageUp":
                if (placingNewItem.retardedOn != undefined) {
                    placingNewItem.retardedOn = 1 * !placingNewItem.retardedOn;
                }
                break;
            case "PageDown":
                if (placingNewItem.retardedOff != undefined) {
                    placingNewItem.retardedOff = 1 * !placingNewItem.retardedOff;
                }
                break;
            case "Shift":
                switch (placingNewItem.state) {
                    case "on":
                    case "off":
                        placingNewItem.state = placingNewItem.state == "off" ? "on" : "off";
                        break;
                    case "open":
                    case "closed":
                        placingNewItem.state = placingNewItem.state == "open" ? "closed" : "open";
                        break;
                }
                break;
        }
    } else {
        switch (e.key) {
            case "Delete":  // Delete selected
                placingNewWire = false;
                if (selectedBlockId != undefined) {
                    delete blocks[selectedBlockId];
                    updateWires();
                } else if (selectedWireId != undefined) {
                    delete wires[selectedWireId];
                    updateWires();
                }
                break;
            case "n":       // Neutral relay
                placingNewItem = generateNewBlock("neutralRelay");
                placingNewWire = false;
                break;
            case "b":       // Bistable relay
                placingNewItem = generateNewBlock("bistableRelay");
                placingNewWire = false;
                break;
            case "m":       // Mechanically bistable relay
                placingNewItem = generateNewBlock("mechanicallyBistableRelay");
                placingNewWire = false;
                break;
            case "h":       // Oscillating relay
                placingNewItem = generateNewBlock("oscillatingRelay");
                placingNewWire = false;
                break;
            case "k":       // Contact
                placingNewItem = generateNewBlock("switch");
                placingNewWire = false;
                break;
            case "p":       // Power source
                placingNewItem = generateNewBlock("power");
                placingNewWire = false;
                break;
            case ".":       // Wire (it kinda connects the dots! fun game innit?)
                placingNewItem = null;
                placingNewWire = [];
                break;
            case "Escape":
                placingNewItem = null;
                placingNewWire = false;
                break;
        }
    }
}