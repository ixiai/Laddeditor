function getFormulas() {
    let graphNodes = getGraphNodes();
    let graphArcs = getGraphArcs(graphNodes);
    console.log(graphNodes);
    console.log(graphArcs);
}

function getGraphNodes() {
    let graphNodes = [];
    for (let id in wires) {
        let wire = wires[id];
        let wiresIDs = [id];
        let connectedToArcs = [];
        let mergeWithExistingWire = false;
        for (let point of wire) {
            if (point.type == "blockPin") {
                connectedToArcs.push(point.block + ":" + point.pin);
            }
        }
        for (let blockPinID of connectedToArcs) {
            for (let graphNodeID in graphNodes) {
                let graphNode = graphNodes[graphNodeID];
                if (graphNode.connectedToArcs.includes(blockPinID)) {
                    mergeWithExistingWire = graphNodeID;
                }
            }
        }
        if (mergeWithExistingWire === false) {
            graphNodes.push(
                {
                    wiresIDs: wiresIDs,
                    connectedToArcs: connectedToArcs,
                    elaborated: false,
                    value: undefined
                }
            );
        } else {
            graphNodes[mergeWithExistingWire].wiresIDs.push(id);
            for (let connectedToBlock of connectedToArcs) {
                graphNodes[mergeWithExistingWire].connectedToArcs.push(connectedToBlock);
            }
        }
    }
    return graphNodes;
}

function getGraphArcs(graphNodes) {
    let graphArcs = [];
    for (let id in blocks) {
        let block = blocks[id];
        switch (block.type) {
            case "power":
                graphArcs.push({
                    blockID: id,
                    elaborated: true,
                    value: "1",
                    pinsConnectedToNodes: getIsConnectedToWhichNodes(graphNodes, id)
                });
                break;
            case "switch":
                graphArcs.push({
                    blockID: id,
                    elaborated: false,
                    value: undefined,
                    pinsConnectedToNodes: getIsConnectedToWhichNodes(graphNodes, id)
                });
                break;
            case "switch2":
                // TODO
                break;
            case "neutralRelay":
                graphArcs.push({
                    blockID: id,
                    elaborated: false,
                    value: undefined,
                    pinsConnectedToNodes: getIsConnectedToWhichNodes(graphNodes, id)
                });
                break;
        }
    }
    return graphArcs;
}

function getIsConnectedToWhichNodes(graphNodes, blockID) {
    let isConnectedToWhichNodes = [];
    for (let pinID = 0; pinID < blocks[blockID].pins.length; pinID++) {
        let blockPinID = blockID + ":" + pinID;
        for (let nodeID in graphNodes) {
            let node = graphNodes[nodeID];
            if (node.connectedToArcs.includes(blockPinID)) {
                isConnectedToWhichNodes.push(nodeID);
            }
        }
    }
    return isConnectedToWhichNodes;
}

function save() {
    // TODO
}