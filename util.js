function pDistance(x, y, x1, y1, x2, y2) {
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;

    var xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}


function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.addEventListener("mousedown", onmousedown);
    canvas.addEventListener("mousemove", onmousemove);
    document.addEventListener("keydown", onkeydown);
    loadSchematic();
    resizeGameCanvas(canvas);

    window.requestAnimationFrame(draw);
}

function loadSchematic() {
    wires = {};
    blocks = {};
    blocks["gebfbad"] = {
        type: "power",
        x: 2,
        y: 1,
        angle: 2 * Math.PI,
        nameTag: {
            //offsetX: 0,
            //offsetY: 0,
            //angle: 0,
            position: "top",
            value: "24Vcc"
        },
        pins: [
            {
                x: 0.5,
                y: 1
            }
        ]
    };
    blocks["te4h9t4t4"] = {
        type: "switch",
        x: 2,
        y: 2,
        angle: 2 * Math.PI,
        nameTag: {
            position: "right",
            value: "Name1"
        },
        state: "closed",
        pins: [
            {
                x: 0.5,
                y: 0
            },
            {
                x: 0.5,
                y: 1
            }
        ]
    };
    blocks["bfuf9fb9w"] = {
        type: "switch2",        // 2-way switch
        x: 2,
        y: 3,
        angle: 2 * Math.PI,
        nameTag: {
            position: "left",
            value: "Name2"
        },
        direction: "right",     // coming from top, goes either down or right
        state: "straight",      // circuit is closed going straight
        pins: [
            {
                x: 0.5,
                y: 0
            },
            {
                x: 0.5,
                y: 1
            },
            {
                x: 0.5,
                y: 0.5
            }
        ]
    };
    blocks["ey3y34y34"] = {
        type: "neutralRelay",
        x: 2,
        y: 4,
        angle: 2 * Math.PI,
        nameTag: {
            position: "bottom",
            value: "Relay1"
        },
        state: "on",
        retardedOn: 0,
        retardedOff: 0,
        pins: [
            {
                x: 0.5,
                y: 0
            }
        ]
    };
    blocks["g9rbg94a"] = {
        type: "neutralRelay",
        x: 4,
        y: 4,
        angle: 2 * Math.PI,
        nameTag: {
            position: "bottom",
            value: "Relay2"
        },
        state: "off",
        retardedOn: 0,
        retardedOff: 0,
        pins: [
            {
                x: 0.5,
                y: 0
            }
        ]
    };
    blocks["lr18hrna"] = {
        type: "neutralRelay",
        x: 5,
        y: 4,
        angle: 2 * Math.PI,
        nameTag: {
            position: "bottom",
            value: "Relay3"
        },
        state: "off",
        retardedOn: 0,
        retardedOff: 3,
        pins: [
            {
                x: 0.5,
                y: 0
            }
        ]
    };

    wires["bg982wgb9"] = [
        {
            type: "blockPin",
            block: "bfuf9fb9w",
            pin: 2
        },
        {
            type: "position",
            positionId: "gf97b79842b",
            x: 4,
            y: 3
        },
        {
            type: "blockPin",
            block: "g9rbg94a",
            pin: 0
        }
    ];
    wires["908rh90bra"] = [
        {
            type: "wireNode",
            wire: "bg982wgb9",
            nodeId: "gf97b79842b"
        },
        {
            type: "position",
            positionId: "gvb9egba",
            x: 5,
            y: 3
        },
        {
            type: "blockPin",
            block: "lr18hrna",
            pin: 0
        }
    ];






    computeWireCoords();
}

let X = false;


function computeWireCoords() {
    for (let wire of Object.values(wires)) {
        for (let node of Object.values(wire)) {
            let x;
            let y;
            switch (node.type) {
                case "position":
                    x = node.x + 0.5;
                    y = node.y + 0.5;
                    break;
                case "blockPin":
                    let block = blocks[node.block];
                    x = block.pins[node.pin].x + block.x;
                    y = block.pins[node.pin].y + block.y;
                    break;
                case "wireNode":
                    let i = 0;
                    for (let j in Object.keys(wires[node.wire])) {
                        if (wires[node.wire][j].positionId == node.nodeId) {
                            i = j;
                            continue;
                        }
                    }
                    x = wires[node.wire][i].x + 0.5;
                    y = wires[node.wire][i].y + 0.5;
                    break;
            }
            node.coords = {
                x: x,
                y: y
            };
        }
    }
}

//function prova(canvas = document.getElementById("canvas")) {
//    //blocks["te4h9t4t4"].angle += 0.05;
//    draw(canvas);
//}
//setInterval(prova, 50);

function transformCanvas(x, y, scale, angle, ctx) {
    // get direction and length of x axis
    const xAX = Math.cos(angle) * scale;
    const xAY = Math.sin(angle) * scale;
    // get direction and length of y axis that is 90 deg CW of x axis and same length
    const [yAX, yAY] = [-xAY, xAX];  // swap and negate new x
    // set the transform
    ctx.setTransform(xAX, xAY, yAX, yAY, x - xAX / 2 - yAX / 2, y - xAY / 2 - yAY / 2);
}

function resizeGameCanvas(c) {
    let canvas = document.getElementById("canvas") || c;
    var dpi = window.devicePixelRatio || 1;
    var width = window.innerWidth;
    var height = window.innerHeight;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.position = "absolute";

    canvas.width = width * dpi;
    canvas.height = height * dpi;
}

function generateNewBlock(type) {
    let block = {};
    block.angle = 0;
    block.nameTag = { position: "bottom", value: "noName" };
    switch (type) {
        case "neutralRelay":
            block.retardedOff = 0;
            block.retardedOn = 0;
        case "oscillatingRelay":
            block.pins = [{ x: 0.5, y: 0 }];
            block.state = "off";
            break;
        case "bistableRelay":
            block.state = "off";
        case "mechanicallyBistableRelay":
            block.state = "normal";
            block.pins = [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }];
            break;
        case "switch":
            block.state = "open";
            block.pins = [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }];
            break;
        case "power":
            block.pins = [{ x: 0.5, y: 0 }];
            break;
    }
    block.type = type;
    typingNewName = "";
    return block;
}


function updateWires() {
    connectBlocksToBlocks();
    connectWiresToBlocks();
    disconnectWiresFromRemovedBlocks();
    disconnectWiresFromRemovedWires();
}

function connectBlocksToBlocks() {
    for (let idA in blocks) {
        for (let idB in blocks) {
            let blockA = blocks[idA];
            let blockB = blocks[idB];
            if (idA != idB &&
                Math.abs(blockA.x - blockB.x == 1) &&
                Math.abs(blockA.y - blockB.y == 1)) {
                for (let idPinA in blockA.pins) {
                    for (let idPinB in blockB.pins) {
                        let connectionAlreadyExists = false;
                        let nodeCounter;
                        for (let wire of Object.values(wires)) {
                            nodeCounter = 0;
                            for (let node of Object.values(wire)) {
                                if (node.type == "blockPin" && (
                                    node.block == idA && node.pin == idPinA ||
                                    node.block == idB && node.pin == idPinB)) {
                                    nodeCounter++;
                                }
                            }
                            if (nodeCounter > 1) {
                                connectionAlreadyExists = true;
                            }
                        }
                        if (connectionAlreadyExists < 2) {
                            if (blockA.x + blockA.pins[idPinA].x == blockB.x + blockB.pins[idPinB].x &&
                                blockA.y + blockA.pins[idPinA].y == blockB.y + blockB.pins[idPinB].y) {
                                wires[newId()] = [
                                    { type: "blockPin", block: idA, pin: idPinA, coords: { x: blockA.x + blockA.pins[idPinA].y, y: blockA.x + blockA.pins[idPinA].y } },
                                    { type: "blockPin", block: idB, pin: idPinB, coords: { x: blockA.x + blockA.pins[idPinA].y, y: blockA.x + blockA.pins[idPinA].y } },
                                ];
                            }
                        }
                    }
                }
            }
        }
    }
}

function connectWiresToBlocks() {
    for (let wire of Object.values(wires)) {
        for (let node of Object.values(wire)) {
            if (node.type == "position") {
                for (let id in blocks) {
                    for (let idPin in blocks[id].pins) {
                        if (blocks[id].x + blocks[id].pins[idPin].x == node.coords.x &&
                            blocks[id].y + blocks[id].pins[idPin].y == node.coords.y) {
                            node.type = "blockPin";
                            block = id;
                            pin = idPin;
                            continue;
                        }
                    }
                }
            }
        }
    }
}

function disconnectWiresFromRemovedBlocks() {
    for (let wire of Object.values(wires)) {
        for (let node of Object.values(wire)) {
            if (node.type == "blockPin") {
                if (blocks[node.block] == undefined) {
                    node.type = "position";
                    node.positionId = newId();
                    delete node.block;
                    delete node.pin;
                }
            }
        }
    }
}

function disconnectWiresFromRemovedWires() {
    for (let wire of Object.values(wires)) {
        for (let node of Object.values(wire)) {
            if (node.type == "wireNode") {
                if (wires[node.wire] == undefined) {
                    node.type = "position";
                    node.positionId = newId();
                    delete node.wire;
                    delete node.nodeId;
                }
            }
        }
    }
}

function newId() {
    return new Date() * 1 + "";
}


window.addEventListener('resize', resizeGameCanvas, false);
window.addEventListener('orientationchange', resizeGameCanvas, false);

document.addEventListener("DOMContentLoaded", init);