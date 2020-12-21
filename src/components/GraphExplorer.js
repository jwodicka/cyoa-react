import { useState } from 'react';
import Cytoscape from './Cytoscape';

const GraphExplorer = ({library}) => {
  const [layout, updateLayout] = useState('cola');
  const [book, updateBook] = useState();

  console.log(book);
  const elts = (book == null) ? [] : library[book].elements;

  return (
    <div>
      <div id="chart">
        <Cytoscape elements={elts} layoutName={layout} />
      </div>
      <select value={layout} onChange={(e) => updateLayout(e.target.value)}>
        <option value='grid'>Grid</option>
        <option value='cola'>CoLa</option>
        <option value='fcose'>fCose</option>
        <option value='avsdf'>AVSDF</option>
        <option value='dagre'>DAGRE</option>
        <option value='klay'>Klay</option>
      </select>
      <select id='books' value={book} onChange={(e) => updateBook(e.target.value)}>
        {library.map((record, i) => {
          if (typeof record === 'string')
            return (<option key={i}>Loading</option>)
          return (<option key={record.title} value={i}>{record.title}</option>);
        })}
      </select>
    </div>
  )
}

export default GraphExplorer;