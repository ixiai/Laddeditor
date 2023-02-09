
function draw() {
    transformCanvas(0, 0, 1, 0, ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colours.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colours.line;
    // Draw blocks
    for (let id in blocks) {
        let block = blocks[id];
        drawBlock(block);
        if (id == selectedBlockId) {
            ctx.save();
            transformCanvas(block.x * scale, block.y * scale, scale, block.angle, ctx);
            ctx.fillStyle = '#FF000050';
            ctx.fillRect(0, 0, 1, 1);
            ctx.restore();
        }
    }
    // Draw tags
    ctx.font = "0.3px Arial";
    ctx.textBaseline = "middle";
    for (let block of Object.values(blocks)) {
        drawTag(block);
    }
    // Draw wires
    for (let id in wires) {
        ctx.lineWidth = id == selectedWireId ? 0.15 : 0.05;
        let wire = wires[id];
        ctx.strokeStyle = colours.line;
        ctx.fillStyle = colours.line;
        drawWire(wire);
    }

    // Draw placing wire
    if (placingNewWire !== false && placingNewWire.length) {
        drawWire(placingNewWire, lastMouseCoords.x, lastMouseCoords.y);
    }

    // Draw placing item
    if (placingNewItem != null) {
        drawBlock(
            placingNewItem,
            Math.round(lastMouseCoords.x / scale),
            Math.round(lastMouseCoords.y / scale)
        );
        drawTag(
            placingNewItem,
            Math.round(lastMouseCoords.x / scale),
            Math.round(lastMouseCoords.y / scale),
            "\xa0" + typingNewName + (new Date() % 500 >= 250 ? "\xa0" : "_")
        );
    }

    ctx.restore();
    transformCanvas(0, 0, 1, 0, ctx);

    window.requestAnimationFrame(draw);
}

function drawBlock(block, x = block.x, y = block.y) {
    ctx.save();
    if (block.type == null) throw new Error("Block type is null", block);
    const blockType = blocksDef[block.type];
    if (blockType == null) throw new Error("Block type " + block.type + " does not exist", block);
    transformCanvas(x * scale, y * scale, scale, block.angle, ctx);
    let squarePath = new Path2D();
    squarePath.rect(0, 0, 1, 1);
    ctx.clip(squarePath);
    ctx.font = "0.3px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = colours.line;
    ctx.strokeStyle = colours.line;
    blockType.draw(block, ctx);
    ctx.restore();
}

function drawTag(block, x = block.x, y = block.y, nameTagValue = block.nameTag.value) {
    ctx.save();
    ctx.font = "0.3px Consolas";
    ctx.textBaseline = "middle";
    if (block.type == null) throw new Error("Block type is null", block);
    const blockType = blocksDef[block.type];
    if (blockType == null) throw new Error("Block type " + block.type + " does not exist", block);
    let offsetX = block.nameTag.position == "left" ? 0 : (block.nameTag.position == "right" ? 1 : 0.5);
    let offsetY = block.nameTag.position == "top" ? -0.1 : (block.nameTag.position == "bottom" ? 1.1 : 0.5);
    ctx.textBaseline = block.nameTag.position == "top" ? "Bottom" : (block.nameTag.position == "bottom" ? "Top" : "Middle");
    ctx.textAlign = block.nameTag.position == "left" ? "right" : (block.nameTag.position == "right" ? "left" : "center");
    transformCanvas((x + offsetX) * scale,
        (y + offsetY) * scale,
        scale,
        block.nameTag.angle || 0,
        ctx);
    ctx.fillText(nameTagValue, 0, 0);
    ctx.restore();
}

function drawWire(wire, x = undefined, y = undefined) {
    ctx.save();
    ctx.beginPath();
    let beginning = true;
    let nodesToDraw = [];
    for (let node of Object.values(wire)) {
        let x = node.coords.x;
        let y = node.coords.y;
        switch (node.type) {
            case "position":
                transformCanvas(0, 0, scale, 0, ctx);
                break;
            case "blockPin":
                let block = blocks[node.block];
                transformCanvas(0, 0, scale, block.angle, ctx);
                break;
            case "wireNode":
                let i = 0;
                for (let j in Object.keys(wires[node.wire])) {
                    if (wires[node.wire][j].positionId == node.nodeId) {
                        i = j;
                        continue;
                    }
                }
                nodesToDraw.push({ x: x, y: y });
                transformCanvas(0, 0, scale, 0, ctx);
                break;
        }
        if (beginning) {
            beginning = false;
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    if (x != undefined && y != undefined) {
        ctx.lineTo(Math.round(x / scale) + 0.5, Math.round(y / scale) + 0.5);
    }
    ctx.stroke();
    for (let node of nodesToDraw) {
        transformCanvas(0, 0, scale, 0, ctx);
        ctx.beginPath();
        ctx.arc(node.x, node.y, 0.075, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.restore();
}