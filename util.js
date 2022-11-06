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


let colours = {
    bg: "#E0E0E0",
    line: "#000000"
};

const blocksDef = {
    power: {
        draw: function (block, ctx) {
            ctx.lineWidth = 0.05;
            ctx.beginPath();
            ctx.moveTo(0.4, 0.05);
            ctx.lineTo(0.6, 0.05);
            ctx.lineTo(0.5, 0.5);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0.5, 0.2);
            ctx.lineTo(0.5, 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.4, 0.7);
            ctx.lineTo(0.6, 0.6);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.4, 0.6);
            ctx.lineTo(0.6, 0.5);
            ctx.stroke();
        },
        pins: [
            {
                position: {
                    x: 0.5,
                    y: 1
                }
            }
        ]
    },
    switch: {
        draw: function (block, ctx) {
            ctx.lineWidth = 0.05;
            ctx.beginPath();
            ctx.moveTo(0.5, 0);
            ctx.lineTo(0.5, 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.8, 0.5);
            ctx.lineTo(block.state == "closed" ? 0.5 : 0.2, 0.5);
            ctx.stroke();
        },
        pins: [
            {
                position: {
                    x: 0.5,
                    y: 0
                }
            },
            {
                position: {
                    x: 0.5,
                    y: 1
                }
            }
        ]
    },
    switch2: {
        draw: function (block, ctx) {
            ctx.lineWidth = 0.05;
            ctx.beginPath();
            ctx.moveTo(0.5, 0);
            ctx.lineTo(0.5, 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.5, 0.5);
            ctx.lineTo(block.direction == "left" ? 0 : 1, 0.5);
            ctx.stroke();
            let direction = block.direction == "left" ? -1 : 1;
            let state = block.state == "straight" ? 1 : 0;
            ctx.beginPath();
            ctx.moveTo(0.5 - direction * 0.2 * (!state), 0.75 + 0.2 * (!state));
            ctx.lineTo(0.5 + 0.25 * direction + 0.2 * direction * state, 0.5 - 0.2 * state);
            ctx.stroke();
        },
        pins: [
            {
                position: {
                    x: 0.5,
                    y: 0
                }
            },
            {
                position: {
                    x: 0.5,
                    y: 1
                }
            }
        ]
    },
    neutralRelay: {
        draw: function (block, ctx) {
            ctx.lineWidth = 0.05;
            ctx.beginPath();
            ctx.arc(0.5, 0.5, 0.35, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.5, 0);
            ctx.lineTo(0.5, 0.15);
            ctx.stroke();
            ctx.lineWidth = 0.03;
            ctx.beginPath();
            ctx.moveTo(0.075, 0.25);
            ctx.lineTo(0.075, 0.75);
            ctx.stroke();
            let highLow = block.state == "on" ? -1 : 1;
            ctx.moveTo(0.025, 0.5 + highLow * 0.15);
            ctx.lineTo(0.075, 0.5 + highLow * 0.25);
            ctx.lineTo(0.125, 0.5 + highLow * 0.15);
            ctx.stroke();
            ctx.lineWidth = block.retardedOn ? 0.12 : 0.05;
            ctx.beginPath();
            ctx.moveTo(0.15, 0.15);
            ctx.lineTo(0.85, 0.15);
            ctx.stroke();
            ctx.lineWidth = block.retardedOff ? 0.12 : 0.05;
            ctx.beginPath();
            ctx.moveTo(0.15, 0.85);
            ctx.lineTo(0.85, 0.85);
            ctx.stroke();
        },
        pins: [
            {
                position: {
                    x: 0.5,
                    y: 0
                }
            }
        ]
    }
};

let wires = {};
let blocks = {};

function init() {
    let canvas = document.getElementById("canvas");
    loadSchematic();
    resizeGameCanvas(canvas);

    draw(canvas);
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
}

let X = false;

function draw(canvas) {
    const ctx = canvas.getContext("2d");
    transformCanvas(0, 0, 1, 0, ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = 164;
    // Draw blocks
    for (let block of Object.values(blocks)) {
        ctx.save();
        if (block.type == null) throw new Error("Block type is null", block);
        const blockType = blocksDef[block.type];
        if (blockType == null) throw new Error("Block type " + block.type + " does not exist", block);
        transformCanvas(block.x * scale, block.y * scale, scale, block.angle, ctx);
        let squarePath = new Path2D();
        squarePath.rect(0, 0, 1, 1);
        ctx.clip(squarePath);
        ctx.font = "0.3px Arial";
        ctx.textBaseline = "middle";
        ctx.fillStyle = '#FF000050';
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillStyle = colours.line;
        ctx.strokeStyle = colours.line;
        blockType.draw(block, ctx);
        ctx.restore();
    }
    // Draw tags
    ctx.font = "0.3px Arial";
    ctx.textBaseline = "middle";
    for (let block of Object.values(blocks)) {
        ctx.save();
        if (block.type == null) throw new Error("Block type is null", block);
        const blockType = blocksDef[block.type];
        if (blockType == null) throw new Error("Block type " + block.type + " does not exist", block);
        let offsetX = block.nameTag.position == "left" ? 0 : (block.nameTag.position == "right" ? 1 : 0.5);
        let offsetY = block.nameTag.position == "top" ? -0.1 : (block.nameTag.position == "bottom" ? 1.1 : 0.5);
        ctx.textBaseline = block.nameTag.position == "top" ? "Bottom" : (block.nameTag.position == "bottom" ? "Top" : "Middle");
        ctx.textAlign = block.nameTag.position == "left" ? "right" : (block.nameTag.position == "right" ? "left" : "center");
        transformCanvas((block.x + offsetX) * scale,
            (block.y + offsetY) * scale,
            scale,
            block.nameTag.angle || 0,
            ctx);
        ctx.fillText(block.nameTag.value, 0, 0);
    }
    // Draw wires
    ctx.save();
    ctx.lineWidth = 0.05;
    for (let wire of Object.values(wires)) {
        ctx.strokeStyle = colours.line;
        ctx.fillStyle = colours.line;
        ctx.beginPath();
        let beginning = true;
        let nodesToDraw = [];
        for (let node of Object.values(wire)) {
            let x;
            let y;
            switch (node.type) {
                case "position":
                    x = node.x + 0.5;
                    y = node.y + 0.5;
                    transformCanvas(0, 0, scale, 0, ctx);
                    break;
                case "blockPin":
                    let block = blocks[node.block];
                    x = block.pins[node.pin].x;
                    y = block.pins[node.pin].y;
                    transformCanvas(block.x * scale, block.y * scale, scale, block.angle, ctx);
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
                    nodesToDraw.push({x: x, y: y});
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
        ctx.stroke();
        for (let node of nodesToDraw) {
            transformCanvas(0, 0, scale, 0, ctx);
            ctx.beginPath();
            ctx.arc(node.x, node.y, 0.075, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    ctx.restore();
    transformCanvas(0, 0, 1, 0, ctx);
}

function prova(canvas = document.getElementById("canvas")) {
    //blocks["te4h9t4t4"].angle += 0.05;
    draw(canvas);
}
setInterval(prova, 50);

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

window.addEventListener('resize', resizeGameCanvas, false);
window.addEventListener('orientationchange', resizeGameCanvas, false);

document.addEventListener("DOMContentLoaded", init);