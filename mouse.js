function onmousedown(e) {
    // Normalize coords
    let x = e.x / scale;
    let y = e.y / scale;
    // Reset selection
    selectedBlockId = undefined;
    selectedWireId = undefined;
    // Try to select a block
    for (let id in blocks) {
        if (blocks[id].x == Math.round(x) && blocks[id].y == Math.round(y)) {
            selectedBlockId = id;
            break;
        }
    }
    // Try to select a wire
    if (selectedBlockId == undefined) {
        for (let id in wires) {
            for (let j = 1; j < wires[id].length; j++) {
                let coordsA = wires[id][j - 1].coords;
                let coordsB = wires[id][j].coords;
                if (pDistance(x + 0.5, y + 0.5, coordsA.x, coordsA.y, coordsB.x, coordsB.y) < 0.2) {
                    selectedWireId = id;
                    break;
                }
            }
        }
    }

    if (placingNewItem != null) {
        placingNewItem.x = Math.round(lastMouseCoords.x / scale);
        placingNewItem.y = Math.round(lastMouseCoords.y / scale);
        placingNewItem.nameTag.value = typingNewName;
        blocks[newId()] = placingNewItem;
        updateWires();
    }

    typingNewName = false;
    placingNewItem = null;
}

function onmousemove(e) {
    lastMouseCoords = {
        x: e.x,
        y: e.y
    };
}