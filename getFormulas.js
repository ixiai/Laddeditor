function getFormulas() {
    let graphNodes = getGraphNodes();
    let graphArcs = getGraphArcs(graphNodes);
    console.log("Graph nodes (wires):", graphNodes);
    console.log("Graph arcs (blocks):", graphArcs);

    let maxIterations = graphNodes.length + graphArcs.length + 2; // At every iteration, at least one node or one arc should be considered elaborated; +2 b/c I don't trust myself
    while (graphIsDone(graphNodes) && maxIterations) {
        //      // i. Look for a node connected to an elaborated arc (e.g. the power supply, from which we will start).
        //      //    Remember :- nodes are wires, and arcs are blocks (i.e. contacts, relays etc.)
        //      for (let nodeID in graphNodes) {
        //          let node = graphNodes[nodeID];
        //          for ()
        //      }
        //      
        //      // ii. Check if there's a non-elaborated arc near an elaborated node
        //      // let doneAnArc = false;
        //      // for (let arc of Object.values(graphArcs)) {
        //      //     for (let j = 0; j <= 1; j++) {
        //      //         if ()
        //      //     }
        //      // }
        //      // iii. Look for a non-elaborated arc near a node with at least one elaborated neighbouring arc
        //      
        //      // iv. Check if a node only has elaborated arcs as neighbours - and consider it as done with
        //



        //      //  i. Look for a node near an elaborated arc.
        //      //     Remember :- nodes are wires, and arcs are blocks (i.e. contacts, relays etc.)
        //      for (let nodeID in graphNodes) {
        //          let node = graphNodes[nodeID];
        //          if (!node.elaborated && node.elaboratedArcsNearMe) {
        //              
        //          }
        //      }

        //  i. Look for a node near a power source (i.e. an arc with a value of "1")
        //     Remember :- nodes are wires, and arcs are blocks (i.e. contacts, relays etc.)
        for (let nodeID in graphNodes) {
            let node = graphNodes[nodeID];
            if (!node.elaborated && node.elaboratedArcsNearMe) {
                for (let arcID of node.connectedToArcs) {
                    if (graphArcs[arcID].value == "1") {
                        node.value = "1";
                    }
                }
            }
        }

        //  ii. Is this node elaborated - and done with?
        for (let nodeID in graphNodes) {
            let node = graphNodes[nodeID];
            if (!node.elaborated && (node.value == "1" || node.elaboratedArcsNearMe == node.connectedToArcs.length)) {
                node.elaborated = true;
            }
        }

        //  iii. Look for an arc which starts from a node 

        maxIterations--;
    }
    
    console.log("Elaborated graph nodes (wires):", graphNodes);
    console.log("Elaborated graph arcs (blocks):", graphArcs);
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
                    elaboratedArcsNearMe: 0,
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

function graphIsDone(graphNodes) {
    for (let node of Object.values(graphNodes)) {
        if (!node.elaborated) {
            return false;
        }
    }
    return true;
}

function save() {
    // TODO
}