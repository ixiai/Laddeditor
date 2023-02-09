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


    if (placingNewWire !== false) {
        if (selectedBlockId != undefined) { // Join a pin
            let nearestPin;
            let distanceToNearestPin = Number.POSITIVE_INFINITY;
            for (let idPin in blocks[selectedBlockId].pins) {
                let pin = blocks[selectedBlockId].pins[idPin];
                let distanceToPin = Math.sqrt(Math.pow(blocks[selectedBlockId].x + pin.x - x, 2) + Math.pow(blocks[selectedBlockId].y + pin.y - y, 2));
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