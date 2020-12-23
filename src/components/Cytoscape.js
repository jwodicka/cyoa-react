import * as React from "react";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import fcose from 'cytoscape-fcose';
import avsdf from 'cytoscape-avsdf';
import dagre from 'cytoscape-dagre';
import klay from 'cytoscape-klay';

const altStyle = `
node {
  background-color: #CCC;
  label: data(id);
  text-valign: center;
  border-style: solid;
  border-color: black;
  border-width: 1;
}

node.unvisited {
  border-width: 0;
  background-color: orange;
}
node.map {
  background-color: lightblue;
}
node.blank {
  background-color: white;
}
node.illustration {
  background-color: beige;
}
node.end {
  background-color: lightgreen;
}
node.bad-end {
  background-color: pink;
}

node[[degree = 0]] {
  display: none;
}

edge {
  width: 3;
  line-color: black;
  target-arrow-color: black;
  target-arrow-shape: triangle;
  curve-style: bezier;
}

edge[label] {
  font-size: 7;
  source-label: data(label);
}
edge.reference {
  line-color: blue;
  target-arrow-color: blue;
}
edge.option {
  line-color: green;
  target-arrow-color: green;
}
edge.repeat {
  line-color: red;
  target-arrow-color: red;
}
`

const Graph = ({elements, layoutName="cola"}) => {
  const container = React.useRef(null);
  const graph = React.useRef();
  const layout = React.useRef();

  console.log("elements", elements);

  const setCurrentLayout = (name) => {
    if (name === 'cola') {
      layout.current = graph.current.makeLayout({
        name,
        infinite: true,
        edgeLength: (edge) => {
          if (edge.source().outdegree() === 1) {
            return 5;
          }
          return 20;
        },
      })
    } else {
      layout.current = graph.current.makeLayout({name});
    }
  }

  React.useEffect(function makeCanvas() {
    console.log('in makeCanvas');
    if (!container.current) {
      console.warn('makeCanvas called when no container is ready')
      return;
    }
    try {
      if (!graph.current) {
        // console.log('initializing cytoscape')
        cytoscape.use(cola);
        cytoscape.use(klay);
        cytoscape.use(dagre);
        cytoscape.use(fcose);
        cytoscape.use(avsdf)
        graph.current = cytoscape({
          elements: [],
          style: altStyle,
          maxZoom: 1,
          container: container.current
        });
        layout.current = graph.current.makeLayout({
          name: 'random'
        });
      }
    } catch (error) {
      console.error(error);
    }
    return () => {
      // console.log('cleaning up makeCanvas')
      graph.current && graph.current.destroy() && (graph.current = null);
    };
  }, []);

  React.useEffect(function changeLayout() {
    console.log('in changeLayout');
    if (graph.current) {
      if (layout.current) {
        layout.current.stop();
      }

      setCurrentLayout(layoutName);

      layout.current.run();
    }
  }, [layoutName])

  React.useEffect(function reconcileElements() {
    console.log('in reconcileElements');
    if (graph.current) {
      if (layout.current) {
        layout.current.stop();
      }

      // cytoscape.json() will perform a full reconciliation of all elements in
      // the graph. This is potentially expensive; if we know we're only adding/
      // removing a few elements (and there are a lot) we could be more optimal
      // here. For our purposes, our graphs are small enough that we don't care.
      graph.current.json({elements})

      // We need to rebuild the layout to account for new elements.
      if (layout.current) {
        console.log('rerunning layout in reconcileElements')
        // This is a naive rebuild; we only preserve the name.
        // We probably want to do a bit more than this...
        setCurrentLayout(layout.current.options.name);
        layout.current.run();
      }
    }
  }, [elements]);

  return <div className="graph" ref={container} />;
};

export default Graph;
