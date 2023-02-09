let colours = {
    bg: "#000000",
    line: "#E0E0E0"
};

let wires = {};
let blocks = {};

let scale = 40;
let selectedBlockId;
let selectedWireId;
let placingNewItem = null;
let lastMouseCoords = {};
let typingNewName = false;

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
    },
    bistableRelay: {
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
            ctx.beginPath();
            ctx.moveTo(0.15, 0.15);
            ctx.lineTo(0.85, 0.15);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.15, 0.85);
            ctx.lineTo(0.85, 0.85);
            ctx.stroke();

            ctx.save();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.beginPath();
            ctx.arc(0.5, 0.5, 0.35, Math.PI / 2, Math.PI * 3 / 2);
            ctx.fill();
            ctx.restore();
        },
        pins: [
            {
                position: {
                    x: 0,
                    y: 0.5
                }
            },
            {
                position: {
                    x: 1,
                    y: 0.5
                }
            }
        ]
    }
};