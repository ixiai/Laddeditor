function onkeydown(e) {
    console.log(e.key);
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
        }
    } else {
        switch (e.key) {
            case "Delete":  // Delete selected
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
                break;
            case "b":       // Bistable relay
                placingNewItem = generateNewBlock("bistableRelay");
                break;
            case "m":       // Mechanically bistable relay
                placingNewItem = generateNewBlock("mechanicallyBistableRelay");
                break;
            case "h":       // Oscillating relay
                placingNewItem = generateNewBlock("oscillatingRelay");
                break;
            case "k":       // Contact
                placingNewItem = generateNewBlock("switch");
                break;
            case "p":       // Power source
                placingNewItem = generateNewBlock("power");
                break;
            case "Escape":
                placingNewItem = null;
                break;
        }
    }
}