import Cytoscape from './Cytoscape';

const BookGraph = ({book, layout}) => {
  console.log("book", book);
  console.log("layout", layout);

  const elements = book.graph.jsons();
  console.log("elements", elements);
  return <Cytoscape elements={elements} layoutName={layout} />
}

export default BookGraph;