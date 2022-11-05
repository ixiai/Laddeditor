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
    switch: {
        draw: function (block, ctx) {
            ctx.fillText("TEST", 0, 0.5);
        }
    },
    neutralRelay: {
        draw: function (block, ctx) {

        }
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
    blocks["te4h9t4t4"] = {
        type: "switch",
        x: 2,
        y: 2,
        angle: 2 * Math.PI,
        nameTag: {
            offsetX: 0,
            offsetY: 0,
            angle: 0,
            value: "Nome1"
        }
    };
}

let X = false;

function draw(canvas) {
    const ctx = canvas.getContext("2d");
    transformCanvas(0, 0, 1, 0, ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = 64;
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
        ctx.fillStyle = 'black';
        blockType.draw(block, ctx);
        ctx.restore();
    }
    // Draw tags
    for (let block of Object.values(blocks)) {
        ctx.save();
        if (block.type == null) throw new Error("Block type is null", block);
        const blockType = blocksDef[block.type];
        if (blockType == null) throw new Error("Block type " + block.type + " does not exist", block);
        transformCanvas((block.x + (block.nameTag.offsetX || 0)) * scale,
        (block.y + (block.nameTag.offsetY || 0)) * scale,
        scale,
        block.nameTag.angle || 0,
        ctx);
        ctx.font = "0.3px Arial";
        ctx.textBaseline = "middle";
        ctx.fillText(block.nameTag.value, 0, 0);
    }
    transformCanvas(0, 0, 1, 0, ctx);
}

function prova(canvas = document.getElementById("canvas")) {
    blocks["te4h9t4t4"].angle += 0.05;
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
    ctx.setTransform(xAX, xAY, yAX, yAY, x - xAX / 2 - yAX  / 2, y - xAY / 2 - yAY / 2);

}

function resizeGameCanvas(canvas = document.getElementById("canvas")) {
    var dpi = window.devicePixelRatio || 1;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var app_container = document.getElementById('canvas');
    app_container.style.width = width + "px";
    app_container.style.height = height + "px";

    canvas.width = width * dpi;
    canvas.height = height * dpi;
}

window.addEventListener('resize', resizeGameCanvas, false);
window.addEventListener('orientationchange', resizeGameCanvas, false);

document.addEventListener("DOMContentLoaded", init);