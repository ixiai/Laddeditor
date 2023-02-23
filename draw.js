
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
    //let nodesToDraw = [];
    let points = [];
    for (let node of Object.values(wire)) {
        let x = node.coords.x;
        let y = node.coords.y;
        switch (node.type) {
            case "position":
                points.push({
                    x: x,
                    y: y,
                    a: 0
                });
                break;
            case "blockPin":
                points.push({
                    x: node.coords.x,
                    y: node.coords.y,
                    a: blocks[node.block].angle
                });
                break;
        }
    }
    ctx.beginPath();
    for (let pId in points) {
        let p = points[pId];
        transformCanvas(0, 0, scale, p.a, ctx);
        if (pId == 0) {                         // First point
            ctx.moveTo(p.x, p.y);
        } else if (pId == points.length - 1) {  // Last point
            ctx.lineTo(p.x, p.y);
        } else {                                // Intermediate points
            let prev = points[pId * 1 - 1];
            let next = points[pId * 1 + 1];
            let dx = 0;
            let dy = 0;
            const bevel = 0.1;
            if (prev.x == p.x) {
                if (prev.y > p.y) {
                    dy = bevel;
                } else if (prev.y < p.y) {
                    dy = -bevel;
                }
            } else if (prev.y == p.y) {
                if (prev.x > p.x) {
                    dx = bevel;
                } else if (prev.x < p.x) {
                    dx = -bevel;
                }
            }
            ctx.lineTo(p.x + dx, p.y + dy);
            dx = 0;
            dy = 0;
            if (next.x == p.x) {
                if (next.y > p.y) {
                    dy = bevel;
                } else if (next.y < p.y) {
                    dy = -bevel;
                }
            } else if (next.y == p.y) {
                if (next.x > p.x) {
                    dx = bevel;
                } else if (next.x < p.x) {
                    dx = -bevel;
                }
            }
            ctx.lineTo(p.x + dx, p.y + dy);
        }
    }
    if (x != undefined && y != undefined) {
        ctx.lineTo(Math.round(x / scale) + 0.5, Math.round(y / scale) + 0.5);
    }
    ctx.stroke();
    ctx.restore();
}