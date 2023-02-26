function getFormulas() {
    let graphNodes = getGraphNodes();
    let graphArcs = getGraphArcs(graphNodes);
    console.log("Graph nodes (wires):", graphNodes);
    console.log("Graph arcs (blocks):", graphArcs);

    //let maxIterations = graphNodes.length + graphArcs.length + 2; // At every iteration, at least one node or one arc should be considered elaborated; +2 b/c I don't trust myself
    let maxIterations = graphArcs.length * 2;

    //  i. Nodes near power sources are set to "1" and considered elaborated (will never change their value)
    for (let nodeID in graphNodes) {
        let node = graphNodes[nodeID];
        for (let arcPinID in node.connectedToArcs) {
            if (graphArcs[arcPinID.split(":")[0]].value == "1") {
                node.value = "1";
                node.elaborated = true;
            }
        }
    }
    while (graphIsDone(graphArcs) && maxIterations) {
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

        //  //  i. Look for a node near a power source (i.e. an arc with a value of "1")
        //  //     Remember :- nodes are wires, and arcs are blocks (i.e. contacts, relays etc.)
        //  for (let nodeID in graphNodes) {
        //      let node = graphNodes[nodeID];
        //      if (!node.elaborated && node.elaboratedArcsNearMe) {
        //          for (let arcID of node.connectedToArcs) {
        //              if (graphArcs[arcID].value == "1") {
        //                  node.value = "1";
        //              }
        //          }
        //      }
        //  }
        //  
        //  //  ii. Is this node elaborated - and done with?
        //  for (let nodeID in graphNodes) {
        //      let node = graphNodes[nodeID];
        //      if (!node.elaborated && (node.value == "1" || node.elaboratedArcsNearMe == node.connectedToArcs.length)) {
        //          node.elaborated = true;
        //      }
        //  }
        //  
        //  //  iii. Look for an arc which starts from a node 



        //  //  i. If a node is set to 1, it is done (elaborated)
        //  //     Remember :- nodes are wires, and arcs are blocks (i.e. contacts, relays etc.)
        //  for (let nodeID in graphNodes) {
        //      let node = graphNodes[nodeID];
        //      if (node.value == "1") {
        //          node.elaborated = true;
        //      }
        //  }
        //  
        //  //  ii. If all the arcs going to a node are all elaborated (in the direction towards the node), then the node is elaborated
        //  
        //  
        //  
        //  //  iii. Make a list of nodes which have at least one 







        //  ii. For each arc:
        //      - if said arc is near a node towards which another arc is elaborated (w/o counting the arc considered at the time),
        //          from that node extend the boolean expression to the adjacent one - and set the arc as elaborated for that direction.
        //          Note that an elaborated node is never changed again; an elaborated arc can be run through again.
        //          Every time an arc is elaborated:
        //              ii/b. For each node, simplify:
        //                  - 1*A = A
        //                  - A*A = A
        //                  - A+A = A
        //                  - to simplify cases such as "AB+ABE(E+CDF) = AB":
        //                      whenever appears an expression that can be written as a+b,
        //                      assume a=0; if this implies that a+b=0, then a+b=a;
        //                      otherwise, assume b=0; if this implies that a+b=0, then a+b=b;
        //                      otherwise, the expression can not be simplified.

        for (let arcID in graphArcs) {
            let arc = graphArcs[arcID];
            for (let direction of ["01", "10"]) {
                let startPin = direction[0];
                let endPin = direction[1];
                // if said arc is near a node towards which another arc is elaborated
                let nodeOnStartPin = graphNodes[arc.pinsConnectedToNodes[startPin]];
                let nodeOnEndPin = graphNodes[arc.pinsConnectedToNodes[endPin]];
                if (nodeOnStartPinIsPoweredFromOtherArcs(nodeOnStartPin, arcID)) {
                    extendBooleanExpression(nodeOnStartPin, arc.operation, nodeOnEndPin);
                    arc["elaborated_" + direction] = true;
                    if (!nodeOnEndPin.arcsPointingTowardsMe.includes(arcID)) {
                        nodeOnEndPin.arcsPointingTowardsMe.push(arcID);
                    }
                }
            }
        }

        maxIterations--;
    }

    console.log("Elaborated graph nodes (wires):", graphNodes);
    console.log("Elaborated graph arcs (blocks):", graphArcs);
}

function extendBooleanExpression(nodeOnStartPin, operation, nodeOnEndPin) {
    let startingValue = nodeOnStartPin.value;
    let endingValue = nodeOnEndPin.value;
    if (endingValue == undefined) {
        endingValue = "(" + startingValue + ") * " + operation;
    } else {
        endingValue = "(" + endingValue + ") | (" + startingValue + ") * " + operation;
    }
    nodeOnEndPin.value = endingValue;
}

function nodeOnStartPinIsPoweredFromOtherArcs(node, arcID) {
    return node.arcsPointingTowardsMe.length - 1 * node.arcsPointingTowardsMe.includes(arcID);
    /////
    let arcAlreadyConnected = node.arcsPointingTowardsMe.includes(arcID);
    if (arcAlreadyConnected) {
        return node.arcsPointingTowardsMe.length - 1;
    } else {
        return node.arcsPointingTowardsMe.length;
    }
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
                    arcsPointingTowardsMe: [],
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
    let graphArcs = {};
    for (let id in blocks) {
        let block = blocks[id];
        switch (block.type) {
            case "power":
                graphArcs[id] = {
                    blockID: id,
                    elaborated_01: true,    // Elaborated from node 0 to node 1
                    elaborated_10: true,    // ' ' '                1 to node 0
                    operation: "1",         // How it changes the boolean expression
                    pinsConnectedToNodes: getIsConnectedToWhichNodes(graphNodes, id)
                };
                break;
            case "switch":
                graphArcs[id] = {
                    blockID: id,
                    elaborated_01: false,    // Elaborated from node 0 to node 1
                    elaborated_10: false,    // ' ' '                1 to node 0
                    operation: undefined, // TODO give it the value of the contact
                    pinsConnectedToNodes: getIsConnectedToWhichNodes(graphNodes, id)
                };
                break;
            case "switch2":
                // TODO
                break;
            case "neutralRelay":
                graphArcs[id] = {
                    blockID: id,
                    elaborated_01: false,    // Elaborated from node 0 to node 1
                    elaborated_10: false,    // ' ' '                1 to node 0
                    operation: undefined,
                    pinsConnectedToNodes: getIsConnectedToWhichNodes(graphNodes, id)
                };
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
                isConnectedToWhichNodes[pinID] = nodeID;
            }
        }
    }
    return isConnectedToWhichNodes;
}

function graphIsDone(graphArcs) {
    for (let arc of Object.values(graphArcs)) {
        if (!arc.elaborated_01 || !arc.elaborated_10) {
            return false;
        }
    }
    return true;
    /////
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