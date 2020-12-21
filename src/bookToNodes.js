import cytoscape from 'cytoscape';

const bookToNodes = (data, { collapse = false }={}) => {
  // We'll use a headless cytoscape instance to generate the graph data.
  const cy = cytoscape({
    elements: []
  });

  // First add all the pages we are aware of.
  for (const page of Object.keys(data.pages)) {
    const pageInfo = data.pages[page];
    const classes = [];
    if (pageInfo.type) { classes.push(pageInfo.type) }
    cy.add({
      group: 'nodes',
      data: { id: page },
      classes,
    });
  }

  const addEdge = (source, target) => {
    if (cy.getElementById(target).empty()) {
      cy.add({
        group: 'nodes',
        data: { id: target },
        classes: ['unvisited'],
      })
    }
    cy.add({
      group: 'edges',
      data: {
        id: `${source}->${target}`,
        source: source,
        target: target,
      },
    });
  }

  // Do a second pass to add edges
  for (const page of Object.keys(data.pages)) {
    const pageInfo = data.pages[page];
    if (pageInfo.next != null) {
      if (typeof pageInfo.next === 'number' || typeof pageInfo.next === 'string') {
        addEdge(page, pageInfo.next);
      } else {
        for (const target of Object.keys(pageInfo.next)) {
          addEdge(page, target);
        }
      }
    }
  }

  // To handle loops in the story-graph, we need to know whether given nodes are repeatable.
  // TODO


  if (collapse) {
    // Collapse forced edges to simplify the graph
    // This should be optional, since it destroys some information
    for (const edge of cy.edges()) {
      const source = edge.source();
      const target = edge.target();
      if (source.outdegree() === 1 && target.indegree() === 1) {
        console.log(`Collapsing edge ${edge.id()}`);
        target.outgoers('edge').move({ source: source.id() });
        source.classes([...source.classes(), ...target.classes()]);
        target.remove();
      }
    }
    for (const node of cy.nodes()) {
      console.log(`Considering node ${node.id()}: in: ${node.indegree()}, out: ${node.outdegree()}`)
      if (node.indegree() === 1 && node.outdegree() === 1) {
        console.log(`Collapsing node ${node.id()}`);
        const target = node.outgoers('node')[0];
        node.incomers('edge').move({ target: target.id() })
        node.remove();
      }
    }
    // After collapse, look for equivalences
    // These are nodes that have exactly the same destinations - they may have different narration, but
    // for story structure we can consider them the same and collapse them.
    for (const nodeA of cy.nodes()) {
      if (nodeA.outdegree() > 1) {
        for (const nodeB of cy.nodes()) {
          if (nodeA.id() !== nodeB.id()) {
            // console.log(`Comparing nodes ${nodeA.id()} and ${nodeB.id()}`)
            if (nodeA.outgoers('node').same(nodeB.outgoers('node'))) {
              console.log(`Collapsing equivalent nodes ${nodeA.id()} and ${nodeB.id()}`)
              // Get the nodes that precede nodeB but not nodeA.
              const uniqueIncomers = nodeB.incomers('node').difference(nodeA.incomers('node'));
              // Reparent the edges from those nodes to point to nodeA.
              uniqueIncomers.edgesTo(nodeB).move({ target: nodeA.id() });
              nodeB.remove();
            }
          }
        }
      }
    }
  }

  return cy.json().elements;
}

export default bookToNodes;