import cytoscape from 'cytoscape';

const buildGraph = (data) => {
  // We'll use a headless cytoscape instance to generate the graph data.
  const cy = cytoscape({
    elements: []
  });

  const addNode = (id, classes=[]) => {
    cy.add({
      group: 'nodes',
      data: {id},
      classes,
    })
  };
  
  const addEdge = (source, target) => {
    if (cy.getElementById(target).empty()) {
      addNode(target, ['unvisited']);
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
  
  // First add all the nodes we are aware of.
  for (const page of Object.keys(data.pages)) {
    const pageInfo = data.pages[page];
    const classes = [];
    if (pageInfo.type) { classes.push(pageInfo.type) }
    addNode(page, classes);
  }
  
  // Do a second pass to add edges, which will also add target nodes we have not yet seen.
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

  return cy.elements();
}

class Book {
  constructor(data) {
    this._graph = null;
    this._data = data;
  }

  get title() {
    return this._data.title;
  }
  get author() {
    return this._data.author;
  }
  get year() {
    return this._data.year;
  }
  get publisher() {
    return this._data.publisher;
  }
  get start() {
    return this._data.start;
  }

  get graph() {
    if (this._graph == null) {
      this._graph = buildGraph(this._data);
    }
    return this._graph;
  }

  getPage(page) {
    return this._data.pages[page];
  }

}

export default Book;