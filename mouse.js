function onmousedown(e) {
    // Normalize coords
    let x = e.x / scale;
    let y = e.y / scale;
    // Reset selection
    let wasSelectedBlockId = selectedBlockId;
    selectedBlockId = undefined;
    selectedWireId = undefined;


    // Release new item on the drawing
    if (placingNewItem != null) {
        placingNewItem.x = Math.round(lastMouseCoords.x / scale);
        placingNewItem.y = Math.round(lastMouseCoords.y / scale);
        placingNewItem.nameTag.value = typingNewName;
        blocks[newId()] = placingNewItem;
        typingNewName = false;
        placingNewItem = null;
    }


    // Try to select a block
    selectedBlockId = snapToBlocks(x, y);
    // Clicked twice on same block: user wants to edit it
    if (selectedBlockId != undefined && wasSelectedBlockId == selectedBlockId && placingNewWire == false) {
        placingNewItem = blocks[selectedBlockId];
        console.log(placingNewItem);
        typingNewName = blocks[selectedBlockId].nameTag.value;
        delete blocks[selectedBlockId];
    }

    // Try to select a wire
    if (placingNewWire == false) {
        selectedWireId = snapToWires(x, y);
    }


    if (placingNewWire !== false) {
        if (selectedBlockId != undefined) { // Join a pin
            let nearestPin;
            let distanceToNearestPin = Number.POSITIVE_INFINITY;
            for (let idPin in blocks[selectedBlockId].pins) {
                let pin = blocks[selectedBlockId].pins[idPin];
                let distanceToPin = Math.sqrt(Math.pow(blocks[selectedBlockId].x + pin.x - x - 0.5, 2) + Math.pow(blocks[selectedBlockId].y + pin.y - y - 0.5, 2));
                if (distanceToPin < distanceToNearestPin) {
                    distanceToNearestPin = distanceToPin;
                    nearestPin = idPin;
                }
            }
            if (nearestPin != undefined) {
                placingNewWire.push({
                    type: "blockPin",
                    block: selectedBlockId,
                    pin: nearestPin,
                    coords: {
                        x: blocks[selectedBlockId].x + blocks[selectedBlockId].pins[nearestPin].x,
                        y: blocks[selectedBlockId].y + blocks[selectedBlockId].pins[nearestPin].y
                    }
                });
            }
        } else if (selectedWireId != undefined) { // Join a wire

        } else { // Join nobody and be alone with yourself - just like me!
            placingNewWire.push({
                type: "position",
                positionId: newId(),
                x: Math.round(x),
                y: Math.round(y),
                coords: {
                    x: Math.round(x) + 0.5,
                    y: Math.round(y) + 0.5
                }
            });
        }


        if (placingNewWire.length > 1) {
            let last = placingNewWire.length - 1;
            if (placingNewWire[last].coords.x == placingNewWire[last - 1].coords.x &&
                placingNewWire[last].coords.y == placingNewWire[last - 1].coords.y) {
                placingNewWire.pop();
                wires[newId()] = placingNewWire;
                placingNewWire = false;
            }
        }
    }

    if (selectedBlockId != undefined) {
        console.log("Block " + selectedBlockId, blocks[selectedBlockId]);
    } else if (selectedWireId != undefined) {
        console.log("Wire " + selectedWireId, wires[selectedWireId]);
    }
    updateWires();
}

function snapToBlocks(x, y) {
    let selectedBlockId = undefined;
    for (let id in blocks) {
        if (blocks[id].x == Math.round(x) && blocks[id].y == Math.round(y)) {
            selectedBlockId = id;
            break;
        }
    }
    return selectedBlockId;
}

function snapToWires(x, y) {
    let selectedWireId = undefined;
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
    return selectedWireId;
}

function onmousemove(e) {
    lastMouseCoords = {
        x: e.x,
        y: e.y
    };
}